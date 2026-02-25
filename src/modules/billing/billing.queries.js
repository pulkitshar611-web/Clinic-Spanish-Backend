module.exports = {
  CREATE_INVOICE: `
        INSERT INTO invoices (invoice_number, patient_id, doctor_id, ars_id, invoice_date, due_date, subtotal, tax_amount, discount_amount, total_amount, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
  CREATE_INVOICE_ITEM: `
        INSERT INTO invoice_items (invoice_id, service_id, description, quantity, unit_price, tax_amount, total_line)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
  CREATE_ELECTRONIC_INVOICE: `
        INSERT INTO invoices (invoice_number, ncf, ncf_expiration_date, patient_id, doctor_id, ars_id, invoice_date, due_date, subtotal, tax_amount, total_amount, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'posted')
    `,
  LIST_INVOICES: `
        SELECT i.*, 
               CONCAT(p.first_name, ' ', p.last_name) as patient_name, 
               CONCAT(d.first_name, ' ', d.last_name) as doctor_name 
        FROM invoices i
        LEFT JOIN patients p ON i.patient_id = p.id
        LEFT JOIN doctors d ON i.doctor_id = d.id
        WHERE i.is_deleted = 0
        AND (? IS NULL OR i.doctor_id = ?)
        AND (? IS NULL OR i.patient_id = ?)
        ORDER BY i.created_at DESC
    `,
  GET_INVOICE_BY_ID: `SELECT * FROM invoices WHERE id = ? AND is_deleted = 0`,
  GET_INVOICE_ITEMS: `SELECT * FROM invoice_items WHERE invoice_id = ? AND is_deleted = 0`,
  GET_NCF_STATS: `
    SELECT 
      (5000 - (SELECT COUNT(*) FROM invoices WHERE ncf IS NOT NULL AND is_deleted = 0)) as available,
      (SELECT COUNT(*) FROM invoices WHERE ncf IS NOT NULL AND month(invoice_date) = month(current_date()) AND year(invoice_date) = year(current_date()) AND is_deleted = 0) as accepted,
      0 as earrings,
      0 as errors
  `,
  LIST_ELECTRONIC_RECEIPTS: `
    SELECT 
      i.invoice_number as id,
      i.ncf,
      NULL as security_code,
      COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)) as entity,
      i.invoice_date as date,
      i.total_amount as amount,
      'ACCEPTED' as status
    FROM invoices i
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    LEFT JOIN patients p ON i.patient_id = p.id
    WHERE i.ncf IS NOT NULL AND i.is_deleted = 0
    ORDER BY i.invoice_date DESC
  `,
  LIST_PAYMENTS: `
    SELECT 
      p.id as id_raw,
      CONCAT('PAY-', p.id) as id,
      a.name as ars,
      p.payment_method as method,
      p.reference_number as ref,
      DATE_FORMAT(p.payment_date, '%d %b %Y') as date,
      p.amount,
      'Confirmado' as status
    FROM payments p
    JOIN invoices i ON p.invoice_id = i.id
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    WHERE p.is_deleted = 0
    ORDER BY p.payment_date DESC
  `
};
