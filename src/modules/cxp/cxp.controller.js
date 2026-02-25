const service = require('./cxp.service');

exports.getSummary = async (req, res) => {
  try {
    const data = await service.getSummary();
    res.json({
      success: true,
      data
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    const data = await service.createInvoice(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPayment = async (req, res) => {
  try {
    const data = await service.createPayment(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listExpenseCategories = async (req, res) => {
  try {
    const data = await service.listExpenseCategories();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
