const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // For now, simpler implementation or verify generic token
  // In production, verify actual Bearer token
  // const authHeader = req.headers['authorization'];
  // const token = authHeader && authHeader.split(' ')[1];

  // if (!token) {
  //     return res.status(401).json({ success: false, message: 'Access denied' });
  // }

  // try {
  //     const verified = jwt.verify(token, process.env.JWT_SECRET || 'secret');
  //     req.user = verified;
  //     next();
  // } catch (err) {
  //     res.status(400).json({ success: false, message: 'Invalid Token' });
  // }

  // For development/demo without frontend login flow implemented yet:
  next();
};

module.exports = verifyToken;
