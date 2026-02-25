const dashboardService = require('./dashboard.service');

exports.getGeneralStats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const stats = await dashboardService.getGeneralStats(doctorId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getServiceStats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const stats = await dashboardService.getServiceStats(doctorId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDoctorStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDoctorStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArsStats = async (req, res) => {
  try {
    const stats = await dashboardService.getArsStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOverdueStats = async (req, res) => {
  try {
    const stats = await dashboardService.getOverdueStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getIncomeExpenseStats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const stats = await dashboardService.getIncomeExpenseStats(doctorId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getServiceTrendStats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    const stats = await dashboardService.getServiceTrendStats(doctorId);
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOverdueList = async (req, res) => {
  try {
    const stats = await dashboardService.getOverdueList();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArsClaimStats = async (req, res) => {
  try {
    const stats = await dashboardService.getArsClaimStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getArsDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getArsDashboardStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
