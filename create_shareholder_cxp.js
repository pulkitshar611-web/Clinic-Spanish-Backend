const db = require('./src/config/db');

const queries = [
  `CREATE TABLE IF NOT EXISTS shareholder_cxp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shareholder_id INT NOT NULL,
    concept VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    expiration_date DATE NOT NULL,
    priority ENUM('Baja', 'Media', 'Alta') DEFAULT 'Media',
    status ENUM('Pendiente', 'Pagado', 'Vencido', 'Programado') DEFAULT 'Pendiente',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted TINYINT(1) DEFAULT 0,
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id)
  )`
];

(async () => {
  try {
    for (const query of queries) {
      await db.query(query);
      console.log('Executed query successfully');
    }
  } catch (e) {
    console.error('Error creating table:', e);
  } finally {
    process.exit(0);
  }
})();
