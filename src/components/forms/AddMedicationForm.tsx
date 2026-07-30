import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Activity } from 'lucide-react';

interface AddMedicationFormProps {
  patientId: string;
  doctorId: string;
  hospitalName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMedicationForm({ patientId, doctorId, hospitalName, onClose, onSuccess }: AddMedicationFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert the medication
      const { error: medError } = await supabase.from('medications').insert({
        patient_id: patientId,
        prescribed_by: doctorId,
        name,
        dosage,
        frequency,
        start_date: new Date().toISOString().split('T')[0],
        status: 'active'
      });

      if (medError) throw medError;

      // 2. Insert audit log
      await supabase.from('audit_logs').insert({
        patient_id: patientId,
        actor_id: doctorId,
        actor_role: 'doctor',
        action: 'Prescribed medication',
        hospital: hospitalName,
        new_value: { medication: name, dosage }
      });

      onSuccess();
    } catch (error) {
      console.error('Error adding medication:', error);
      alert('Failed to prescribe medication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">Prescribe Medication</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Medication Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue/50"
              placeholder="e.g., Paracetamol"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dosage</label>
              <input 
                type="text" 
                required
                value={dosage}
                onChange={e => setDosage(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue/50"
                placeholder="e.g., 500mg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Frequency</label>
              <input 
                type="text" 
                required
                value={frequency}
                onChange={e => setFrequency(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue/50"
                placeholder="e.g., Twice daily"
              />
            </div>
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
              className="flex-1 px-4 py-2 text-white bg-nhv-green hover:bg-green-700 rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
            >
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Prescribe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
