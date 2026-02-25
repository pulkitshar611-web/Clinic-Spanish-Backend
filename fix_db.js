const db = require('./src/config/db');

async function fix() {
  try {
    console.log("Adding service_category_id to payments table...");
    await db.query("ALTER TABLE payments ADD COLUMN service_category_id INT NULL AFTER invoice_id");
    await db.query("ALTER TABLE payments ADD CONSTRAINT fk_payments_service_cat FOREIGN KEY (service_category_id) REFERENCES service_categories(id)");
    console.log("Column added and foreign key created.");
    process.exit(0);
  } catch (e) {
    console.error("Error fixing DB:", e);
    process.exit(1);
  }
}

fix();
