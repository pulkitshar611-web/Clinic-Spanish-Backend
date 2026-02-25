const express = require('express');
const router = express.Router();
const controller = require('./config.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/config';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `logo-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

// Services
router.post('/services/create', controller.createService);
router.put('/services/:id', controller.updateService);
router.delete('/services/:id', controller.deleteService);
router.get('/services/list', controller.listServices);

// Service Categories
router.get('/categories/list', controller.listServiceCategories);
router.post('/categories/create', controller.createServiceCategory);
router.put('/categories/:id', controller.updateServiceCategory);
router.delete('/categories/:id', controller.deleteServiceCategory);

// Financial Config
router.get('/financial-config', controller.getFinancialConfig);
router.put('/financial-config/:id', controller.updateFinancialConfig);

// Tax Config
router.get('/tax-config', controller.getTaxConfig);
router.put('/tax-config/:id', upload.single('logo'), controller.updateTaxConfig);

// Commissions
router.get('/commissions/list', controller.listCommissionRules);
router.post('/commissions/create', controller.createCommissionRule);
router.put('/commissions/:id', controller.updateCommissionRule);

// Price Lists
router.get('/price-lists/list', controller.listPriceLists);
router.post('/price-lists/create', controller.createPriceList);
router.put('/price-lists/:id', controller.updatePriceList);
router.delete('/price-lists/:id', controller.deletePriceList);

// Suppliers
router.get('/suppliers/list', controller.listSuppliers);
router.post('/suppliers/create', controller.createSupplier);
router.put('/suppliers/:id', controller.updateSupplier);
router.delete('/suppliers/:id', controller.deleteSupplier);

// Expense Categories
router.get('/expense-categories/list', controller.listExpenseCategories);
router.post('/expense-categories/create', controller.createExpenseCategory);
router.put('/expense-categories/:id', controller.updateExpenseCategory);
router.delete('/expense-categories/:id', controller.deleteExpenseCategory);

// Commission Rules
router.get('/commission-rules/list', controller.listCommissionRules);
router.post('/commission-rules/create', controller.createCommissionRule);
router.put('/commission-rules/:id', controller.updateCommissionRule);
router.delete('/commission-rules/:id', controller.deleteCommissionRule);

module.exports = router;
