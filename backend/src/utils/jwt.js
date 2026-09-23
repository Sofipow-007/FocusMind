const jwt = require('jsonwebtoken');
const envConfig = require('../config/env');

function signToken(payload) {
  return jwt.sign(payload, envConfig.jwtSecret, { expiresIn: envConfig.jwtExpiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, envConfig.jwtSecret);
}

module.exports = {
  signToken,
  verifyToken,
};
