const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding expense categories...');
    const categories = [
      ['Operativos', 'Gastos generales de operación'],
      ['Nómina', 'Sueldos y salarios'],
      ['Mantenimiento', 'Reparaciones y mantenimiento'],
      ['Suministros Médicos', 'Insumos para la clínica'],
      ['Servicios Públicos', 'Luz, agua, internet'],
      ['Otros', 'Gastos no clasificados']
    ];

    for (const [name, desc] of categories) {
      const [rows] = await connection.query('SELECT * FROM expense_categories WHERE name = ?', [name]);
      if (rows.length === 0) {
        await connection.query('INSERT INTO expense_categories (name, description) VALUES (?, ?)', [name, desc]);
        console.log(`Category "${name}" created.`);
      }
    }
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await connection.end();
  }
}

seedCategories();
