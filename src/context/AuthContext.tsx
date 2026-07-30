import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockPatients, mockDoctors } from '../data/mockDb';
import type { Role } from '../data/mockDb';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null; // Patient | Doctor | etc.
  role: Role | null;
}

interface AuthContextType extends AuthState {
  loginPatient: (aadhaar: string) => Promise<boolean>;
  loginDoctor: (licenseNo: string) => Promise<boolean>;
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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    // Simulated mock authentication: matching mock data for demo
    // We only take the last 4 digits to match our masked 'XXXX-XXXX-1234' format roughly.
    const last4 = aadhaar.slice(-4);
    const patient = mockPatients.find(p => p.aadhaarMasked.endsWith(last4));
    
    if (patient) {
      setAuthState({
        isAuthenticated: true,
        user: patient,
        role: 'patient',
      });
      return true;
    }
    return false;
  };

  const loginDoctor = async (licenseNo: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const doctor = mockDoctors.find(d => d.licenseNo === licenseNo);
    
    if (doctor) {
      setAuthState({
        isAuthenticated: true,
        user: doctor,
        role: 'doctor',
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
    <AuthContext.Provider value={{ ...authState, loginPatient, loginDoctor, logout }}>
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
