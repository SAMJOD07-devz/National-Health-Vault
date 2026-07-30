import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Activity } from 'lucide-react';

interface AddVisitFormProps {
  patientId: string;
  doctorId: string;
  hospitalName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddVisitForm({ patientId, doctorId, hospitalName, onClose, onSuccess }: AddVisitFormProps) {
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert the visit
      const { error: visitError } = await supabase.from('visits').insert({
        patient_id: patientId,
        doctor_id: doctorId,
        hospital_name: hospitalName,
        diagnosis,
        notes,
        visit_date: new Date().toISOString()
      });

      if (visitError) throw visitError;

      // 2. Insert audit log
      await supabase.from('audit_logs').insert({
        patient_id: patientId,
        actor_id: doctorId,
        actor_role: 'doctor',
        action: 'Created visit',
        hospital: hospitalName,
        new_value: { diagnosis }
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding visit:', error);
      alert('Failed to add visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Record New Visit</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
            <input 
              type="text" 
              required
              value={diagnosis}
              onChange={e => setDiagnosis(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue/50"
              placeholder="e.g., Viral Fever"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
            <textarea 
              required
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue/50 resize-none"
              placeholder="Patient presenting with..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 text-white bg-nhv-blue hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Save Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
