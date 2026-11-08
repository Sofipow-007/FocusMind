const { verifyToken } = require('../utils/jwt');
const envConfig = require('../config/env');
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

function authMiddleware(req, res, next) {
  const token = req.cookies?.[envConfig.cookieName];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    if (MUTATING_METHODS.has(req.method)) {
      const requestOrigin = req.get('origin');
      let isAllowedOrigin = false;
      try {
        isAllowedOrigin = new URL(requestOrigin).origin === new URL(envConfig.frontendUrl).origin;
      } catch {
        isAllowedOrigin = false;
      }

      if (!isAllowedOrigin) {
        return res.status(403).json({ message: 'Origen de solicitud no permitido' });
      }
    }
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
}

module.exports = {
  authMiddleware,
};
