const { isNonEmptyString, isValidEmail } = require('../utils/validation');

function validateRegisterInput({ nombre, email, password } = {}) {
  if (!isNonEmptyString(nombre) || !isValidEmail(email) || !isNonEmptyString(password)) {
    return 'Nombre, email y password son obligatorios';
  }

  return null;
}

function validateLoginInput({ email, password } = {}) {
  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    return 'Email y password son obligatorios';
  }

  return null;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
