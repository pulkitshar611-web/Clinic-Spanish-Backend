const express = require('express');
const router = express.Router();
const controller = require('./billing.controller');

router.post('/invoices/create', controller.createInvoice);
router.post('/invoices/electronica/create', controller.createElectronicInvoice);
router.get('/invoices/list', controller.listInvoices);
router.get('/invoices/ncf-summary', controller.getNcfSummary);
router.get('/invoices/payments', controller.listPayments);
router.get('/invoices/:id', controller.getInvoiceById);

module.exports = router;
