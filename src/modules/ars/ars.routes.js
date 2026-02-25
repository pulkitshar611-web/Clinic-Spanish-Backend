const express = require('express');
const router = express.Router();
const controller = require('./ars.controller');

router.post('/create', controller.createArs);
router.put('/:id', controller.updateArs);
router.delete('/:id', controller.deleteArs);
router.get('/list', controller.listArs);
router.get('/summary', controller.getSummary);
router.get('/statements', controller.getStatements);
router.get('/movements/:id', controller.getMovements);
router.get('/report', controller.getReportData);
router.get('/rates/:id', controller.getRates);
router.get('/contacts/:id', controller.getContacts);

module.exports = router;
