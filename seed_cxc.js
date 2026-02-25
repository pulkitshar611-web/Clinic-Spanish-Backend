const db = require('./src/config/db');

async function seed() {
  try {
    // Ensure we have an ARS and a Patient
    const [arsRows] = await db.query('SELECT id FROM ars_companies LIMIT 1');
    let arsId = arsRows[0]?.id;
    if (!arsId) {
      const [res] = await db.query('INSERT INTO ars_companies (name, rnc) VALUES (?, ?)', ['ARS Humano', '123456789']);
      arsId = res.insertId;
    }

    const [patientRows] = await db.query('SELECT id FROM patients LIMIT 1');
    let patientId = patientRows[0]?.id;
    if (!patientId) {
      const [res] = await db.query('INSERT INTO patients (first_name, last_name, identification_number) VALUES (?, ?, ?)', ['Juan', 'Perez', '40212345678']);
      patientId = res.insertId;
    }

    const [doctorRows] = await db.query('SELECT id FROM doctors LIMIT 1');
    let doctorId = doctorRows[0]?.id;
    if (!doctorId) {
      const [res] = await db.query('INSERT INTO doctors (first_name, last_name) VALUES (?, ?)', ['David', 'Rodriguez']);
      doctorId = res.insertId;
    }

    // Add some invoices
    const now = new Date();
    const invoices = [
      ['INV-001', 'B0100000001', patientId, doctorId, null, now, new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), 1000, 1000, 'unpaid'], // Overdue
      ['INV-002', 'B0100000002', patientId, doctorId, arsId, now, new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), 5000, 5000, 'unpaid'], // ARS Invoice
      ['INV-003', 'B0100000003', patientId, doctorId, null, now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), 2000, 2000, 'partial'], // Partial
    ];

    for (const inv of invoices) {
      await db.query(
        'INSERT INTO invoices (invoice_number, ncf, patient_id, doctor_id, ars_id, invoice_date, due_date, subtotal, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        inv
      );
    }

    // Add a payment for the partial one
    const [lastInv] = await db.query('SELECT id FROM invoices WHERE invoice_number = "INV-003"');
    if (lastInv.length > 0) {
      await db.query(
        'INSERT INTO payments (invoice_id, patient_id, payment_date, amount, payment_method, reference_number) VALUES (?, ?, ?, ?, ?, ?)',
        [lastInv[0].id, patientId, now, 500, 'cash', 'REF-SEED-001']
      );
    }

    console.log('Successfully seeded CXC data');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
