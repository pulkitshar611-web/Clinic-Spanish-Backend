module.exports = {
  GET_INVENTORY_SUMMARY: `
    SELECT 
      COUNT(*) as total_items,
      SUM(current_stock * cost_price) as total_value,
      SUM(CASE WHEN current_stock < reorder_level THEN 1 ELSE 0 END) as low_stock,
      SUM(CASE WHEN current_stock = 0 THEN 1 ELSE 0 END) as out_of_stock
    FROM inventory_items 
    WHERE is_deleted = 0
  `,
  LIST_INVENTORY: 'SELECT * FROM inventory_items WHERE is_deleted = 0 ORDER BY name ASC',
  CREATE_INVENTORY_ITEM: 'INSERT INTO inventory_items (name, sku, category, description, unit_measure, current_stock, reorder_level, cost_price, supplier_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
  UPDATE_INVENTORY_ITEM: 'UPDATE inventory_items SET name = ?, sku = ?, category = ?, description = ?, unit_measure = ?, current_stock = ?, reorder_level = ?, cost_price = ? WHERE id = ?',
  DELETE_INVENTORY_ITEM: 'UPDATE inventory_items SET is_deleted = 1 WHERE id = ?',
  UPDATE_STOCK: 'UPDATE inventory_items SET current_stock = current_stock + ? WHERE id = ?',

  LIST_FIXED_ASSETS: 'SELECT * FROM fixed_assets WHERE is_deleted = 0',
  GET_ASSETS_SUMMARY: `
    SELECT 
      COUNT(*) as total_assets,
      SUM(purchase_cost) as total_cost,
      SUM(current_value) as current_total_value
    FROM fixed_assets 
    WHERE is_deleted = 0
  `,
  CREATE_FIXED_ASSET: 'INSERT INTO fixed_assets (name, category, serial_number, purchase_date, purchase_cost, current_value, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  UPDATE_FIXED_ASSET: 'UPDATE fixed_assets SET name = ?, category = ?, serial_number = ?, purchase_date = ?, purchase_cost = ?, current_value = ?, location = ?, status = ? WHERE id = ?',
  DELETE_FIXED_ASSET: 'UPDATE fixed_assets SET is_deleted = 1 WHERE id = ?'
};
