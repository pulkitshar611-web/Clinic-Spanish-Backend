const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedProfitabilityData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'clinic_erp'
  });

  try {
    console.log('Seeding Profitability Data (Services & Invoice Items)...');

    // 1. Ensure Service Categories exist (from seed-service-categories.js)
    const [categories] = await connection.query('SELECT id, name FROM service_categories LIMIT 3');
    if (categories.length === 0) {
      console.log('No service categories found. Please run seed-db first.');
      return;
    }

    // 2. Add some Services if not present
    const [existingServices] = await connection.query('SELECT id FROM services LIMIT 1');
    if (existingServices.length === 0) {
      await connection.query(
        'INSERT INTO services (category_id, name, code, base_price) VALUES (?, ?, ?, ?), (?, ?, ?, ?), (?, ?, ?, ?)',
        [categories[0].id, 'Consulta General', 'CONS-001', 1500.00,
        categories[1].id, 'Analisis Sangre', 'LAB-001', 800.00,
        categories[2].id, 'X-Ray Chest', 'RAD-001', 2500.00]
      );
      console.log('Services seeded.');
    }

    const [services] = await connection.query('SELECT id, base_price FROM services');
    const [invoices] = await connection.query('SELECT id FROM invoices');

    if (invoices.length === 0) {
      console.log('No invoices found. Please run seed-overdue.js first.');
      return;
    }

    // 3. Link Invoice Items to existing Invoices
    const [existingItems] = await connection.query('SELECT id FROM invoice_items LIMIT 1');
    if (existingItems.length === 0) {
      for (const inv of invoices) {
        // Add 2 random services to each invoice
        const s1 = services[Math.floor(Math.random() * services.length)];
        const s2 = services[Math.floor(Math.random() * services.length)];

        await connection.query(
          'INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, total_line) VALUES (?, ?, ?, ?, ?, ?), (?, ?, ?, ?, ?, ?)',
          [inv.id, s1.id, 'Procedimiento A', 1, s1.base_price, s1.base_price,
          inv.id, s2.id, 'Procedimiento B', 1, s2.base_price, s2.base_price]
        );
      }
      console.log('Invoice items linked to invoices.');
    }

    console.log('Profitability seeding complete.');
  } catch (error) {
    console.error('Error seeding profitability data:', error);
  } finally {
    await connection.end();
  }
}

seedProfitabilityData();
