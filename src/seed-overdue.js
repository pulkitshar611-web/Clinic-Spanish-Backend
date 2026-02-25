const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedOverdueInvoices() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding overdue invoices...');

    // 1. Get a patient and a doctor
    const [patients] = await connection.query('SELECT id FROM patients LIMIT 2');
    const [doctors] = await connection.query('SELECT id FROM doctors LIMIT 2');

    if (patients.length === 0 || doctors.length === 0) {
      console.log('Please ensure you have patients and doctors seeded first.');
      return;
    }

    const patientId = patients[0].id;
    const doctorId = doctors[0].id;

    // 2. Create an invoice from 45 days ago (Overdue > 30)
    const fortyFiveDaysAgo = new Date();
    fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);
    const dueDate45 = new Date(fortyFiveDaysAgo);
    dueDate45.setDate(dueDate45.getDate() + 5); // 5 days term

    await connection.query(
      'INSERT INTO invoices (invoice_number, ncf, patient_id, doctor_id, invoice_date, due_date, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['INV-001', 'B0100000001', patientId, doctorId, fortyFiveDaysAgo.toISOString().split('T')[0], dueDate45.toISOString().split('T')[0], 50000.00, 'posted', 'unpaid']
    );

    // 3. Create an invoice from 100 days ago (Critical > 90)
    const hundredDaysAgo = new Date();
    hundredDaysAgo.setDate(hundredDaysAgo.getDate() - 100);
    const dueDate100 = new Date(hundredDaysAgo);
    dueDate100.setDate(dueDate100.getDate() + 5);

    await connection.query(
      'INSERT INTO invoices (invoice_number, ncf, patient_id, doctor_id, invoice_date, due_date, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['INV-002', 'B0100000002', patientId, doctorId, hundredDaysAgo.toISOString().split('T')[0], dueDate100.toISOString().split('T')[0], 125000.00, 'posted', 'unpaid']
    );

    // 4. Create another critical invoice
    const hundredTwentyDaysAgo = new Date();
    hundredTwentyDaysAgo.setDate(hundredTwentyDaysAgo.getDate() - 120);
    const dueDate120 = new Date(hundredTwentyDaysAgo);
    dueDate120.setDate(dueDate120.getDate() + 5);

    await connection.query(
      'INSERT INTO invoices (invoice_number, ncf, patient_id, doctor_id, invoice_date, due_date, total_amount, status, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      ['INV-003', 'B0100000003', patients[1]?.id || patientId, doctorId, hundredTwentyDaysAgo.toISOString().split('T')[0], dueDate120.toISOString().split('T')[0], 85000.00, 'posted', 'unpaid']
    );

    console.log('Overdue invoices seeded successfully.');
  } catch (error) {
    console.error('Error seeding overdue invoices:', error);
  } finally {
    await connection.end();
  }
}

seedOverdueInvoices();
