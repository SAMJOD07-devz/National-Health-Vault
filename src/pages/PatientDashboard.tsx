import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, Activity, Droplet, AlertTriangle, Pill, Clock, FileText, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Medication, Visit, AuditLog } from '../types/database';

export default function PatientDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeMeds, setActiveMeds] = useState<Medication[]>([]);
  const [patientVisits, setPatientVisits] = useState<Visit[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-nhv-lightGray pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-nhv-blue" />
            <h1 className="text-xl font-bold text-slate-800">NHV <span className="font-light text-slate-500">| Patient Portal</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-slate-800">{user.profiles?.first_name} {user.profiles?.last_name}</p>
              <p className="text-slate-500">ID: {user.health_id}</p>
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
        
        {/* Alerts Banner */}
        {user.allergies && user.allergies.length > 0 && (
          <div className="bg-red-50 border-l-4 border-nhv-red p-4 rounded-r-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-nhv-red flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-1">Known Allergies</h3>
              <p className="text-red-700">{user.allergies.join(', ')}</p>
            </div>
          </div>
        )}

        {/* Top Row: Profile & Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 md:col-span-2">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-nhv-blue" />
              Patient Profile
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-500 mb-1">Date of Birth</p>
                <p className="font-medium text-slate-800">{user.date_of_birth}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Gender</p>
                <p className="font-medium text-slate-800 capitalize">{user.gender}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Aadhaar</p>
                <p className="font-medium text-slate-800">{user.aadhaar_masked}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-slate-500 mb-1">Address</p>
                <p className="font-medium text-slate-800">{user.address}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">Emergency Contact</p>
                <p className="font-medium text-slate-800">{user.emergency_contact}</p>
              </div>
            </div>
          </div>

          <div className="bg-nhv-blue p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Droplet className="w-32 h-32" />
            </div>
            <Droplet className="w-10 h-10 mb-2 text-nhv-accent" />
            <p className="text-blue-200 text-sm uppercase tracking-wider mb-1">Blood Group</p>
            <p className="text-5xl font-bold">{user.blood_group}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <Activity className="w-8 h-8 text-nhv-blue animate-pulse mx-auto" />
            <p className="text-slate-500 mt-2">Loading live records...</p>
          </div>
        ) : (
          <>
            {/* Middle Row: Medications & Visits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Medications */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-nhv-green" />
                  Active Medications
                </h2>
                <div className="space-y-4">
                  {activeMeds.length > 0 ? activeMeds.map(med => (
                    <div key={med.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <div>
                        <p className="font-semibold text-slate-800">{med.name} <span className="text-sm font-normal text-slate-500">({med.dosage})</span></p>
                        <p className="text-sm text-slate-500">{med.frequency}</p>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                        <p className="text-xs text-slate-400 mt-1">Since {med.start_date}</p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-sm text-slate-500 italic">No active medications.</p>
                  )}
                </div>
              </div>

              {/* Recent Visits */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-nhv-blue" />
                  Recent Visits & Reports
                </h2>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {patientVisits.map((visit, index) => (
                    <div key={visit.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-nhv-lightBlue text-nhv-blue shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-slate-800 text-sm">{visit.diagnosis}</h3>
                          <time className="text-xs text-slate-400">{new Date(visit.visit_date).toLocaleDateString()}</time>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2">{visit.notes}</p>
                        <p className="text-xs text-slate-400 mt-1">At {visit.hospital_name}</p>
                      </div>
                    </div>
                  ))}
                  {patientVisits.length === 0 && <p className="text-sm text-slate-500 italic pl-12">No recent visits.</p>}
                </div>
              </div>
            </div>

            {/* Audit Log (Bottom) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-nhv-blue" />
                Access & Audit Log
                <span className="ml-auto text-xs font-normal text-slate-400">Live Supabase Feed</span>
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Timestamp</th>
                      <th className="px-4 py-3">Actor Role</th>
                      <th className="px-4 py-3">Action Taken</th>
                      <th className="px-4 py-3 rounded-r-lg">Hospital</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map(log => (
                      <tr key={log.id} className="border-b last:border-0 border-slate-100 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium mr-2">
                            {log.actor_role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">{log.action}</td>
                        <td className="px-4 py-3">{log.hospital || '-'}</td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-3 text-center text-slate-500">No logs found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
