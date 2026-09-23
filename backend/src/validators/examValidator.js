const {
  isNonEmptyString,
  isPositiveInteger,
  isValidDate,
} = require('../utils/validation');

function validateExamInput({ materiaId, titulo, fecha, descripcion } = {}, isUpdate = false) {
  if (!isUpdate && (!isPositiveInteger(materiaId) || !isNonEmptyString(titulo) || !isValidDate(fecha))) {
    return 'materiaId, titulo y fecha son obligatorios';
  }

  if ((isUpdate && titulo !== undefined && !isNonEmptyString(titulo)) ||
    (isUpdate && fecha !== undefined && !isValidDate(fecha)) ||
    (descripcion !== undefined && descripcion !== null && !isNonEmptyString(descripcion))) {
    return isUpdate ? 'Los datos del examen no son válidos' : 'materiaId, titulo y fecha son obligatorios';
  }

  return null;
}

module.exports = { validateExamInput };
