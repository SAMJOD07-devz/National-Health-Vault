import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Key, FileHeart, Activity } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import OrbCanvas from '../components/3D/Orb';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-nhv-dark text-white overflow-x-hidden selection:bg-nhv-accent selection:text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 lg:px-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-nhv-dark via-nhv-dark to-[#0f172a] -z-20" />
        
        {/* 3D Orb Component */}
        <div className="absolute inset-0 z-0">
          <OrbCanvas />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold font-serif leading-tight mb-6"
          >
            Trusted with your <br/>
            <span className="text-nhv-accent">health record.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg"
          >
            A centralized digital medical record system replacing physical files. 
            One lifelong health record, verified via Aadhaar.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12"
          >
            <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Trusted By</p>
            <div className="flex items-center gap-6 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              {/* Mock logos text as placeholders */}
              <span className="font-bold text-xl">Apollo</span>
              <span className="font-bold text-xl">Fortis</span>
              <span className="font-bold text-xl">Max</span>
              <span className="font-bold text-xl text-sm border px-2 py-1 rounded">MCI</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 lg:px-24 bg-gradient-to-b from-transparent to-nhv-dark">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-nhv-accent" />}
            title="Aadhaar Verified"
            desc="Identity verification ensures your records are always linked securely to you."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Key className="w-6 h-6 text-nhv-accent" />}
            title="Doctor-Only Edits"
            desc="Only registered, verified medical professionals can update your clinical data."
            delay={0.2}
          />
          <FeatureCard 
            icon={<FileHeart className="w-6 h-6 text-nhv-accent" />}
            title="Audit Trail"
            desc="Complete transparency. See exactly who accessed or updated your health record."
            delay={0.3}
          />
          <FeatureCard 
            icon={<Activity className="w-6 h-6 text-nhv-red" />}
            title="Emergency Access"
            desc="Critical data like blood group and allergies available instantly in the ER."
            delay={0.4}
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode, title: string, desc: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="glass-panel-dark rounded-2xl p-6 hover:-translate-y-1 transition-transform"
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
