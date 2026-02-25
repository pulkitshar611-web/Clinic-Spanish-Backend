const express = require('express');
const router = express.Router();
const controller = require('./cxc.controller');

router.get('/summary', controller.getSummary);
router.get('/list', controller.listInvoices);
router.post('/payments', controller.recordPayment);

module.exports = router;
