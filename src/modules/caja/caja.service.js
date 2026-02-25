const db = require('../../config/db');
const queries = require('./caja.queries');

exports.getSummary = async () => {
  const [liquidity, movements, cashFlow, categories] = await Promise.all([
    db.query(queries.GET_LIQUIDITY_BY_ACCOUNT).then(([rows]) => rows),
    db.query(queries.GET_MOVEMENTS).then(([rows]) => rows),
    db.query(queries.GET_CASH_FLOW).then(([rows]) => rows),
    db.query(queries.LIST_CATEGORIES).then(([rows]) => rows)
  ]);

  return {
    liquidity,
    movements,
    cashFlow,
    categories
  };
};

exports.getMovements = async (filters = {}) => {
  const [movements] = await db.query(queries.GET_MOVEMENTS);
  return movements;
};

exports.getCashFlow = async (filters = {}) => {
  const [cashFlow] = await db.query(queries.GET_CASH_FLOW);
  return cashFlow;
};

exports.getBankReconciliation = async () => {
  const [movements] = await db.query(queries.GET_BANK_MOVEMENTS);
  return movements;
};

exports.updateReconciliationStatus = async (id, status) => {
  const [prefix, realId] = id.split('-');
  const isReconciled = status ? 1 : 0;

  if (prefix === 'PAY') {
    await db.query(queries.UPDATE_PAYMENT_RECONCILED, [isReconciled, realId]);
  } else if (prefix === 'SUP') {
    await db.query(queries.UPDATE_SUPPLIER_PAYMENT_RECONCILED, [isReconciled, realId]);
  } else if (prefix === 'EXP') {
    await db.query(queries.UPDATE_EXPENSE_RECONCILED, [isReconciled, realId]);
  }

  return { success: true };
};

exports.createMovement = async (data) => {
  const { description, amount, payment_method, date, category_id, type } = data;

  if (type === 'in') {
    const [result] = await db.query(queries.CREATE_MANUAL_PAYMENT, [
      description, amount, payment_method, date
    ]);
    return result;
  } else {
    const [result] = await db.query(queries.CREATE_DIRECT_EXPENSE, [
      description, amount, payment_method, date, category_id || 1
    ]);
    return result;
  }
};
