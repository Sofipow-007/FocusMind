const { verifyToken } = require('../utils/jwt');
const envConfig = require('../config/env');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = req.cookies?.[envConfig.cookieName] || (
    authHeader?.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : null
  );

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = {
  authMiddleware,
};
