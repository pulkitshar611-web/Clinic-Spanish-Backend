const db = require('../../config/db');
const queries = require('./inventory_assets.queries');

exports.listInventory = async () => {
  console.log('[Data Travel] Fetching Inventory items and summary');
  const [items, summary] = await Promise.all([
    db.query(queries.LIST_INVENTORY).then(([rows]) => rows),
    db.query(queries.GET_INVENTORY_SUMMARY).then(([rows]) => rows[0])
  ]);
  return { items, summary };
};

exports.createInventoryItem = async (data) => {
  const { name, sku, category, description, unit_measure, current_stock, reorder_level, cost_price, supplier_id } = data;
  console.log(`[Data Travel] Creating Inventory Item: ${name} (SKU: ${sku})`);
  const [result] = await db.query(queries.CREATE_INVENTORY_ITEM, [
    name, sku, category || 'General', description || '', unit_measure || 'unit', current_stock || 0,
    reorder_level || 10, cost_price || 0, supplier_id || null
  ]);
  return result.insertId;
};

exports.updateInventoryItem = async (id, data) => {
  console.log(`[Data Travel] Updating Inventory Item ID: ${id}`);
  const { name, sku, category, description, unit_measure, current_stock, reorder_level, cost_price } = data;
  const [result] = await db.query(queries.UPDATE_INVENTORY_ITEM, [
    name, sku, category, description, unit_measure, current_stock, reorder_level, cost_price, id
  ]);
  return result.affectedRows > 0;
};

exports.deleteInventoryItem = async (id) => {
  console.log(`[Data Travel] Flagging Inventory Item ID: ${id} as deleted`);
  const [result] = await db.query(queries.DELETE_INVENTORY_ITEM, [id]);
  return result.affectedRows > 0;
};

exports.updateStock = async (id, quantity) => {
  console.log(`[Data Travel] Adjusting Stock for ID: ${id} by ${quantity}`);
  const [result] = await db.query(queries.UPDATE_STOCK, [quantity, id]);
  return result.affectedRows > 0;
};

exports.listFixedAssets = async () => {
  console.log('[Data Travel] Fetching Fixed Assets list and summary');
  const [items, summary] = await Promise.all([
    db.query(queries.LIST_FIXED_ASSETS).then(([rows]) => rows),
    db.query(queries.GET_ASSETS_SUMMARY).then(([rows]) => rows[0])
  ]);
  return { items, summary };
};

exports.createFixedAsset = async (data) => {
  const { name, category, serial_number, purchase_date, purchase_cost, current_value, location, status } = data;
  console.log(`[Data Travel] Registering Fixed Asset: ${name}`);
  const [result] = await db.query(queries.CREATE_FIXED_ASSET, [
    name, category || 'General', serial_number, purchase_date, purchase_cost,
    current_value || purchase_cost, location, status || 'active'
  ]);
  return result.insertId;
};

exports.updateFixedAsset = async (id, data) => {
  console.log(`[Data Travel] Updating Fixed Asset ID: ${id}`);
  const { name, category, serial_number, purchase_date, purchase_cost, current_value, location, status } = data;
  const [result] = await db.query(queries.UPDATE_FIXED_ASSET, [
    name, category, serial_number, purchase_date, purchase_cost, current_value, location, status, id
  ]);
  return result.affectedRows > 0;
};

exports.deleteFixedAsset = async (id) => {
  console.log(`[Data Travel] Flagging Fixed Asset ID: ${id} as deleted`);
  const [result] = await db.query(queries.DELETE_FIXED_ASSET, [id]);
  return result.affectedRows > 0;
};
