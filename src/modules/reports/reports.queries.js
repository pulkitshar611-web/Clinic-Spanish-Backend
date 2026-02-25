module.exports = {
  GET_BILLING_SUMMARY: `
    SELECT 
      (SELECT IFNULL(SUM(total_amount), 0) FROM invoices WHERE is_deleted = 0) as total_billed,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE is_deleted = 0) as total_collected
  `,

  GET_BILLING_TREND: `
    SELECT 
      DATE_FORMAT(invoice_date, '%b') as month,
      IFNULL(SUM(total_amount), 0) as billed,
      IFNULL((
        SELECT SUM(p.amount) 
        FROM payments p 
        JOIN invoices inv ON p.invoice_id = inv.id
        WHERE MONTH(inv.invoice_date) = MONTH(invoices.invoice_date) 
        AND YEAR(inv.invoice_date) = YEAR(invoices.invoice_date)
        AND p.is_deleted = 0
      ), 0) as collected
    FROM invoices
    WHERE is_deleted = 0 AND invoice_date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    GROUP BY YEAR(invoice_date), MONTH(invoice_date)
    ORDER BY YEAR(invoice_date) ASC, MONTH(invoice_date) ASC
  `,

  GET_CASHFLOW_SUMMARY: `
    SELECT 
      -- Incomes
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE is_deleted = 0) as total_incomes,
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE is_deleted = 0 AND MONTH(payment_date) = MONTH(CURRENT_DATE) AND YEAR(payment_date) = YEAR(CURRENT_DATE)) as incomes_month,
      
      -- Expenses
      (
        SELECT IFNULL(SUM(amount), 0) 
        FROM (
          SELECT amount FROM direct_expenses WHERE is_deleted = 0
          UNION ALL
          SELECT amount FROM supplier_payments WHERE is_deleted = 0
        ) as all_exp
      ) as total_expenses,
      (
        SELECT IFNULL(SUM(amount), 0) 
        FROM (
          SELECT amount FROM direct_expenses WHERE is_deleted = 0 AND MONTH(expense_date) = MONTH(CURRENT_DATE) AND YEAR(expense_date) = YEAR(CURRENT_DATE)
          UNION ALL
          SELECT p.amount 
          FROM supplier_payments p 
          WHERE p.is_deleted = 0 AND MONTH(p.payment_date) = MONTH(CURRENT_DATE) AND YEAR(p.payment_date) = YEAR(CURRENT_DATE)
        ) as exp_month
      ) as expenses_month
  `,

  GET_CASHFLOW_DAILY_TREND: `
    SELECT 
      days.date as full_date,
      DATE_FORMAT(days.date, '%d/%m') as date,
      IFNULL(inc.amount, 0) as income,
      IFNULL(exp.amount, 0) as expense
    FROM (
      -- Generate last 15 days
      SELECT CURDATE() - INTERVAL (a.a + (10 * b.a)) DAY as date
      FROM (SELECT 0 as a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) as a
      CROSS JOIN (SELECT 0 as a UNION ALL SELECT 1 UNION ALL SELECT 2) as b
      WHERE CURDATE() - INTERVAL (a.a + (10 * b.a)) DAY >= DATE_SUB(CURDATE(), INTERVAL 15 DAY)
    ) as days
    LEFT JOIN (
      SELECT DATE(payment_date) as date, SUM(amount) as amount FROM payments WHERE is_deleted = 0 GROUP BY DATE(payment_date)
    ) as inc ON days.date = inc.date
    LEFT JOIN (
      SELECT date, SUM(amount) as amount FROM (
        SELECT DATE(expense_date) as date, amount FROM direct_expenses WHERE is_deleted = 0
        UNION ALL
        SELECT DATE(payment_date) as date, amount FROM supplier_payments WHERE is_deleted = 0
      ) as e GROUP BY date
    ) as exp ON days.date = exp.date
    ORDER BY days.date ASC
  `,

  GET_CXC_REPORT_KPI: `
    SELECT 
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0) as total,
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) <= 30) as corriente,
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) BETWEEN 31 AND 60) as vencido,
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) > 60) as critico
  `,

  GET_CXC_REPORT_LIST: `
    SELECT 
      i.id,
      CONCAT(p.first_name, ' ', p.last_name) as client,
      COALESCE(a.name, 'Privado') as insurance,
      DATEDIFF(CURRENT_DATE(), i.due_date) as days,
      (i.total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)) as amount,
      CASE 
        WHEN DATEDIFF(CURRENT_DATE(), i.due_date) > 0 THEN 'Vencido'
        ELSE 'Corriente'
      END as status
    FROM invoices i
    JOIN patients p ON i.patient_id = p.id
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    WHERE i.payment_status != 'paid' AND i.is_deleted = 0
    ORDER BY days DESC
  `,

  GET_OVERDUE_KPI: `
    SELECT 
      -- Total en Mora (+30 días)
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) 
       FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) > 30) as total_mora,
      
      -- Casos Críticos (+90 días)
      (SELECT IFNULL(SUM(total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)), 0) 
       FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) > 90) as total_critical,
       
      -- Count of cases (+90 days)
      (SELECT COUNT(*) FROM invoices i WHERE payment_status != 'paid' AND is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), due_date) > 90) as critical_count
  `,

  GET_OVERDUE_LIST: `
    SELECT 
      i.id,
      CONCAT(p.first_name, ' ', p.last_name) as name,
      p.email,
      p.phone,
      i.invoice_number as ncf,
      DATEDIFF(CURRENT_DATE(), i.due_date) as days,
      (i.total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id AND is_deleted = 0)) as amount
    FROM invoices i
    JOIN patients p ON i.patient_id = p.id
    WHERE i.payment_status != 'paid' AND i.is_deleted = 0 AND DATEDIFF(CURRENT_DATE(), i.due_date) > 30
    ORDER BY days DESC
  `,

  GET_CXP_REPORT_KPI: `
    SELECT 
      (SELECT IFNULL(SUM(balance_due), 0) FROM supplier_invoices WHERE is_deleted = 0 AND status != 'paid') as total,
      (SELECT IFNULL(SUM(balance_due), 0) FROM supplier_invoices WHERE is_deleted = 0 AND status != 'paid' AND due_date < CURRENT_DATE()) as overdue,
      (SELECT IFNULL(SUM(balance_due), 0) FROM supplier_invoices WHERE is_deleted = 0 AND status != 'paid' AND due_date BETWEEN CURRENT_DATE() AND DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)) as next_7_days
  `,

  GET_CXP_REPORT_LIST: `
    SELECT 
      si.id,
      s.name as provider,
      si.description as concept,
      si.balance_due as amount,
      si.due_date as dueDate,
      CASE 
        WHEN si.due_date < CURRENT_DATE() THEN 'overdue'
        WHEN si.status = 'partial' THEN 'partial'
        ELSE 'pending'
      END as status,
      si.ncf,
      s.rnc
    FROM supplier_invoices si
    JOIN suppliers s ON si.supplier_id = s.id
    WHERE si.is_deleted = 0 AND si.status != 'paid'
    ORDER BY si.due_date ASC
  `,

  GET_INCOME_EXPENSE_SUMMARY: `
    SELECT 
      (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE is_deleted = 0) as total_income,
      (SELECT IFNULL(SUM(amount), 0) FROM (
         SELECT amount FROM direct_expenses WHERE is_deleted = 0
         UNION ALL
         SELECT amount FROM supplier_payments WHERE is_deleted = 0
      ) as e) as total_expense
  `,

  GET_MONTHLY_COMPARISON: `
    SELECT 
      months.month_name as month,
      IFNULL(inc.amount, 0) as income,
      IFNULL(exp.amount, 0) as expense
    FROM (
      SELECT 1 as m, 'Ene' as month_name UNION ALL SELECT 2, 'Feb' UNION ALL SELECT 3, 'Mar' UNION ALL 
      SELECT 4, 'Abr' UNION ALL SELECT 5, 'May' UNION ALL SELECT 6, 'Jun' UNION ALL 
      SELECT 7, 'Jul' UNION ALL SELECT 8, 'Ago' UNION ALL SELECT 9, 'Sep' UNION ALL 
      SELECT 10, 'Oct' UNION ALL SELECT 11, 'Nov' UNION ALL SELECT 12, 'Dic'
    ) as months
    LEFT JOIN (
      SELECT MONTH(payment_date) as m, SUM(amount) as amount FROM payments WHERE is_deleted = 0 AND YEAR(payment_date) = YEAR(CURDATE()) GROUP BY MONTH(payment_date)
    ) as inc ON months.m = inc.m
    LEFT JOIN (
      SELECT m, SUM(amount) as amount FROM (
         SELECT MONTH(expense_date) as m, amount FROM direct_expenses WHERE is_deleted = 0 AND YEAR(expense_date) = YEAR(CURDATE())
         UNION ALL
         SELECT MONTH(payment_date) as m, amount FROM supplier_payments WHERE is_deleted = 0 AND YEAR(payment_date) = YEAR(CURDATE())
      ) as e GROUP BY m
    ) as exp ON months.m = exp.m
    ORDER BY months.m ASC
  `,

  GET_EXPENSES_BY_CATEGORY: `
    SELECT 
      ec.name,
      SUM(de.amount) as value
    FROM direct_expenses de
    JOIN expense_categories ec ON de.expense_category_id = ec.id
    WHERE de.is_deleted = 0
    GROUP BY ec.id
    UNION ALL
    SELECT 
      'Pagos Suplidores' as name,
      IFNULL(SUM(amount), 0) as value
    FROM supplier_payments
    WHERE is_deleted = 0
    HAVING value > 0
  `,

  GET_SERVICE_PROFITABILITY: `
    SELECT 
      sc.name as service,
      IFNULL(SUM(ii.total_line), 0) as revenue,
      COUNT(ii.id) as sessions
    FROM service_categories sc
    LEFT JOIN services s ON s.category_id = sc.id AND s.is_deleted = 0
    LEFT JOIN invoice_items ii ON ii.service_id = s.id AND ii.is_deleted = 0
    LEFT JOIN invoices i ON ii.invoice_id = i.id AND i.is_deleted = 0
    GROUP BY sc.id
    ORDER BY revenue DESC
  `,

  GET_DOCTOR_PROFITABILITY: `
    SELECT 
      CONCAT(d.first_name, ' ', d.last_name) as name,
      d.specialization as specialty,
      COUNT(i.id) as patients,
      IFNULL(SUM(i.total_amount), 0) as value
    FROM doctors d
    LEFT JOIN invoices i ON i.doctor_id = d.id AND i.is_deleted = 0
    WHERE d.is_deleted = 0
    GROUP BY d.id
    ORDER BY value DESC
  `,

  GET_ARS_DISTRIBUTION: `
    SELECT 
      COALESCE(a.name, 'Privado') as name,
      SUM(i.total_amount) as value
    FROM invoices i
    LEFT JOIN ars_companies a ON i.ars_id = a.id
    WHERE i.is_deleted = 0
    GROUP BY i.ars_id
    ORDER BY value DESC
  `
};
