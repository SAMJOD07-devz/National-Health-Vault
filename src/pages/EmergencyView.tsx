import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Droplet, HeartPulse, ChevronLeft, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Patient } from '../types/database';

export default function EmergencyView() {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('patients')
          .select('*, profiles(first_name, last_name)')
          .eq('health_id', id.toUpperCase())
          .single();

        if (data) {
          setPatient(data as unknown as Patient);
        }
      } catch (err) {
        console.error('Error fetching emergency patient:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <Activity className="w-12 h-12 text-red-500 animate-pulse mb-4" />
        <p className="text-gray-400">Accessing Emergency Records...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Patient Not Found</h1>
        <p className="text-gray-400">Invalid Health ID for Emergency Access.</p>
        <Link to="/" className="mt-8 text-blue-400 hover:underline flex items-center"><ChevronLeft className="w-4 h-4" /> Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 flex flex-col">
      <div className="w-full max-w-3xl mx-auto flex-1 flex flex-col">
        {/* Warning Header */}
        <div className="bg-red-900/50 border border-red-500 p-4 rounded-xl flex items-center justify-center gap-3 mb-8 animate-pulse">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h1 className="text-red-500 font-bold tracking-widest uppercase">Emergency Read-Only Access</h1>
        </div>

        {/* Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
            <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Patient Name</h2>
            <p className="text-3xl font-bold">{patient.profiles?.first_name} {patient.profiles?.last_name}</p>
            <div className="mt-4 pt-4 border-t border-zinc-800 text-sm text-gray-400">
              <p>ID: {patient.health_id}</p>
              <p>DOB: {patient.date_of_birth}</p>
            </div>
          </div>

          <div className="bg-red-950/30 border border-red-900/50 p-6 rounded-2xl flex items-center gap-6">
            <Droplet className="w-16 h-16 text-red-500 shrink-0" />
            <div>
              <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Blood Group</h2>
              <p className="text-6xl font-bold text-red-500">{patient.blood_group}</p>
            </div>
          </div>
        </div>

        {/* Critical Alerts */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl mb-6 flex-1">
          <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-red-500" /> Critical Conditions & Allergies
          </h2>
          
          <div className="space-y-4">
            {patient.allergies && patient.allergies.length > 0 ? (
              <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-lg">
                <h3 className="text-red-400 font-semibold mb-2 uppercase text-sm">Severe Allergies</h3>
                <p className="text-xl font-medium text-white">{patient.allergies.join(', ')}</p>
              </div>
            ) : (
              <p className="text-gray-500">No known allergies.</p>
            )}
            
            {patient.critical_conditions && patient.critical_conditions.length > 0 && (
              <div className="p-4 bg-orange-900/20 border border-orange-900/50 rounded-lg mt-4">
                <h3 className="text-orange-400 font-semibold mb-2 uppercase text-sm">Critical Conditions</h3>
                <p className="text-xl font-medium text-white">{patient.critical_conditions.join(', ')}</p>
              </div>
            )}

            <div className="p-4 bg-zinc-800/50 rounded-lg">
              <h3 className="text-gray-400 font-semibold mb-2 uppercase text-sm">Emergency Contact</h3>
              <p className="text-xl font-medium text-white">{patient.emergency_contact}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-zinc-600 text-xs mt-auto pt-4">
          Access logged. Unauthorized use of emergency access is strictly prohibited.
        </p>
      </div>
    </div>
  );
}
