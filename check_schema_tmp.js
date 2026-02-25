const db = require('./src/config/db');
(async () => {
  try {
    const [shareholders] = await db.query('DESCRIBE shareholders');
    console.log('--- SHAREHOLDERS ---');
    console.log(JSON.stringify(shareholders, null, 2));

    const [contributions] = await db.query('DESCRIBE capital_contributions');
    console.log('--- CONTRIBUTIONS ---');
    console.log(JSON.stringify(contributions, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
