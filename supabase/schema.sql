-- National Health Vault (NHV) - Supabase PostgreSQL Schema
-- Note: Row Level Security (RLS) is omitted for this phase.

-- 1. ENUMS
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other');
CREATE TYPE blood_group_enum AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE report_type_enum AS ENUM ('Lab Report', 'Prescription', 'Discharge Summary', 'X-Ray', 'MRI', 'CT Scan', 'Blood Test', 'ECG');
CREATE TYPE medication_status AS ENUM ('active', 'discontinued');
CREATE TYPE user_role_enum AS ENUM ('patient', 'doctor', 'nurse', 'admin');

-- 2. Profiles
-- Independent profile table (Custom Aadhaar + OTP login, not tied to auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT CHECK (phone ~ '^[6-9][0-9]{9}$'),
    role user_role_enum NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_profiles_first_name ON profiles(first_name);
CREATE INDEX idx_profiles_last_name ON profiles(last_name);
CREATE INDEX idx_profiles_full_name ON profiles(first_name, last_name);
CREATE INDEX idx_profiles_role ON profiles(role);

-- 3. Patients
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    health_id TEXT NOT NULL UNIQUE CHECK (health_id ~ '^NHV-\d{4}-\d{6}$'),
    aadhaar_masked TEXT NOT NULL CHECK (aadhaar_masked ~ '^XXXX-XXXX-[0-9]{4}$'),   
    date_of_birth DATE NOT NULL,
    gender gender_enum NOT NULL,
    blood_group blood_group_enum,
    allergies TEXT[] DEFAULT '{}',
    critical_conditions TEXT[] DEFAULT '{}',
    address TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_patients_health_id ON patients(health_id);
CREATE INDEX idx_patients_profile_id ON patients(profile_id);
CREATE INDEX idx_patients_blood_group ON patients(blood_group);
CREATE INDEX idx_patients_created_at ON patients(created_at);

-- 4. Doctors
CREATE TABLE doctors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    license_no TEXT NOT NULL UNIQUE,
    specialization TEXT NOT NULL,
    hospital TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_doctors_license_no ON doctors(license_no);
CREATE INDEX idx_doctors_profile_id ON doctors(profile_id);
CREATE INDEX idx_doctors_hospital ON doctors(hospital);

-- 5. Nurses
CREATE TABLE nurses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    hospital TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_nurses_profile_id ON nurses(profile_id);
CREATE INDEX idx_nurses_hospital ON nurses(hospital);

-- 6. Visits
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    hospital_name TEXT NOT NULL,
    visit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diagnosis TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_visits_patient_id ON visits(patient_id);
CREATE INDEX idx_visits_doctor_id ON visits(doctor_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_visits_patient_date ON visits(patient_id, visit_date DESC);

-- 7. Medications
CREATE TABLE medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    prescribed_by UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    dosage TEXT NOT NULL,
    frequency TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    status medication_status NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT chk_medication_dates CHECK (end_date IS NULL OR end_date >= start_date)
);
CREATE INDEX idx_medications_patient_id ON medications(patient_id);
CREATE INDEX idx_medications_status ON medications(status);
CREATE INDEX idx_medications_patient_status ON medications(patient_id, status);

-- 8. Reports
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    type report_type_enum NOT NULL, 
    storage_path TEXT NOT NULL, 
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_reports_visit_id ON reports(visit_id);
CREATE INDEX idx_reports_patient_id ON reports(patient_id);
CREATE INDEX idx_reports_doctor_id ON reports(doctor_id);
CREATE INDEX idx_reports_created_at ON reports(created_at);
CREATE INDEX idx_reports_patient_type ON reports(patient_id, type);

-- 9. Vitals
CREATE TABLE vitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    recorded_by_nurse_id UUID REFERENCES nurses(id) ON DELETE SET NULL,
    blood_pressure TEXT,
    pulse INTEGER CHECK (pulse > 0),
    spo2 INTEGER CHECK (spo2 BETWEEN 0 AND 100),
    temperature NUMERIC, 
    blood_sugar NUMERIC, 
    height NUMERIC CHECK (height > 0),
    weight NUMERIC CHECK (weight > 0),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_vitals_patient_id ON vitals(patient_id);
CREATE INDEX idx_vitals_recorded_at ON vitals(recorded_at DESC);

-- 10. Audit Logs (Immutable)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    actor_id UUID NOT NULL, 
    actor_role user_role_enum NOT NULL,
    action TEXT NOT NULL, 
    old_value JSONB,
    new_value JSONB,
    hospital TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_audit_logs_patient_id ON audit_logs(patient_id);
CREATE INDEX idx_audit_logs_actor_id ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- Prevent Updates/Deletes on audit_logs
CREATE OR REPLACE FUNCTION make_audit_logs_immutable()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Audit logs are immutable and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_logs_immutable
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION make_audit_logs_immutable();

-- 11. Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_patients_modtime BEFORE UPDATE ON patients FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_doctors_modtime BEFORE UPDATE ON doctors FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_nurses_modtime BEFORE UPDATE ON nurses FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_visits_modtime BEFORE UPDATE ON visits FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_medications_modtime BEFORE UPDATE ON medications FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_reports_modtime BEFORE UPDATE ON reports FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_vitals_modtime BEFORE UPDATE ON vitals FOR EACH ROW EXECUTE FUNCTION update_modified_column();
