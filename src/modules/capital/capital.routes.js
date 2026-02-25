const express = require('express');
const router = express.Router();
const capitalController = require('./capital.controller');

router.get('/shareholders', capitalController.listShareholders);
router.get('/summary', capitalController.getSummary);
router.post('/shareholders', capitalController.createShareholder);
router.put('/shareholders/:id', capitalController.updateShareholder);
router.delete('/shareholders/:id', capitalController.deleteShareholder);
router.post('/contributions', capitalController.createContribution);

// CXP Routes
router.get('/cxp', capitalController.getCxpSummary);
router.post('/cxp', capitalController.createCxp);
router.put('/cxp/:id', capitalController.updateCxp);
router.delete('/cxp/:id', capitalController.deleteCxp);

// Movements Routes
router.get('/movements', capitalController.listMovements);
router.post('/movements', capitalController.createMovement);
router.put('/movements/:id', capitalController.updateMovement);
router.delete('/movements/:id', capitalController.deleteMovement);

module.exports = router;
