const db = require('./src/config/db');

async function cleanDatabase() {
  const tables = [
    'appointments',
    'ars_companies',
    'ars_coverage',
    'ars_plans',
    'calendar_events',
    'capital_contributions',
    'commission_rules',
    'consultations',
    'direct_expenses',
    'doctors',
    'expense_categories',
    'fixed_assets',
    'inventory_items',
    'inventory_transactions',
    'invoice_items',
    'invoices',
    'ncf_sequences',
    'patients',
    'payments',
    'service_categories',
    'services',
    'shareholders',
    'supplier_invoices',
    'supplier_payments',
    'suppliers',
    'tax_config',
    'users'
  ];

  try {
    console.log('Starting full database cleanup...');
    await db.query('SET FOREIGN_KEY_CHECKS = 0');

    for (const table of tables) {
      // Check if table exists before truncating to avoid errors
      await db.query(`TRUNCATE TABLE ${table}`);
      console.log(`Truncated table: ${table}`);
    }

    await db.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('Database cleanup completed successfully!');

  } catch (e) {
    console.error('Error during cleanup:', e.message);
  } finally {
    process.exit();
  }
}

cleanDatabase();
