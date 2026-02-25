const service = require('./config.service');

exports.createService = async (req, res) => {
  try {
    const id = await service.createService(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateService = async (req, res) => {
  try {
    await service.updateService(req.params.id, req.body);
    res.json({ success: true, message: 'Servicio actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    await service.deleteService(req.params.id);
    res.json({ success: true, message: 'Servicio eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listServices = async (req, res) => {
  try {
    const data = await service.listServices();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Categories
exports.listServiceCategories = async (req, res) => {
  try {
    const data = await service.listServiceCategories();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createServiceCategory = async (req, res) => {
  try {
    const id = await service.createServiceCategory(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateServiceCategory = async (req, res) => {
  try {
    await service.updateServiceCategory(req.params.id, req.body);
    res.json({ success: true, message: 'Categoría actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteServiceCategory = async (req, res) => {
  try {
    await service.deleteServiceCategory(req.params.id);
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getFinancialConfig = async (req, res) => {
  try {
    const data = await service.getFinancialConfig();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateFinancialConfig = async (req, res) => {
  try {
    const { id } = req.params;
    await service.updateFinancialConfig(id, req.body);
    res.json({ success: true, message: 'Configuración financiera actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.getTaxConfig = async (req, res) => {
  try {
    const data = await service.getTaxConfig();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateTaxConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const logo_url = req.file ? `/uploads/config/${req.file.filename}` : req.body.logo_url;

    const updateData = {
      ...req.body,
      logo_url: logo_url
    };

    await service.updateTaxConfig(id, updateData);
    res.json({ success: true, message: 'Configuración actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.listCommissionRules = async (req, res) => {
  try {
    const data = await service.listCommissionRules();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createCommissionRule = async (req, res) => {
  try {
    const id = await service.createCommissionRule(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateCommissionRule = async (req, res) => {
  try {
    const { id } = req.params;
    await service.updateCommissionRule(id, req.body);
    res.json({ success: true, message: 'Regla actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Price Lists
exports.listPriceLists = async (req, res) => {
  try {
    const data = await service.listPriceLists();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createPriceList = async (req, res) => {
  try {
    const id = await service.createPriceList(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updatePriceList = async (req, res) => {
  try {
    await service.updatePriceList(req.params.id, req.body);
    res.json({ success: true, message: 'Tarifario actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deletePriceList = async (req, res) => {
  try {
    await service.deletePriceList(req.params.id);
    res.json({ success: true, message: 'Tarifario eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Suppliers
exports.listSuppliers = async (req, res) => {
  try {
    const data = await service.listSuppliers();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createSupplier = async (req, res) => {
  try {
    const id = await service.createSupplier(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateSupplier = async (req, res) => {
  try {
    await service.updateSupplier(req.params.id, req.body);
    res.json({ success: true, message: 'Proveedor actualizado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    await service.deleteSupplier(req.params.id);
    res.json({ success: true, message: 'Proveedor eliminado correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Expense Categories
exports.listExpenseCategories = async (req, res) => {
  try {
    const data = await service.listExpenseCategories();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createExpenseCategory = async (req, res) => {
  try {
    const id = await service.createExpenseCategory(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateExpenseCategory = async (req, res) => {
  try {
    await service.updateExpenseCategory(req.params.id, req.body);
    res.json({ success: true, message: 'Categoría actualizada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteExpenseCategory = async (req, res) => {
  try {
    await service.deleteExpenseCategory(req.params.id);
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

// Commission Rules
exports.listCommissionRules = async (req, res) => {
  try {
    const data = await service.listCommissionRules();
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.createCommissionRule = async (req, res) => {
  try {
    const id = await service.createCommissionRule(req.body);
    res.json({ success: true, id });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.updateCommissionRule = async (req, res) => {
  try {
    await service.updateCommissionRule(req.params.id, req.body);
    res.json({ success: true, message: 'Regla de comisión actualizada' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

exports.deleteCommissionRule = async (req, res) => {
  try {
    await service.deleteCommissionRule(req.params.id);
    res.json({ success: true, message: 'Regla de comisión eliminada' });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
