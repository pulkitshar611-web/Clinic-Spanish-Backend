const service = require('./auth.service');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await service.login(username, password);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const result = await service.register(req.body);
    res.json({
      success: true,
      message: 'User registered successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
