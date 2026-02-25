const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function fixRoles() {
  console.log('--- Swapping Roles: Kiaan -> Doctor, Yash -> Patient ---');

  // 1. Fix Users Table
  const docPass = await bcrypt.hash('doctor123', 10);
  const patPass = await bcrypt.hash('patient123', 10);

  // Update Kiaan to Doctor
  await db.query('UPDATE users SET role = "doctor", full_name = "Dr. Kiaan", password_hash = ? WHERE username = "kiaan@gmail.com"', [docPass]);
  // Update Yash to Patient
  await db.query('UPDATE users SET role = "patient", full_name = "Yash", password_hash = ? WHERE username = "y@gmail.com"', [patPass]);

  // 2. Fetch User IDs
  const [kiaanUser] = await db.query('SELECT id FROM users WHERE username = "kiaan@gmail.com"');
  const [yashUser] = await db.query('SELECT id FROM users WHERE username = "y@gmail.com"');

  const kiaanId = kiaanUser[0]?.id;
  const yashId = yashUser[0]?.id;

  if (kiaanId) {
    // Check if Kiaan is in doctors
    const [existingDoc] = await db.query('SELECT id FROM doctors WHERE email = "kiaan@gmail.com"');
    if (existingDoc.length > 0) {
      await db.query('UPDATE doctors SET user_id = ?, first_name = "Kiaan", last_name = "Doctor" WHERE id = ?', [kiaanId, existingDoc[0].id]);
    } else {
      // Create Kiaan in doctors if not exists
      await db.query('INSERT INTO doctors (user_id, first_name, last_name, email, mobile, specialization) VALUES (?, "Kiaan", "Doctor", "kiaan@gmail.com", "0000000000", "General")', [kiaanId]);
    }
    // Delete Kiaan from patients if he was there
    await db.query('DELETE FROM patients WHERE email = "kiaan@gmail.com"');
  }

  if (yashId) {
    // Check if Yash is in patients
    const [existingPat] = await db.query('SELECT id FROM patients WHERE email = "y@gmail.com"');
    if (existingPat.length > 0) {
      await db.query('UPDATE patients SET user_id = ?, first_name = "Yash", last_name = "Patient" WHERE id = ?', [yashId, existingPat[0].id]);
    } else {
      // Create Yash in patients
      await db.query('INSERT INTO patients (user_id, first_name, last_name, email, phone) VALUES (?, "Yash", "Patient", "y@gmail.com", "0000000000")', [yashId]);
    }
    // Delete Yash from doctors if he was there
    await db.query('DELETE FROM doctors WHERE email = "y@gmail.com"');
  }

  console.log('Roles swapped and records updated.');
  process.exit(0);
}

fixRoles();
