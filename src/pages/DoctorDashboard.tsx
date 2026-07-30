import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Search, User, FilePlus, ShieldCheck, Sparkles, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Patient, Visit, Medication } from '../types/database';
import AddVisitForm from '../components/forms/AddVisitForm';
import AddMedicationForm from '../components/forms/AddMedicationForm';
import RawNotesProcessor from '../components/doctor/RawNotesProcessor';

export default function DoctorDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientVisits, setPatientVisits] = useState<Visit[]>([]);
  const [activeMeds, setActiveMeds] = useState<Medication[]>([]);
  
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  // Modals state
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showAddMedication, setShowAddMedication] = useState(false);

  if (!user || role !== 'doctor') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchPatientData = async (patientId: string) => {
    try {
      const [visitsRes, medsRes] = await Promise.all([
        supabase.from('visits').select('*').eq('patient_id', patientId).order('visit_date', { ascending: false }),
        supabase.from('medications').select('*').eq('patient_id', patientId).eq('status', 'active')
      ]);

      if (visitsRes.data) setPatientVisits(visitsRes.data);
      if (medsRes.data) setActiveMeds(medsRes.data);
    } catch (error) {
      console.error('Error fetching patient clinical data:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSearch(true);
    setSearchError('');
    setSelectedPatient(null);

    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*, profiles(first_name, last_name, phone)')
        .eq('health_id', searchQuery.toUpperCase())
        .single();

      if (error || !data) {
        setSearchError('No patient found with that Health ID.');
      } else {
        setSelectedPatient(data as unknown as Patient);
        await fetchPatientData(data.id);
      }
    } catch (err) {
      setSearchError('An error occurred during search.');
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleDataAdded = () => {
    setShowAddVisit(false);
    setShowAddMedication(false);
    if (selectedPatient) {
      fetchPatientData(selectedPatient.id);
    }
  };

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
              <p className="font-semibold text-slate-800">Dr. {user.profiles?.first_name} {user.profiles?.last_name}</p>
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-1/2">
            <h2 className="text-lg font-semibold text-slate-800 mb-2">Search Patient Record</h2>
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-nhv-blue/50 sm:text-sm transition-all"
                placeholder="Enter Health ID (e.g., NHV-2026-000001)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={loadingSearch || !searchQuery}
                className="absolute inset-y-1 right-1 px-4 bg-nhv-blue text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors disabled:opacity-70"
              >
                {loadingSearch ? 'Searching...' : 'Search'}
              </button>
            </form>
            {searchError && <p className="text-red-500 text-sm mt-2">{searchError}</p>}
          </div>
          <div className="hidden md:flex text-slate-400 flex-col items-end text-sm">
            <p>Accessing medical records is strictly audited.</p>
            <p>Only search for patients currently under your care.</p>
          </div>
        </div>

        {/* Welcome Dashboard when no patient is selected */}
        {!selectedPatient && !loadingSearch && (
          <div className="mt-8 space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <div className="md:col-span-2 bg-gradient-to-br from-nhv-blue to-blue-900 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Dr. {user.profiles?.last_name}</h2>
                  <p className="text-blue-200 mb-8 max-w-md">Your clinical dashboard is ready. Search for a patient using their Health ID to view their full medical history securely.</p>
                  
                  <div className="flex gap-4">
                    <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <p className="text-sm text-blue-200 font-medium">Patients Today</p>
                      <p className="text-3xl font-bold mt-1">14</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-xl border border-white/20">
                      <p className="text-sm text-blue-200 font-medium">Pending Reviews</p>
                      <p className="text-3xl font-bold mt-1">3</p>
                    </div>
                  </div>
                </div>
                <ShieldCheck className="absolute -right-10 -bottom-10 w-64 h-64 text-white opacity-5" />
              </div>

              {/* AI Assistant Promo Card */}
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Gemma AI is Active</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    The NLP notes processor is running. Just type your shorthand notes during the visit and Gemma will automatically structure them into the patient's record.
                  </p>
                </div>
                <div className="text-xs font-bold tracking-wider text-purple-600 bg-purple-50 px-3 py-3 rounded-xl text-center uppercase border border-purple-100">
                  Powered by Google Gemma
                </div>
              </div>
            </div>

            {/* Today's Schedule (Mock Data for UI) */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-nhv-blue rounded-lg">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Today's Appointments</h3>
                </div>
                <span className="text-sm font-medium text-nhv-blue bg-blue-50 px-3 py-1 rounded-full cursor-pointer hover:bg-blue-100 transition-colors">View Full Schedule</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm text-slate-500">
                      <th className="py-3 px-4 font-medium">Time</th>
                      <th className="py-3 px-4 font-medium">Patient Name</th>
                      <th className="py-3 px-4 font-medium">Health ID</th>
                      <th className="py-3 px-4 font-medium">Reason for Visit</th>
                      <th className="py-3 px-4 font-medium text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> 09:00 AM</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">Rahul Sharma</td>
                      <td className="py-4 px-4 font-mono text-slate-500 text-xs">NHV-2026-000001</td>
                      <td className="py-4 px-4 text-slate-600">Routine Checkup</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-green-100">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      </td>
                    </tr>
                    <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> 11:30 AM</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">Priya Patel</td>
                      <td className="py-4 px-4 font-mono text-slate-500 text-xs">NHV-2026-982341</td>
                      <td className="py-4 px-4 text-slate-600">Post-Op Review</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-100">
                           Waiting
                        </span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 text-slate-600 flex items-center gap-2"><Clock className="w-4 h-4" /> 02:15 PM</td>
                      <td className="py-4 px-4 font-semibold text-slate-800">Amit Kumar</td>
                      <td className="py-4 px-4 font-mono text-slate-500 text-xs">NHV-2026-445892</td>
                      <td className="py-4 px-4 text-slate-600">Cardiology Consult</td>
                      <td className="py-4 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-200">
                           Scheduled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Patient Dashboard View */}
        {selectedPatient && (
          <div className="space-y-6 animate-fade-in">
            {/* Action Bar */}
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors shadow-sm">
                <FilePlus className="w-4 h-4 text-nhv-accent" /> Upload External Report
              </button>
            </div>

            {/* Patient Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-6">
              <div className="hidden sm:flex w-16 h-16 bg-blue-50 text-nhv-blue rounded-full items-center justify-center shrink-0">
                <User className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{selectedPatient.profiles?.first_name} {selectedPatient.profiles?.last_name}</h3>
                    <p className="text-sm font-medium text-slate-500">ID: {selectedPatient.health_id} • Blood: <span className="text-nhv-red font-bold">{selectedPatient.blood_group}</span></p>
                  </div>
                  <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-200">
                    Verified
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-slate-400">DOB</p>
                    <p className="font-medium text-slate-700">{selectedPatient.date_of_birth}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Gender</p>
                    <p className="font-medium text-slate-700 capitalize">{selectedPatient.gender}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-400">Allergies</p>
                    <p className="font-medium text-red-600">
                      {selectedPatient.allergies?.length ? selectedPatient.allergies.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Notes Processor */}
            <RawNotesProcessor 
              patientId={selectedPatient.id}
              doctorId={user.id}
              hospitalName={user.hospital}
              patientAllergies={selectedPatient.allergies || []}
              onSuccess={handleDataAdded}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Medications */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Active Medications</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                  {activeMeds.length > 0 ? activeMeds.map(med => (
                    <div key={med.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{med.name} <span className="text-xs font-normal text-slate-500 ml-1">{med.dosage}</span></p>
                        <p className="text-xs text-slate-500 mt-1">{med.frequency}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Started</p>
                        <p className="text-sm font-medium text-slate-700">{med.start_date}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 italic text-center mt-10">No active medications found.</p>
                  )}
                </div>
              </div>

              {/* Visit History */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] flex flex-col">
                <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Visit History</h3>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                  {patientVisits.length > 0 ? patientVisits.map(visit => (
                    <div key={visit.id} className="relative pl-4 border-l-2 border-slate-200 pb-4 last:pb-0">
                      <div className="absolute w-3 h-3 bg-nhv-blue rounded-full -left-[7px] top-1 border-2 border-white"></div>
                      <p className="text-xs text-slate-400 mb-1">{new Date(visit.visit_date).toLocaleDateString()} • {visit.hospital_name}</p>
                      <p className="font-semibold text-slate-800 text-sm">{visit.diagnosis}</p>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">{visit.notes}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 italic text-center mt-10">No visit history found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddVisit && selectedPatient && (
        <AddVisitForm 
          patientId={selectedPatient.id} 
          doctorId={user.id}
          hospitalName={user.hospital}
          onClose={() => setShowAddVisit(false)}
          onSuccess={handleDataAdded}
        />
      )}
      
      {showAddMedication && selectedPatient && (
        <AddMedicationForm 
          patientId={selectedPatient.id} 
          doctorId={user.id}
          hospitalName={user.hospital}
          onClose={() => setShowAddMedication(false)}
          onSuccess={handleDataAdded}
        />
      )}
    </div>
  );
}
