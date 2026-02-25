const db = require('./src/config/db');
const fs = require('fs');
(async () => {
  try {
    const [shareholders] = await db.query('DESCRIBE shareholders');
    const [contributions] = await db.query('DESCRIBE capital_contributions');
    const data = {
      shareholders: shareholders.map(f => f.Field),
      contributions: contributions.map(f => f.Field)
    };
    fs.writeFileSync('schema_clean.json', JSON.stringify(data, null, 2));
    console.log('Schema saved to schema_clean.json');
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
})();
