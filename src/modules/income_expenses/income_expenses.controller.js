const service = require('./income_expenses.service');

exports.getIncomeSummary = async (req, res) => {
  try {
    const data = await service.getIncomeSummary();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getExpenseSummary = async (req, res) => {
  try {
    const isPrepaid = req.query.prepaid === 'true' ? 1 : 0;
    const data = await service.getExpenseSummary(isPrepaid);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createIncome = async (req, res) => {
  try {
    const data = await service.createDirectIncome(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createExpense = async (req, res) => {
  try {
    const data = await service.createDirectExpense(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listCategories = async (req, res) => {
  try {
    const data = await service.listCategories();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listServiceCategories = async (req, res) => {
  try {
    const data = await service.listServiceCategories();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const data = await service.createCategory(req.body);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const data = await service.deleteCategory(req.params.id);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
