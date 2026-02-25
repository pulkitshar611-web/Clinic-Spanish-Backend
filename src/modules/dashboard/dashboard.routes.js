const express = require('express');
const router = express.Router();
const dashboardController = require('./dashboard.controller');

router.get('/general', dashboardController.getGeneralStats);
router.get('/servicios', dashboardController.getServiceStats);
router.get('/medicos', dashboardController.getDoctorStats);
router.get('/ars', dashboardController.getArsStats);
router.get('/morosidad', dashboardController.getOverdueStats);
router.get('/ingresos-gastos', dashboardController.getIncomeExpenseStats);
router.get('/demanda-servicios', dashboardController.getServiceTrendStats);
router.get('/morosidad-lista', dashboardController.getOverdueList);
router.get('/ars-claims', dashboardController.getArsClaimStats);
router.get('/ars-dashboard', dashboardController.getArsDashboardStats);

module.exports = router;
