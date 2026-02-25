module.exports = {
    GET_LIQUIDITY_BY_ACCOUNT: `
        SELECT 
            payment_method as name,
            CASE 
                WHEN payment_method = 'cash' THEN 'Efectivo'
                WHEN payment_method IN ('transfer', 'card') THEN 'Banco'
                ELSE 'Otros'
            END as type,
            SUM(amount) as balance
        FROM (
            SELECT payment_method, amount FROM payments WHERE is_deleted = 0
            UNION ALL
            SELECT payment_method, -amount FROM supplier_payments WHERE is_deleted = 0
            UNION ALL
            SELECT payment_method, -amount FROM direct_expenses WHERE is_deleted = 0
        ) t
        GROUP BY payment_method
    `,
    GET_MOVEMENTS: `
        SELECT 
            id,
            date,
            description,
            type,
            amount,
            method,
            is_reconciled
        FROM (
            SELECT CONCAT('PAY-', id) as id, payment_date as date, IFNULL(notes, 'Ingreso Manual') as description, 'in' as type, amount, payment_method as method, is_reconciled FROM payments WHERE is_deleted = 0
            UNION ALL
            SELECT CONCAT('SUP-', sp.id) as id, sp.payment_date as date, CONCAT('Pago Suplidor: ', s.name) as description, 'out' as type, sp.amount, sp.payment_method as method, sp.is_reconciled 
            FROM supplier_payments sp
            JOIN supplier_invoices si ON sp.supplier_invoice_id = si.id
            JOIN suppliers s ON si.supplier_id = s.id
            WHERE sp.is_deleted = 0
            UNION ALL
            SELECT CONCAT('EXP-', id) as id, expense_date as date, description, 'out' as type, amount, payment_method as method, is_reconciled FROM direct_expenses WHERE is_deleted = 0
        ) t
        ORDER BY date DESC
        LIMIT 50
    `,
    GET_BANK_MOVEMENTS: `
        SELECT 
            id,
            date,
            description,
            type,
            amount,
            method,
            is_reconciled
        FROM (
            SELECT CONCAT('PAY-', id) as id, payment_date as date, IFNULL(notes, 'Ingreso Manual') as description, 'in' as type, amount, payment_method as method, is_reconciled FROM payments WHERE is_deleted = 0 AND payment_method != 'cash'
            UNION ALL
            SELECT CONCAT('SUP-', sp.id) as id, sp.payment_date as date, CONCAT('Pago Suplidor: ', s.name) as description, 'out' as type, sp.amount, sp.payment_method as method, sp.is_reconciled 
            FROM supplier_payments sp
            JOIN supplier_invoices si ON sp.supplier_invoice_id = si.id
            JOIN suppliers s ON si.supplier_id = s.id
            WHERE sp.is_deleted = 0 AND sp.payment_method != 'cash'
            UNION ALL
            SELECT CONCAT('EXP-', id) as id, expense_date as date, description, 'out' as type, amount, payment_method as method, is_reconciled FROM direct_expenses WHERE is_deleted = 0 AND payment_method != 'cash'
        ) t
        ORDER BY date DESC
    `,
    GET_CASH_FLOW: `
        SELECT 
            DATE_FORMAT(date, '%u') as week_num,
            CONCAT('Sem ', WEEK(date)) as name,
            SUM(CASE WHEN type = 'in' THEN amount ELSE 0 END) as ingresos,
            SUM(CASE WHEN type = 'out' THEN amount ELSE 0 END) as egresos
        FROM (
            SELECT payment_date as date, amount, 'in' as type FROM payments WHERE is_deleted = 0
            UNION ALL
            SELECT payment_date as date, amount, 'out' as type FROM supplier_payments WHERE is_deleted = 0
            UNION ALL
            SELECT expense_date as date, amount, 'out' as type FROM direct_expenses WHERE is_deleted = 0
        ) t
        WHERE date >= DATE_SUB(NOW(), INTERVAL 4 WEEK)
        GROUP BY name, WEEK(date)
        ORDER BY WEEK(date) ASC
    `,
    CREATE_DIRECT_EXPENSE: `
        INSERT INTO direct_expenses (description, amount, payment_method, expense_date, expense_category_id)
        VALUES (?, ?, ?, ?, ?)
    `,
    CREATE_MANUAL_PAYMENT: `
        INSERT INTO payments (notes, amount, payment_method, payment_date)
        VALUES (?, ?, ?, ?)
    `,
    LIST_CATEGORIES: `SELECT id, name FROM expense_categories WHERE is_deleted = 0 ORDER BY name ASC`,
    UPDATE_PAYMENT_RECONCILED: `UPDATE payments SET is_reconciled = ? WHERE id = ?`,
    UPDATE_SUPPLIER_PAYMENT_RECONCILED: `UPDATE supplier_payments SET is_reconciled = ? WHERE id = ?`,
    UPDATE_EXPENSE_RECONCILED: `UPDATE direct_expenses SET is_reconciled = ? WHERE id = ?`
};
