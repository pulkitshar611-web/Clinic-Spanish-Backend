const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedServiceCategories() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding service categories (Income Tags)...');
    const categories = [
      ['Consulta Médica', 'Servicios de consulta general y especialidades'],
      ['Laboratorio', 'Análisis clínicos y resultados'],
      ['Seguros (ARS)', 'Pagos recibidos de aseguradoras'],
      ['Copagos', 'Pagos directos del paciente en consulta'],
      ['Procedimientos', 'Cirugías menores y otros'],
      ['Farmacia', 'Venta de medicamentos e insumos']
    ];

    for (const [name, desc] of categories) {
      const [rows] = await connection.query('SELECT * FROM service_categories WHERE name = ?', [name]);
      if (rows.length === 0) {
        await connection.query('INSERT INTO service_categories (name, description) VALUES (?, ?)', [name, desc]);
        console.log(`Service Category "${name}" created.`);
      }
    }
    console.log('Service categories seeding completed.');
  } catch (error) {
    console.error('Error seeding service categories:', error);
  } finally {
    await connection.end();
  }
}

seedServiceCategories();
