module.exports = {
  CREATE_DOCTOR: `
        INSERT INTO doctors (
            user_id, first_name, middle_name, last_name, gender, dob, blood_group, 
            email, mobile, alternative_contact, address, city, state, postal_code,
            designation, department, specialization, experience_years, 
            license_number, license_expiry_date, education, certifications,
            joining_date, employee_id, room_cabin_number, available_days, 
            start_time, end_time, emergency_contact_name, emergency_contact_phone, 
            emergency_contact_relationship, profile_photo, license_document, 
            education_certificate, additional_documents
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  LIST_DOCTORS: `
        SELECT id, first_name, last_name, specialization as specialty, license_number as exequatur, mobile as phone, email, commission_rate,
        (SELECT COUNT(DISTINCT patient_id) FROM invoices WHERE doctor_id = doctors.id AND is_deleted = 0) as patients,
        (SELECT IFNULL(SUM(total_amount * (doctors.commission_rate / 100)), 0) FROM invoices WHERE doctor_id = doctors.id AND is_deleted = 0) as commissions,
        (SELECT IFNULL(SUM(total_amount), 0) FROM invoices WHERE doctor_id = doctors.id AND is_deleted = 0) as total_billed,
        status,
        12 as turns
        FROM doctors 
        WHERE is_deleted = 0
    `,
  GET_TODAYS_SCHEDULE: `
        SELECT a.id, a.appointment_date, p.id as patient_id, p.first_name, p.last_name, p.phone, p.gender, p.dob, a.reason, a.status,
        d.first_name as doc_first, d.last_name as doc_last, d.specialization as specialty
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE DATE(a.appointment_date) = CURDATE() 
        AND (? IS NULL OR a.doctor_id = ?)
        AND a.is_deleted = 0
        ORDER BY a.appointment_date ASC
    `,
  GET_ALL_APPOINTMENTS: `
        SELECT a.id, a.appointment_date, p.id as patient_id, p.first_name, p.last_name, 
        d.first_name as doc_first, d.last_name as doc_last, d.specialization as specialty,
        a.reason, a.status
        FROM appointments a
        JOIN patients p ON a.patient_id = p.id
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.is_deleted = 0
        AND (? IS NULL OR a.doctor_id = ?)
        ORDER BY a.appointment_date ASC
    `,
  GET_DOCTOR_PATIENTS: `
        SELECT DISTINCT p.id, p.first_name, p.last_name, p.phone, p.email, p.dob, p.gender, 
        (SELECT MAX(appointment_date) FROM appointments WHERE patient_id = p.id AND doctor_id = ?) as last_appointment
        FROM patients p
        JOIN appointments a ON p.id = a.patient_id
        WHERE a.doctor_id = ? AND a.is_deleted = 0 AND p.is_deleted = 0
    `,
  CREATE_PATIENT: `
        INSERT INTO patients (user_id, first_name, last_name, dob, gender, identification_number, phone, email, address, insurance_provider_id, insurance_policy_number)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  LIST_PATIENTS: `
        SELECT p.id, p.first_name, p.last_name, p.dob, p.gender, p.identification_number, p.phone, p.email, p.insurance_provider_id as ars_id,
        (SELECT CONCAT('Dr. ', d2.first_name, ' ', d2.last_name) 
         FROM appointments a2 
         JOIN doctors d2 ON a2.doctor_id = d2.id 
         WHERE a2.patient_id = p.id AND a2.is_deleted = 0 
         ORDER BY a2.appointment_date DESC LIMIT 1) as assigned_doctor,
        (SELECT MAX(invoice_date) FROM invoices WHERE patient_id = p.id AND is_deleted = 0) as last_visit
        FROM patients p 
        WHERE p.is_deleted = 0
        AND (? IS NULL OR EXISTS (SELECT 1 FROM appointments a3 WHERE a3.patient_id = p.id AND a3.doctor_id = ? AND a3.is_deleted = 0))
    `,
  GET_PATIENT_BY_ID: `
        SELECT * FROM patients WHERE id = ? AND is_deleted = 0
    `,
  UPDATE_PATIENT: `
        UPDATE patients SET 
            first_name = ?, last_name = ?, dob = ?, gender = ?, 
            identification_number = ?, phone = ?, email = ?, 
            address = ?, insurance_provider_id = ?, insurance_policy_number = ?
        WHERE id = ?
    `,
  DELETE_PATIENT: `
        UPDATE patients SET is_deleted = 1 WHERE id = ?
    `,
  GET_PANEL_STATS: `
        SELECT 
            (SELECT COUNT(*) FROM patients p WHERE p.is_deleted = 0 AND (? IS NULL OR EXISTS (SELECT 1 FROM appointments a WHERE a.patient_id = p.id AND a.doctor_id = ? AND a.is_deleted = 0))) as active_patients,
            (SELECT COUNT(*) FROM doctors WHERE is_deleted = 0) as active_doctors,
            (SELECT COUNT(*) FROM appointments WHERE DATE(appointment_date) = CURDATE() AND is_deleted = 0 AND (? IS NULL OR doctor_id = ?)) as today_appointments
    `,
  SEARCH_PATIENTS: `
        SELECT id, first_name, last_name, identification_number, phone, email, dob
        FROM patients
        WHERE (first_name LIKE ? OR last_name LIKE ? OR identification_number LIKE ?)
        AND is_deleted = 0
        LIMIT 10
    `,
  CREATE_CONSULTATION: `
        INSERT INTO consultations (
            patient_id, doctor_id, heart_rate, temperature, respiratory_rate, 
            blood_pressure, background, reason_for_consultation, 
            physical_examination, diagnosis_code, diagnosis_description, clinical_notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  CREATE_APPOINTMENT: `
        INSERT INTO appointments (doctor_id, patient_id, appointment_date, reason, status, notes)
        VALUES (?, ?, ?, ?, 'scheduled', ?)
    `,
  CREATE_LAB_ORDER: `
        INSERT INTO lab_orders (patient_id, doctor_id, order_type, description, status)
        VALUES (?, ?, ?, ?, 'pending')
    `,
  CREATE_PRESCRIPTION: `
        INSERT INTO prescriptions (patient_id, doctor_id, medication, dosage, duration, instructions)
        VALUES (?, ?, ?, ?, ?, ?)
    `,
  DELETE_DOCTOR: `
        UPDATE doctors SET is_deleted = 1 WHERE id = ?
    `
};
