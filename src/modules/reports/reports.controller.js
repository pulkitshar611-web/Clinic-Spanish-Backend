const reportsService = require('./reports.service');

const getBillingReport = async (req, res) => {
  try {
    const { range } = req.query;
    const data = await reportsService.getBillingReport(range);
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching billing report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCashFlowReport = async (req, res) => {
  try {
    const data = await reportsService.getCashFlowReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching cash flow report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCxcReport = async (req, res) => {
  try {
    const data = await reportsService.getCxcReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CxC report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getOverdueReport = async (req, res) => {
  try {
    const data = await reportsService.getOverdueReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching overdue report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCxpReport = async (req, res) => {
  try {
    const data = await reportsService.getCxpReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching CxP report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getIncomeExpenseReport = async (req, res) => {
  try {
    const data = await reportsService.getIncomeExpenseReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Income/Expense report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getServiceProfitability = async (req, res) => {
  try {
    const data = await reportsService.getServiceProfitability();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Service Profitability report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDoctorProfitability = async (req, res) => {
  try {
    const data = await reportsService.getDoctorProfitability();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching Doctor Profitability report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getArsReport = async (req, res) => {
  try {
    const data = await reportsService.getArsReport();
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching ARS report:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const initiateLegalAction = async (req, res) => {
  try {
    const { instructions, cases, totalAmount } = req.body;
    // For now, we just log it and return success. 
    // In a real scenario, this would create a record in a legal_actions table.
    console.log('Initiating Legal Action:', { instructions, cases, totalAmount });

    res.json({
      success: true,
      message: 'Proceso legal iniciado correctamente',
      actionId: Math.floor(Math.random() * 1000) // Mock ID
    });
  } catch (error) {
    console.error('Error initiating legal action:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getBillingReport,
  getCashFlowReport,
  getCxcReport,
  getOverdueReport,
  getCxpReport,
  getIncomeExpenseReport,
  getServiceProfitability,
  getDoctorProfitability,
  getArsReport,
  initiateLegalAction
};
