const service = require('./cxc.service');

exports.getSummary = async (req, res) => {
  try {
    const data = await service.getSummary();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listInvoices = async (req, res) => {
  try {
    const data = await service.listInvoices();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const data = await service.recordPayment(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
