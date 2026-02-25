const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'src/config/.env' }); // path might need adjustment based on where I run it
// Actually I'll run it from Backend root so path is .env

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Updating database schema...');

    // Add columns to doctors if they don't exist
    // MySQL 8.0 support IF NOT EXISTS in ALTER TABLE is tricky, usually we catch error

    const queries = [
      "ALTER TABLE doctors ADD COLUMN schedule VARCHAR(255)",
      "ALTER TABLE doctors ADD COLUMN status ENUM('Disponible', 'En Consulta', 'Fuera de Servicio') DEFAULT 'Disponible'",
      "ALTER TABLE doctors ADD COLUMN experience VARCHAR(50)",
      "ALTER TABLE doctors ADD COLUMN image_url VARCHAR(255)"
    ];

    for (const q of queries) {
      try {
        await connection.query(q);
        console.log(`Executed: ${q}`);
      } catch (e) {
        // Ignore duplicate column errors
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`Skipped (exists): ${q}`);
        } else {
          console.error(`Error: ${e.message}`);
        }
      }
    }

    console.log('Schema update complete.');
  } catch (err) {
    console.error(err);
  } finally {
    await connection.end();
  }
})();
