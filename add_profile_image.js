const db = require('./src/config/db');

async function addProfileImage() {
  try {
    await db.query("ALTER TABLE users ADD COLUMN profile_image VARCHAR(255) AFTER email");
    console.log("Column profile_image added to users table");
    process.exit(0);
  } catch (e) {
    console.error("Error:", e);
    process.exit(1);
  }
}

addProfileImage();
