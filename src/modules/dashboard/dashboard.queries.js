module.exports = {
    GET_GENERAL_STATS: `
        SELECT 
            (SELECT COUNT(*) FROM patients WHERE is_deleted = 0) as total_patients,
            (SELECT COUNT(*) FROM doctors WHERE is_deleted = 0) as total_doctors,
            (SELECT SUM(total_amount) FROM invoices WHERE status != 'void' AND is_deleted = 0) as total_billed,
            (SELECT SUM(amount) FROM payments WHERE is_deleted = 0) as total_collected
    `,
    GET_SERVICE_STATS: `
        SELECT s.name, COUNT(ii.id) as usage_count, IFNULL(SUM(ii.total_line), 0) as revenue
        FROM services s
        LEFT JOIN invoice_items ii ON ii.service_id = s.id AND ii.is_deleted = 0
        GROUP BY s.name
        ORDER BY revenue DESC
        LIMIT 5
    `,
    GET_DOCTOR_STATS: `
        SELECT d.first_name, d.last_name, d.specialization as specialty, COUNT(i.id) as invoices_count, SUM(i.total_amount) as total_billed
        FROM doctors d
        LEFT JOIN invoices i ON i.doctor_id = d.id AND i.is_deleted = 0
        WHERE d.is_deleted = 0
        GROUP BY d.id
        ORDER BY total_billed DESC
    `,
    GET_ARS_STATS: `
        SELECT a.name, SUM(i.insurance_coverage_amount) as total_coverage
        FROM invoices i
        JOIN ars_companies a ON i.ars_id = a.id
        WHERE i.is_deleted = 0
          GROUP BY a.id, a.name
    `,
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
            CONCAT('Semana ', WEEK(date_col, 1) - WEEK(DATE_SUB(NOW(), INTERVAL 4 WEEK), 1)) as name,
            SUM(billed) as facturado,
            SUM(collected) as cobrado
        FROM (
            SELECT invoice_date as date_col, insurance_coverage_amount as billed, 0 as collected FROM invoices WHERE ars_id IS NOT NULL AND is_deleted = 0
            UNION ALL
            SELECT payment_date as date_col, 0 as billed, amount as collected FROM payments WHERE payment_method = 'insurance_payment' AND is_deleted = 0
        ) t
        WHERE date_col >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
        GROUP BY WEEK(date_col, 1)
        ORDER BY WEEK(date_col, 1) ASC
    `,
    GET_OVERDUE_STATS: `
        SELECT 
            SUM(CASE WHEN DATEDIFF(NOW(), due_date) BETWEEN 1 AND 30 THEN total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = invoices.id) ELSE 0 END) as overdue_30,
            SUM(CASE WHEN DATEDIFF(NOW(), due_date) BETWEEN 31 AND 60 THEN total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = invoices.id) ELSE 0 END) as overdue_60,
            SUM(CASE WHEN DATEDIFF(NOW(), due_date) BETWEEN 61 AND 90 THEN total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = invoices.id) ELSE 0 END) as overdue_90,
            SUM(CASE WHEN DATEDIFF(NOW(), due_date) > 90 THEN total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = invoices.id) ELSE 0 END) as overdue_plus_90
        FROM invoices
        WHERE (status = 'overdue' OR payment_status != 'paid') AND is_deleted = 0
    `,
    GET_INCOME_EXPENSE_STATS: `
        SELECT 
            DATE_FORMAT(t.date, '%b') as name,
            SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as ingresos,
            SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as gastos
        FROM (
            SELECT p.payment_date as date, p.amount, 'income' as type 
            FROM payments p 
            JOIN invoices i ON p.invoice_id = i.id
            WHERE p.is_deleted = 0 AND (? IS NULL OR i.doctor_id = ?)
            UNION ALL
            SELECT payment_date as date, amount, 'expense' as type FROM supplier_payments WHERE is_deleted = 0 AND (? IS NULL)
            UNION ALL
            SELECT expense_date as date, amount, 'expense' as type FROM direct_expenses WHERE is_deleted = 0 AND (? IS NULL)
        ) t
        WHERE t.date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(t.date, '%Y-%m'), DATE_FORMAT(t.date, '%b')
        ORDER BY DATE_FORMAT(t.date, '%Y-%m') ASC
    `,
    GET_SERVICE_TREND_STATS: `
       SELECT 
            DATE_FORMAT(i.invoice_date, '%a') as name,
            sc.name as category,
            COUNT(ii.id) as count
        FROM invoice_items ii
        JOIN invoices i ON ii.invoice_id = i.id
        JOIN services s ON ii.service_id = s.id
        LEFT JOIN service_categories sc ON s.category_id = sc.id
        WHERE i.invoice_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        AND (? IS NULL OR i.doctor_id = ?)
        GROUP BY DATE_FORMAT(i.invoice_date, '%Y-%m-%d'), sc.name
        ORDER BY i.invoice_date ASC
    `,
    GET_OVERDUE_LIST: `
        SELECT 
          COALESCE(a.name, CONCAT(p.first_name, ' ', p.last_name)) as entity,
          i.total_amount - (SELECT IFNULL(SUM(amount), 0) FROM payments WHERE invoice_id = i.id) as amount,
          DATEDIFF(NOW(), i.due_date) as days,
          CASE WHEN DATEDIFF(NOW(), i.due_date) > 90 THEN 'Legal' ELSE 'Pendiente' END as status
        FROM invoices i
        LEFT JOIN ars_companies a ON i.ars_id = a.id
        JOIN patients p ON i.patient_id = p.id
        WHERE (i.status = 'overdue' OR (i.payment_status != 'paid' AND i.due_date < NOW())) AND i.is_deleted = 0
        ORDER BY days DESC
        LIMIT 5
    `,
    GET_ARS_CLAIM_STATS: `
        SELECT 
          a.name,
          SUM(CASE WHEN i.payment_status = 'paid' THEN 1 ELSE 0 END) as Aprobado,
          SUM(CASE WHEN i.payment_status != 'paid' AND i.id IS NOT NULL THEN 1 ELSE 0 END) as Rechazado
        FROM ars_companies a
        LEFT JOIN invoices i ON i.ars_id = a.id AND i.is_deleted = 0
        GROUP BY a.id, a.name
    `,
    GET_DOCTOR_DASHBOARD_STATS: `
        SELECT 
            (SELECT COUNT(DISTINCT patient_id) FROM invoices WHERE doctor_id = ? AND is_deleted = 0) as total_patients,
            (SELECT SUM(total_amount) FROM invoices WHERE doctor_id = ? AND status != 'void' AND is_deleted = 0) as total_billed,
            (SELECT SUM(p.amount) FROM payments p JOIN invoices i ON p.invoice_id = i.id WHERE i.doctor_id = ? AND p.is_deleted = 0) as total_collected,
            (SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND appointment_date >= CURDATE() AND is_deleted = 0) as upcoming_appointments
    `,
    GET_DOCTOR_SERVICE_STATS: `
        SELECT s.name, COUNT(ii.id) as usage_count, SUM(ii.total_line) as revenue
        FROM invoice_items ii
        JOIN services s ON ii.service_id = s.id
        JOIN invoices i ON ii.invoice_id = i.id
        WHERE i.doctor_id = ? AND ii.is_deleted = 0
        GROUP BY s.name
        ORDER BY revenue DESC
        LIMIT 5
    `,
    GET_ARS_REPORT_MONTHLY: `
        SELECT 
            DATE_FORMAT(i.invoice_date, '%b') as month,
            a.name as ars,
            SUM(i.insurance_coverage_amount) as amount
        FROM invoices i
        JOIN ars_companies a ON i.ars_id = a.id
        WHERE i.invoice_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH) AND i.is_deleted = 0
        GROUP BY DATE_FORMAT(i.invoice_date, '%Y-%m'), a.name
        ORDER BY i.invoice_date ASC
    `,
    GET_ARS_REPORT_STATS: `
        SELECT
            (SELECT COUNT(*) FROM invoices WHERE ars_id IS NOT NULL AND status = 'paid' AND is_deleted = 0) / NULLIF((SELECT COUNT(*) FROM invoices WHERE ars_id IS NOT NULL AND is_deleted = 0), 0) * 100 as acceptance_rate,
            AVG(DATEDIFF(p.payment_date, i.invoice_date)) as avg_payment_days
        FROM invoices i
        JOIN payments p ON p.invoice_id = i.id
        WHERE i.ars_id IS NOT NULL AND i.is_deleted = 0
    `,
    GET_ARS_STATUS_PIE: `
        SELECT 
            CASE 
                WHEN payment_status = 'paid' THEN 'Pagado'
                WHEN payment_status = 'partial' THEN 'En Proceso'
                WHEN status = 'overdue' THEN 'Pendiente'
                ELSE 'Otros'
            END as name,
            COUNT(*) as value
        FROM invoices
        WHERE ars_id IS NOT NULL AND is_deleted = 0
        GROUP BY name
    `
};
