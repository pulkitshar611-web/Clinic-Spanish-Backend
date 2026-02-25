const express = require('express');
const router = express.Router();
const controller = require('./cxp.controller');

router.get('/summary', controller.getSummary);
router.get('/categories', controller.listExpenseCategories);
router.post('/invoices', controller.createInvoice);
router.post('/payments', controller.createPayment);

module.exports = router;
