const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function check() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_pro'
  });
  const [rows] = await connection.execute('SELECT COUNT(*) as count FROM doctors WHERE is_deleted = 0');
  console.log('Doctors count:', rows[0].count);
  const [doctors] = await connection.execute('SELECT id, first_name, last_name FROM doctors WHERE is_deleted = 0');
  console.log('Doctors:', doctors);
  await connection.end();
}
check().catch(console.error);
