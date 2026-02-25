const db = require('../../config/db');
const queries = require('./consultorios.queries');
const bcrypt = require('bcryptjs');

exports.createDoctor = async (data) => {
  const {
    firstName, middleName, lastName, gender, dateOfBirth, bloodGroup,
    email, mobile, alternativeContact, address, city, state, postalCode,
    password, designation, department, specialization, experience, licenseNumber, licenseExpiryDate,
    education, certifications, joiningDate, employeeId, roomCabinNumber,
    availableDays, startTime, endTime, emergencyContactName, emergencyContactNumber,
    relationship, profilePhoto, licenseDoc, eduCert, addDocs
  } = data;

  // 1. Create User first for login
  const hashedPassword = await bcrypt.hash(password || 'doctor123', 10);
  const [userResult] = await db.query(
    'INSERT INTO users (username, password_hash, role, full_name, email) VALUES (?, ?, ?, ?, ?)',
    [email, hashedPassword, 'doctor', `${firstName} ${lastName}`, email]
  );
  const userId = userResult.insertId;

  // 2. Create Doctor entry
  const [result] = await db.query(queries.CREATE_DOCTOR, [
    userId, // user_id
    firstName, middleName || null, lastName, gender, dateOfBirth || null, bloodGroup || null,
    email, mobile, alternativeContact || null, address || null, city || null, state || null, postalCode || null,
    designation, department, specialization, experience || 0,
    licenseNumber, licenseExpiryDate || null, education, certifications || null,
    joiningDate || null, employeeId, roomCabinNumber || null, availableDays,
    startTime || null, endTime || null, emergencyContactName || null, emergencyContactNumber || null,
    relationship || null, profilePhoto || null, licenseDoc || null,
    eduCert || null, addDocs || null
  ]);

  return result.insertId;
};

exports.listDoctors = async () => {
  const [rows] = await db.query(queries.LIST_DOCTORS);
  return rows;
};

exports.createPatient = async (data) => {
  const {
    first_name, last_name, dob, gender, identification_number,
    phone, email, address, insurance_provider_id, insurance_policy_number,
    password, doctor_id, appointment_date, appointment_time, appointment_reason
  } = data;

  // 1. Optional User creation or retrieval
  let userId = null;
  const username = email || identification_number;

  // Check if user already exists
  const [existingUser] = await db.query('SELECT id, role FROM users WHERE username = ? OR email = ?', [username, email]);

  if (existingUser.length > 0) {
    userId = existingUser[0].id;
    // Check if this user is already a patient
    const [existingPatient] = await db.query('SELECT id FROM patients WHERE user_id = ? OR identification_number = ?', [userId, identification_number]);
    if (existingPatient.length > 0) {
      throw new Error('Ya existe un paciente registrado con este correo o identificación.');
    }
  } else if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await db.query(
      'INSERT INTO users (username, password_hash, role, full_name, email) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, 'patient', `${first_name} ${last_name}`, email]
    );
    userId = userResult.insertId;
  }


  // 2. Create Patient
  const [result] = await db.query(queries.CREATE_PATIENT, [
    userId, first_name, last_name, dob, gender, identification_number,
    phone, email, address, insurance_provider_id, insurance_policy_number
  ]);
  const patientId = result.insertId;

  // 3. Optional Appointment creation
  if (doctor_id) {
    const dateTime = (appointment_date && appointment_time)
      ? `${appointment_date} ${appointment_time}`
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    await db.query(queries.CREATE_APPOINTMENT, [
      doctor_id, patientId, dateTime, appointment_reason || 'Paciente Asignado', null
    ]);
  }

  return patientId;
};

exports.listPatients = async (doctorId = null) => {
  const [rows] = await db.query(queries.LIST_PATIENTS, [doctorId, doctorId]);
  return rows;
};

exports.getPanelData = async (doctorId = null) => {
  // Aggregated data for panel
  const [stats] = await db.query(queries.GET_PANEL_STATS, [doctorId, doctorId, doctorId, doctorId]);
  return stats[0];
};

exports.getTodaysSchedule = async (doctorId = null) => {
  const [rows] = await db.query(queries.GET_TODAYS_SCHEDULE, [doctorId, doctorId]);
  return rows;
};

exports.searchPatients = async (query) => {
  const searchTerm = `%${query}%`;
  const [rows] = await db.query(queries.SEARCH_PATIENTS, [searchTerm, searchTerm, searchTerm]);
  return rows;
};

exports.getAllAppointments = async (doctorId = null) => {
  const [rows] = await db.query(queries.GET_ALL_APPOINTMENTS, [doctorId, doctorId]);
  return rows;
};

exports.createLabOrder = async (data) => {
  const { patient_id, doctor_id, order_type, description } = data;
  const [result] = await db.query(queries.CREATE_LAB_ORDER, [patient_id, doctor_id, order_type, description]);
  return result.insertId;
};

exports.createPrescription = async (data) => {
  const { patient_id, doctor_id, medication, dosage, duration, instructions } = data;
  const [result] = await db.query(queries.CREATE_PRESCRIPTION, [patient_id, doctor_id, medication, dosage, duration, instructions]);
  return result.insertId;
};

exports.createConsultation = async (data) => {
  const {
    patient_id, doctor_id, heart_rate, temperature, respiratory_rate,
    blood_pressure, background, reason_for_consultation,
    physical_examination, diagnosis_code, diagnosis_description, clinical_notes
  } = data;

  const [result] = await db.query(queries.CREATE_CONSULTATION, [
    patient_id, doctor_id, heart_rate, temperature, respiratory_rate,
    blood_pressure, background, reason_for_consultation,
    physical_examination, diagnosis_code, diagnosis_description, clinical_notes
  ]);

  return result.insertId;
};

exports.getDoctorPatients = async (doctorId) => {
  const [rows] = await db.query(queries.GET_DOCTOR_PATIENTS, [doctorId, doctorId]);
  return rows;
};

exports.getPatientPortalData = async (patientUserId) => {
  // 1. Get Patient ID from User ID
  const [patientRows] = await db.query('SELECT id FROM patients WHERE user_id = ?', [patientUserId]);
  if (patientRows.length === 0) throw new Error('Patient not found');
  const patientId = patientRows[0].id;

  // 2. Fetch all related data
  const [appointments] = await db.query(`
        SELECT a.*, d.first_name as doc_first, d.last_name as doc_last, d.specialization
        FROM appointments a
        JOIN doctors d ON a.doctor_id = d.id
        WHERE a.patient_id = ? AND a.is_deleted = 0
        ORDER BY a.appointment_date DESC
    `, [patientId]);

  const [consultations] = await db.query(`
        SELECT c.*, d.first_name as doc_first, d.last_name as doc_last
        FROM consultations c
        JOIN doctors d ON c.doctor_id = d.id
        WHERE c.patient_id = ?
        ORDER BY c.created_at DESC
    `, [patientId]);

  const [invoices] = await db.query(`
        SELECT * FROM invoices WHERE patient_id = ? AND is_deleted = 0
        ORDER BY invoice_date DESC
    `, [patientId]);

  return { appointments, consultations, invoices };
};

exports.getPatientById = async (id) => {
  const [rows] = await db.query(queries.GET_PATIENT_BY_ID, [id]);
  return rows[0];
};

exports.updatePatient = async (id, data) => {
  const {
    first_name, last_name, dob, gender, identification_number,
    phone, email, address, insurance_provider_id, insurance_policy_number,
    doctor_id, appointment_date, appointment_time, appointment_reason
  } = data;

  const [result] = await db.query(queries.UPDATE_PATIENT, [
    first_name, last_name, dob, gender, identification_number,
    phone, email, address, insurance_provider_id, insurance_policy_number,
    id
  ]);

  // Handle assignment update
  if (doctor_id) {
    const dateTime = (appointment_date && appointment_time)
      ? `${appointment_date} ${appointment_time}`
      : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Check if an appointment for this doctor and patient already exists today
    const [existing] = await db.query(
      'SELECT id FROM appointments WHERE doctor_id = ? AND patient_id = ? AND DATE(appointment_date) = CURDATE() AND is_deleted = 0',
      [doctor_id, id]
    );

    if (existing.length === 0) {
      await db.query(queries.CREATE_APPOINTMENT, [
        doctor_id, id, dateTime, appointment_reason || 'Actualización de Asignación', null
      ]);
    }
  }

  return result.affectedRows > 0;
};

exports.deletePatient = async (id) => {
  const [result] = await db.query(queries.DELETE_PATIENT, [id]);
  return result.affectedRows > 0;
};

exports.deleteDoctor = async (id) => {
  const [result] = await db.query(queries.DELETE_DOCTOR, [id]);
  return result.affectedRows > 0;
};
