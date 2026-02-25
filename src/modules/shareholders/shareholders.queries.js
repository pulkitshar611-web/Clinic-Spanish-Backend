module.exports = {
  LIST_SHAREHOLDERS: 'SELECT * FROM shareholders WHERE is_deleted = 0 ORDER BY name ASC',
  GET_CAPITAL_SUMMARY: `
    SELECT 
      IFNULL(SUM(amount), 0) as total_capital,
      (SELECT COUNT(*) FROM shareholders WHERE is_deleted = 0) as total_shareholders
    FROM capital_contributions 
    WHERE is_deleted = 0
  `,
  CREATE_SHAREHOLDER: 'INSERT INTO shareholders (name, legal_id, email, phone, role, status, join_date, share_percentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
  UPDATE_SHAREHOLDER: 'UPDATE shareholders SET name = ?, legal_id = ?, email = ?, phone = ?, role = ?, status = ?, join_date = ?, share_percentage = ? WHERE id = ?',
  DELETE_SHAREHOLDER: 'UPDATE shareholders SET is_deleted = 1 WHERE id = ?',

  LIST_CONTRIBUTIONS: `
    SELECT cc.*, s.name as shareholder_name 
    FROM capital_contributions cc
    JOIN shareholders s ON cc.shareholder_id = s.id
    WHERE cc.is_deleted = 0
    ORDER BY cc.contribution_date DESC
  `,
  CREATE_CONTRIBUTION: 'INSERT INTO capital_contributions (shareholder_id, amount, contribution_date, contribution_type, shares_count, notes) VALUES (?, ?, ?, ?, ?, ?)'
};
