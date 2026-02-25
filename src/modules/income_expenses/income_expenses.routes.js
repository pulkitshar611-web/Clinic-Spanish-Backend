const express = require('express');
const router = express.Router();
const controller = require('./income_expenses.controller');

router.get('/income/summary', controller.getIncomeSummary);
router.get('/expense/summary', controller.getExpenseSummary);
router.post('/income', controller.createIncome);
router.post('/expense', controller.createExpense);
router.get('/categories', controller.listCategories);
router.get('/service-categories', controller.listServiceCategories);
router.post('/categories', controller.createCategory);
router.delete('/categories/:id', controller.deleteCategory);

module.exports = router;
