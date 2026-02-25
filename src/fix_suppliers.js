const mysql = require('mysql2/promise');
require('dotenv').config();

async function fix() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  console.log('Checking suppliers table...');
  const [columns] = await connection.query('DESCRIBE suppliers');
  const columnNames = columns.map(c => c.Field);

  console.log('Current columns:', columnNames);

  if (!columnNames.includes('category')) {
    console.log('Adding category column...');
    await connection.query('ALTER TABLE suppliers ADD COLUMN category VARCHAR(50) AFTER rnc');
  }

  if (!columnNames.includes('contact_person')) {
    console.log('Adding contact_person column...');
    await connection.query('ALTER TABLE suppliers ADD COLUMN contact_person VARCHAR(100) AFTER category');
  }

  console.log('Table fixed!');
  process.exit();
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
