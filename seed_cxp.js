const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding CXP data...');

    // 1. Seed Expense Categories
    const categories = [
      ['Electricidad', 'Servicio de energía eléctrica'],
      ['Agua Potable', 'Servicio de agua'],
      ['Internet / Tel', 'Servicios de comunicación'],
      ['Mantenimiento', 'Mantenimiento de equipos e instalaciones'],
      ['Suministros Médicos', 'Compra de materiales y suministros'],
      ['Papelería', 'Útiles de oficina'],
      ['Seguros', 'Primas de seguros'],
      ['Alquiler', 'Arrendamiento de local']
    ];

    for (const cat of categories) {
      await db.query('INSERT IGNORE INTO expense_categories (name, description) VALUES (?, ?)', cat);
    }

    // 2. Seed Suppliers
    const suppliers = [
      ['EDESUR', '101010101', 'Juan Jose', '8095551212', 'info@edesur.com.do', 'Santo Domingo'],
      ['CAASD', '202020202', 'Maria Lopez', '8095553434', 'info@caasd.gob.do', 'Santo Domingo'],
      ['Claro', '303030303', 'Carlos Slim', '8095555656', 'ventas@claro.com.do', 'Av. John F. Kennedy'],
      ['Farmacia Carol', '404040404', 'Ana Caro', '8095557878', 'pedidos@farmaciacarol.com', 'Diferentes ubicaciones'],
      ['Suministros Médicos S.A.', '505050505', 'Roberto Gomez', '8095559090', 'ventas@suministros.com', 'Haina']
    ];

    for (const sup of suppliers) {
      await db.query('INSERT IGNORE INTO suppliers (name, rnc, contact_person, phone, email, address) VALUES (?, ?, ?, ?, ?, ?)', sup);
    }

    // Get IDs
    const [catRows] = await db.query('SELECT id, name FROM expense_categories');
    const [supRows] = await db.query('SELECT id, name FROM suppliers');

    const catMap = Object.fromEntries(catRows.map(r => [r.name, r.id]));
    const supMap = Object.fromEntries(supRows.map(r => [r.name, r.id]));

    // 3. Seed Supplier Invoices
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const overdueDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const upcomingDate = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    const invoices = [
      [supMap['EDESUR'], 'FAC-E-001', 'NCF-001', yesterday, new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), 15000, 15000, 'pending', catMap['Electricidad'], 'Consumo Mayo 2026'],
      [supMap['CAASD'], 'FAC-A-001', 'NCF-002', yesterday, new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), 2500, 2500, 'pending', catMap['Agua Potable'], 'Consumo Mayo 2026'],
      [supMap['Claro'], 'FAC-C-001', 'NCF-003', overdueDate, overdueDate, 4800, 4800, 'pending', catMap['Internet / Tel'], 'Mensualidad Internet'],
      [supMap['Suministros Médicos S.A.'], 'FAC-SM-123', 'NCF-004', yesterday, upcomingDate, 50000, 25000, 'partial', catMap['Suministros Médicos'], 'Compra de jeringuillas y gasas'],
      [supMap['Farmacia Carol'], 'FAC-FC-999', 'NCF-005', yesterday, yesterday, 1200, 0, 'paid', catMap['Suministros Médicos'], 'Compra menor alcohol']
    ];

    for (const inv of invoices) {
      await db.query(
        'INSERT INTO supplier_invoices (supplier_id, invoice_number, ncf, issue_date, due_date, total_amount, balance_due, status, expense_category_id, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        inv
      );
    }

    console.log('Successfully seeded CXP data');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
