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

  if (!columnNames.includes('credit_limit')) {
    console.log('Adding credit_limit column...');
    await connection.query('ALTER TABLE suppliers ADD COLUMN credit_limit DECIMAL(12,2) DEFAULT 0.00 AFTER address');
  }

  if (!columnNames.includes('current_balance')) {
    console.log('Adding current_balance column...');
    await connection.query('ALTER TABLE suppliers ADD COLUMN current_balance DECIMAL(12,2) DEFAULT 0.00 AFTER credit_limit');
  }

  if (!columnNames.includes('status')) {
    console.log('Adding status column...');
    await connection.query("ALTER TABLE suppliers ADD COLUMN status ENUM('Active', 'Inactive') DEFAULT 'Active' AFTER current_balance");
  }

  console.log('Table fixed!');
  process.exit();
}

fix().catch(err => {
  console.error(err);
  process.exit(1);
});
