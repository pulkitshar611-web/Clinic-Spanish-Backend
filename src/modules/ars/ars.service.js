const db = require('../../config/db');
const queries = require('./ars.queries');

exports.createArs = async (data) => {
  const { name, rnc, website, status, email, phone } = data;
  const [result] = await db.query(queries.CREATE_ARS, [name, rnc, website || '', status || 'Activo', email, phone]);
  return result.insertId;
};

exports.updateArs = async (id, data) => {
  const { name, rnc, website, status, email, phone } = data;
  const [result] = await db.query(queries.UPDATE_ARS, [name, rnc, website, status, email, phone, id]);
  return result.affectedRows > 0;
};

exports.deleteArs = async (id) => {
  const [result] = await db.query(queries.DELETE_ARS, [id]);
  return result.affectedRows > 0;
};

exports.listArs = async () => {
  const [rows] = await db.query(queries.LIST_ARS);
  return rows;
};

exports.getSummary = async () => {
  const [stats] = await db.query(queries.GET_ARS_DASHBOARD_STATS);
  const [trend] = await db.query(queries.GET_ARS_FINANCIAL_TREND);
  return { stats: stats[0], trend };
};

exports.getStatements = async () => {
  const [rows] = await db.query(queries.GET_STATEMENTS);
  return rows.map(r => ({
    ...r,
    balance: r.billed - r.collected,
    pending: r.billed - r.collected,
    last_payment: r.last_payment ? new Date(r.last_payment).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'
  }));
};

exports.getMovements = async (id) => {
  const [rows] = await db.query(queries.GET_MOVEMENTS, [id, id]);
  return rows.map(m => ({
    ...m,
    date: new Date(m.date).toLocaleDateString('es-DO', { day: '2-digit', month: 'short', year: 'numeric' })
  }));
};

exports.getRates = async (id) => {
  const [rows] = await db.query(queries.GET_ARS_RATES, [id]);
  return rows;
};

exports.getContacts = async (id) => {
  const [rows] = await db.query(queries.GET_ARS_CONTACTS, [id]);
  return rows;
};
exports.getReportData = async () => {
  const [balanceRows] = await db.query(queries.GET_STATEMENTS); // Reuse this for overall balance
  const [monthlyRows] = await db.query(require('../dashboard/dashboard.queries').GET_ARS_REPORT_MONTHLY);
  const [statsRows] = await db.query(require('../dashboard/dashboard.queries').GET_ARS_REPORT_STATS);
  const [pieRows] = await db.query(require('../dashboard/dashboard.queries').GET_ARS_STATUS_PIE);

  // Pivot monthlyRows
  const monthlyData = [];
  const months = [...new Set(monthlyRows.map(r => r.month))];
  months.forEach(m => {
    const item = { name: m };
    monthlyRows.filter(r => r.month === m).forEach(r => {
      item[r.ars.toLowerCase()] = parseFloat(r.amount);
    });
    monthlyData.push(item);
  });

  return {
    monthlyData,
    pieData: pieRows.map(r => ({
      ...r,
      color: r.name === 'Pagado' ? '#22c55e' : r.name === 'Pendiente' ? '#f59e0b' : r.name === 'Glosado' ? '#ef4444' : '#3b82f6'
    })),
    stats: statsRows[0] || { acceptance_rate: 0, avg_payment_days: 0 }
  };
};
