import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Activity } from 'lucide-react';

interface RegisterPatientFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function RegisterPatientForm({ onClose, onSuccess }: RegisterPatientFormProps) {
  const [loading, setLoading] = useState(false);
  
  // Profile fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Patient fields
  const [aadhaar, setAadhaar] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [allergies, setAllergies] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  const generateHealthId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `NHV-${new Date().getFullYear()}-${randomNum}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const maskedAadhaar = aadhaar.length === 12 
        ? `XXXX-XXXX-${aadhaar.slice(-4)}` 
        : aadhaar;

      // 1. Insert into profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          role: 'patient'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 2. Insert into patients
      const healthId = generateHealthId();
      const allergiesList = allergies.split(',').map(a => a.trim()).filter(a => a);

      const { error: patientError } = await supabase
        .from('patients')
        .insert({
          profile_id: profileData.id,
          health_id: healthId,
          aadhaar_masked: maskedAadhaar,
          date_of_birth: dob,
          gender: gender,
          blood_group: bloodGroup,
          allergies: allergiesList,
          critical_conditions: [],
          address: address,
          emergency_contact: emergencyContact
        });

      if (patientError) throw patientError;

      alert(`Success! Patient registered with Health ID: ${healthId}`);
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h2 className="text-xl font-bold text-slate-800">Register New Patient</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Profile Info */}
            <div className="space-y-4 md:col-span-2">
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
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 9876543210" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Aadhaar Number (12 digits)</label>
                  <input type="text" required value={aadhaar} onChange={e => setAadhaar(e.target.value)} placeholder="111122223333" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
                </div>
              </div>
            </div>

            {/* Medical Info */}
            <div className="space-y-4 md:col-span-2 mt-4">
               <h3 className="text-sm font-semibold text-nhv-blue uppercase tracking-wider border-b pb-2">Medical & Demographic</h3>
               <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth</label>
                  <input type="date" required value={dob} onChange={e => setDob(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                  <select value={gender} onChange={e => setGender(e.target.value as any)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none bg-white">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Blood Group</label>
                  <select value={bloodGroup} onChange={e => setBloodGroup(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none bg-white">
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
               </div>

               <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Allergies (comma separated)</label>
                  <input type="text" value={allergies} onChange={e => setAllergies(e.target.value)} placeholder="Peanuts, Penicillin..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
               </div>

               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Residential Address</label>
                    <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact Phone</label>
                    <input type="text" required value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue/50 outline-none" />
                 </div>
               </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3 border-t">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-3 text-white bg-nhv-blue hover:bg-blue-700 rounded-xl font-medium transition-colors disabled:opacity-70 flex justify-center items-center gap-2">
              {loading ? <Activity className="w-5 h-5 animate-spin" /> : 'Register Patient'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
