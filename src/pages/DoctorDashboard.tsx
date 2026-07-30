import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Search, User, FilePlus, Activity, Pill, ShieldCheck } from 'lucide-react';
import { mockPatients, mockVisits, mockMedications } from '../data/mockDb';
import type { Patient } from '../data/mockDb';

export default function DoctorDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (!user || role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock search by ID or last 4 digits of Aadhaar
    const found = mockPatients.find(p => 
      p.id.toLowerCase() === searchQuery.toLowerCase() || 
      p.aadhaarMasked.endsWith(searchQuery)
    );
    setSelectedPatient(found || null);
  };

  const activeMeds = selectedPatient ? mockMedications.filter(m => m.patientId === selectedPatient.id && m.status === 'active') : [];

  return (
    <div className="min-h-screen bg-nhv-lightGray pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-nhv-blue" />
            <h1 className="text-xl font-bold text-slate-800">NHV <span className="font-light text-slate-500">| Doctor Portal</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-slate-800">{user.name}</p>
              <p className="text-slate-500">{user.specialization} • {user.hospital}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-nhv-red hover:bg-red-50 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patient by Health ID (e.g. P-1001) or last 4 digits of Aadhaar (e.g. 4589)" 
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nhv-blue focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className="bg-nhv-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors whitespace-nowrap">
              Search Record
            </button>
          </form>
        </div>

        {selectedPatient ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Patient Summary Card */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-blue-100 text-nhv-blue rounded-full flex items-center justify-center font-bold text-2xl">
                    {selectedPatient.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{selectedPatient.name}</h2>
                    <p className="text-sm text-slate-500">ID: {selectedPatient.id}</p>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Blood Group</span>
                    <span className="font-bold text-nhv-red">{selectedPatient.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Age / Gender</span>
                    <span className="font-medium text-slate-800">
                      {new Date().getFullYear() - new Date(selectedPatient.dob).getFullYear()} yrs / {selectedPatient.gender}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-slate-500">Allergies</span>
                    <span className="font-medium text-red-600">
                      {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.join(', ') : 'None'}
                    </span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <button onClick={() => window.open(`/emergency/${selectedPatient.id}`, '_blank')} className="w-full text-center text-sm font-medium text-nhv-red hover:underline">
                    View Emergency Card
                  </button>
                </div>
              </div>

              {/* Active Meds Quick View */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-nhv-green" /> Active Meds
                </h3>
                <ul className="space-y-2 text-sm">
                  {activeMeds.map(med => (
                    <li key={med.id} className="flex justify-between items-center">
                      <span>{med.name}</span>
                      <span className="text-slate-500 text-xs">{med.dosage}</span>
                    </li>
                  ))}
                  {activeMeds.length === 0 && <li className="text-slate-500 italic">No active meds.</li>}
                </ul>
              </div>
            </div>

            {/* Action Area */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Add Visit Form */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-t-4 border-t-nhv-blue">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                  <FilePlus className="w-5 h-5 text-nhv-blue" />
                  Add Clinical Note / Visit
                </h2>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Note added to record (Mock)'); }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Diagnosis</label>
                      <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue outline-none text-sm" placeholder="e.g. Acute Bronchitis" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                      <input type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue outline-none text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Clinical Notes</label>
                    <textarea rows={4} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue outline-none text-sm" placeholder="Patient symptoms, observations, advised plan..."></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prescription Updates</label>
                    <input type="text" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue outline-none text-sm" placeholder="e.g. Start Azithromycin 500mg, stop previous meds" />
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-nhv-blue text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                      Save to Record
                    </button>
                  </div>
                </form>
              </div>

              {/* Past History */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-nhv-blue" /> Past History
                </h3>
                <div className="space-y-3">
                  {mockVisits.filter(v => v.patientId === selectedPatient.id).map(visit => (
                    <div key={visit.id} className="p-3 bg-slate-50 border rounded-lg text-sm">
                      <div className="flex justify-between font-medium mb-1">
                        <span>{visit.diagnosis}</span>
                        <span className="text-slate-500">{visit.date}</span>
                      </div>
                      <p className="text-slate-600 mb-1">{visit.notes}</p>
                      <p className="text-xs text-slate-400">Recorded by: {visit.doctorId}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          searchQuery && <div className="text-center py-12 text-slate-500">No patient found with this ID/Aadhaar.</div>
        )}
      </main>
    </div>
  );
}
