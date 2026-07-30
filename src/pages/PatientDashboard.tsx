import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Activity, Droplet, AlertTriangle, Pill, Clock, FileText, ShieldCheck, User, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Medication, Visit, AuditLog } from '../types/database';
import PatientChatbot from '../components/patient/PatientChatbot';

export default function PatientDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeMeds, setActiveMeds] = useState<Medication[]>([]);
  const [patientVisits, setPatientVisits] = useState<Visit[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Typewriter effect state
  const [typedName, setTypedName] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    if (!user?.profiles?.first_name) return;
    
    const targetText = user.profiles.first_name;
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex <= targetText.length) {
        setTypedName(targetText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [user?.profiles?.first_name]);

  useEffect(() => {
    if (!user || role !== 'patient') return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [medsRes, visitsRes, logsRes] = await Promise.all([
          supabase.from('medications').select('*').eq('patient_id', user.id).eq('status', 'active'),
          supabase.from('visits').select('*').eq('patient_id', user.id).order('visit_date', { ascending: false }),
          supabase.from('audit_logs').select('*').eq('patient_id', user.id).order('timestamp', { ascending: false })
        ]);

        if (medsRes.data) setActiveMeds(medsRes.data);
        if (visitsRes.data) setPatientVisits(visitsRes.data);
        if (logsRes.data) setAuditLogs(logsRes.data);
      } catch (error) {
        console.error('Error fetching live data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, role]);

  if (!user || role !== 'patient') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-nhv-dark text-white pb-12 overflow-x-hidden selection:bg-nhv-accent selection:text-white">
      
      {/* Background Gradient to match Landing Page */}
      <div className="fixed inset-0 bg-gradient-to-br from-nhv-dark via-nhv-dark to-[#0f172a] -z-20" />

      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl border border-nhv-accent/30 bg-nhv-accent/10">
              <Shield className="w-6 h-6 text-nhv-accent" />
            </div>
            <h1 className="text-xl font-bold font-serif text-white">
              NHV <span className="font-light text-gray-400 font-sans tracking-wide">| Patient Portal</span>
            </h1>
          </div>
          <div className="flex items-center gap-5">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-white">{user.profiles?.first_name} {user.profiles?.last_name}</p>
              <p className="text-xs text-nhv-accent font-medium mt-0.5">ID: {user.health_id}</p>
            </div>
            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
            <button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-300"
              title="Logout"
            >
              <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 animate-fade-in-up">
          <div>
            <h2 className="text-3xl font-bold font-serif text-white tracking-tight flex items-center">
              Good morning,&nbsp;
              <span className="text-nhv-accent text-type">{typedName}</span>
              <span className={`text-nhv-accent text-type__cursor ${isTypingComplete ? 'text-type__cursor--hidden' : ''}`}>|</span>
            </h2>
            <p className="text-gray-400 mt-1">Here is a secure overview of your verified health records.</p>
          </div>
        </div>

        {/* Alerts Banner */}
        {user.allergies && user.allergies.length > 0 && (
          <div className="glass-panel-dark border-nhv-red/30 p-5 rounded-2xl flex items-start gap-4 hover:-translate-y-1 transition-transform duration-300">
            <div className="p-2 bg-nhv-red/10 border border-nhv-red/30 rounded-xl text-nhv-red shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-nhv-red uppercase tracking-widest mb-1">Critical Allergies</h3>
              <p className="text-white font-medium">{user.allergies.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Top Row: Profile & Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up-delay-1">
          
          {/* ID Card Style Profile */}
          <div className="glass-panel-dark p-8 rounded-3xl md:col-span-2 group hover:bg-black/40 transition-colors duration-500 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="p-3 bg-nhv-accent/10 border border-nhv-accent/30 text-nhv-accent rounded-2xl">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-semibold text-white">Verified Digital ID</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 text-sm relative z-10">
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Date of Birth</p>
                <p className="font-medium text-gray-200 text-base">{user.date_of_birth}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Gender</p>
                <p className="font-medium text-gray-200 text-base capitalize">{user.gender}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Aadhaar (Linked)</p>
                <p className="font-mono font-medium text-nhv-accent text-base tracking-widest">{user.aadhaar_masked}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Residential Address</p>
                <p className="font-medium text-gray-200 text-base">{user.address}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Emergency Contact</p>
                <p className="font-medium text-gray-200 text-base">{user.emergency_contact}</p>
              </div>
            </div>
          </div>

          {/* Blood Group Indicator */}
          <div className="glass-panel-dark relative p-1 rounded-3xl group hover:scale-[1.02] transition-transform duration-300">
            <div className="bg-black/50 h-full rounded-[22px] p-6 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-nhv-red/10 group-hover:bg-nhv-red/20 transition-colors duration-500 blur-xl"></div>
              <Droplet className="w-14 h-14 mb-4 text-nhv-red drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] relative z-10" />
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1 relative z-10">Blood Group</p>
              <p className="text-6xl font-black tracking-tighter drop-shadow-md text-white relative z-10">{user.blood_group}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 glass-panel-dark rounded-3xl">
            <Activity className="w-10 h-10 text-nhv-accent animate-pulse mx-auto mb-4" />
            <p className="text-gray-400 font-medium">Syncing verified records...</p>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in-up-delay-2">
            {/* Middle Row: Medications & Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Active Medications (Glass List) */}
              <div className="glass-panel-dark p-8 rounded-3xl flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-nhv-accent/10 border border-nhv-accent/30 text-nhv-accent rounded-xl">
                    <Pill className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Active Prescriptions</h2>
                </div>
                
                <div className="space-y-3 flex-1">
                  {activeMeds.length > 0 ? activeMeds.map(med => (
                    <div key={med.id} className="group flex justify-between items-center p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all duration-300 cursor-default">
                      <div>
                        <p className="font-medium text-white text-base">{med.name} <span className="text-sm text-gray-500 ml-1">({med.dosage})</span></p>
                        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">{med.frequency}</p>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-nhv-accent/20 text-nhv-accent border border-nhv-accent/30">
                          <span className="w-1.5 h-1.5 bg-nhv-accent rounded-full mr-1.5 animate-pulse"></span>
                          ACTIVE
                        </span>
                        <p className="text-[10px] uppercase font-bold text-gray-500 mt-2">Since {med.start_date}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="h-full flex flex-col items-center justify-center py-10 text-gray-500">
                      <Pill className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-medium">No active medications.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Visits (Timeline) */}
              <div className="glass-panel-dark p-8 rounded-3xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-white/10 border border-white/20 text-white rounded-xl">
                    <Clock className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Verified Clinical Visits</h2>
                </div>
                
                <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[1.125rem] before:h-full before:w-px before:bg-gradient-to-b before:from-white/20 before:via-white/10 before:to-transparent">
                  {patientVisits.map((visit) => (
                    <div key={visit.id} className="relative flex items-start gap-4 group">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full border border-white/20 bg-black text-white shrink-0 z-10 group-hover:bg-white/10 transition-colors duration-300">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-white/5 p-5 rounded-2xl border border-white/10 hover:border-white/20 transition-colors duration-300 group-hover:bg-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-white text-base">{visit.diagnosis}</h3>
                          <time className="text-xs font-bold text-gray-400 bg-black/50 px-2.5 py-1 rounded-lg border border-white/5">{new Date(visit.visit_date).toLocaleDateString()}</time>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed mb-3">{visit.notes}</p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                          <Activity className="w-3 h-3 text-nhv-accent" /> {visit.hospital_name}
                        </div>
                      </div>
                    </div>
                  ))}
                  {patientVisits.length === 0 && (
                    <p className="text-sm text-gray-500 font-medium pl-14 py-4">No recent visits recorded.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Audit Log (Sleek Table) */}
            <div className="glass-panel-dark p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-nhv-accent/10 border border-nhv-accent/30 text-nhv-accent rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">Cryptographic Audit Trail</h2>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-nhv-accent bg-nhv-accent/10 px-3 py-1.5 rounded-lg border border-nhv-accent/20 uppercase tracking-wider">
                  <div className="w-2 h-2 bg-nhv-accent rounded-full animate-pulse"></div>
                  Live Trace
                </span>
              </div>
              
              <div className="overflow-x-auto rounded-2xl border border-white/10 bg-black/20">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase tracking-widest bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Timestamp</th>
                      <th className="px-6 py-4 font-semibold">Actor Role</th>
                      <th className="px-6 py-4 font-semibold">Action Taken</th>
                      <th className="px-6 py-4 font-semibold">Hospital Network</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-gray-400 font-medium">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-white/10 text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10">
                            {log.actor_role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-300 font-medium">{log.action}</td>
                        <td className="px-6 py-4 text-gray-500">{log.hospital || '-'}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500 font-medium">No security logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* AI Chatbot Widget */}
      <PatientChatbot patientId={user.id} />
    </div>
  );
}
