const db = require('./src/config/db');
(async () => {
  try {
    const [shareholders] = await db.query('DESCRIBE shareholders');
    console.log('Shareholders fields:', shareholders.map(f => f.Field).join(', '));

    const [contributions] = await db.query('DESCRIBE capital_contributions');
    console.log('Contributions fields:', contributions.map(f => f.Field).join(', '));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
