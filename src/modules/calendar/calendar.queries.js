module.exports = {
  LIST_EVENTS: `
    SELECT 
      id,
      title,
      description,
      DATE_FORMAT(start_date, '%Y-%m-%d %H:%i:%s') as start,
      DATE_FORMAT(end_date, '%Y-%m-%d %H:%i:%s') as end,
      type,
      is_full_day
    FROM calendar_events
    ORDER BY start_date ASC
  `,

  CREATE_EVENT: `
    INSERT INTO calendar_events (title, description, start_date, end_date, type, is_full_day)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  UPDATE_EVENT: `
    UPDATE calendar_events 
    SET title = ?, description = ?, start_date = ?, end_date = ?, type = ?, is_full_day = ?
    WHERE id = ?
  `,

  DELETE_EVENT: `
    DELETE FROM calendar_events WHERE id = ?
  `
};
