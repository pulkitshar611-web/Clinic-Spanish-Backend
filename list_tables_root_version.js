const db = require('./src/config/db');
(async () => {
  try {
    const [tables] = await db.query('SHOW TABLES');
    const tableList = tables.map(t => Object.values(t)[0]);
    console.log('Tables:', tableList.join(', '));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
