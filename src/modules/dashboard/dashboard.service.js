const db = require('../../config/db');
const queries = require('./dashboard.queries');

exports.getGeneralStats = async (doctorId = null) => {
  if (doctorId) {
    const [rows] = await db.query(queries.GET_DOCTOR_DASHBOARD_STATS, [doctorId, doctorId, doctorId, doctorId]);
    return {
      ...rows[0],
      total_doctors: 1 // For doctor view, it's just them
    };
  }
  const [rows] = await db.query(queries.GET_GENERAL_STATS);
  return rows[0];
};

exports.getServiceStats = async (doctorId = null) => {
  if (doctorId) {
    const [rows] = await db.query(queries.GET_DOCTOR_SERVICE_STATS, [doctorId]);
    return rows;
  }
  const [rows] = await db.query(queries.GET_SERVICE_STATS);
  return rows;
};

exports.getDoctorStats = async () => {
  const [rows] = await db.query(queries.GET_DOCTOR_STATS);
  return rows;
};

exports.getArsStats = async () => {
  const [rows] = await db.query(queries.GET_ARS_STATS);
  return rows;
};

exports.getOverdueStats = async () => {
  const [rows] = await db.query(queries.GET_OVERDUE_STATS);
  return rows[0];
};

exports.getIncomeExpenseStats = async (doctorId = null) => {
  const [rows] = await db.query(queries.GET_INCOME_EXPENSE_STATS, [doctorId, doctorId, doctorId, doctorId]);
  const spanishMonths = {
    'Jan': 'Ene', 'Feb': 'Feb', 'Mar': 'Mar', 'Apr': 'Abr', 'May': 'May', 'Jun': 'Jun',
    'Jul': 'Jul', 'Aug': 'Ago', 'Sep': 'Sep', 'Oct': 'Oct', 'Nov': 'Nov', 'Dec': 'Dic'
  };
  return rows.map(r => ({
    ...r,
    name: spanishMonths[r.name] || r.name,
    ingresos: parseFloat(r.ingresos),
    gastos: parseFloat(r.gastos)
  }));
};

exports.getServiceTrendStats = async (doctorId = null) => {
  const [rows] = await db.query(queries.GET_SERVICE_TREND_STATS, [doctorId, doctorId]);
  const spanishDays = {
    'Mon': 'Lun', 'Tue': 'Mar', 'Wed': 'Mie', 'Thu': 'Jue', 'Fri': 'Vie', 'Sat': 'Sab', 'Sun': 'Dom'
  };

  const grouped = {};
  const order = []; // to keep order

  rows.forEach(row => {
    const dayName = spanishDays[row.name] || row.name;
    if (!grouped[dayName]) {
      grouped[dayName] = { name: dayName };
      order.push(dayName);
    }
    const category = row.category || 'Otros';
    grouped[dayName][category] = (grouped[dayName][category] || 0) + row.count;
  });

  return order.map(day => grouped[day]);
};

exports.getOverdueList = async () => {
  const [rows] = await db.query(queries.GET_OVERDUE_LIST);
  return rows;
};

exports.getArsClaimStats = async () => {
  const [rows] = await db.query(queries.GET_ARS_CLAIM_STATS);
  // Returns { name: 'Humano', Aprobado: 85, Rechazado: 15 }
  return rows;
};

exports.getArsDashboardStats = async () => {
  const [rows] = await db.query(queries.GET_ARS_DASHBOARD_STATS);
  const trend = await exports.getArsFinancialTrend();
  return {
    ...rows[0],
    trend
  };
};

exports.getArsFinancialTrend = async () => {
  const [rows] = await db.query(queries.GET_ARS_FINANCIAL_TREND);
  return rows;
};
