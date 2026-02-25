const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  console.log('Seeding Price Lists...');

  const plans = [
    ['Plan Básico Privado', 'Estándar', 'DOP', '100%', 1],
    ['Plan Seguro Básico', 'Aseguradora', 'DOP', '80%', 1],
    ['Plan Premium Internacional', 'Internacional', 'USD', '100%', 1],
    ['Plan Empleados', 'Interno', 'DOP', '50%', 1],
    ['Tarifa Nocturna', 'Especial', 'DOP', 'N/A', 0]
  ];

  for (const plan of plans) {
    await connection.execute(
      'INSERT INTO price_lists (name, type, currency, coverage, active) VALUES (?, ?, ?, ?, ?)',
      plan
    );
  }

  console.log('Seeding complete!');
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
