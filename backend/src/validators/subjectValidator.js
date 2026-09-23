const {
  isBoolean,
  isNonEmptyString,
  validateSchedule,
} = require('../utils/validation');

function validateSubjectInput({ nombre, favorita, prioritaria, diaEstudio, horaInicio, horaFin } = {}, isUpdate = false) {
  const scheduleError = validateSchedule({ diaEstudio, horaInicio, horaFin });

  if ((!isUpdate && !isNonEmptyString(nombre)) ||
    (isUpdate && nombre !== undefined && !isNonEmptyString(nombre)) ||
    (favorita !== undefined && !isBoolean(favorita)) ||
    (prioritaria !== undefined && !isBoolean(prioritaria)) ||
    scheduleError) {
    return scheduleError || 'Los datos de la materia no son válidos';
  }

  return null;
}

module.exports = { validateSubjectInput };
