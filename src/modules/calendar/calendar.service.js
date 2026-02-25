const db = require('../../config/db');
const queries = require('./calendar.queries');

const listEvents = async () => {
  const [rows] = await db.execute(queries.LIST_EVENTS);
  return rows;
};

const createEvent = async (data) => {
  const [result] = await db.execute(queries.CREATE_EVENT, [
    data.title,
    data.description || null,
    data.start_date,
    data.end_date || null,
    data.type || 'reminder',
    data.is_full_day ? 1 : 0
  ]);
  return result.insertId;
};

const updateEvent = async (id, data) => {
  await db.execute(queries.UPDATE_EVENT, [
    data.title,
    data.description || null,
    data.start_date,
    data.end_date || null,
    data.type || 'reminder',
    data.is_full_day ? 1 : 0,
    id
  ]);
};

const deleteEvent = async (id) => {
  await db.execute(queries.DELETE_EVENT, [id]);
};

module.exports = {
  listEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
