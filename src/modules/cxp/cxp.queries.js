module.exports = {
  GET_KPI_STATS: `
    SELECT 
      (SELECT IFNULL(SUM(balance_due), 0) FROM supplier_invoices WHERE status != 'paid' AND is_deleted = 0) as total_cxp,
      (SELECT IFNULL(SUM(amount), 0) FROM supplier_payments WHERE month(payment_date) = month(current_date()) AND year(payment_date) = year(current_date()) AND is_deleted = 0) as paid_month,
      (SELECT COUNT(*) FROM supplier_invoices WHERE status = 'pending' AND due_date <= current_date() AND is_deleted = 0) as overdue_count
  `,
  GET_EXPENSE_DISTRIBUTION: `
    SELECT 
      ec.name, 
      IFNULL(SUM(si.total_amount), 0) as total
    FROM expense_categories ec
    LEFT JOIN supplier_invoices si ON ec.id = si.expense_category_id AND si.is_deleted = 0
    WHERE ec.is_deleted = 0
    GROUP BY ec.id, ec.name
    HAVING total > 0
  `,
  GET_UPCOMING_PAYMENTS: `
    SELECT 
      si.id,
      s.name as provider,
      si.description as concept,
      DATE_FORMAT(si.due_date, '%d %b') as dueDate,
      si.balance_due as amount,
      CASE 
        WHEN DATEDIFF(si.due_date, NOW()) <= 2 THEN 'Urgente'
        WHEN DATEDIFF(si.due_date, NOW()) <= 10 THEN 'Normal'
        ELSE 'Baja'
      END as priority
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    WHERE si.status != 'paid' AND si.is_deleted = 0
    ORDER BY si.due_date ASC
    LIMIT 10
  `,
  GET_SUPPLIERS_STATUS: `
    SELECT 
      s.id, s.name,
      1000000 as credit, -- Mock credit limit as it's not in schema
      IFNULL(SUM(si.balance_due), 0) as used,
      DATE_FORMAT(MAX(sp.payment_date), '%d %b') as lastPay,
      COUNT(DISTINCT si.id) as invoices
    FROM suppliers s
    LEFT JOIN supplier_invoices si ON s.id = si.supplier_id AND si.status != 'paid' AND si.is_deleted = 0
    LEFT JOIN supplier_payments sp ON si.id = sp.supplier_invoice_id AND sp.is_deleted = 0
    WHERE s.is_deleted = 0
    GROUP BY s.id, s.name
    ORDER BY used DESC
  `,
  GET_PURCHASE_ORDERS: `
    SELECT 
      CONCAT('PO-', DATE_FORMAT(si.created_at, '%Y'), '-', LPAD(si.id, 3, '0')) as id,
      s.name as vendor,
      DATE_FORMAT(si.issue_date, '%d %b') as date,
      si.total_amount as total,
      CASE 
        WHEN si.status = 'paid' THEN 'Pagado'
        WHEN si.status = 'partial' THEN 'En Proceso'
        ELSE 'Pendiente'
      END as status
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    WHERE si.is_deleted = 0
    ORDER BY si.created_at DESC
    LIMIT 10
  `,
  GET_UTILITY_BILLS: `
    SELECT 
      ec.name as service,
      s.name as provider,
      (SELECT AVG(total_amount) FROM supplier_invoices WHERE supplier_id = s.id AND is_deleted = 0) as avg,
      si.total_amount as current,
      CASE 
        WHEN si.due_date < NOW() THEN 'Vencido'
        WHEN si.due_date <= DATE_ADD(NOW(), INTERVAL 3 DAY) THEN 'Por Vencer'
        ELSE 'Al Día'
      END as status
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    JOIN expense_categories ec ON si.expense_category_id = ec.id
    WHERE ec.name IN ('Electricidad', 'Agua Potable', 'Internet / Tel', 'Mantenimiento')
    AND si.is_deleted = 0
    AND si.id IN (SELECT MAX(id) FROM supplier_invoices GROUP BY supplier_id)
  `,
  CREATE_SUPPLIER_INVOICE: `
    INSERT INTO supplier_invoices (supplier_id, invoice_number, issue_date, due_date, total_amount, balance_due, status, expense_category_id, description)
    VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)
  `,
  CREATE_SUPPLIER_PAYMENT: `
    INSERT INTO supplier_payments (supplier_invoice_id, payment_date, amount, payment_method, reference_number)
    VALUES (?, ?, ?, ?, ?)
  `,
  UPDATE_SUPPLIER_INVOICE_BALANCE: `
    UPDATE supplier_invoices 
    SET balance_due = balance_due - ?, 
        status = CASE WHEN (balance_due - ?) <= 0 THEN 'paid' ELSE 'partial' END 
    WHERE id = ?
  `,
  LIST_EXPENSE_CATEGORIES: `SELECT id, name FROM expense_categories WHERE is_deleted = 0 ORDER BY name ASC`,
  GET_PAYROLL_DATA: `
    SELECT 
      d.id,
      CONCAT(d.first_name, ' ', d.last_name) as name,
      d.specialization as position,
      (SELECT IFNULL(SUM(total_amount * (d.commission_rate / 100)), 0) FROM invoices WHERE doctor_id = d.id AND is_deleted = 0) as amount,
      'Pendiente' as status
    FROM doctors d
    WHERE d.is_deleted = 0
    HAVING amount > 0
  `,
  GET_OTHER_EXPENSES: `
    SELECT 
      si.id,
      s.name as provider,
      si.description as concept,
      DATE_FORMAT(si.issue_date, '%d %b') as date,
      si.total_amount as amount,
      si.balance_due,
      si.status
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    JOIN expense_categories ec ON si.expense_category_id = ec.id
    WHERE ec.name NOT IN ('Electricidad', 'Agua Potable', 'Internet / Tel', 'Mantenimiento')
    AND si.is_deleted = 0
    ORDER BY si.issue_date DESC
    LIMIT 20
  `
};
