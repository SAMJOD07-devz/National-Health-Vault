-- National Health Vault (NHV) - Seed Data
-- 12 Profiles: 6 Patients, 3 Doctors, 2 Nurses, 1 Admin

-- Insert Profiles
INSERT INTO profiles (id, first_name, last_name, phone, role) VALUES
('11111111-1111-1111-1111-111111111111', 'Rahul', 'Sharma', '9876543210', 'patient'),
('11111111-1111-1111-1111-111111111112', 'Anjali', 'Desai', '9123456789', 'patient'),
('11111111-1111-1111-1111-111111111113', 'Vikram', 'Singh', '9898989898', 'patient'),
('11111111-1111-1111-1111-111111111114', 'Sneha', 'Patel', '8888888888', 'patient'),
('11111111-1111-1111-1111-111111111115', 'Arun', 'Iyer', '9999999999', 'patient'),
('11111111-1111-1111-1111-111111111116', 'Priya', 'Verma', '9797979797', 'patient'),

('22222222-2222-2222-2222-222222222221', 'Rajesh', 'Kumar', '9876543211', 'doctor'),
('22222222-2222-2222-2222-222222222222', 'Neha', 'Gupta', '9123456781', 'doctor'),
('22222222-2222-2222-2222-222222222223', 'Sanjay', 'Reddy', '9898989891', 'doctor'),

('33333333-3333-3333-3333-333333333331', 'Sita', 'Menon', '8888888881', 'nurse'),
('33333333-3333-3333-3333-333333333332', 'Gita', 'Rao', '9999999991', 'nurse'),

('44444444-4444-4444-4444-444444444441', 'Admin', 'User', '9797979791', 'admin');

-- Insert Patients
INSERT INTO patients (id, profile_id, health_id, aadhaar_masked, date_of_birth, gender, blood_group, allergies, critical_conditions, address, emergency_contact) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '11111111-1111-1111-1111-111111111111', 'NHV-2026-000001', 'XXXX-XXXX-4589', '1985-04-12', 'male', 'O+', '{"Penicillin", "Dust"}', '{"Hypertension"}', 'Andheri West, Mumbai', '9988776655'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '11111111-1111-1111-1111-111111111112', 'NHV-2026-000002', 'XXXX-XXXX-9921', '1992-08-25', 'female', 'A-', '{}', '{}', 'Koramangala, Bengaluru', '9876543211'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '11111111-1111-1111-1111-111111111113', 'NHV-2026-000003', 'XXXX-XXXX-1123', '1970-11-03', 'male', 'B+', '{"Peanuts"}', '{"Diabetes", "Hypertension"}', 'Connaught Place, New Delhi', '9797979797'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '11111111-1111-1111-1111-111111111114', 'NHV-2026-000004', 'XXXX-XXXX-6543', '2001-02-14', 'female', 'AB+', '{"Sulfa Drugs"}', '{"Asthma"}', 'Navrangpura, Ahmedabad', '8787878787'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '11111111-1111-1111-1111-111111111115', 'NHV-2026-000005', 'XXXX-XXXX-8765', '1965-06-30', 'male', 'O-', '{"Latex"}', '{"Coronary Artery Disease"}', 'Mylapore, Chennai', '9191919191'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', '11111111-1111-1111-1111-111111111116', 'NHV-2026-000006', 'XXXX-XXXX-3344', '1988-12-10', 'female', 'B-', '{}', '{}', 'Bandra East, Mumbai', '8877665544');

-- Insert Doctors
INSERT INTO doctors (id, profile_id, license_no, specialization, hospital) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', '22222222-2222-2222-2222-222222222221', 'MCI-12345', 'Cardiology', 'Fortis Hospital'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', '22222222-2222-2222-2222-222222222222', 'MCI-67890', 'General Medicine', 'Apollo Hospitals'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', '22222222-2222-2222-2222-222222222223', 'MCI-54321', 'Endocrinology', 'AIIMS Delhi');

-- Insert Nurses
INSERT INTO nurses (id, profile_id, hospital) VALUES
('cccccccc-cccc-cccc-cccc-ccccccccccc1', '33333333-3333-3333-3333-333333333331', 'Fortis Hospital'),
('cccccccc-cccc-cccc-cccc-ccccccccccc2', '33333333-3333-3333-3333-333333333332', 'Apollo Hospitals');

-- Insert Visits (20 visits)
INSERT INTO visits (id, patient_id, doctor_id, hospital_name, visit_date, diagnosis, notes) VALUES
('dddddddd-dddd-dddd-dddd-ddddddddddd1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2023-10-15T10:30:00Z', 'Mild Hypertension', 'Patient advised to reduce sodium intake. Prescribed Losartan.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2023-11-20T14:45:00Z', 'Viral Fever', 'Symptoms of fever, body ache. Prescribed Paracetamol.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'AIIMS Delhi', '2023-12-05T09:15:00Z', 'Type 2 Diabetes', 'HbA1c is 7.5%. Increasing Metformin dose.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2024-01-10T11:00:00Z', 'Asthma Exacerbation', 'Mild wheezing. Advised inhaler usage.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2024-02-14T16:20:00Z', 'High Cholesterol', 'Lipid profile elevated. Prescribed Atorvastatin.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2024-03-01T10:00:00Z', 'Bacterial Pharyngitis', 'Throat pain and redness. Amoxicillin prescribed.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd7', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2024-04-15T09:30:00Z', 'Routine Checkup', 'BP is stable.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd8', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Manipal Hospital', '2024-05-10T11:45:00Z', 'Migraine', 'Advised rest and hydration.'),
('dddddddd-dddd-dddd-dddd-ddddddddddd9', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'AIIMS Delhi', '2024-06-05T14:15:00Z', 'Diabetes Follow-up', 'HbA1c improved to 6.8%.'),
('dddddddd-dddd-dddd-dddd-dddddddddd10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2024-07-20T16:00:00Z', 'Allergic Rhinitis', 'Prescribed antihistamines.'),
('dddddddd-dddd-dddd-dddd-dddddddddd11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2024-08-14T10:20:00Z', 'Angina', 'Referred for ECG.'),
('dddddddd-dddd-dddd-dddd-dddddddddd12', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2024-09-01T11:00:00Z', 'Typhoid', 'Prescribed Azithromycin.'),
('dddddddd-dddd-dddd-dddd-dddddddddd13', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Kauvery Hospital', '2024-10-15T15:30:00Z', 'Hypertension Follow-up', 'Continue Losartan.'),
('dddddddd-dddd-dddd-dddd-dddddddddd14', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2024-11-20T09:45:00Z', 'Viral Fever', 'Rest advised.'),
('dddddddd-dddd-dddd-dddd-dddddddddd15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'AIIMS Delhi', '2024-12-05T13:15:00Z', 'Neuropathy', 'Complication of diabetes.'),
('dddddddd-dddd-dddd-dddd-dddddddddd16', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Manipal Hospital', '2025-01-10T14:00:00Z', 'Asthma Checkup', 'Lungs clear.'),
('dddddddd-dddd-dddd-dddd-dddddddddd17', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2025-02-14T11:20:00Z', 'Routine Checkup', 'Lipids normal.'),
('dddddddd-dddd-dddd-dddd-dddddddddd18', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Kauvery Hospital', '2025-03-01T15:00:00Z', 'Sinusitis', 'Prescribed Amoxicillin.'),
('dddddddd-dddd-dddd-dddd-dddddddddd19', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Fortis Hospital', '2025-04-15T10:30:00Z', 'Chest Pain', 'Admitted for observation.'),
('dddddddd-dddd-dddd-dddd-dddddddddd20', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Apollo Hospitals', '2025-05-10T11:45:00Z', 'Sprain', 'Prescribed pain relief.');

-- Insert Medications (30 medications)
INSERT INTO medications (id, patient_id, prescribed_by, name, dosage, frequency, start_date, end_date, status) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Losartan', '50mg', 'Once daily', '2023-10-15', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Paracetamol', '500mg', 'SOS', '2023-11-20', '2023-11-25', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Metformin', '1000mg', 'Twice daily', '2023-12-05', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Insulin', '10 units', 'Before meals', '2023-12-05', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Atorvastatin', '20mg', 'Once daily', '2024-02-14', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Amoxicillin', '500mg', 'Three times daily', '2024-03-01', '2024-03-07', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Aspirin', '75mg', 'Once daily', '2024-04-15', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Azithromycin', '500mg', 'Once daily', '2024-09-01', '2024-09-05', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Paracetamol', '500mg', 'SOS', '2024-10-20', '2024-10-25', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Amoxicillin', '500mg', 'Three times daily', '2025-05-10', '2025-05-17', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Atorvastatin', '10mg', 'Once daily', '2024-06-05', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Aspirin', '75mg', 'Once daily', '2024-08-14', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Metformin', '500mg', 'Twice daily', '2025-04-15', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Azithromycin', '500mg', 'Once daily', '2024-11-20', '2024-11-25', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Losartan', '25mg', 'Once daily', '2025-01-10', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Paracetamol', '500mg', 'SOS', '2025-03-01', '2025-03-05', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Aspirin', '150mg', 'Once daily', '2024-12-05', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Metformin', '500mg', 'Twice daily', '2025-02-14', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Amoxicillin', '500mg', 'Three times daily', '2025-04-15', '2025-04-22', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Atorvastatin', '20mg', 'Once daily', '2024-01-10', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Losartan', '50mg', 'Once daily', '2024-05-10', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Aspirin', '75mg', 'Once daily', '2024-09-01', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Paracetamol', '500mg', 'SOS', '2024-06-05', '2024-06-10', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Azithromycin', '500mg', 'Once daily', '2024-08-14', '2024-08-19', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Atorvastatin', '40mg', 'Once daily', '2024-10-15', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Insulin', '15 units', 'Before meals', '2024-07-20', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Metformin', '1000mg', 'Twice daily', '2024-11-20', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Losartan', '50mg', 'Once daily', '2025-03-01', NULL, 'active'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Amoxicillin', '500mg', 'Three times daily', '2024-12-05', '2024-12-12', 'discontinued'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Paracetamol', '500mg', 'SOS', '2025-02-14', '2025-02-19', 'discontinued');

-- Insert Reports (20 reports)
INSERT INTO reports (id, visit_id, patient_id, doctor_id, type, storage_path) VALUES
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Blood Test', 'medical-reports/NHV-2026-000001/blood_test_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Prescription', 'medical-reports/NHV-2026-000002/prescription_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Lab Report', 'medical-reports/NHV-2026-000003/lab_report_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Prescription', 'medical-reports/NHV-2026-000004/prescription_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Blood Test', 'medical-reports/NHV-2026-000005/lipid_profile.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Prescription', 'medical-reports/NHV-2026-000006/prescription_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd7', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'ECG', 'medical-reports/NHV-2026-000001/ecg_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd8', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'MRI', 'medical-reports/NHV-2026-000002/mri_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-ddddddddddd9', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'Lab Report', 'medical-reports/NHV-2026-000003/hba1c.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd10', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Prescription', 'medical-reports/NHV-2026-000004/prescription_2.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd11', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'ECG', 'medical-reports/NHV-2026-000005/ecg_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd12', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Blood Test', 'medical-reports/NHV-2026-000006/widal_test.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd13', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Prescription', 'medical-reports/NHV-2026-000001/prescription_2.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd14', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Blood Test', 'medical-reports/NHV-2026-000002/cbp.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd15', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'CT Scan', 'medical-reports/NHV-2026-000003/ct_scan_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd16', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'X-Ray', 'medical-reports/NHV-2026-000004/xray_chest.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd17', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Lab Report', 'medical-reports/NHV-2026-000005/lipid_profile_2.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd18', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'Prescription', 'medical-reports/NHV-2026-000006/prescription_3.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd19', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'Discharge Summary', 'medical-reports/NHV-2026-000001/discharge_1.pdf'),
(gen_random_uuid(), 'dddddddd-dddd-dddd-dddd-dddddddddd20', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'X-Ray', 'medical-reports/NHV-2026-000002/xray_leg.pdf');

-- Insert Vitals (30 vitals)
INSERT INTO vitals (id, patient_id, recorded_by_nurse_id, blood_pressure, pulse, spo2, temperature, blood_sugar, height, weight, recorded_at) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '140/90', 82, 98, 98.6, 110, 175, 80, '2023-10-15T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '120/80', 95, 99, 101.2, 95, 160, 60, '2023-11-20T14:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '135/85', 78, 97, 98.4, 210, 180, 85, '2023-12-05T08:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '110/70', 88, 96, 98.6, 90, 165, 55, '2024-01-10T10:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '130/80', 75, 98, 98.6, 105, 170, 75, '2024-02-14T15:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '115/75', 85, 99, 100.5, 92, 162, 58, '2024-03-01T09:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '130/85', 80, 99, 98.6, 108, 175, 79, '2024-04-15T09:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '118/78', 76, 99, 98.8, 94, 160, 60, '2024-05-10T11:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '130/80', 75, 98, 98.5, 150, 180, 84, '2024-06-05T13:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '112/72', 80, 98, 98.6, 91, 165, 55, '2024-07-20T15:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '145/95', 88, 97, 98.6, 106, 170, 76, '2024-08-14T09:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '120/80', 92, 98, 102.0, 93, 162, 57, '2024-09-01T10:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '125/80', 78, 99, 98.6, 107, 175, 79, '2024-10-15T15:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '115/75', 85, 99, 100.2, 95, 160, 60, '2024-11-20T09:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '135/85', 77, 98, 98.6, 140, 180, 84, '2024-12-05T12:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '110/70', 82, 99, 98.6, 92, 165, 55, '2025-01-10T13:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '128/82', 74, 98, 98.6, 105, 170, 75, '2025-02-14T10:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '118/78', 84, 99, 100.8, 94, 162, 58, '2025-03-01T14:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '150/95', 90, 96, 98.8, 109, 175, 80, '2025-04-15T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '122/82', 79, 99, 98.6, 96, 160, 60, '2025-05-10T11:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '132/82', 76, 98, 98.6, 145, 180, 84, '2024-06-15T09:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '115/75', 81, 99, 98.6, 90, 165, 55, '2024-07-25T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '135/85', 78, 98, 98.6, 104, 170, 75, '2024-08-20T11:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '110/70', 86, 99, 98.6, 92, 162, 57, '2024-09-10T14:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '128/82', 75, 99, 98.6, 108, 175, 79, '2024-10-25T09:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '118/78', 80, 99, 98.6, 94, 160, 60, '2024-11-25T10:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '130/80', 74, 98, 98.6, 138, 180, 84, '2024-12-15T11:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '112/72', 82, 99, 98.6, 91, 165, 55, '2025-01-20T12:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', '130/80', 76, 98, 98.6, 105, 170, 75, '2025-02-24T13:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', '120/80', 85, 99, 98.6, 93, 162, 58, '2025-03-10T14:30:00Z');

-- Insert Audit Logs (50 logs)
INSERT INTO audit_logs (id, patient_id, actor_id, actor_role, action, old_value, new_value, hospital, timestamp) VALUES
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-01T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-02T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-03T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-04T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-05T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', '44444444-4444-4444-4444-444444444441', 'admin', 'Created patient record', NULL, '{"status": "created"}', 'NHV Portal', '2023-10-06T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"bp": "140/90"}', 'Fortis Hospital', '2023-10-15T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Created visit', NULL, '{"diagnosis": "Mild Hypertension"}', 'Fortis Hospital', '2023-10-15T10:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Prescribed medication', NULL, '{"medication": "Losartan"}', 'Fortis Hospital', '2023-10-15T10:35:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Uploaded report', NULL, '{"type": "Blood Test"}', 'Fortis Hospital', '2023-10-15T10:40:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"temp": 101.2}', 'Apollo Hospitals', '2023-11-20T14:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Viral Fever"}', 'Apollo Hospitals', '2023-11-20T14:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Prescribed medication', NULL, '{"medication": "Paracetamol"}', 'Apollo Hospitals', '2023-11-20T14:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Uploaded report', NULL, '{"type": "Prescription"}', 'Apollo Hospitals', '2023-11-20T14:55:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Discontinued medication', '{"status": "active"}', '{"status": "discontinued"}', 'Apollo Hospitals', '2023-11-25T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"sugar": 210}', 'AIIMS Delhi', '2023-12-05T08:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Created visit', NULL, '{"diagnosis": "Type 2 Diabetes"}', 'AIIMS Delhi', '2023-12-05T09:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Prescribed medication', NULL, '{"medication": "Metformin"}', 'AIIMS Delhi', '2023-12-05T09:20:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Prescribed medication', NULL, '{"medication": "Insulin"}', 'AIIMS Delhi', '2023-12-05T09:25:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Uploaded report', NULL, '{"type": "Lab Report"}', 'AIIMS Delhi', '2023-12-05T09:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"spo2": 96}', 'Apollo Hospitals', '2024-01-10T10:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Asthma Exacerbation"}', 'Apollo Hospitals', '2024-01-10T11:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Uploaded report', NULL, '{"type": "Prescription"}', 'Apollo Hospitals', '2024-01-10T11:05:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"bp": "130/80"}', 'Fortis Hospital', '2024-02-14T15:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Created visit', NULL, '{"diagnosis": "High Cholesterol"}', 'Fortis Hospital', '2024-02-14T16:20:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Prescribed medication', NULL, '{"medication": "Atorvastatin"}', 'Fortis Hospital', '2024-02-14T16:25:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Uploaded report', NULL, '{"type": "Blood Test"}', 'Fortis Hospital', '2024-02-14T16:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"temp": 100.5}', 'Apollo Hospitals', '2024-03-01T09:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Bacterial Pharyngitis"}', 'Apollo Hospitals', '2024-03-01T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Prescribed medication', NULL, '{"medication": "Amoxicillin"}', 'Apollo Hospitals', '2024-03-01T10:05:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Uploaded report', NULL, '{"type": "Prescription"}', 'Apollo Hospitals', '2024-03-01T10:10:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Discontinued medication', '{"status": "active"}', '{"status": "discontinued"}', 'Apollo Hospitals', '2024-03-07T10:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"bp": "130/85"}', 'Fortis Hospital', '2024-04-15T09:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Created visit', NULL, '{"diagnosis": "Routine Checkup"}', 'Fortis Hospital', '2024-04-15T09:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Prescribed medication', NULL, '{"medication": "Aspirin"}', 'Fortis Hospital', '2024-04-15T09:35:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Uploaded report', NULL, '{"type": "ECG"}', 'Fortis Hospital', '2024-04-15T09:40:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"bp": "118/78"}', 'Manipal Hospital', '2024-05-10T11:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Migraine"}', 'Manipal Hospital', '2024-05-10T11:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Uploaded report', NULL, '{"type": "MRI"}', 'Manipal Hospital', '2024-05-10T11:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"sugar": 150}', 'AIIMS Delhi', '2024-06-05T13:45:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Created visit', NULL, '{"diagnosis": "Diabetes Follow-up"}', 'AIIMS Delhi', '2024-06-05T14:15:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'doctor', 'Uploaded report', NULL, '{"type": "Lab Report"}', 'AIIMS Delhi', '2024-06-05T14:20:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"bp": "112/72"}', 'Apollo Hospitals', '2024-07-20T15:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Allergic Rhinitis"}', 'Apollo Hospitals', '2024-07-20T16:00:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Uploaded report', NULL, '{"type": "Prescription"}', 'Apollo Hospitals', '2024-07-20T16:05:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'cccccccc-cccc-cccc-cccc-ccccccccccc1', 'nurse', 'Recorded vitals', NULL, '{"bp": "145/95"}', 'Fortis Hospital', '2024-08-14T09:50:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Created visit', NULL, '{"diagnosis": "Angina"}', 'Fortis Hospital', '2024-08-14T10:20:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'doctor', 'Uploaded report', NULL, '{"type": "ECG"}', 'Fortis Hospital', '2024-08-14T10:25:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'cccccccc-cccc-cccc-cccc-ccccccccccc2', 'nurse', 'Recorded vitals', NULL, '{"temp": 102.0}', 'Apollo Hospitals', '2024-09-01T10:30:00Z'),
(gen_random_uuid(), 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'doctor', 'Created visit', NULL, '{"diagnosis": "Typhoid"}', 'Apollo Hospitals', '2024-09-01T11:00:00Z');
