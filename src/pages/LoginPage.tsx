import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Fingerprint, Stethoscope, ChevronLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'patient' | 'doctor' | 'admin'>('patient');
  const [aadhaar, setAadhaar] = useState('');
  const [license, setLicense] = useState('');
  const [adminCode, setAdminCode] = useState('');
  
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginPatient, loginDoctor, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length !== 12) {
      setError('Aadhaar must be 12 digits');
      return;
    }
    setError('');
    setShowOtp(true);
  };

  const handlePatientOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginPatient(aadhaar);
    setLoading(false);
    if (success) {
      navigate('/patient/dashboard');
    } else {
      setError('Invalid Aadhaar. Patient record not found.');
      setShowOtp(false);
    }
  };

  const handleDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginDoctor(license);
    setLoading(false);
    if (success) {
      navigate('/doctor/dashboard');
    } else {
      setError('Invalid License No. (Try MCI-12345)');
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await loginAdmin(adminCode);
    setLoading(false);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid Admin Code (Try ADMIN-NHV)');
    }
  };

  return (
    <div className="min-h-screen bg-nhv-lightGray flex flex-col items-center justify-center p-4">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-nhv-dark hover:text-nhv-blue font-medium">
        <ChevronLeft className="w-5 h-5" /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-nhv-blue p-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Shield className="w-32 h-32" />
          </div>
          <Shield className="w-12 h-12 text-white mx-auto mb-2 relative z-10" />
          <h2 className="text-2xl font-bold text-white relative z-10">Login to NHV</h2>
        </div>

        <div className="flex border-b text-sm sm:text-base">
          <button 
            className={`flex-1 py-3 font-medium flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'patient' ? 'text-nhv-blue border-b-2 border-nhv-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('patient'); setError(''); setShowOtp(false); }}
          >
            <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5" /> Patient
          </button>
          <button 
            className={`flex-1 py-3 font-medium flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'doctor' ? 'text-nhv-blue border-b-2 border-nhv-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('doctor'); setError(''); }}
          >
            <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" /> Doctor
          </button>
          <button 
            className={`flex-1 py-3 font-medium flex items-center justify-center gap-1 sm:gap-2 ${activeTab === 'admin' ? 'text-nhv-blue border-b-2 border-nhv-blue' : 'text-gray-500'}`}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" /> Admin
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-nhv-red rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          {activeTab === 'patient' && (
            !showOtp ? (
              <form onSubmit={handlePatientSubmit} className="space-y-4 animate-fade-in">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter 12-digit Aadhaar (e.g. 111122224589)"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue focus:border-nhv-blue outline-none"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  />
                  <p className="text-xs text-gray-500 mt-2">Simulated verification. Real Aadhaar required for live system.</p>
                </div>
                <button type="submit" className="w-full bg-nhv-blue text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handlePatientOtpVerify} className="space-y-4 animate-fade-in">
                <div className="bg-blue-50 p-4 rounded-lg text-sm text-nhv-blue mb-4 border border-blue-100">
                  <p className="font-medium">Mock OTP sent!</p>
                  <p>Auto-filled for hackathon demo purposes.</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue focus:border-nhv-blue outline-none tracking-widest text-center text-xl"
                    value="123456"
                    readOnly
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-nhv-green text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-70"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            )
          )}

          {activeTab === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical License Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. MCI-12345"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue focus:border-nhv-blue outline-none"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-nhv-blue text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Login as Doctor'}
              </button>
            </form>
          )}

          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Admin Access Code</label>
                <input 
                  type="password" 
                  placeholder="e.g. ADMIN-NHV"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-nhv-blue focus:border-nhv-blue outline-none"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium hover:bg-slate-900 transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                <Settings className="w-5 h-5" />
                {loading ? 'Authenticating...' : 'System Login'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
