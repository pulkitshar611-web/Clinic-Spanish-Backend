const mysql = require('mysql2/promise');
require('dotenv').config();

async function cleanDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Cleaning database...');

    // Disable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Get all tables
    const [tables] = await connection.query('SHOW TABLES');
    const dbName = process.env.DB_NAME || 'clinic_erp';
    const tableKey = `Tables_in_${dbName}`;

    for (const tableRow of tables) {
      const tableName = tableRow[tableKey];
      console.log(`Truncating table: ${tableName}`);
      await connection.query(`TRUNCATE TABLE ${tableName}`);
    }

    // Re-enable foreign key checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Database cleaned successfully.');

  } catch (error) {
    console.error('Error cleaning database:', error);
  } finally {
    await connection.end();
  }
}

cleanDatabase();
