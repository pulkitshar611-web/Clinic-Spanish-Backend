module.exports = {
  // Services
  CREATE_SERVICE: `INSERT INTO services (name, base_price, code, category_id, tax_applicable, estimated_time, patient_description) VALUES (?, ?, ?, ?, ?, ?, ?)`,
  UPDATE_SERVICE: `UPDATE services SET name = ?, base_price = ?, code = ?, category_id = ?, tax_applicable = ?, estimated_time = ?, patient_description = ? WHERE id = ?`,
  DELETE_SERVICE: `DELETE FROM services WHERE id = ?`,
  LIST_SERVICES: `
    SELECT s.*, c.name as category_name 
    FROM services s 
    LEFT JOIN service_categories c ON s.category_id = c.id
  `,

  // Service Categories
  LIST_SERVICE_CATEGORIES: `SELECT * FROM service_categories`,
  CREATE_SERVICE_CATEGORY: `INSERT INTO service_categories (name, description) VALUES (?, ?)`,
  UPDATE_SERVICE_CATEGORY: `UPDATE service_categories SET name = ?, description = ? WHERE id = ?`,
  DELETE_SERVICE_CATEGORY: `DELETE FROM service_categories WHERE id = ?`,

  GET_FINANCIAL_CONFIG: `SELECT * FROM tax_config WHERE is_deleted = 0 LIMIT 1`,
  UPDATE_FINANCIAL_CONFIG: `UPDATE tax_config SET 
    currency = ?, 
    currency_symbol = ?, 
    tax_rate = ?, 
    tax_rate_reduced = ?, 
    tax_rate_general_active = ?, 
    tax_rate_reduced_active = ?, 
    fiscal_year_end = ?, 
    lock_date = ? 
    WHERE id = ?`,
  GET_TAX_CONFIG: `SELECT * FROM tax_config WHERE is_deleted = 0 LIMIT 1`,
  UPDATE_TAX_CONFIG: `UPDATE tax_config SET 
    trade_name = ?, 
    company_name = ?, 
    rnc = ?, 
    economic_activity = ?, 
    address = ?, 
    phone = ?, 
    email = ?, 
    logo_url = ?, 
    invoice_footer = ?
    WHERE id = ?`,
  LIST_COMMISSION_RULES: `SELECT * FROM commission_rules WHERE is_deleted = 0`,
  CREATE_COMMISSION_RULE: `INSERT INTO commission_rules (name, type, value, applies_to, p_condition) VALUES (?, ?, ?, ?, ?)`,
  UPDATE_COMMISSION_RULE: `UPDATE commission_rules SET name = ?, type = ?, value = ?, applies_to = ?, p_condition = ? WHERE id = ?`,

  // Price Lists (Tarifarios)
  LIST_PRICE_LISTS: `SELECT pl.*, (SELECT COUNT(*) FROM price_list_items pli WHERE pli.price_list_id = pl.id) as items_count FROM price_lists pl`,
  CREATE_PRICE_LIST: `INSERT INTO price_lists (name, type, currency, coverage, active) VALUES (?, ?, ?, ?, ?)`,
  UPDATE_PRICE_LIST: `UPDATE price_lists SET name = ?, type = ?, currency = ?, coverage = ?, active = ? WHERE id = ?`,
  DELETE_PRICE_LIST: `DELETE FROM price_lists WHERE id = ?`,

  // Suppliers
  LIST_SUPPLIERS: `SELECT * FROM suppliers`,
  CREATE_SUPPLIER: `INSERT INTO suppliers (name, rnc, category, contact_person, phone, email, address, credit_limit, current_balance, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  UPDATE_SUPPLIER: `UPDATE suppliers SET name = ?, rnc = ?, category = ?, contact_person = ?, phone = ?, email = ?, address = ?, credit_limit = ?, current_balance = ?, status = ? WHERE id = ?`,
  DELETE_SUPPLIER: `DELETE FROM suppliers WHERE id = ?`,

  // Expense Categories
  LIST_EXPENSE_CATEGORIES: `SELECT * FROM expense_categories`,
  CREATE_EXPENSE_CATEGORY: `INSERT INTO expense_categories (name, description) VALUES (?, ?)`,
  UPDATE_EXPENSE_CATEGORY: `UPDATE expense_categories SET name = ?, description = ? WHERE id = ?`,
  DELETE_EXPENSE_CATEGORY: `DELETE FROM expense_categories WHERE id = ?`,

  // Commission Rules
  LIST_COMMISSION_RULES: `SELECT * FROM commission_rules`,
  CREATE_COMMISSION_RULE: `INSERT INTO commission_rules (name, calculation_type, value, applies_to, payment_condition) VALUES (?, ?, ?, ?, ?)`,
  UPDATE_COMMISSION_RULE: `UPDATE commission_rules SET name = ?, calculation_type = ?, value = ?, applies_to = ?, payment_condition = ? WHERE id = ?`,
  DELETE_COMMISSION_RULE: `DELETE FROM commission_rules WHERE id = ?`
};
