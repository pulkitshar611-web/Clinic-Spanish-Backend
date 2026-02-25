const service = require('./shareholders.service');

exports.listShareholders = async (req, res) => {
  try {
    const data = await service.listShareholders();
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

exports.createShareholder = async (req, res) => {
  try {
    const id = await service.createShareholder(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createContribution = async (req, res) => {
  try {
    const id = await service.createContribution(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
