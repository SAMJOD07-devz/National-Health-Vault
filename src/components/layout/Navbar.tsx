import { Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-6 lg:px-12 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-2 shrink-0">
        <Shield className="w-8 h-8 text-nhv-accent" />
        <span className="text-white font-bold text-xl tracking-wide">NHV</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#about" className="hover:text-white transition-colors tracking-wide">About Product</a>
        <a href="#doctors" className="hover:text-white transition-colors tracking-wide">For Doctors</a>
        <a href="#patients" className="hover:text-white transition-colors tracking-wide">For Patients</a>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          to="/emergency"
          className="hidden md:flex items-center gap-2 bg-nhv-red/10 border border-nhv-red/50 text-nhv-red px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider hover:bg-nhv-red hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
        >
          <AlertCircle className="w-4 h-4" />
          Emergency Service
        </Link>
        <Link 
          to="/login"
          className="bg-white text-nhv-dark px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
