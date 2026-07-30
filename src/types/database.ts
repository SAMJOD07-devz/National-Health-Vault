export type UserRole = 'patient' | 'doctor' | 'nurse' | 'admin';
export type Gender = 'male' | 'female' | 'other';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type ReportType = 'Lab Report' | 'Prescription' | 'Discharge Summary' | 'X-Ray' | 'MRI' | 'CT Scan' | 'Blood Test' | 'ECG';
export type MedicationStatus = 'active' | 'discontinued';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: string;
  profile_id: string;
  health_id: string;
  aadhaar_masked: string;
  date_of_birth: string;
  gender: Gender;
  blood_group: BloodGroup;
  allergies: string[];
  critical_conditions: string[];
  address: string;
  emergency_contact: string;
  created_at: string;
  
  // Joined relation fields for ease of use in UI
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export interface Doctor {
  id: string;
  profile_id: string;
  license_no: string;
  specialization: string;
  hospital: string;
  created_at: string;

  // Joined relation fields
  profiles?: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export interface Visit {
  id: string;
  patient_id: string;
  doctor_id: string;
  hospital_name: string;
  visit_date: string;
  diagnosis: string;
  notes: string;
  
  // Joined relations
  doctors?: Doctor;
}

export interface Medication {
  id: string;
  patient_id: string;
  prescribed_by: string;
  name: string;
  dosage: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  status: MedicationStatus;
  
  // Joined relations
  doctors?: Doctor;
}

export interface Report {
  id: string;
  visit_id: string;
  patient_id: string;
  doctor_id: string;
  type: ReportType;
  storage_path: string;
  created_at: string;
}

export interface Vitals {
  id: string;
  patient_id: string;
  recorded_by_nurse_id: string | null;
  blood_pressure: string;
  pulse: number;
  spo2: number;
  temperature: number;
  blood_sugar: number;
  height: number;
  weight: number;
  recorded_at: string;
}

export interface AuditLog {
  id: string;
  patient_id: string;
  actor_id: string;
  actor_role: UserRole;
  action: string;
  old_value: any;
  new_value: any;
  hospital: string;
  timestamp: string;
}
