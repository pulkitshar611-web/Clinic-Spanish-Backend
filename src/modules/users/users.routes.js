const express = require('express');
const router = express.Router();
const controller = require('./users.controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads/profiles';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

router.get('/profile', controller.getProfile);
router.put('/profile/update', controller.updateProfile);
router.put('/profile/password', controller.updatePassword);
router.post('/profile/image', upload.single('image'), controller.updateProfileImage);

module.exports = router;
