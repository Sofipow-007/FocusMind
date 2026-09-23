const VALID_DAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const SESSION_STATES = ['planificada', 'completada', 'cancelada'];
const NOTE_TYPES = ['definicion', 'consulta', 'apunte'];
const NOTE_ORIGINS = ['usuario', 'IA'];
const NOTE_STATES = ['pendiente', 'respondida'];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPositiveInteger(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

function isValidDate(value) {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isValidTime(value) {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
}

function validateSchedule({ diaEstudio, horaInicio, horaFin }) {
  if (diaEstudio !== undefined && diaEstudio !== null && !VALID_DAYS.includes(diaEstudio)) {
    return 'El día de estudio no es válido';
  }

  if (horaInicio !== undefined && horaInicio !== null && !isValidTime(horaInicio)) {
    return 'La hora de inicio no es válida';
  }

  if (horaFin !== undefined && horaFin !== null && !isValidTime(horaFin)) {
    return 'La hora de fin no es válida';
  }

  if (horaInicio && horaFin && horaInicio >= horaFin) {
    return 'La hora de inicio debe ser anterior a la hora de fin';
  }

  return null;
}

module.exports = {
  VALID_DAYS,
  SESSION_STATES,
  NOTE_TYPES,
  NOTE_ORIGINS,
  NOTE_STATES,
  isNonEmptyString,
  isValidEmail,
  isPositiveInteger,
  isValidDate,
  isBoolean,
  validateSchedule,
};
