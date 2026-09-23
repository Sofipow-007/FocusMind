const {
  SESSION_STATES,
  isNonEmptyString,
  isPositiveInteger,
  isValidDate,
} = require('../utils/validation');

function validateStudySessionInput({ materiaId, fecha, duracion, descripcion, estado } = {}, isUpdate = false) {
  if (!isUpdate && (!isPositiveInteger(materiaId) || !isValidDate(fecha) || !isPositiveInteger(duracion))) {
    return 'materiaId, fecha y duracion son obligatorios';
  }

  if ((isUpdate && fecha !== undefined && !isValidDate(fecha)) ||
    (isUpdate && duracion !== undefined && !isPositiveInteger(duracion)) ||
    (descripcion !== undefined && descripcion !== null && !isNonEmptyString(descripcion)) ||
    (estado !== undefined && !SESSION_STATES.includes(estado))) {
    return isUpdate ? 'Los datos de la sesión no son válidos' : 'materiaId, fecha y duracion son obligatorios';
  }

  return null;
}

module.exports = { validateStudySessionInput };
