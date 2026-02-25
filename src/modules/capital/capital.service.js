const db = require('../../config/db');
const queries = require('./capital.queries');

const listShareholders = async () => {
  const [rows] = await db.execute(queries.LIST_SHAREHOLDERS);
  return rows;
};

const getSummary = async () => {
  const [rows] = await db.execute(queries.GET_CAPITAL_SUMMARY);
  const [contributions] = await db.execute(queries.LIST_CONTRIBUTIONS);

  return {
    kpi: rows[0],
    contributions: contributions
  };
};

const createShareholder = async (data) => {
  const [result] = await db.execute(queries.CREATE_SHAREHOLDER, [
    data.name,
    data.legal_id || data.doc || null,
    data.email || data.mail || null,
    data.phone || null,
    data.role || 'Socio Inversionista',
    data.status || 'Activo',
    data.join_date || data.since || null,
    data.share_percentage || 0
  ]);
  return result.insertId;
};

const updateShareholder = async (id, data) => {
  await db.execute(queries.UPDATE_SHAREHOLDER, [
    data.name,
    data.legal_id || data.doc || null,
    data.email || data.mail || null,
    data.phone || null,
    data.role || 'Socio Inversionista',
    data.status || 'Activo',
    data.join_date || data.since || null,
    data.share_percentage || 0,
    id
  ]);
  return true;
};

const deleteShareholder = async (id) => {
  await db.execute(queries.DELETE_SHAREHOLDER, [id]);
  return true;
};

const createContribution = async (data) => {
  const [result] = await db.execute(queries.CREATE_CONTRIBUTION, [
    data.shareholder_id,
    data.amount,
    data.contribution_type || data.type || 'Efectivo',
    data.shares_count || data.stocks || 0,
    data.contribution_date || data.date,
    data.notes || data.method
  ]);
  return result.insertId;
};

// CXP Services
const listCxp = async () => {
  const [rows] = await db.execute(queries.LIST_SHAREHOLDER_CXP);
  return rows;
};

const getCxpSummary = async () => {
  const [summary] = await db.execute(queries.GET_CXP_SUMMARY);
  const [list] = await db.execute(queries.LIST_SHAREHOLDER_CXP);
  return {
    kpi: summary[0],
    data: list
  };
};

const createCxp = async (data) => {
  const [result] = await db.execute(queries.CREATE_SHAREHOLDER_CXP, [
    data.shareholder_id,
    data.concept,
    data.amount,
    data.expiration_date || data.date,
    data.priority || 'Media',
    data.status || 'Pendiente',
    data.notes || null
  ]);
  return result.insertId;
};

const updateCxp = async (id, data) => {
  await db.execute(queries.UPDATE_SHAREHOLDER_CXP, [
    data.shareholder_id,
    data.concept,
    data.amount,
    data.expiration_date || data.date,
    data.priority || 'Media',
    data.status || 'Pendiente',
    data.notes || null,
    id
  ]);
  return true;
};

const deleteCxp = async (id) => {
  await db.execute(queries.DELETE_SHAREHOLDER_CXP, [id]);
  return true;
};

// MOVEMENTS Services
const listMovements = async () => {
  const [rows] = await db.execute(queries.LIST_MOVEMENTS);
  return rows;
};

const createMovement = async (data) => {
  const [result] = await db.execute(queries.CREATE_MOVEMENT, [
    data.type || 'Ingreso',
    data.category || 'Aporte de Capital',
    data.description,
    data.partner_name || null,
    data.shareholder_id || null,
    data.amount,
    data.movement_date || data.date || new Date().toISOString().split('T')[0],
    data.reference || data.ref || null
  ]);
  return result.insertId;
};

const deleteMovement = async (id) => {
  await db.execute(queries.DELETE_MOVEMENT, [id]);
  return true;
};

const updateMovement = async (id, data) => {
  await db.execute(queries.UPDATE_MOVEMENT, [
    data.type || 'Ingreso',
    data.category || 'Aporte de Capital',
    data.description,
    data.partner_name || null,
    data.shareholder_id || null,
    data.amount,
    data.movement_date || data.date || new Date().toISOString().split('T')[0],
    data.reference || data.ref || null,
    id
  ]);
  return true;
};

module.exports = {
  listShareholders,
  getSummary,
  createShareholder,
  updateShareholder,
  deleteShareholder,
  createContribution,
  listCxp,
  getCxpSummary,
  createCxp,
  updateCxp,
  deleteCxp,
  listMovements,
  createMovement,
  deleteMovement,
  updateMovement
};
