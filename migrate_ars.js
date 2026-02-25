const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_pro'
  });
  console.log('Adding website column to ars_companies...');
  try {
    await connection.execute('ALTER TABLE ars_companies ADD COLUMN website VARCHAR(255) AFTER contact_phone;');
    console.log('Column added successfully.');
  } catch (e) {
    if (e.code === 'ER_DUP_COLUMN_NAME') {
      console.log('Column already exists.');
    } else {
      console.error(e);
    }
  }
  await connection.end();
}
migrate().catch(console.error);
