import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Activity } from 'lucide-react';

interface RegisterDoctorFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterDoctorForm({ onClose, onSuccess }: RegisterDoctorFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Doctor fields
  const [licenseNo, setLicenseNo] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [hospital, setHospital] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Insert into profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'doctor'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Insert into doctors
      const { error: doctorError } = await supabase
        .from('doctors')
        .insert({
          profile_id: profileData.id,
          license_no: licenseNo.toUpperCase(),
          specialization: specialization,
          hospital: hospital
        });

      if (doctorError) throw doctorError;

      alert(`Success! Doctor registered with License No: ${licenseNo.toUpperCase()}`);
      onSuccess();
    } catch (error: any) {
      console.error('Registration Error:', error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-slate-800">Register New Doctor</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-nhv-blue uppercase tracking-wider border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <h3 className="text-sm font-semibold text-nhv-blue uppercase tracking-wider border-b pb-2">Professional Credentials</h3>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medical License Number</label>
              <input type="text" required value={licenseNo} onChange={e => setLicenseNo(e.target.value)} placeholder="MCI-XXXXX" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specialization</label>
                <input type="text" required value={specialization} onChange={e => setSpecialization(e.target.value)} placeholder="Cardiologist, General Physician..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Hospital</label>
                <input type="text" required value={hospital} onChange={e => setHospital(e.target.value)} placeholder="Apollo Hospital" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 text-white bg-nhv-blue hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Register Doctor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
