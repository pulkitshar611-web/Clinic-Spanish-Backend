module.exports = {
  CREATE_ARS: `INSERT INTO ars_companies (name, rnc, website, status, email, contact_phone) VALUES (?, ?, ?, ?, ?, ?)`,
  UPDATE_ARS: `UPDATE ars_companies SET name = ?, rnc = ?, website = ?, status = ?, email = ?, contact_phone = ? WHERE id = ?`,
  DELETE_ARS: `UPDATE ars_companies SET is_deleted = 1 WHERE id = ?`,
  LIST_ARS: `SELECT id, name, rnc, website, status, email, contact_phone as phone, updated_at FROM ars_companies WHERE is_deleted = 0 ORDER BY name ASC`,
  GET_ARS_DASHBOARD_STATS: `
    SELECT
      (SELECT IFNULL(SUM(insurance_coverage_amount), 0) FROM invoices WHERE ars_id IS NOT NULL AND is_deleted = 0) as total_billed,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE payment_method = 'insurance_payment' AND is_deleted = 0) as total_collected,
      (SELECT COUNT(DISTINCT id) FROM patients WHERE insurance_provider_id IS NOT NULL AND is_deleted = 0) as insured_patients,
      (SELECT COUNT(*) FROM invoices WHERE ars_id IS NOT NULL AND payment_status = 'paid' AND is_deleted = 0) as paid_claims,
      (SELECT COUNT(*) FROM invoices WHERE ars_id IS NOT NULL AND is_deleted = 0) as total_claims
  `,
  GET_ARS_FINANCIAL_TREND: `
    SELECT 
      DATE_FORMAT(date_col, '%d %b') as name,
      SUM(billed) as facturado,
      SUM(collected) as cobrado
    FROM (
      SELECT invoice_date as date_col, insurance_coverage_amount as billed, 0 as collected FROM invoices WHERE ars_id IS NOT NULL AND is_deleted = 0
      UNION ALL
      SELECT payment_date as date_col, 0 as billed, amount as collected FROM payments WHERE payment_method = 'insurance_payment' AND is_deleted = 0
    ) t
    WHERE date_col >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY date_col
    ORDER BY date_col ASC
  `,
  GET_STATEMENTS: `
    SELECT 
      a.id, a.name as ars, a.rnc,
      (SELECT IFNULL(SUM(insurance_coverage_amount), 0) FROM invoices WHERE ars_id = a.id AND is_deleted = 0) as billed,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE payment_method = 'insurance_payment' AND invoice_id IN (SELECT id FROM invoices WHERE ars_id = a.id) AND is_deleted = 0) as collected,
      (SELECT IFNULL(SUM(insurance_coverage_amount), 0) FROM invoices WHERE ars_id = a.id AND is_deleted = 0) - 
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE payment_method = 'insurance_payment' AND invoice_id IN (SELECT id FROM invoices WHERE ars_id = a.id) AND is_deleted = 0) as balance,
      (SELECT MAX(payment_date) FROM payments p JOIN invoices i ON p.invoice_id = i.id WHERE i.ars_id = a.id) as last_payment
    FROM ars_companies a
    WHERE a.is_deleted = 0
  `,
  GET_MOVEMENTS: `
    SELECT 
        id, type, description as 'desc', amount, date
    FROM (
        SELECT 
            id, 'Facturación' as type, CONCAT('Factura #', invoice_number) as description, 
            insurance_coverage_amount as amount, invoice_date as date 
        FROM invoices WHERE ars_id = ? AND is_deleted = 0
        UNION ALL
        SELECT 
            p.id, 'Pago Recibido' as type, CONCAT('Pago Ref: ', p.reference_number) as description, 
            -p.amount as amount, p.payment_date as date 
        FROM payments p JOIN invoices i ON p.invoice_id = i.id WHERE i.ars_id = ? AND p.payment_method = 'insurance_payment' AND p.is_deleted = 0
    ) t
    ORDER BY date DESC
    LIMIT 50
  `,
  GET_ARS_RATES: `
    SELECT 
      c.id, s.name as procedure_name, s.code, 
      c.coverage_percentage as coverage, c.copay_amount as copay, 
      s.base_price as clinic_amount
    FROM ars_coverage c
    JOIN services s ON c.service_id = s.id
    WHERE c.ars_id = ? AND c.is_deleted = 0
  `,
  GET_ARS_CONTACTS: `
    SELECT id, name, role, phone, email 
    FROM ars_contacts 
    WHERE ars_id = ? AND is_deleted = 0
  `
};
