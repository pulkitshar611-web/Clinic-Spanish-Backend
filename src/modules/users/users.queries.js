module.exports = {
  GET_USER_PROFILE: `
    SELECT id, username, role, full_name, email FROM users WHERE id = ? AND is_deleted = 0
  `,
  UPDATE_USER_PROFILE: `
    UPDATE users SET full_name = ?, email = ? WHERE id = ?
  `,
  UPDATE_PASSWORD: `
    UPDATE users SET password_hash = ? WHERE id = ?
  `,
  GET_DOCTOR_DETAILS: `
    SELECT * FROM doctors WHERE user_id = ? AND is_deleted = 0
  `,
  GET_PATIENT_DETAILS: `
    SELECT * FROM patients WHERE user_id = ? AND is_deleted = 0
  `,
  UPDATE_DOCTOR_DETAILS: `
    UPDATE doctors SET 
      first_name = ?, last_name = ?, gender = ?, dob = ?, 
      mobile = ?, address = ?, specialization = ?
    WHERE user_id = ?
  `,
  UPDATE_PATIENT_DETAILS: `
    UPDATE patients SET 
      first_name = ?, last_name = ?, gender = ?, dob = ?, 
      phone = ?, address = ?
    WHERE user_id = ?
  `
};
