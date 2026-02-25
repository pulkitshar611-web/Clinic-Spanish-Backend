module.exports = {
  LIST_NCF_SEQUENCES: `SELECT * FROM ncf_sequences WHERE is_deleted = 0`,
  GET_NCF_SUMMARY: `
    SELECT 
      SUM(max_sequence - current_sequence) as total_available,
      (SELECT COUNT(*) FROM ncf_sequences WHERE status = 'alert' AND is_deleted = 0) as alerts_count,
      (SELECT COUNT(*) FROM invoices WHERE ncf LIKE 'E%' AND is_deleted = 0) as emitted_ecf
    FROM ncf_sequences 
    WHERE is_deleted = 0
  `,
  CREATE_NCF_SEQUENCE: `INSERT INTO ncf_sequences (type_name, prefix, current_sequence, max_sequence, expiration_date, status) VALUES (?, ?, 1, ?, ?, 'active')`,
  INCREMENT_NCF_SEQUENCE: `UPDATE ncf_sequences SET current_sequence = current_sequence + 1 WHERE id = ?`,
  UPDATE_NCF_STATUS: `UPDATE ncf_sequences SET status = ? WHERE id = ?`
};
