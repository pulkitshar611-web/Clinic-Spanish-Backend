const db = require('./src/config/db');

async function migrate() {
  try {
    console.log('Starting migration for services...');

    // Check if columns exist
    const [columns] = await db.query('SHOW COLUMNS FROM services');
    const columnNames = columns.map(c => c.Field);

    if (!columnNames.includes('estimated_time')) {
      console.log('Adding estimated_time column...');
      await db.query("ALTER TABLE services ADD COLUMN estimated_time VARCHAR(50)");
    }

    if (!columnNames.includes('patient_description')) {
      console.log('Adding patient_description column...');
      await db.query("ALTER TABLE services ADD COLUMN patient_description TEXT");
    }

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
