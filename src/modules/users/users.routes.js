const express = require('express');
const router = express.Router();
const controller = require('./users.controller');

router.get('/profile', controller.getProfile);
router.put('/profile/update', controller.updateProfile);
router.put('/profile/password', controller.updatePassword);

module.exports = router;
