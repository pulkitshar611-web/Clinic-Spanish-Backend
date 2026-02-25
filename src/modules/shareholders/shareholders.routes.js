const express = require('express');
const router = express.Router();
const controller = require('./shareholders.controller');

router.get('/', controller.listShareholders);
router.get('/summary', controller.getSummary);
router.post('/', controller.createShareholder);
router.post('/contribution', controller.createContribution);

module.exports = router;
