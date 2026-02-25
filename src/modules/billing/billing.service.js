const db = require('../../config/db');
const queries = require('./billing.queries');

exports.createInvoice = async (data) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { patient_id, doctor_id, ars_id, invoice_date, due_date, items, notes } = data;

    // Calculate totals
    let subtotal = 0;
    let total_tax = 0;
    let total_discount = 0;

    items.forEach(item => {
      item.quantity = parseFloat(item.quantity) || 1;
      item.unit_price = parseFloat(item.unit_price) || 0;
      item.tax_amount = parseFloat(item.tax_amount) || 0;
      // Calculate line total
      item.total_line = (item.quantity * item.unit_price) + item.tax_amount;

      subtotal += item.quantity * item.unit_price;
      total_tax += item.tax_amount;
    });

    const total_amount = subtotal + total_tax - total_discount;
    const invoice_number = `INV-${Date.now()}`; // Simple generation

    // Insert Invoice
    const [invResult] = await connection.query(queries.CREATE_INVOICE, [
      invoice_number, patient_id, doctor_id, ars_id, invoice_date || new Date(),
      due_date, subtotal, total_tax, total_discount, total_amount, notes
    ]);
    const invoiceId = invResult.insertId;

    // Insert Items
    for (const item of items) {
      await connection.query(queries.CREATE_INVOICE_ITEM, [
        invoiceId, item.service_id, item.description, item.quantity,
        item.unit_price, item.tax_amount, item.total_line
      ]);
    }

    await connection.commit();
    return invoiceId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

exports.listInvoices = async (doctorId = null, patientId = null) => {
  const [rows] = await db.query(queries.LIST_INVOICES, [doctorId, doctorId, patientId, patientId]);
  return rows;
};

exports.getInvoiceById = async (id) => {
  const [rows] = await db.query(queries.GET_INVOICE_BY_ID, [id]);
  if (rows.length === 0) return null;

  const invoice = rows[0];
  const [items] = await db.query(queries.GET_INVOICE_ITEMS, [id]);
  invoice.items = items;

  return invoice;
};

exports.getNcfSummary = async () => {
  const [stats] = await db.query(queries.GET_NCF_STATS);
  const [receipts] = await db.query(queries.LIST_ELECTRONIC_RECEIPTS);
  return { stats: stats[0], receipts };
};

exports.listPayments = async () => {
  const [rows] = await db.query(queries.LIST_PAYMENTS);
  return rows;
};

exports.createElectronicInvoice = async (data) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { patient_id, doctor_id, ars_id, items, ncf_type = '31' } = data;

    // Calculate totals
    let subtotal = 0;
    let total_tax = 0;
    items.forEach(item => {
      const q = parseFloat(item.qty || item.quantity) || 1;
      const p = parseFloat(item.price || item.unit_price) || 0;
      const t = p * q * 0.18; // Default 18% tax
      item.total_line = (q * p) + t;
      subtotal += q * p;
      total_tax += t;
    });

    const total_amount = subtotal + total_tax;
    const invoice_number = `E-${Date.now()}`;
    const ncf = `E${ncf_type}${Math.floor(Math.random() * 900000000 + 100000000)}`;
    const expiration = new Date();
    expiration.setFullYear(expiration.getFullYear() + 2);

    const [invResult] = await connection.query(queries.CREATE_ELECTRONIC_INVOICE, [
      invoice_number, ncf, expiration, patient_id || null, doctor_id || null,
      ars_id || null, new Date(), new Date(), subtotal, total_tax, total_amount,
      'Factura Electrónica DGII'
    ]);
    const invoiceId = invResult.insertId;

    for (const item of items) {
      await connection.query(queries.CREATE_INVOICE_ITEM, [
        invoiceId, null, item.service || item.description,
        parseFloat(item.qty || item.quantity) || 1,
        parseFloat(item.price || item.unit_price) || 0,
        (parseFloat(item.price || item.unit_price) * 0.18),
        item.total_line
      ]);
    }

    await connection.commit();
    return invoiceId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
