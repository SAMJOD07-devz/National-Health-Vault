import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Fingerprint, Stethoscope, ChevronLeft, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: {x: number, y: number, radius: number, vx: number, vy: number, alpha: number}[] = [];
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((canvas.width * canvas.height) / 8000); // density
      for(let i=0; i<numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.5, // size variation
          vx: (Math.random() - 0.5) * 0.3,   // slow drift
          vy: (Math.random() - 0.5) * 0.3,
          alpha: Math.random() * 0.5 + 0.2
        });
      }
    };
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    window.addEventListener('resize', resize);
    resize();
    draw();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-[#070b14]" />;
}

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
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      
      {/* Cosmos Particle Background */}
      <ParticleBackground />

      <Link 
        to="/" 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-gray-400 hover:text-white font-medium transition-colors bg-black/30 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md"
      >
        <ChevronLeft className="w-5 h-5" /> Back to Home
      </Link>

      <div className="relative z-10 w-full max-w-2xl bg-black/10 backdrop-blur-sm rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
        
        {/* Header */}
        <div className="bg-transparent p-10 text-center relative overflow-hidden border-b border-white/10">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Shield className="w-48 h-48" />
          </div>
          <div className="w-20 h-20 bg-nhv-accent/10 border border-nhv-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
            <Shield className="w-10 h-10 text-nhv-accent drop-shadow-[0_0_15px_rgba(45,212,191,0.5)]" />
          </div>
          <h2 className="text-4xl font-bold font-serif text-white relative z-10 tracking-tight">Secure Access Portal</h2>
          <p className="text-gray-400 mt-2 text-lg">Verify your identity to continue</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10 bg-black/40">
          <button 
            className={`flex-1 py-6 text-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'patient' ? 'text-nhv-accent bg-nhv-accent/5 border-b-2 border-nhv-accent' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            onClick={() => { setActiveTab('patient'); setError(''); setShowOtp(false); }}
          >
            <Fingerprint className="w-6 h-6" /> Patient
          </button>
          <button 
            className={`flex-1 py-6 text-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'doctor' ? 'text-blue-400 bg-blue-500/5 border-b-2 border-blue-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            onClick={() => { setActiveTab('doctor'); setError(''); }}
          >
            <Stethoscope className="w-6 h-6" /> Doctor
          </button>
          <button 
            className={`flex-1 py-6 text-lg font-bold flex items-center justify-center gap-3 transition-all ${activeTab === 'admin' ? 'text-purple-400 bg-purple-500/5 border-b-2 border-purple-400' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
            onClick={() => { setActiveTab('admin'); setError(''); }}
          >
            <Settings className="w-6 h-6" /> Admin
          </button>
        </div>

        {/* Forms */}
        <div className="p-10 bg-black/20">
          {error && (
            <div className="mb-6 p-4 bg-nhv-red/10 text-nhv-red rounded-xl text-base font-medium border border-nhv-red/20 flex items-center gap-3 animate-fade-in">
              <Shield className="w-5 h-5 shrink-0" /> {error}
            </div>
          )}

          {activeTab === 'patient' && (
            !showOtp ? (
              <form onSubmit={handlePatientSubmit} className="space-y-6 animate-fade-in">
                <div>
                  <label className="block text-base font-semibold text-gray-300 mb-2">Aadhaar Number</label>
                  <input 
                    type="text" 
                    placeholder="Enter 12-digit Aadhaar (e.g. 111122224589)"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-nhv-accent/50 focus:border-nhv-accent outline-none text-white text-lg transition-all"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                  />
                  <p className="text-sm text-gray-500 mt-3 font-medium">Simulated verification. Real Aadhaar required for live system.</p>
                </div>
                <button type="submit" className="w-full bg-nhv-accent/10 border border-nhv-accent text-nhv-accent py-4 rounded-xl text-lg font-bold hover:bg-nhv-accent hover:text-white transition-all shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)]">
                  Verify Identity
                </button>
              </form>
            ) : (
              <form onSubmit={handlePatientOtpVerify} className="space-y-6 animate-fade-in">
                <div className="bg-nhv-accent/10 p-5 rounded-xl text-base text-nhv-accent mb-6 border border-nhv-accent/20">
                  <p className="font-bold mb-1 flex items-center gap-2"><Fingerprint className="w-5 h-5" /> Mock OTP sent!</p>
                  <p className="opacity-80">Auto-filled for hackathon demo purposes.</p>
                </div>
                <div>
                  <label className="block text-base font-semibold text-gray-300 mb-2">Enter OTP</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl outline-none tracking-[1em] text-center text-3xl font-mono text-white focus:ring-2 focus:ring-nhv-accent/50"
                    value="123456"
                    readOnly
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-nhv-accent text-black py-4 rounded-xl text-lg font-bold hover:bg-teal-400 transition-all disabled:opacity-70 shadow-[0_0_20px_rgba(45,212,191,0.4)]"
                >
                  {loading ? 'Authenticating...' : 'Confirm & Login'}
                </button>
              </form>
            )
          )}

          {activeTab === 'doctor' && (
            <form onSubmit={handleDoctorSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-base font-semibold text-gray-300 mb-2">Medical License Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. MCI-12345"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 outline-none text-white text-lg transition-all uppercase"
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-500/10 border border-blue-500 text-blue-400 py-4 rounded-xl text-lg font-bold hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-70"
              >
                {loading ? 'Authenticating...' : 'Access Clinical Dashboard'}
              </button>
            </form>
          )}

          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSubmit} className="space-y-6 animate-fade-in">
              <div>
                <label className="block text-base font-semibold text-gray-300 mb-2">Admin Access Code</label>
                <input 
                  type="password" 
                  placeholder="e.g. ADMIN-NHV"
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400 outline-none text-white text-lg transition-all tracking-widest font-mono"
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value)}
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-500/10 border border-purple-500 text-purple-400 py-4 rounded-xl text-lg font-bold hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-70 flex justify-center items-center gap-3"
              >
                <Settings className="w-6 h-6" />
                {loading ? 'Authenticating...' : 'Initialize System Access'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
