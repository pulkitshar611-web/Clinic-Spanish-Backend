const db = require('../../config/db');
const queries = require('./reports.queries');

const getBillingReport = async (range) => {
  try {
    const [summaryResult] = await db.query(queries.GET_BILLING_SUMMARY);
    const summary = summaryResult[0] || { total_billed: 0, total_collected: 0 };

    const [trendResult] = await db.query(queries.GET_BILLING_TREND);

    let finalTrend = trendResult;
    if (!finalTrend || finalTrend.length === 0) {
      const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const currentMonth = new Date().getMonth();
      finalTrend = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        finalTrend.push({
          month: months[d.getMonth()],
          billed: 0,
          collected: 0
        });
      }
    }

    return {
      summary: {
        total_billed: summary.total_billed || 0,
        total_collected: summary.total_collected || 0
      },
      trend: finalTrend
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getCashFlowReport = async () => {
  try {
    const [summaryResult] = await db.query(queries.GET_CASHFLOW_SUMMARY);
    const summary = summaryResult[0];

    const [trend] = await db.query(queries.GET_CASHFLOW_DAILY_TREND);

    const saldo_actual = summary.total_incomes - summary.total_expenses;
    const neto_mensual = summary.incomes_month - summary.expenses_month;

    return {
      summary: {
        current_balance: saldo_actual,
        monthly_incomes: summary.incomes_month,
        monthly_expenses: summary.expenses_month,
        monthly_net: neto_mensual
      },
      trend: trend.map(t => ({
        ...t,
        net: t.income - t.expense
      }))
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getCxcReport = async () => {
  try {
    const [kpiRows] = await db.query(queries.GET_CXC_REPORT_KPI);
    const [list] = await db.query(queries.GET_CXC_REPORT_LIST);

    return {
      summary: kpiRows[0],
      list: list
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getOverdueReport = async () => {
  try {
    const [kpiRows] = await db.query(queries.GET_OVERDUE_KPI);
    const [list] = await db.query(queries.GET_OVERDUE_LIST);

    return {
      summary: kpiRows[0],
      list: list
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getCxpReport = async () => {
  try {
    const [kpiRows] = await db.query(queries.GET_CXP_REPORT_KPI);
    const [list] = await db.query(queries.GET_CXP_REPORT_LIST);

    return {
      summary: kpiRows[0],
      list: list
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getIncomeExpenseReport = async () => {
  try {
    const [summaryRows] = await db.query(queries.GET_INCOME_EXPENSE_SUMMARY);
    const [monthlyComparison] = await db.query(queries.GET_MONTHLY_COMPARISON);
    const [expensesByCategory] = await db.query(queries.GET_EXPENSES_BY_CATEGORY);

    return {
      summary: summaryRows[0],
      monthlyComparison,
      expensesByCategory
    };
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getServiceProfitability = async () => {
  try {
    const [rows] = await db.query(queries.GET_SERVICE_PROFITABILITY);

    // Calculate margins based on some mock logic since we don't have real cost per service
    return rows.map(r => ({
      ...r,
      margin: r.revenue > 100000 ? 55 : r.revenue > 50000 ? 45 : 30 // Mocked for UI
    }));
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getDoctorProfitability = async () => {
  try {
    const [rows] = await db.query(queries.GET_DOCTOR_PROFITABILITY);
    return rows;
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
  }
};

const getArsReport = async () => {
  try {
    const [rows] = await db.query(queries.GET_ARS_DISTRIBUTION);
    return rows;
  } catch (error) {
    console.error('Service Error:', error);
    throw error;
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
  getArsReport
};
