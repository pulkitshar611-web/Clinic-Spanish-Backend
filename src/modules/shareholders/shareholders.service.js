const db = require('../../config/db');
const queries = require('./shareholders.queries');

exports.listShareholders = async () => {
  const [rows] = await db.query(queries.LIST_SHAREHOLDERS);
  return rows;
};

exports.getSummary = async () => {
  const [kpiRows] = await db.query(queries.GET_CAPITAL_SUMMARY);
  const [contributionRows] = await db.query(queries.LIST_CONTRIBUTIONS);
  return {
    kpi: kpiRows[0],
    contributions: contributionRows
  };
};

exports.createShareholder = async (data) => {
  const { name, legal_id, email, phone, role, status, join_date, share_percentage } = data;
  const [result] = await db.query(queries.CREATE_SHAREHOLDER, [
    name, legal_id, email, phone, role || 'Socio Inversionista', status || 'Activo', join_date, share_percentage || 0
  ]);
  return result.insertId;
};

exports.updateShareholder = async (id, data) => {
  const { name, legal_id, email, phone, role, status, join_date, share_percentage } = data;
  const [result] = await db.query(queries.UPDATE_SHAREHOLDER, [
    name, legal_id, email, phone, role, status, join_date, share_percentage, id
  ]);
  return result.affectedRows;
};

exports.createContribution = async (data) => {
  const { shareholder_id, amount, contribution_date, contribution_type, shares_count, notes } = data;
  const [result] = await db.query(queries.CREATE_CONTRIBUTION, [
    shareholder_id, amount, contribution_date, contribution_type || 'Efectivo', shares_count || 0, notes
  ]);
  return result.insertId;
};
