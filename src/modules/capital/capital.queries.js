module.exports = {
  LIST_SHAREHOLDERS: `
    SELECT 
      id, 
      name, 
      legal_id,
      legal_id as doc, 
      email,
      email as mail, 
      phone, 
      role,
      status,
      join_date,
      DATE_FORMAT(IFNULL(join_date, created_at), '%Y-%m-%d') as since,
      share_percentage
    FROM shareholders
    WHERE is_deleted = 0
    ORDER BY name ASC
  `,

  GET_CAPITAL_SUMMARY: `
    SELECT 
      IFNULL((SELECT SUM(amount) FROM capital_contributions WHERE is_deleted = 0), 0) as total_capital,
      IFNULL((SELECT SUM(amount) FROM capital_contributions WHERE is_deleted = 0 AND contribution_type = 'Efectivo'), 0) as total_cash,
      IFNULL((SELECT SUM(amount) FROM capital_contributions WHERE is_deleted = 0 AND contribution_type != 'Efectivo'), 0) as total_assets,
      (SELECT COUNT(*) FROM shareholders WHERE is_deleted = 0) as total_shareholders
  `,

  LIST_CONTRIBUTIONS: `
    SELECT 
      cc.id,
      s.name as shareholder_name,
      cc.contribution_type as type,
      cc.contribution_type,
      cc.amount,
      cc.shares_count as stocks,
      cc.shares_count,
      DATE_FORMAT(cc.contribution_date, '%Y-%m-%d') as date,
      DATE_FORMAT(cc.contribution_date, '%d %b, %Y') as formatted_date,
      cc.notes as method,
      cc.notes,
      CONCAT('CONT-', cc.id) as ref
    FROM capital_contributions cc
    JOIN shareholders s ON cc.shareholder_id = s.id
    WHERE cc.is_deleted = 0
    ORDER BY cc.contribution_date DESC
  `,

  CREATE_SHAREHOLDER: `
    INSERT INTO shareholders (name, legal_id, email, phone, role, status, join_date, share_percentage)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  UPDATE_SHAREHOLDER: `
    UPDATE shareholders 
    SET name = ?, legal_id = ?, email = ?, phone = ?, role = ?, status = ?, join_date = ?, share_percentage = ?
    WHERE id = ?
  `,

  DELETE_SHAREHOLDER: `
    UPDATE shareholders SET is_deleted = 1 WHERE id = ?
  `,

  CREATE_CONTRIBUTION: `
    INSERT INTO capital_contributions (shareholder_id, amount, contribution_type, shares_count, contribution_date, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `,

  // CXP Queries
  LIST_SHAREHOLDER_CXP: `
    SELECT 
      sc.id,
      s.name as creditor_name,
      sc.shareholder_id,
      sc.concept,
      sc.amount,
      DATE_FORMAT(sc.expiration_date, '%Y-%m-%d') as expiration_date,
      sc.priority,
      sc.status,
      sc.notes,
      DATE_FORMAT(sc.created_at, '%Y-%m-%d') as created_at
    FROM shareholder_cxp sc
    JOIN shareholders s ON sc.shareholder_id = s.id
    WHERE sc.is_deleted = 0
    ORDER BY sc.expiration_date ASC
  `,

  CREATE_SHAREHOLDER_CXP: `
    INSERT INTO shareholder_cxp (shareholder_id, concept, amount, expiration_date, priority, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,

  UPDATE_SHAREHOLDER_CXP: `
    UPDATE shareholder_cxp 
    SET shareholder_id = ?, concept = ?, amount = ?, expiration_date = ?, priority = ?, status = ?, notes = ?
    WHERE id = ?
  `,

  DELETE_SHAREHOLDER_CXP: `
    UPDATE shareholder_cxp SET is_deleted = 1 WHERE id = ?
  `,

  GET_CXP_SUMMARY: `
    SELECT 
      IFNULL(SUM(amount), 0) as total_balance,
      IFNULL(SUM(CASE WHEN status != 'Pagado' AND expiration_date <= CURDATE() THEN amount ELSE 0 END), 0) as total_due,
      IFNULL(SUM(CASE WHEN status != 'Pagado' AND expiration_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 30 DAY) THEN amount ELSE 0 END), 0) as next_30_days
    FROM shareholder_cxp
    WHERE is_deleted = 0
  `,

  // MOVEMENTS Queries
  LIST_MOVEMENTS: `
    SELECT 
      m.id,
      m.type,
      m.category,
      m.description,
      m.partner_name,
      m.shareholder_id,
      m.amount,
      DATE_FORMAT(m.movement_date, '%Y-%m-%d') as date,
      DATE_FORMAT(m.movement_date, '%d %b, %Y') as formatted_date,
      m.reference as ref,
      m.reference
    FROM capital_movements m
    WHERE m.is_deleted = 0
    ORDER BY m.movement_date DESC, m.created_at DESC
  `,

  CREATE_MOVEMENT: `
    INSERT INTO capital_movements (type, category, description, partner_name, shareholder_id, amount, movement_date, reference)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  DELETE_MOVEMENT: `
    UPDATE capital_movements SET is_deleted = 1 WHERE id = ?
  `,

  UPDATE_MOVEMENT: `
    UPDATE capital_movements 
    SET type = ?, category = ?, description = ?, partner_name = ?, shareholder_id = ?, amount = ?, movement_date = ?, reference = ?
    WHERE id = ?
  `
};
