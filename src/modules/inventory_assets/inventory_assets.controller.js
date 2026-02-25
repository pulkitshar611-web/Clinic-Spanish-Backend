const service = require('./inventory_assets.service');

exports.listInventory = async (req, res) => {
  try {
    const items = await service.listInventory();
    res.json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createInventoryItem = async (req, res) => {
  try {
    const id = await service.createInventoryItem(req.body);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateInventoryItem = async (req, res) => {
  try {
    const success = await service.updateInventoryItem(req.params.id, req.body);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteInventoryItem = async (req, res) => {
  try {
    const success = await service.deleteInventoryItem(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const success = await service.updateStock(req.params.id, req.body.quantity);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listFixedAssets = async (req, res) => {
  try {
    const assets = await service.listFixedAssets();
    res.json({ success: true, data: assets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createFixedAsset = async (req, res) => {
  try {
    const id = await service.createFixedAsset(req.body);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFixedAsset = async (req, res) => {
  try {
    const success = await service.updateFixedAsset(req.params.id, req.body);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFixedAsset = async (req, res) => {
  try {
    const success = await service.deleteFixedAsset(req.params.id);
    res.json({ success });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
