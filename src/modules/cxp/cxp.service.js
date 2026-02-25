const db = require('../../config/db');
const queries = require('./cxp.queries');

exports.getSummary = async () => {
  const [[kpi], distribution, payments, suppliers, pos, utilities, payroll, otherExpenses] = await Promise.all([
    db.query(queries.GET_KPI_STATS).then(([rows]) => rows),
    db.query(queries.GET_EXPENSE_DISTRIBUTION).then(([rows]) => rows),
    db.query(queries.GET_UPCOMING_PAYMENTS).then(([rows]) => rows),
    db.query(queries.GET_SUPPLIERS_STATUS).then(([rows]) => rows),
    db.query(queries.GET_PURCHASE_ORDERS).then(([rows]) => rows),
    db.query(queries.GET_UTILITY_BILLS).then(([rows]) => rows),
    db.query(queries.GET_PAYROLL_DATA).then(([rows]) => rows),
    db.query(queries.GET_OTHER_EXPENSES).then(([rows]) => rows)
  ]);

  return {
    kpi,
    distribution,
    payments,
    suppliers,
    pos,
    utilities,
    payroll,
    otherExpenses
  };
};

exports.createInvoice = async (data) => {
  const { supplier_id, invoice_number, invoice_date, due_date, subtotal, tax_amount, total_amount, expense_category_id, description } = data;
  const balance_due = total_amount;
  const [result] = await db.query(queries.CREATE_SUPPLIER_INVOICE, [
    supplier_id, invoice_number, invoice_date, due_date, total_amount, balance_due, expense_category_id, description
  ]);
  return result;
};

exports.createPayment = async (data) => {
  const { supplier_invoice_id, payment_date, amount, payment_method, reference_number } = data;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query(queries.CREATE_SUPPLIER_PAYMENT, [
      supplier_invoice_id, payment_date, amount, payment_method, reference_number
    ]);

    await connection.query(queries.UPDATE_SUPPLIER_INVOICE_BALANCE, [
      amount, amount, supplier_invoice_id
    ]);

    await connection.commit();
    return true;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
};

exports.listExpenseCategories = async () => {
  const [rows] = await db.query(queries.LIST_EXPENSE_CATEGORIES);
  return rows;
};
