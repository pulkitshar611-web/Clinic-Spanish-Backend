const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');

router.get('/billing', reportsController.getBillingReport);
router.get('/cashflow', reportsController.getCashFlowReport);
router.get('/cxc', reportsController.getCxcReport);
router.get('/overdue', reportsController.getOverdueReport);
router.get('/cxp', reportsController.getCxpReport);
router.get('/income-expense', reportsController.getIncomeExpenseReport);
router.get('/service-profitability', reportsController.getServiceProfitability);
router.get('/doctor-profitability', reportsController.getDoctorProfitability);
router.get('/ars', reportsController.getArsReport);
router.post('/legal-action', reportsController.initiateLegalAction);

module.exports = router;
