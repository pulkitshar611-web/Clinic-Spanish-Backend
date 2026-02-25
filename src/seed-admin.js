const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAdmin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding admin user...');
    const username = 'clinivaAdmin';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);

    if (rows.length === 0) {
      await connection.query(
        'INSERT INTO users (username, password_hash, role, full_name, email) VALUES (?, ?, ?, ?, ?)',
        [username, hashedPassword, 'admin', 'Cliniva Admin', 'admin@cliniva.com']
      );
      console.log('Admin user created successfully.');
    } else {
      console.log('Admin user already exists.');
    }
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Users table does not exist. Please run the full_schema.sql first.');
    } else {
      console.error('Error seeding admin user:', error);
    }
  } finally {
    await connection.end();
  }
}

seedAdmin();
