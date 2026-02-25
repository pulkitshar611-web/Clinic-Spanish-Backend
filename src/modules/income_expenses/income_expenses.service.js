const db = require('../../config/db');
const queries = require('./income_expenses.queries');

exports.getIncomeSummary = async () => {
  const [kpi, history] = await Promise.all([
    db.query(queries.GET_INCOME_KPI).then(([rows]) => rows[0]),
    db.query(queries.LIST_INCOMES).then(([rows]) => rows)
  ]);
  return { kpi, history };
};

exports.getExpenseSummary = async (isPrepaid = 0) => {
  const [kpi, history] = await Promise.all([
    db.query(queries.GET_EXPENSE_KPI, [isPrepaid]).then(([rows]) => rows[0]),
    db.query(queries.LIST_EXPENSES, [isPrepaid]).then(([rows]) => rows)
  ]);
  return { kpi, history };
};

exports.createDirectIncome = async (data) => {
  const { source, amount, category_id, method, date, reference } = data;
  console.log(`[Data Travel] Creating Direct Income: ${source}, RD$${amount}, Cat: ${category_id}, Ref: ${reference}`);
  const [result] = await db.query(queries.CREATE_DIRECT_INCOME, [
    source, amount, method, date, category_id, reference || null
  ]);
  return result;
};

exports.createDirectExpense = async (data) => {
  const { beneficiary, amount, category_id, method, reference, date, is_prepaid } = data;

  console.log(`[Data Travel] Creating Direct Expense: ${beneficiary}, RD$${amount}, Cat: ${category_id}, Prepaid: ${is_prepaid}`);

  const [result] = await db.query(queries.CREATE_DIRECT_EXPENSE, [
    category_id, beneficiary, amount, date, method, reference, is_prepaid || 0
  ]);

  return result;
};

exports.listCategories = async () => {
  console.log('[Data Travel] Fetching expense categories');
  const [rows] = await db.query(queries.LIST_CATEGORIES);
  return rows;
};

exports.listServiceCategories = async () => {
  console.log('[Data Travel] Fetching service/income categories');
  const [rows] = await db.query(queries.LIST_SERVICE_CATEGORIES);
  return rows;
};

exports.createCategory = async (data) => {
  const { name, description } = data;
  console.log(`[Data Travel] Creating new Category: ${name}`);
  const [result] = await db.query(queries.CREATE_CATEGORY, [name, description || '']);
  return result;
};

exports.deleteCategory = async (id) => {
  console.log(`[Data Travel] Deleting Category ID: ${id}`);
  const [result] = await db.query(queries.DELETE_CATEGORY, [id]);
  return result;
};
