const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Updating shareholders & contributions table schema...');

    const queries = [
      "ALTER TABLE shareholders ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'Socio Inversionista'",
      "ALTER TABLE shareholders ADD COLUMN IF NOT EXISTS status ENUM('Activo', 'Inactivo') DEFAULT 'Activo'",
      "ALTER TABLE shareholders ADD COLUMN IF NOT EXISTS join_date DATE",
      "ALTER TABLE capital_contributions ADD COLUMN IF NOT EXISTS contribution_type VARCHAR(50) DEFAULT 'Efectivo'",
      "ALTER TABLE capital_contributions ADD COLUMN IF NOT EXISTS shares_count INT DEFAULT 0"
    ];

    // Note: IF NOT EXISTS in ALTER TABLE requires MySQL 8.0.19+. 
    // For safety, we'll use a loop and catch duplicate error.

    for (let q of queries) {
      // Remove IF NOT EXISTS if not supported or just let error catch handle it
      const sql = q.replace('IF NOT EXISTS', '');
      try {
        await connection.query(sql);
        console.log(`Executed: ${sql}`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`Skipped (exists): ${sql}`);
        } else {
          console.error(`Error executing "${sql}": ${e.message}`);
        }
      }
    }

    console.log('Database tables updated successfully.');
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await connection.end();
  }
})();
