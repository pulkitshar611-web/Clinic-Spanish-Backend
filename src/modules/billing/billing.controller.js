const service = require('./billing.service');

exports.createInvoice = async (req, res) => {
  try {
    const { patient_id, doctor_id, items, invoice_date } = req.body;
    if (!patient_id || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }
    const invoiceId = await service.createInvoice(req.body);
    res.status(201).json({ success: true, message: 'Invoice created', id: invoiceId });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listInvoices = async (req, res) => {
  try {
    const { doctorId, patientId } = req.query;
    const invoices = await service.listInvoices(doctorId, patientId);
    res.json({ success: true, data: invoices });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await service.getInvoiceById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });
    res.json({ success: true, data: invoice });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getNcfSummary = async (req, res) => {
  try {
    const data = await service.getNcfSummary();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listPayments = async (req, res) => {
  try {
    const data = await service.listPayments();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createElectronicInvoice = async (req, res) => {
  try {
    const id = await service.createElectronicInvoice(req.body);
    res.status(201).json({ success: true, message: 'Electronic Invoice created', id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
