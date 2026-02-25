const db = require('../../config/db');
const queries = require('./cxc.queries');

exports.getKpiStats = async () => {
  const [rows] = await db.query(queries.GET_KPI_STATS);
  return rows[0];
};

exports.getAgingSummary = async () => {
  const [rows] = await db.query(queries.GET_AGING_SUMMARY);
  return rows;
};

exports.getTopDebtors = async () => {
  const [rows] = await db.query(queries.GET_TOP_DEBTORS);
  return rows;
};

exports.getAllInvoices = async () => {
  const [rows] = await db.query(queries.GET_ALL_INVOICES);
  return rows;
};

exports.listInvoices = exports.getAllInvoices;

exports.getEntityBalances = async () => {
  const [rows] = await db.query(queries.GET_ENTITY_BALANCES);
  return rows;
};

exports.getSummary = async () => {
  const [kpi, aging, topDebtors, invoices, entities] = await Promise.all([
    db.query(queries.GET_KPI_STATS).then(([rows]) => rows[0]),
    db.query(queries.GET_AGING_SUMMARY).then(([rows]) => rows),
    db.query(queries.GET_TOP_DEBTORS).then(([rows]) => rows),
    db.query(queries.GET_ALL_INVOICES).then(([rows]) => rows),
    db.query(queries.GET_ENTITY_BALANCES).then(([rows]) => rows)
  ]);
  return { kpi, aging, topDebtors, invoices, entities };
};

exports.recordPayment = async (data) => {
  const { invoice_id, payment_date, amount, payment_method, reference_number } = data;
  let { patient_id } = data;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Fetch patient_id if not provided
    if (!patient_id && invoice_id) {
      const [invRows] = await connection.query('SELECT patient_id FROM invoices WHERE id = ?', [invoice_id]);
      if (invRows.length > 0) {
        patient_id = invRows[0].patient_id;
      }
    }

    await connection.query(queries.CREATE_PAYMENT, [invoice_id, patient_id, payment_date, amount, payment_method, reference_number]);
    await connection.query(queries.UPDATE_INVOICE_STATUS, [invoice_id]);
    await connection.commit();
    return true;
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    connection.release();
  }
};
