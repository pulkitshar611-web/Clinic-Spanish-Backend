const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding Income and Expenses data...');

    // 1. Direct Incomes (into payments table)
    const incomes = [
      ['Reembolso Seguro', 5000, 'transfer', new Date()],
      ['Venta de Material Desechable', 1200, 'cash', new Date()],
      ['Donación Equipamiento', 25000, 'transfer', new Date()],
      ['Intereses Bancarios', 450, 'transfer', new Date()]
    ];

    for (const inc of incomes) {
      await db.query('INSERT INTO payments (notes, amount, payment_method, payment_date) VALUES (?, ?, ?, ?)', inc);
    }

    // 2. Direct Expenses
    // Categories: 1: Costos Operativos, 2: Nómina, 3: Insumos, 4: Servicios, 5: Mantenimiento
    const expenses = [
      [1, 'Gasolina Ambulancia', 3500, new Date(), 'cash', 'GAS-001'],
      [2, 'Pago Enfermera Turno Extra', 2500, new Date(), 'transfer', 'NOM-EXTRA-01'],
      [4, 'Reparación Aire Acondicionado', 4500, new Date(), 'transfer', 'MANT-99'],
      [1, 'Publicidad Facebook', 1500, new Date(), 'card', 'FB-ADS-123']
    ];

    for (const exp of expenses) {
      await db.query('INSERT INTO direct_expenses (expense_category_id, description, amount, expense_date, payment_method, reference_number) VALUES (?, ?, ?, ?, ?, ?)', exp);
    }

    console.log('Successfully seeded Income & Expenses data');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
