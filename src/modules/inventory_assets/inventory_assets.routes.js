const express = require('express');
const router = express.Router();
const controller = require('./inventory_assets.controller');

router.get('/inventory/list', controller.listInventory);
router.post('/inventory/create', controller.createInventoryItem);
router.put('/inventory/update/:id', controller.updateInventoryItem);
router.delete('/inventory/delete/:id', controller.deleteInventoryItem);
router.post('/inventory/update-stock/:id', controller.updateStock);

router.get('/assets/list', controller.listFixedAssets);
router.post('/assets/create', controller.createFixedAsset);
router.put('/assets/update/:id', controller.updateFixedAsset);
router.delete('/assets/delete/:id', controller.deleteFixedAsset);

module.exports = router;
