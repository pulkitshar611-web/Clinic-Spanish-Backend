const service = require('./caja.service');

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

exports.getMovements = async (req, res) => {
  try {
    const data = await service.getMovements(req.query);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getCashFlow = async (req, res) => {
  try {
    const data = await service.getCashFlow(req.query);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getBankReconciliation = async (req, res) => {
  try {
    const data = await service.getBankReconciliation();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateReconciliationStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const data = await service.updateReconciliationStatus(id, status);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createMovement = async (req, res) => {
  try {
    const data = await service.createMovement(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
