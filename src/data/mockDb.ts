export type Role = 'patient' | 'doctor' | 'nurse' | 'admin';

export interface Patient {
  id: string;
  name: string;
  dob: string; // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  aadhaarMasked: string;
  phone: string;
  address: string;
  allergies: string[];
  emergencyContact: string;
}

export interface Doctor {
  id: string;
  name: string;
  licenseNo: string;
  specialization: string;
  hospital: string;
}

export interface Visit {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  notes: string;
  reportFileUrl?: string;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedBy: string; // Doctor ID
  startDate: string;
  status: 'active' | 'discontinued';
}

export interface AuditLog {
  id: string;
  patientId: string;
  actorId: string;
  actorRole: Role;
  action: string;
  timestamp: string;
}

export const mockPatients: Patient[] = [
  {
    id: 'P-1001',
    name: 'Rahul Sharma',
    dob: '1985-04-12',
    gender: 'Male',
    bloodGroup: 'O+',
    aadhaarMasked: 'XXXX-XXXX-4589',
    phone: '+91 9876543210',
    address: 'Andheri West, Mumbai, MH',
    allergies: ['Penicillin', 'Dust'],
    emergencyContact: '+91 9988776655 (Priya Sharma)'
  },
  {
    id: 'P-1002',
    name: 'Anjali Desai',
    dob: '1992-08-25',
    gender: 'Female',
    bloodGroup: 'A-',
    aadhaarMasked: 'XXXX-XXXX-9921',
    phone: '+91 9123456789',
    address: 'Koramangala, Bengaluru, KA',
    allergies: [],
    emergencyContact: '+91 9876543211 (Rohan Desai)'
  },
  {
    id: 'P-1003',
    name: 'Vikram Singh',
    dob: '1970-11-03',
    gender: 'Male',
    bloodGroup: 'B+',
    aadhaarMasked: 'XXXX-XXXX-1123',
    phone: '+91 9898989898',
    address: 'Connaught Place, New Delhi, DL',
    allergies: ['Peanuts'],
    emergencyContact: '+91 9797979797 (Simran Singh)'
  },
  {
    id: 'P-1004',
    name: 'Sneha Patel',
    dob: '2001-02-14',
    gender: 'Female',
    bloodGroup: 'AB+',
    aadhaarMasked: 'XXXX-XXXX-6543',
    phone: '+91 8888888888',
    address: 'Navrangpura, Ahmedabad, GJ',
    allergies: ['Sulfa Drugs'],
    emergencyContact: '+91 8787878787 (Karan Patel)'
  },
  {
    id: 'P-1005',
    name: 'Arun Iyer',
    dob: '1965-06-30',
    gender: 'Male',
    bloodGroup: 'O-',
    aadhaarMasked: 'XXXX-XXXX-8765',
    phone: '+91 9999999999',
    address: 'Mylapore, Chennai, TN',
    allergies: ['Latex'],
    emergencyContact: '+91 9191919191 (Geetha Iyer)'
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'D-2001',
    name: 'Dr. Rajesh Kumar',
    licenseNo: 'MCI-12345',
    specialization: 'Cardiology',
    hospital: 'Fortis Hospital, Mumbai'
  },
  {
    id: 'D-2002',
    name: 'Dr. Neha Gupta',
    licenseNo: 'MCI-67890',
    specialization: 'General Medicine',
    hospital: 'Apollo Hospital, Bengaluru'
  },
  {
    id: 'D-2003',
    name: 'Dr. Sanjay Verma',
    licenseNo: 'MCI-54321',
    specialization: 'Endocrinology',
    hospital: 'Max Super Speciality, Delhi'
  }
];

export const mockVisits: Visit[] = [
  {
    id: 'V-3001',
    patientId: 'P-1001',
    doctorId: 'D-2001',
    date: '2023-10-15',
    diagnosis: 'Mild Hypertension',
    notes: 'Patient advised to reduce sodium intake and exercise regularly. Prescribed low-dose antihypertensive.',
    reportFileUrl: '/reports/bp_monitor.pdf'
  },
  {
    id: 'V-3002',
    patientId: 'P-1002',
    doctorId: 'D-2002',
    date: '2023-11-20',
    diagnosis: 'Viral Fever',
    notes: 'Symptoms of fever, body ache, and mild cough. Advised rest and hydration.'
  },
  {
    id: 'V-3003',
    patientId: 'P-1003',
    doctorId: 'D-2003',
    date: '2023-12-05',
    diagnosis: 'Type 2 Diabetes Type',
    notes: 'HbA1c is 7.5%. Increasing metformin dose. Advised strict diet control.',
    reportFileUrl: '/reports/blood_test.pdf'
  }
];

export const mockMedications: Medication[] = [
  {
    id: 'M-4001',
    patientId: 'P-1001',
    name: 'Amlodipine',
    dosage: '5mg',
    frequency: 'Once a day',
    prescribedBy: 'D-2001',
    startDate: '2023-10-15',
    status: 'active'
  },
  {
    id: 'M-4002',
    patientId: 'P-1002',
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: 'Thrice a day as needed',
    prescribedBy: 'D-2002',
    startDate: '2023-11-20',
    status: 'discontinued'
  },
  {
    id: 'M-4003',
    patientId: 'P-1003',
    name: 'Metformin',
    dosage: '1000mg',
    frequency: 'Twice a day',
    prescribedBy: 'D-2003',
    startDate: '2023-12-05',
    status: 'active'
  }
];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 'A-5001',
    patientId: 'P-1001',
    actorId: 'D-2001',
    actorRole: 'doctor',
    action: 'Added new visit and diagnosis (Hypertension)',
    timestamp: '2023-10-15T10:30:00Z'
  },
  {
    id: 'A-5002',
    patientId: 'P-1002',
    actorId: 'D-2002',
    actorRole: 'doctor',
    action: 'Added new visit (Viral Fever)',
    timestamp: '2023-11-20T14:45:00Z'
  },
  {
    id: 'A-5003',
    patientId: 'P-1003',
    actorId: 'D-2003',
    actorRole: 'doctor',
    action: 'Updated medication (Metformin)',
    timestamp: '2023-12-05T09:15:00Z'
  }
];
