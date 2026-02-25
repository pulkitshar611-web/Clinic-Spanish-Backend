module.exports = {
  GET_INCOME_KPI: `
    SELECT 
      IFNULL(SUM(CASE WHEN MONTH(payment_date) = MONTH(CURRENT_DATE) AND YEAR(payment_date) = YEAR(CURRENT_DATE) THEN amount ELSE 0 END), 0) as total_month,
      IFNULL(SUM(CASE WHEN payment_method = 'insurance_payment' THEN amount ELSE 0 END), 0) as by_insurance,
      IFNULL(SUM(CASE WHEN payment_method IN ('cash', 'transfer', 'card') THEN amount ELSE 0 END), 0) as by_cash
    FROM payments 
    WHERE is_deleted = 0
  `,
  LIST_INCOMES: `
    SELECT 
      p.payment_date as date,
      COALESCE(pa.first_name, p.notes, 'Ingreso General') as source,
      COALESCE(sc.name, 
        CASE 
          WHEN p.invoice_id IS NOT NULL THEN 'Factura / Copago'
          WHEN p.payment_method = 'insurance_payment' THEN 'Pago ARS'
          ELSE 'Otro Ingreso'
        END
      ) as cat,
      p.payment_method as method,
      p.amount,
      p.reference_number as reference
    FROM payments p
    LEFT JOIN patients pa ON p.patient_id = pa.id
    LEFT JOIN service_categories sc ON p.service_category_id = sc.id
    WHERE p.is_deleted = 0
    ORDER BY p.payment_date DESC
    LIMIT 50
  `,
  GET_EXPENSE_KPI: `
    SELECT 
      IFNULL(SUM(CASE WHEN MONTH(expense_date) = MONTH(CURRENT_DATE) AND YEAR(expense_date) = YEAR(CURRENT_DATE) THEN amount ELSE 0 END), 0) as total_month,
      IFNULL(SUM(CASE WHEN expense_category_id IN (1, 3, 4, 5) THEN amount ELSE 0 END), 0) as operative,
      IFNULL(SUM(CASE WHEN expense_category_id = 2 THEN amount ELSE 0 END), 0) as payroll
    FROM direct_expenses 
    WHERE is_deleted = 0 AND is_prepaid = ?
  `,
  LIST_EXPENSES: `
    SELECT * FROM (
      SELECT 
        de.id,
        expense_date as date,
        de.description as beneficiary,
        ec.name as category_name, 
        reference_number as reference,
        amount,
        is_prepaid
      FROM direct_expenses de
      LEFT JOIN expense_categories ec ON de.expense_category_id = ec.id
      WHERE de.is_deleted = 0
      UNION ALL
      SELECT 
        p.id,
        p.payment_date as date,
        s.name as beneficiary,
        'Pago Suplidor' as category_name,
        p.reference_number as reference,
        p.amount,
        0 as is_prepaid
      FROM supplier_payments p
      JOIN supplier_invoices si ON p.supplier_invoice_id = si.id
      JOIN suppliers s ON si.supplier_id = s.id
      WHERE p.is_deleted = 0
    ) as integrated_expenses
    WHERE is_prepaid = ?
    ORDER BY date DESC
    LIMIT 50
  `,
  CREATE_DIRECT_INCOME: `
    INSERT INTO payments (notes, amount, payment_method, payment_date, service_category_id, reference_number)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  CREATE_DIRECT_EXPENSE: `
    INSERT INTO direct_expenses (expense_category_id, description, amount, expense_date, payment_method, reference_number, is_prepaid)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
  LIST_CATEGORIES: `SELECT id, name, description FROM expense_categories WHERE is_deleted = 0 ORDER BY name ASC`,
  LIST_SERVICE_CATEGORIES: `SELECT id, name, description FROM service_categories WHERE is_deleted = 0 ORDER BY name ASC`,
  CREATE_CATEGORY: `INSERT INTO expense_categories (name, description) VALUES (?, ?)`,
  DELETE_CATEGORY: `UPDATE expense_categories SET is_deleted = 1 WHERE id = ?`
};
