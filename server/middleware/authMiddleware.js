const { verify } = require('../utils/jwtUtil');

module.exports = function (req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    req.user = verify(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};