const db = require('./src/config/db');

async function seed() {
  try {
    const data = [
      ['B01 - Crédito Fiscal', 'B01', 451, 1000, '2026-12-31', 'active'],
      ['B02 - Consumidor Final', 'B02', 1289, 2000, '2026-12-31', 'active'],
      ['B14 - Regímenes Especiales', 'B14', 856, 900, '2026-06-30', 'alert'],
      ['B15 - Gubernamental', 'B15', 823, 823, '2025-12-31', 'exhausted'],
      ['E31 - Factura Electrónica', 'E31', 888, 5000, null, 'active'],
      ['E45 - Factura de Exportación', 'E45', 120, 1000, null, 'active']
    ];

    for (const row of data) {
      await db.query(
        'INSERT INTO ncf_sequences (type_name, prefix, current_sequence, max_sequence, expiration_date, status) VALUES (?, ?, ?, ?, ?, ?)',
        row
      );
    }
    console.log('Successfully seeded ncf_sequences');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
