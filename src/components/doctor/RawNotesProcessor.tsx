import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { genAI } from '../../lib/gemma';
import { Activity, Wand2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { SchemaType } from '@google/generative-ai';
import type { FunctionDeclaration, Tool } from '@google/generative-ai';

interface RawNotesProcessorProps {
  patientId: string;
  doctorId: string;
  hospitalName: string;
  patientAllergies: string[];
  onSuccess: () => void;
}

// Define schemas for Gemma 4 Native Function Calling
const addDiagnosisSchema: FunctionDeclaration = {
  name: 'add_diagnosis',
  description: 'Call this to extract a primary diagnosis and any clinical notes from the raw text.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      diagnosis: { type: SchemaType.STRING, description: 'The medical diagnosis' },
      notes: { type: SchemaType.STRING, description: 'Summary of clinical observations or notes' }
    },
    required: ['diagnosis', 'notes']
  }
};

const addMedicationSchema: FunctionDeclaration = {
  name: 'add_medication',
  description: 'Call this to extract medication prescription details.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      name: { type: SchemaType.STRING, description: 'Name of the medicine' },
      dosage: { type: SchemaType.STRING, description: 'Dosage (e.g. 500mg)' },
      frequency: { type: SchemaType.STRING, description: 'Frequency (e.g. OD, BD, Twice a day)' }
    },
    required: ['name', 'dosage', 'frequency']
  }
};

const addVitalsSchema: FunctionDeclaration = {
  name: 'add_vitals',
  description: 'Call this to extract recorded vitals.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      bp: { type: SchemaType.STRING, description: 'Blood pressure (e.g. 130/85)' },
      pulse: { type: SchemaType.NUMBER, description: 'Pulse rate' },
      sugar: { type: SchemaType.NUMBER, description: 'Blood sugar' }
    }
  }
};

const flagInteractionSchema: FunctionDeclaration = {
  name: 'flag_interaction',
  description: 'Call this to report if a new medicine interacts with existing medicines or allergies.',
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      severity: { 
        type: SchemaType.STRING, 
        description: 'Must be one of: "none", "caution", "severe"' 
      },
      explanation: { 
        type: SchemaType.STRING, 
        description: 'Explanation of the interaction or why there is none.' 
      }
    },
    required: ['severity', 'explanation']
  }
};

export default function RawNotesProcessor({ patientId, doctorId, hospitalName, patientAllergies, onSuccess }: RawNotesProcessorProps) {
  const [rawNotes, setRawNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Structured state from Gemma
  const [extractedData, setExtractedData] = useState<{
    diagnosis?: any;
    medications: any[];
    vitals?: any;
  } | null>(null);

  // Interaction check state
  const [interactionResult, setInteractionResult] = useState<{
    severity: 'none' | 'caution' | 'severe';
    explanation: string;
  } | null>(null);

  const processNotes = async () => {
    if (!rawNotes.trim()) return;
    setProcessing(true);
    setInteractionResult(null);

    try {
      // Feature 1: Raw Notes -> Automatic Function Call
      const model = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        tools: [{ functionDeclarations: [addDiagnosisSchema, addMedicationSchema, addVitalsSchema] }]
      });

      const prompt = `You are a clinical note structuring assistant. Given a doctor's raw free-text note, call the appropriate function(s) to extract diagnosis, medication, vitals. Only call functions for information explicitly present in the note. Do not infer or add information not stated.
      
      Raw Note: "${rawNotes}"`;

      const result = await model.generateContent(prompt);
      const functionCalls = result.response.functionCalls();
      
      const parsedData: any = { medications: [] };

      if (functionCalls) {
        for (const call of functionCalls) {
          if (call.name === 'add_diagnosis') parsedData.diagnosis = call.args;
          if (call.name === 'add_medication') parsedData.medications.push(call.args);
          if (call.name === 'add_vitals') parsedData.vitals = call.args;
        }
      }

      setExtractedData(parsedData);

      // Feature 2: Medicine Interaction Check (if medications were added)
      if (parsedData.medications.length > 0) {
        await checkInteractions(parsedData.medications);
      }

    } catch (error) {
      console.error('AI Processing Error:', error);
      alert('Failed to process notes via AI API.');
    } finally {
      setProcessing(false);
    }
  };

  const checkInteractions = async (newMeds: any[]) => {
    try {
      // 1. Fetch patient's active meds
      const { data: existingMeds } = await supabase
        .from('medications')
        .select('name')
        .eq('patient_id', patientId)
        .eq('status', 'active');

      const existingMedNames = existingMeds?.map(m => m.name) || [];
      const newMedNames = newMeds.map(m => m.name);

      const interactionModel = genAI.getGenerativeModel({
        model: 'gemini-3.6-flash',
        tools: [{ functionDeclarations: [flagInteractionSchema] }],
        toolConfig: { functionCallingConfig: { mode: 'ANY' as any, allowedFunctionNames: ['flag_interaction'] } }
      });

      const prompt = `Given the new medications [${newMedNames.join(', ')}] being prescribed, the patient's current active medications [${existingMedNames.join(', ')}], and known allergies [${patientAllergies.join(', ')}], check for drug-drug or drug-allergy interactions. Call flag_interaction with severity ("none", "caution", "severe") and explanation.`;

      const result = await interactionModel.generateContent(prompt);
      const calls = result.response.functionCalls();
      
      if (calls && calls[0] && calls[0].name === 'flag_interaction') {
        const args = calls[0].args as any;
        setInteractionResult({
          severity: args.severity,
          explanation: args.explanation
        });
      }
    } catch (err) {
      console.error('Interaction check failed', err);
    }
  };

  const confirmAndSave = async () => {
    if (!extractedData) return;
    setSaving(true);
    
    try {
      // Save Visit
      const diagnosisText = extractedData.diagnosis?.diagnosis || 'General Visit';
      const notesText = extractedData.diagnosis?.notes || rawNotes;
      
      const { data: visitData, error: visitErr } = await supabase
        .from('visits')
        .insert({
          patient_id: patientId,
          doctor_id: doctorId,
          hospital_name: hospitalName,
          diagnosis: diagnosisText,
          notes: notesText + `\n\n[Original Note: ${rawNotes}]`,
          visit_date: new Date().toISOString()
        })
        .select()
        .single();
        
      if (visitErr) throw visitErr;

      // Save Medications
      for (const med of extractedData.medications) {
        await supabase.from('medications').insert({
          patient_id: patientId,
          prescribed_by: doctorId,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          start_date: new Date().toISOString().split('T')[0],
          status: 'active'
        });
      }

      // Audit Log
      await supabase.from('audit_logs').insert({
        patient_id: patientId,
        actor_id: doctorId,
        actor_role: 'doctor',
        action: 'AI Structured Visit Created',
        hospital: hospitalName,
        new_value: { extractedData, interactionSeverity: interactionResult?.severity }
      });

      setRawNotes('');
      setExtractedData(null);
      setInteractionResult(null);
      onSuccess();
      alert('Visit saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving data.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-nhv-blue/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-nhv-blue" /> AI Raw Notes Processor
        </h3>
        <span className="text-xs bg-blue-50 text-nhv-blue px-2 py-1 rounded border border-blue-100 font-medium">Powered by Gemma 4</span>
      </div>

      <textarea
        value={rawNotes}
        onChange={(e) => setRawNotes(e.target.value)}
        placeholder="Type unstructured clinical notes here... e.g. 'pt c/o fever 3 days, started azithromycin 500mg OD x5days, review in 1 week, bp 130/85'"
        rows={4}
        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nhv-blue/50 resize-none text-slate-700"
      />

      <div className="mt-3 flex justify-end">
        <button 
          onClick={processNotes}
          disabled={processing || !rawNotes.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors disabled:opacity-50"
        >
          {processing ? <Activity className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          Process Notes
        </button>
      </div>

      {/* Confirmation UI */}
      {extractedData && (
        <div className="mt-6 border-t pt-6 animate-fade-in">
          <h4 className="font-bold text-slate-800 mb-4">Review Structured Output</h4>
          
          <div className="space-y-4">
            {extractedData.diagnosis && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase">Diagnosis</p>
                <p className="text-slate-800 font-medium">{extractedData.diagnosis.diagnosis}</p>
                <p className="text-sm text-slate-600 mt-1">{extractedData.diagnosis.notes}</p>
              </div>
            )}

            {extractedData.medications.length > 0 && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-lg">
                <p className="text-xs font-bold text-slate-500 uppercase mb-2">Prescribed Medications</p>
                {extractedData.medications.map((m, i) => (
                  <div key={i} className="flex justify-between items-center text-sm bg-white p-2 rounded border border-blue-50 mb-1">
                    <span className="font-bold text-slate-800">{m.name}</span>
                    <span className="text-slate-600">{m.dosage} • {m.frequency}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Interaction Banner */}
            {interactionResult && (
              <div className={`p-4 rounded-lg border flex gap-3 ${
                interactionResult.severity === 'none' ? 'bg-green-50 border-green-200 text-green-800' :
                interactionResult.severity === 'caution' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                'bg-red-50 border-red-200 text-red-800'
              }`}>
                {interactionResult.severity === 'none' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                <div>
                  <p className="font-bold text-sm uppercase tracking-wider mb-1">
                    Interaction Check: {interactionResult.severity}
                  </p>
                  <p className="text-sm">{interactionResult.explanation}</p>
                  {interactionResult.severity === 'severe' && (
                     <p className="text-xs mt-2 font-bold underline">Explicit doctor acknowledgement required to proceed.</p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button 
                onClick={() => setExtractedData(null)}
                className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
              >
                Cancel / Edit Note
              </button>
              <button 
                onClick={confirmAndSave}
                disabled={saving || interactionResult?.severity === 'severe'}
                className="flex-1 py-3 bg-nhv-blue text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Activity className="w-5 h-5 animate-spin" /> : <ShieldAlert className="w-5 h-5" />}
                Confirm & Save to Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
