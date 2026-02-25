const mysql = require('mysql2/promise');
require('dotenv').config({ path: './.env' });

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_pro'
  });
  console.log('Creating ars_contacts table...');
  try {
    await connection.execute(`
            CREATE TABLE IF NOT EXISTS ars_contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ars_id INT NOT NULL,
                name VARCHAR(100) NOT NULL,
                role VARCHAR(100),
                phone VARCHAR(20),
                email VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_deleted TINYINT DEFAULT 0,
                FOREIGN KEY (ars_id) REFERENCES ars_companies(id)
            )
        `);
    console.log('Table created successfully.');
  } catch (e) {
    console.error(e);
  }
  await connection.end();
}
migrate().catch(console.error);
