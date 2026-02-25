const db = require('./src/config/db');

const queries = [
  `CREATE TABLE IF NOT EXISTS capital_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('Ingreso', 'Egreso', 'Transferencia', 'Ajuste') NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g., 'Aporte de Capital', 'Pago de Dividendos', etc.
    description TEXT NOT NULL,
    partner_name VARCHAR(255),
    shareholder_id INT,
    amount DECIMAL(15, 2) NOT NULL,
    movement_date DATE NOT NULL,
    reference VARCHAR(100),
    is_deleted TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shareholder_id) REFERENCES shareholders(id) ON DELETE SET NULL
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
