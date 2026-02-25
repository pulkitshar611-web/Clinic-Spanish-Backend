const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding Shareholders...');

    const shareholders = [
      ['Dr. Roberto Méndez', '001-xxxxxxx-x', 'roberto@clinic.com', '809-555-0101', 35.00],
      ['Lic. Maria Santos', '001-xxxxxxx-y', 'maria@clinic.com', '809-555-0102', 25.00],
      ['Inversiones Salud SRL', '1-31-xxxxx-x', 'inversiones@salud.com', '809-555-0103', 40.00]
    ];

    for (const sh of shareholders) {
      const [res] = await db.query(`
                INSERT INTO shareholders (name, legal_id, email, phone, share_percentage) 
                VALUES (?, ?, ?, ?, ?)
            `, sh);

      const shareholderId = res.insertId;

      // Initial contribution based on percentage (Assume 10M total capital)
      const contribution = (sh[4] / 100) * 10000000;
      await db.query(`
                INSERT INTO capital_contributions (shareholder_id, amount, contribution_date, notes)
                VALUES (?, ?, NOW(), ?)
            `, [shareholderId, contribution, 'Aporte inicial de capital']);
    }

    console.log('Successfully seeded Shareholders');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
