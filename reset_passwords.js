const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function reset() {
  const users = [
    { username: 'y@gmail.com', password: 'doctor123', role: 'doctor' },
    { username: 'kiaan@gmail.com', password: 'patient123', role: 'patient' }
  ];

  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const [res] = await db.query(
      'UPDATE users SET password_hash = ?, role = ? WHERE username = ?',
      [hashedPassword, u.role, u.username]
    );
    console.log(`Updated ${u.username} with Password: ${u.password}. Rows affected: ${res.affectedRows}`);
  }
  process.exit(0);
}

reset();
