module.exports = {
  GET_KPI_STATS: `
    SELECT 
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0) as total_cxc,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE month(payment_date) = month(current_date()) AND year(payment_date) = year(current_date()) AND is_deleted = 0) as collected_month,
      (SELECT COUNT(*) FROM invoices WHERE payment_status != 'paid' AND due_date < CURRENT_DATE() AND is_deleted = 0) as overdue_invoices_count
  `,
  GET_AGING_SUMMARY: `
    SELECT 
      ranges.range_name,
      IFNULL(SUM(i.total_amount - (SELECT IFNULL(SUM(p.amount), 0) FROM payments p WHERE p.invoice_id = i.id AND p.is_deleted = 0)), 0) as value
    FROM (
      SELECT 'Corriente' as range_name, 0 as min_days, 0 as max_days
      UNION SELECT '1-30 Días', 1, 30
      UNION SELECT '31-60 Días', 31, 60
      UNION SELECT '61-90 Días', 61, 90
      UNION SELECT '+90 Días', 91, 99999
    ) ranges
    LEFT JOIN invoices i ON i.is_deleted = 0 AND i.payment_status != 'paid' AND (
      (ranges.range_name = 'Corriente' AND DATEDIFF(CURRENT_DATE(), i.due_date) <= 0) OR
      (ranges.range_name != 'Corriente' AND DATEDIFF(CURRENT_DATE(), i.due_date) BETWEEN ranges.min_days AND ranges.max_days)
    )
    GROUP BY ranges.range_name
    ORDER BY FIELD(ranges.range_name, 'Corriente', '1-30 Días', '31-60 Días', '61-90 Días', '+90 Días')
  `,
  GET_TOP_DEBTORS: `
    SELECT 
      COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)) as name,
      CASE WHEN i.ars_id IS NOT NULL THEN 'ARS' ELSE 'Paciente' END as type,
      MAX(i.invoice_date) as lastInv,
      MAX(DATEDIFF(CURRENT_DATE(), i.due_date)) as days,
      SUM(i.total_amount - (SELECT IFNULL(SUM(payment.amount), 0) FROM payments payment WHERE payment.invoice_id = i.id AND payment.is_deleted = 0)) as balance
    FROM invoices i
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    JOIN patients p ON i.patient_id = p.id
    WHERE i.payment_status != 'paid' AND i.is_deleted = 0
    GROUP BY COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)), i.ars_id, i.patient_id
    ORDER BY balance DESC
    LIMIT 5
  `,
  GET_ALL_INVOICES: `
    SELECT 
      i.id,
      i.invoice_number,
      COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)) as entity,
      DATE_FORMAT(i.invoice_date, '%d/%b/%Y') as date,
      i.total_amount as total,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0) as pagado,
      CASE 
        WHEN i.payment_status != 'paid' AND i.due_date < CURRENT_DATE() THEN 'overdue' 
        ELSE i.payment_status 
      END as status
    FROM invoices i
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    JOIN patients p ON i.patient_id = p.id
    WHERE i.is_deleted = 0
    ORDER BY i.invoice_date DESC
  `,
  GET_ENTITY_BALANCES: `
     SELECT 
      COALESCE(a.id, p.id) as id,
      COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)) as name,
      CASE WHEN i.ars_id IS NOT NULL THEN 'ARS' ELSE 'Paciente' END as tipo,
      COUNT(DISTINCT i.patient_id) as patientCount,
      SUM(i.total_amount - (SELECT IFNULL(SUM(payment.amount), 0) FROM payments payment WHERE payment.invoice_id = i.id AND payment.is_deleted = 0)) as balance,
      MAX(DATEDIFF(CURRENT_DATE(), i.due_date)) as max_days
    FROM invoices i
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    JOIN patients p ON i.patient_id = p.id
    WHERE i.payment_status != 'paid' AND i.is_deleted = 0
    GROUP BY COALESCE(a.id, p.id), name, tipo
    ORDER BY balance DESC
  `,
  CREATE_PAYMENT: `
    INSERT INTO payments (invoice_id, patient_id, payment_date, amount, payment_method, reference_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  UPDATE_INVOICE_STATUS: `
    UPDATE invoices i 
    SET payment_status = CASE 
      WHEN (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0) >= i.total_amount THEN 'paid' 
      WHEN (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0) > 0 THEN 'partial' 
      ELSE 'unpaid' 
    END 
    WHERE id = ?
  `
};
