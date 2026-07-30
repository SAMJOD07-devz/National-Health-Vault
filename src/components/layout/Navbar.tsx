import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, FileText } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="absolute top-0 w-full z-50 flex items-center justify-between px-6 py-4 lg:px-12">
      <div className="flex items-center gap-2">
        <Shield className="w-8 h-8 text-nhv-accent" />
        <span className="text-white font-bold text-xl tracking-wide">NHV</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#product" className="hover:text-white transition-colors">Product</a>
        <a href="#doctors" className="hover:text-white transition-colors">For Doctors</a>
        <a href="#patients" className="hover:text-white transition-colors">For Patients</a>
      </div>

      <div className="flex gap-4">
        <Link 
          to="/login"
          className="bg-white text-nhv-dark px-5 py-2 rounded-full font-semibold text-sm hover:bg-gray-200 transition-colors"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
