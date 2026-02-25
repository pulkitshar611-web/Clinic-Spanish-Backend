const service = require('./users.service');

exports.getProfile = async (req, res) => {
  try {
    const { userId, role } = req.query;
    const profile = await service.getProfile(userId, role);
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { userId, role } = req.body;
    await service.updateProfile(userId, role, req.body);
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    await service.updatePassword(userId, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!req.file) throw new Error('No file uploaded');

    const imageUrl = `/uploads/profiles/${req.file.filename}`;
    await service.updateProfileImage(userId, imageUrl);

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      imageUrl
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
