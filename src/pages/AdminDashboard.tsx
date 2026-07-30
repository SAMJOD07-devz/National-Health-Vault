import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck, Users, Stethoscope, Activity, Settings, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import RegisterPatientForm from '../components/forms/RegisterPatientForm';
import RegisterDoctorForm from '../components/forms/RegisterDoctorForm';

export default function AdminDashboard() {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showRegisterPatient, setShowRegisterPatient] = useState(false);
  const [showRegisterDoctor, setShowRegisterDoctor] = useState(false);

  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    visits: 0
  });

  const fetchStats = async () => {
    try {
      const [patientsRes, doctorsRes, visitsRes] = await Promise.all([
        supabase.from('patients').select('*', { count: 'exact', head: true }),
        supabase.from('doctors').select('*', { count: 'exact', head: true }),
        supabase.from('visits').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        patients: patientsRes.count || 0,
        doctors: doctorsRes.count || 0,
        visits: visitsRes.count || 0
      });
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  useEffect(() => {
    if (user && role === 'admin') {
      fetchStats();
    }
  }, [user, role]);

  if (!user || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRegistrationSuccess = () => {
    setShowRegisterPatient(false);
    setShowRegisterDoctor(false);
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="bg-slate-900 shadow-sm border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Settings className="w-8 h-8 text-nhv-accent" />
            <h1 className="text-xl font-bold text-white">NHV <span className="font-light text-slate-400">| System Admin</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-slate-400">ID: {user.id}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* System Overview */}
        <div>
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Activity className="w-6 h-6 text-nhv-blue" />
            Live System Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Patients</p>
                <p className="text-4xl font-bold text-slate-800">{stats.patients}</p>
              </div>
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-nhv-blue" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Registered Doctors</p>
                <p className="text-4xl font-bold text-slate-800">{stats.doctors}</p>
              </div>
              <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center">
                <Stethoscope className="w-7 h-7 text-nhv-green" />
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-1">Total Visits</p>
                <p className="text-4xl font-bold text-slate-800">{stats.visits}</p>
              </div>
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center">
                <Activity className="w-7 h-7 text-amber-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Administration Actions */}
        <div>
           <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-nhv-blue" />
            User Registration & Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-nhv-blue/50 transition-colors">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <Users className="w-12 h-12 text-nhv-blue mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Patient Onboarding</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm relative z-10">
                Register a new patient into the National Health Vault, assigning them a unique Health ID and securely storing their demographic data.
              </p>
              <button 
                onClick={() => setShowRegisterPatient(true)}
                className="flex items-center gap-2 px-6 py-3 bg-nhv-blue text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm relative z-10"
              >
                <Plus className="w-5 h-5" /> Register New Patient
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-center items-center text-center relative overflow-hidden group hover:border-nhv-green/50 transition-colors">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-green-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
              <Stethoscope className="w-12 h-12 text-nhv-green mb-4 relative z-10" />
              <h3 className="text-xl font-bold text-slate-800 mb-2 relative z-10">Doctor Onboarding</h3>
              <p className="text-slate-500 text-sm mb-6 max-w-sm relative z-10">
                Verify and register a new medical professional, granting them secure access to prescribe medications and log patient visits.
              </p>
              <button 
                onClick={() => setShowRegisterDoctor(true)}
                className="flex items-center gap-2 px-6 py-3 bg-nhv-green text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-sm relative z-10"
              >
                <Plus className="w-5 h-5" /> Register New Doctor
              </button>
            </div>

          </div>
        </div>

      </main>

      {/* Modals */}
      {showRegisterPatient && (
        <RegisterPatientForm 
          onClose={() => setShowRegisterPatient(false)} 
          onSuccess={handleRegistrationSuccess}
        />
      )}
      {showRegisterDoctor && (
        <RegisterDoctorForm 
          onClose={() => setShowRegisterDoctor(false)} 
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}
