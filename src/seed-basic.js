const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedBasicData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding basic doctors and patients...');

    // Seed Doctors
    const [existingDoctors] = await connection.query('SELECT id FROM doctors');
    if (existingDoctors.length === 0) {
      await connection.query(
        'INSERT INTO doctors (first_name, last_name, specialization, email, mobile, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Juan', 'Perez', 'Cardiology', 'juan.perez@example.com', '809-555-0001', 'Disponible']
      );
      await connection.query(
        'INSERT INTO doctors (first_name, last_name, specialization, email, mobile, status) VALUES (?, ?, ?, ?, ?, ?)',
        ['Maria', 'Garcia', 'Pediatrics', 'maria.garcia@example.com', '809-555-0002', 'Disponible']
      );
      console.log('Doctors seeded.');
    }

    // Seed Patients
    const [existingPatients] = await connection.query('SELECT id FROM patients');
    if (existingPatients.length === 0) {
      await connection.query(
        'INSERT INTO patients (first_name, last_name, identification_number, phone, email) VALUES (?, ?, ?, ?, ?)',
        ['Carlos', 'Ramirez', '001-0000000-1', '809-123-4567', 'carlos.ramirez@example.com']
      );
      await connection.query(
        'INSERT INTO patients (first_name, last_name, identification_number, phone, email) VALUES (?, ?, ?, ?, ?)',
        ['Ana', 'Martinez', '001-0000000-2', '809-987-6543', 'ana.martinez@example.com']
      );
      console.log('Patients seeded.');
    }

  } catch (error) {
    console.error('Error seeding basic data:', error);
  } finally {
    await connection.end();
  }
}

seedBasicData();
