const db = require('../../config/db');
const queries = require('./ncf.queries');

exports.listSequences = async () => {
  const [rows] = await db.query(queries.LIST_NCF_SEQUENCES);
  return rows;
};

exports.getSummary = async () => {
  const [rows] = await db.query(queries.GET_NCF_SUMMARY);
  return rows[0];
};

exports.requestSequence = async (data) => {
  const { type_name, quantity, expiration_date } = data;
  const prefix = type_name.split(' ')[0];
  const [result] = await db.query(queries.CREATE_NCF_SEQUENCE, [type_name, prefix, quantity, expiration_date]);
  return result.insertId;
};
