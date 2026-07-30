import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, FileHeart, Activity, Bot, Zap, Globe, HeartPulse, ArrowUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import OrbCanvas from '../components/3D/Orb';

export default function LandingPage() {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-nhv-dark text-white overflow-x-hidden selection:bg-nhv-accent selection:text-white">
      <Navbar />
      
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 px-6 lg:px-24">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-nhv-dark via-nhv-dark to-[#0f172a] -z-20" />
        
        {/* 3D Orb Component */}
        <div className="absolute inset-0 z-0">
          <OrbCanvas />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Left Text */}
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
            >
              <Bot className="w-4 h-4 text-nhv-accent" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-300">Powered by Google Gemma AI</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold font-serif leading-tight mb-6"
            >
              India's unified <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nhv-accent to-blue-500">health record.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 mb-10 max-w-lg leading-relaxed"
            >
              A completely centralized, AI-driven medical record system for 1.4 billion people. 
              One lifelong health record, securely verified via Aadhaar.
            </motion.p>
          </div>

          {/* Right Floating Card: For Patients Chatbot */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full max-w-xl glass-panel-dark p-8 sm:p-10 rounded-3xl relative overflow-hidden group shadow-2xl shadow-indigo-500/10"
          >
            <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-bold text-white">For Patients</h4>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div>
                <h5 className="text-lg font-bold text-gray-200 mb-2">Personal AI Health Assistant</h5>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Medical records are notoriously difficult to understand. NHV uses a secure Gemma-powered RAG Chatbot embedded directly in the patient dashboard.
                </p>
              </div>
              <div className="p-5 bg-black/40 rounded-2xl border border-white/5 shadow-inner">
                {/* User Message */}
                <div className="flex flex-col gap-1.5 mb-5 opacity-70">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center text-[10px] text-white">You</div>
                    <span className="text-xs font-semibold text-gray-400">You</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-base bg-white/5 p-3 rounded-xl rounded-tl-none inline-block">When did I start taking Metformin?</p>
                  </div>
                </div>
                
                {/* Bot Message */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center"><Bot className="w-3 h-3" /></div>
                    <span className="text-xs font-bold text-indigo-400 tracking-wide">GEMMA</span>
                  </div>
                  <div className="pl-8">
                    <p className="text-base bg-indigo-500/10 text-indigo-100 p-4 rounded-xl rounded-tl-none border border-indigo-500/20 leading-relaxed">
                      Based on your securely verified record, Dr. Sharma prescribed Metformin (500mg) on October 12, 2023 at Apollo Hospital.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Infinite Scrolling Marquee for Hospitals */}
      <section className="py-8 bg-[#070b14] border-y border-white/5 overflow-hidden flex items-center">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* We duplicate the list to create a seamless infinite scroll effect */}
          {[1, 2].map((group) => (
            <div key={group} className="flex items-center gap-12 mx-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
              <span className="font-bold text-xl font-serif">AIIMS New Delhi</span>
              <span className="font-bold text-xl font-serif">Apollo Hospitals</span>
              <span className="font-bold text-xl font-serif">Fortis Healthcare</span>
              <span className="font-bold text-xl font-serif">Medanta</span>
              <span className="font-bold text-xl font-serif">CMC Vellore</span>
              <span className="font-bold text-xl font-serif">Tata Memorial</span>
              <span className="font-bold text-xl font-serif">Manipal Hospitals</span>
              <span className="font-bold text-xl font-serif">Narayana Health</span>
              <span className="font-bold text-xl font-serif">Max Super Speciality</span>
              <span className="font-bold text-xl font-serif">Sir Ganga Ram Hospital</span>
              <span className="font-bold text-xl font-serif">Kokilaben Dhirubhai</span>
              <span className="font-bold text-xl font-serif">Lilavati Hospital</span>
              <span className="font-bold text-xl font-serif">KIMS</span>
              <span className="font-bold text-xl font-serif">Care Hospitals</span>
              <span className="font-bold text-xl font-serif">Aster Medcity</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. About Product: All-India Impact */}
      <section id="about" className="relative z-10 py-32 px-6 lg:px-24 bg-gradient-to-b from-transparent via-[#0b1121] to-nhv-dark">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-blue-500/10 text-blue-400 rounded-2xl mb-6"
          >
            <Globe className="w-8 h-8" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold font-serif mb-6"
          >
            Connecting a nation of <span className="text-blue-400">1.4 Billion</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-400 leading-relaxed max-w-3xl mx-auto"
          >
            Currently, Indian healthcare is heavily fragmented. Physical files are lost, medical history is forgotten, and switching hospitals means starting from scratch. The National Health Vault replaces physical files entirely, allowing any verified doctor in the country to instantly and securely access your lifelong medical history.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-nhv-accent" />}
            title="Aadhaar Verified"
            desc="Identity verification ensures your records are always linked securely to you."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Key className="w-6 h-6 text-nhv-accent" />}
            title="Doctor-Only Edits"
            desc="Only registered, verified medical professionals can update clinical data."
            delay={0.2}
          />
          <FeatureCard 
            icon={<FileHeart className="w-6 h-6 text-nhv-accent" />}
            title="Audit Trail"
            desc="Cryptographic logs show exactly who accessed or updated your health record."
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

      {/* 3. The Power of Gemma AI (Main Thing) */}
      <section className="relative z-10 py-32 px-6 lg:px-24 bg-[#0a0f1c] border-y border-white/5 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-nhv-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-nhv-accent uppercase tracking-widest mb-4">The Secret Weapon</h2>
            <h3 className="text-4xl md:text-6xl font-bold font-serif text-white">Making healthcare <span className="text-transparent bg-clip-text bg-gradient-to-r from-nhv-accent to-emerald-400">effective.</span></h3>
          </motion.div>

          <div className="flex justify-center items-center">
            
            {/* For Doctors */}
            <div id="doctors" className="space-y-8 w-full max-w-4xl">
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-panel-dark p-8 rounded-3xl relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-nhv-accent/10 rounded-full blur-3xl group-hover:bg-nhv-accent/20 transition-colors duration-500"></div>
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="p-3 bg-nhv-accent/10 text-nhv-accent rounded-2xl border border-nhv-accent/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">For Doctors</h4>
                </div>
                
                <div className="space-y-6 relative z-10">
                  <div>
                    <h5 className="text-lg font-bold text-gray-200 mb-2">AI Raw Notes Processor</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Doctors don't have time to click through complex forms. With Gemma AI, doctors simply type raw, shorthand clinical notes. The AI instantly parses the text, extracts the exact diagnoses, structures the medication dosages, and files the official record automatically.
                    </p>
                  </div>
                  <div className="h-px w-full bg-white/10"></div>
                  <div>
                    <h5 className="text-lg font-bold text-gray-200 mb-2">Automated Safety Checks</h5>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      Before a prescription is saved, Gemma AI automatically cross-references the new drugs against the patient's entire historical record. It instantly flags fatal drug-drug interactions or unknown drug allergies, saving lives silently in the background.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-nhv-accent/20 border border-nhv-accent/50 text-nhv-accent backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.3)] hover:bg-nhv-accent hover:text-white hover:shadow-[0_0_25px_rgba(45,212,191,0.6)] transition-all duration-300 group"
          >
            <ArrowUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

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
      className="glass-panel-dark rounded-2xl p-6 hover:-translate-y-2 hover:shadow-2xl hover:shadow-nhv-accent/10 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
