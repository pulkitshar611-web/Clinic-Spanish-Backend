const service = require('./ncf.service');

exports.listSequences = async (req, res) => {
  try {
    const data = await service.listSequences();
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

exports.requestSequence = async (req, res) => {
  try {
    const id = await service.requestSequence(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
