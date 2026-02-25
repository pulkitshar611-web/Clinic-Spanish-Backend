const db = require('./src/config/db');

async function checkUsersTable() {
  try {
    const [columns] = await db.query("SHOW COLUMNS FROM users");
    console.log("USERS table columns:");
    console.table(columns);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

checkUsersTable();
