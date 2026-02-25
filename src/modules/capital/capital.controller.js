const capitalService = require('./capital.service');

const listShareholders = async (req, res) => {
  try {
    const shareholders = await capitalService.listShareholders();
    res.json({ success: true, data: shareholders });
  } catch (error) {
    console.error('Error listing shareholders:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const getSummary = async (req, res) => {
  try {
    const summary = await capitalService.getSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error getting capital summary:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createShareholder = async (req, res) => {
  try {
    const id = await capitalService.createShareholder(req.body);
    res.json({ success: true, data: { id }, message: 'Shareholder created successfuly' });
  } catch (error) {
    console.error('Error creating shareholder:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const updateShareholder = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.updateShareholder(id, req.body);
    res.json({ success: true, message: 'Shareholder updated successfully' });
  } catch (error) {
    console.error('Error updating shareholder:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteShareholder = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.deleteShareholder(id);
    res.json({ success: true, message: 'Shareholder deleted successfully' });
  } catch (error) {
    console.error('Error deleting shareholder:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createContribution = async (req, res) => {
  try {
    const id = await capitalService.createContribution(req.body);
    res.json({ success: true, data: { id }, message: 'Contribution registered successfully' });
  } catch (error) {
    console.error('Error creating contribution:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// CXP Controllers
const getCxpSummary = async (req, res) => {
  try {
    const summary = await capitalService.getCxpSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error getting CXP summary:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createCxp = async (req, res) => {
  try {
    const id = await capitalService.createCxp(req.body);
    res.json({ success: true, data: { id }, message: 'Accounts payable registered successfully' });
  } catch (error) {
    console.error('Error creating CXP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const updateCxp = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.updateCxp(id, req.body);
    res.json({ success: true, message: 'Accounts payable updated successfully' });
  } catch (error) {
    console.error('Error updating CXP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteCxp = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.deleteCxp(id);
    res.json({ success: true, message: 'Accounts payable deleted successfully' });
  } catch (error) {
    console.error('Error deleting CXP:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

// MOVEMENTS Controllers
const listMovements = async (req, res) => {
  try {
    const movements = await capitalService.listMovements();
    res.json({ success: true, data: movements });
  } catch (error) {
    console.error('Error listing movements:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const createMovement = async (req, res) => {
  try {
    const id = await capitalService.createMovement(req.body);
    res.json({ success: true, data: { id }, message: 'Movement registered successfully' });
  } catch (error) {
    console.error('Error creating movement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const deleteMovement = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.deleteMovement(id);
    res.json({ success: true, message: 'Movement deleted successfully' });
  } catch (error) {
    console.error('Error deleting movement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

const updateMovement = async (req, res) => {
  try {
    const { id } = req.params;
    await capitalService.updateMovement(id, req.body);
    res.json({ success: true, message: 'Movement updated successfully' });
  } catch (error) {
    console.error('Error updating movement:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = {
  listShareholders,
  getSummary,
  createShareholder,
  updateShareholder,
  deleteShareholder,
  createContribution,
  getCxpSummary,
  createCxp,
  updateCxp,
  deleteCxp,
  listMovements,
  createMovement,
  deleteMovement,
  updateMovement
};
