const express = require('express');
const router = express.Router();
const controller = require('./ncf.controller');

router.get('/list', controller.listSequences);
router.get('/summary', controller.getSummary);
router.post('/request', controller.requestSequence);

module.exports = router;
