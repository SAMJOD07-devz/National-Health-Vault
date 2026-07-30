import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Patient, Doctor, UserRole } from '../types/database';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Patient or Doctor or Admin
  role: UserRole | null;
}

interface AuthContextType extends AuthState {
  loginPatient: (aadhaar: string) => Promise<boolean>;
  loginDoctor: (licenseNo: string) => Promise<boolean>;
  loginAdmin: (adminCode: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null,
  });

  const loginPatient = async (aadhaar: string) => {
    let searchAadhaar = aadhaar;
    if (aadhaar.length === 12) {
      searchAadhaar = `XXXX-XXXX-${aadhaar.slice(-4)}`;
    } else if (aadhaar.length === 4) {
      searchAadhaar = `XXXX-XXXX-${aadhaar}`;
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*, profiles(first_name, last_name, phone)')
      .eq('aadhaar_masked', searchAadhaar)
      .single();

    if (error || !data) {
      console.error('Patient login failed:', error);
      return false;
    }

    setAuthState({
      isAuthenticated: true,
      user: data as unknown as Patient,
      role: 'patient',
    });
    return true;
  };

  const loginDoctor = async (licenseNo: string) => {
    const { data, error } = await supabase
      .from('doctors')
      .select('*, profiles(first_name, last_name, phone)')
      .eq('license_no', licenseNo)
      .single();

    if (error || !data) {
      console.error('Doctor login failed:', error);
      return false;
    }

    setAuthState({
      isAuthenticated: true,
      user: data as unknown as Doctor,
      role: 'doctor',
    });
    return true;
  };

  const loginAdmin = async (adminCode: string) => {
    // For hackathon purposes, hardcode a simple admin code.
    // In a real app, this would verify against a users table with role='admin'
    if (adminCode === 'ADMIN-NHV') {
      setAuthState({
        isAuthenticated: true,
        user: { id: 'admin-1', name: 'System Administrator' },
        role: 'admin',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, loginPatient, loginDoctor, loginAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
