const service = require('./ars.service');

exports.createArs = async (req, res) => {
  try {
    const id = await service.createArs(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateArs = async (req, res) => {
  try {
    const success = await service.updateArs(req.params.id, req.body);
    res.json({ success });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteArs = async (req, res) => {
  try {
    const success = await service.deleteArs(req.params.id);
    res.json({ success });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listArs = async (req, res) => {
  try {
    const data = await service.listArs();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const data = await service.getSummary();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getStatements = async (req, res) => {
  try {
    const data = await service.getStatements();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getMovements = async (req, res) => {
  try {
    const data = await service.getMovements(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getRates = async (req, res) => {
  try {
    const data = await service.getRates(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getContacts = async (req, res) => {
  try {
    const data = await service.getContacts(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
exports.getReportData = async (req, res) => {
  try {
    const data = await service.getReportData();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
