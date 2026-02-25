const express = require('express');
const router = express.Router();
const controller = require('./caja.controller');

router.get('/summary', controller.getSummary);
router.get('/movements', controller.getMovements);
router.get('/cash-flow', controller.getCashFlow);
router.get('/reconciliation', controller.getBankReconciliation);
router.put('/reconciliation/status', controller.updateReconciliationStatus);
router.post('/movements', controller.createMovement);

module.exports = router;
