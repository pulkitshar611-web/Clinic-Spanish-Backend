const db = require('./src/config/db');

async function seed() {
  try {
    console.log('Seeding Inventory and Fixed Assets...');

    // 1. Inventory Items
    const inventoryItems = [
      ['Guantes de Nitrilo (M)', 'INV-001', 'Consumibles', 'Guantes desechables médicos', 'Caja x 100', 50, 10, 450.00],
      ['Jeringas 5ml', 'INV-002', 'Consumibles', 'Jeringas con aguja', 'Caja x 50', 25, 5, 250.00],
      ['Película Gammagrafía', 'INV-003', 'Radiología', 'Película para Rayos X', 'Pack x 20', 8, 10, 2500.00],
      ['Hojas Papel A4', 'INV-004', 'Oficina', 'Papel bond blanco', 'Resma', 15, 5, 350.00],
      ['Cloro Industrial', 'INV-005', 'Limpieza', 'Solución de hipoclorito', 'Galón', 0, 3, 150.00]
    ];

    for (const item of inventoryItems) {
      await db.query(`
                INSERT INTO inventory_items (name, sku, category, description, unit_measure, current_stock, reorder_level, cost_price) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, item);
    }

    // 2. Fixed Assets
    const fixedAssets = [
      ['Monitor Signos Vitales', 'Equipo Médico', 'SN-2024-001', '2024-01-15', 85000.00, 75000.00, 'Emergencias', 'active'],
      ['Scanner MRI Pro 500', 'Equipo Médico', 'SN-MRI-99X', '2023-06-20', 2500000.00, 1800000.00, 'Radiología', 'active'],
      ['Escritorio Gerencial', 'Mobiliario', 'MOB-010', '2024-02-10', 12000.00, 11500.00, 'Administración', 'active'],
      ['Servidor Principal Dell', 'Infraestructura IT', 'DELL-SRV-01', '2024-03-01', 150000.00, 145000.00, 'Data Center', 'active']
    ];

    for (const asset of fixedAssets) {
      await db.query(`
                INSERT INTO fixed_assets (name, category, serial_number, purchase_date, purchase_cost, current_value, location, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, asset);
    }

    console.log('Successfully seeded Inventory & Fixed Assets');
  } catch (e) {
    console.error('Error seeding data:', e.message);
  } finally {
    process.exit();
  }
}

seed();
