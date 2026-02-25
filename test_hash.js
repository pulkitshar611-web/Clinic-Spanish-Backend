const db = require('./src/config/db');
const bcrypt = require('bcryptjs');

async function test() {
  const users = [
    { username: 'y@gmail.com', password: 'doctor123' },
    { username: 'kiaan@gmail.com', password: 'patient123' }
  ];

  for (const u of users) {
    const [rows] = await db.query('SELECT password_hash FROM users WHERE username = ?', [u.username]);
    if (rows.length > 0) {
      const isMatch = await bcrypt.compare(u.password, rows[0].password_hash);
      console.log(`User: ${u.username}, Password: ${u.password}, Match: ${isMatch}`);
    } else {
      console.log(`User: ${u.username} not found!`);
    }
  }
  process.exit(0);
}

test();
