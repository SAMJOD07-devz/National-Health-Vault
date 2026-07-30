import { Link } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-4 py-4 md:px-6 lg:px-12 backdrop-blur-sm border-b border-white/5">
      <div className="flex items-center gap-3 shrink-0">
        <img src="/logo.png" className="h-12 w-auto object-contain" alt="iNHV Logo" />
        <span className="text-white font-bold text-2xl tracking-wide hidden sm:inline-block">iNHV</span>
      </div>
      
      <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#about" className="hover:text-white transition-colors tracking-wide">About Product</a>
        <a href="#doctors" className="hover:text-white transition-colors tracking-wide">For Doctors</a>
        <a href="#patients" className="hover:text-white transition-colors tracking-wide">For Patients</a>
      </div>

      <div className="flex items-center gap-3">

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
