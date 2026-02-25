const db = require('../../config/db');
const queries = require('./config.queries');

exports.createService = async (data) => {
  const { name, base_price, code, category_id, tax_applicable, estimated_time, patient_description } = data;
  const [result] = await db.query(queries.CREATE_SERVICE, [
    name, base_price, code, category_id, tax_applicable, estimated_time, patient_description
  ]);
  return result.insertId;
};

exports.updateService = async (id, data) => {
  const { name, base_price, code, category_id, tax_applicable, estimated_time, patient_description } = data;
  await db.query(queries.UPDATE_SERVICE, [
    name, base_price, code, category_id, tax_applicable, estimated_time, patient_description, id
  ]);
  return true;
};

exports.deleteService = async (id) => {
  await db.query(queries.DELETE_SERVICE, [id]);
  return true;
};

exports.listServices = async () => {
  const [rows] = await db.query(queries.LIST_SERVICES);
  return rows;
};

// Categories
exports.listServiceCategories = async () => {
  const [rows] = await db.query(queries.LIST_SERVICE_CATEGORIES);
  return rows;
};

exports.createServiceCategory = async (data) => {
  const { name, description } = data;
  const [result] = await db.query(queries.CREATE_SERVICE_CATEGORY, [name, description]);
  return result.insertId;
};

exports.updateServiceCategory = async (id, data) => {
  const { name, description } = data;
  await db.query(queries.UPDATE_SERVICE_CATEGORY, [name, description, id]);
  return true;
};

exports.deleteServiceCategory = async (id) => {
  await db.query(queries.DELETE_SERVICE_CATEGORY, [id]);
  return true;
};

exports.getFinancialConfig = async () => {
  const [rows] = await db.query(queries.GET_FINANCIAL_CONFIG);
  return rows[0];
};

exports.updateFinancialConfig = async (id, data) => {
  const {
    currency, currency_symbol, tax_rate, tax_rate_reduced,
    tax_rate_general_active, tax_rate_reduced_active, fiscal_year_end, lock_date
  } = data;

  await db.query(queries.UPDATE_FINANCIAL_CONFIG, [
    currency, currency_symbol, tax_rate, tax_rate_reduced,
    tax_rate_general_active, tax_rate_reduced_active, fiscal_year_end, lock_date, id
  ]);
  return true;
};

exports.getTaxConfig = async () => {
  const [rows] = await db.query(queries.GET_TAX_CONFIG);
  return rows[0];
};

exports.updateTaxConfig = async (id, data) => {
  const {
    trade_name, company_name, rnc, economic_activity,
    address, phone, email, logo_url, invoice_footer
  } = data;

  await db.query(queries.UPDATE_TAX_CONFIG, [
    trade_name, company_name, rnc, economic_activity,
    address, phone, email, logo_url, invoice_footer, id
  ]);
  return true;
};

exports.listCommissionRules = async () => {
  const [rows] = await db.query(queries.LIST_COMMISSION_RULES);
  return rows;
};

exports.createCommissionRule = async (data) => {
  const { name, type, value, applies_to, p_condition } = data;
  const [result] = await db.query(queries.CREATE_COMMISSION_RULE, [
    name, type, value, applies_to, p_condition
  ]);
  return result.insertId;
};

exports.updateCommissionRule = async (id, data) => {
  const { name, type, value, applies_to, p_condition } = data;
  const [result] = await db.query(queries.UPDATE_COMMISSION_RULE, [
    name, type, value, applies_to, p_condition, id
  ]);
  return true;
};

// Price Lists
exports.listPriceLists = async () => {
  const [rows] = await db.query(queries.LIST_PRICE_LISTS);
  return rows;
};

exports.createPriceList = async (data) => {
  const { name, type, currency, coverage, active } = data;
  const [result] = await db.query(queries.CREATE_PRICE_LIST, [
    name, type, currency, coverage, active || 1
  ]);
  return result.insertId;
};

exports.updatePriceList = async (id, data) => {
  const { name, type, currency, coverage, active } = data;
  await db.query(queries.UPDATE_PRICE_LIST, [
    name, type, currency, coverage, active, id
  ]);
  return true;
};

exports.deletePriceList = async (id) => {
  await db.query(queries.DELETE_PRICE_LIST, [id]);
  return true;
};

// Suppliers
exports.listSuppliers = async () => {
  const [rows] = await db.query(queries.LIST_SUPPLIERS);
  return rows;
};

exports.createSupplier = async (data) => {
  const { name, rnc, category, contact_person, phone, email, address, credit_limit, current_balance, status } = data;
  const [result] = await db.query(queries.CREATE_SUPPLIER, [
    name, rnc, category, contact_person, phone, email, address, credit_limit || 0, current_balance || 0, status || 'Active'
  ]);
  return result.insertId;
};

exports.updateSupplier = async (id, data) => {
  const { name, rnc, category, contact_person, phone, email, address, credit_limit, current_balance, status } = data;
  await db.query(queries.UPDATE_SUPPLIER, [
    name, rnc, category, contact_person, phone, email, address, credit_limit, current_balance, status, id
  ]);
  return true;
};

exports.deleteSupplier = async (id) => {
  await db.query(queries.DELETE_SUPPLIER, [id]);
  return true;
};

// Expense Categories
exports.listExpenseCategories = async () => {
  const [rows] = await db.query(queries.LIST_EXPENSE_CATEGORIES);
  return rows;
};

exports.createExpenseCategory = async (data) => {
  const { name, description } = data;
  const [result] = await db.query(queries.CREATE_EXPENSE_CATEGORY, [name, description]);
  return result.insertId;
};

exports.updateExpenseCategory = async (id, data) => {
  const { name, description } = data;
  await db.query(queries.UPDATE_EXPENSE_CATEGORY, [name, description, id]);
  return true;
};

exports.deleteExpenseCategory = async (id) => {
  await db.query(queries.DELETE_EXPENSE_CATEGORY, [id]);
  return true;
};

// Commission Rules
exports.listCommissionRules = async () => {
  const [rows] = await db.query(queries.LIST_COMMISSION_RULES);
  return rows;
};

exports.createCommissionRule = async (data) => {
  const { name, calculation_type, value, applies_to, payment_condition } = data;
  const [result] = await db.query(queries.CREATE_COMMISSION_RULE, [name, calculation_type, value, applies_to, payment_condition]);
  return result.insertId;
};

exports.updateCommissionRule = async (id, data) => {
  const { name, calculation_type, value, applies_to, payment_condition } = data;
  await db.query(queries.UPDATE_COMMISSION_RULE, [name, calculation_type, value, applies_to, payment_condition, id]);
  return true;
};

exports.deleteCommissionRule = async (id) => {
  await db.query(queries.DELETE_COMMISSION_RULE, [id]);
  return true;
};



