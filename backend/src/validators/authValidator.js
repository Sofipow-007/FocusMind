const { isNonEmptyString, isValidEmail } = require('../utils/validation');
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72;

function isValidPassword(value, { requireMinimum = false } = {}) {
  return isNonEmptyString(value) &&
    Buffer.byteLength(value, 'utf8') <= MAX_PASSWORD_BYTES &&
    (!requireMinimum || Array.from(value).length >= MIN_PASSWORD_LENGTH);
}

function validateRegisterInput({ nombre, email, password } = {}) {
  if (!isNonEmptyString(nombre) || !isValidEmail(email)) return 'Nombre y email son obligatorios';
  if (!isValidPassword(password, { requireMinimum: true })) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres y no más de ${MAX_PASSWORD_BYTES} bytes`;
  }

  return null;
}

function validateLoginInput({ email, password } = {}) {
  if (!isValidEmail(email) || !isValidPassword(password)) {
    return `Email válido y contraseña de hasta ${MAX_PASSWORD_BYTES} bytes son obligatorios`;
  }

  return null;
}

module.exports = {
  isValidPassword,
  validateRegisterInput,
  validateLoginInput,
};
