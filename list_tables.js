const db = require('./src/config/db');

async function listTables() {
  try {
    const [rows] = await db.query('SHOW TABLES');
    const tableNames = rows.map(row => Object.values(row)[0]);
    console.log('Tables:');
    tableNames.forEach(t => console.log(t));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

listTables();
