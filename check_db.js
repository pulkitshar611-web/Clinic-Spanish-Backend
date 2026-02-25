const db = require('./src/config/db');

async function check() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM payments");
    console.log("COLUMNS:");
    columns.forEach(c => console.log(c.Field));
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

check();
