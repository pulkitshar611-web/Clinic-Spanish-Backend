const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

(async () => {
  try {
    // Create connection without database selected to run CREATE DATABASE
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    const sqlPath = path.join(__dirname, 'full_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split and execute statements one by one is safer for some drivers, 
    // but enabling multipleStatements: true allows running the whole file content at once if configured.
    // However, USE database command changes context for subsequent queries in the same connection.

    // Let's try executing the whole script content as one query block if possible, 
    // or split by semi-colon if the driver handles it better.
    // mysql2 supports multipleStatements if option is set.

    // We can also just run it as a single block if the driver supports it.
    console.log('Executing database schema...');
    await connection.query(sql);

    console.log('Database setup complete! "clinic_erp" created and tables initialized.');
    await connection.end();
  } catch (err) {
    console.error('Error setting up database:', err);
    process.exit(1);
  }
})();
