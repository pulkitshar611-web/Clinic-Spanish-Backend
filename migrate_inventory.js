const db = require('./src/config/db');
async function migrate() {
  try {
    await db.query('ALTER TABLE inventory_items ADD COLUMN category VARCHAR(100) AFTER sku');
    console.log('Column added successfully');
    process.exit(0);
  } catch (e) {
    if (e.code === 'ER_DUP_FIELDNAME') {
      console.log('Column already exists');
    } else {
      console.error(e);
    }
    process.exit(1);
  }
}
migrate();
