const db = require('./src/config/db');

async function createTable() {
  try {
    const sql = `
            CREATE TABLE IF NOT EXISTS ncf_sequences (
                id INT AUTO_INCREMENT PRIMARY KEY,
                type_name VARCHAR(100) NOT NULL,
                prefix VARCHAR(10) NOT NULL,
                current_sequence INT DEFAULT 1,
                max_sequence INT NOT NULL,
                expiration_date DATE,
                status ENUM('active', 'expired', 'exhausted', 'alert') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                is_deleted TINYINT DEFAULT 0
            )
        `;
    await db.query(sql);
    console.log('Table ncf_sequences created');
  } catch (e) {
    console.error('Error creating table:', e);
  } finally {
    process.exit();
  }
}

createTable();
