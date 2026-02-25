const db = require('./src/config/db');

async function checkPayments() {
  try {
    const [rows] = await db.query('SELECT notes, amount, payment_method, payment_date FROM payments WHERE is_deleted = 0 ORDER BY amount DESC LIMIT 10');
    console.log('Top 10 Payments:');
    rows.forEach(r => console.log(`${r.notes || 'No notes'}: RD$${r.amount} via ${r.payment_method} on ${r.payment_date}`));

    const [total] = await db.query('SELECT SUM(amount) as total FROM payments WHERE is_deleted = 0');
    console.log('\nTotal Collected:', total[0].total);

  } catch (e) {
    console.error(e);
  } finally {
    process.exit();
  }
}

checkPayments();
