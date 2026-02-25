const db = require('../../config/db');
const queries = require('./users.queries');
const bcrypt = require('bcryptjs');

exports.getProfile = async (userId, role) => {
  const [userRows] = await db.query(queries.GET_USER_PROFILE, [userId]);
  if (userRows.length === 0) throw new Error('User not found');

  const profile = { ...userRows[0] };

  if (role === 'doctor') {
    const [docRows] = await db.query(queries.GET_DOCTOR_DETAILS, [userId]);
    if (docRows.length > 0) profile.details = docRows[0];
  } else if (role === 'patient') {
    const [patRows] = await db.query(queries.GET_PATIENT_DETAILS, [userId]);
    if (patRows.length > 0) profile.details = patRows[0];
  }

  return profile;
};

exports.updateProfile = async (userId, role, data) => {
  const { full_name, email, firstName, lastName, gender, dob, phone, address, specialization } = data;

  // 1. Update basic user info
  await db.query(queries.UPDATE_USER_PROFILE, [full_name, email, userId]);

  // 2. Update specific details
  if (role === 'doctor') {
    await db.query(queries.UPDATE_DOCTOR_DETAILS, [
      firstName, lastName, gender, dob, phone, address, specialization, userId
    ]);
  } else if (role === 'patient') {
    await db.query(queries.UPDATE_PATIENT_DETAILS, [
      firstName, lastName, gender, dob, phone, address, userId
    ]);
  }

  return true;
};

exports.updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await db.query(queries.UPDATE_PASSWORD, [hashedPassword, userId]);
  return true;
};
