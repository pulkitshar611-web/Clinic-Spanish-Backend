const db = require('./src/config/db');

async function check() {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM services');
    console.log('Services Columns:', columns.map(c => c.Field));

    const [catColumns] = await db.query('SHOW COLUMNS FROM service_categories');
    console.log('Service Categories Columns:', catColumns.map(c => c.Field));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

check();
