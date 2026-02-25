const db = require('./src/config/db');

async function checkUsers() {
  try {
    const [users] = await db.query("SELECT id, username, role, full_name, email FROM users");
    console.log("USERS IN DB:");
    console.table(users);
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

checkUsers();
