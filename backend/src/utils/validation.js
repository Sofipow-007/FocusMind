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
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0;
  }

  return typeof value === 'string' &&
    /^[1-9]\d*$/.test(value) &&
    Number.isSafeInteger(Number(value));
}

function isValidId(value) {
  return isPositiveInteger(value);
}

function isValidDate(value) {
  if (typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-](?:0\d|1\d|2[0-3]):[0-5]\d)$/.test(value) ||
    Number.isNaN(Date.parse(value))) {
    return false;
  }

  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
}

function isBoolean(value) {
  return typeof value === 'boolean';
}

function isValidTime(value) {
  return typeof value === 'string' && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);
}

function validateSchedule({ diaEstudio, horaInicio, horaFin }, { partial = false } = {}) {
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

  if (!partial) {
    const scheduleValues = [diaEstudio, horaInicio, horaFin];
    const hasSchedule = scheduleValues.some((value) => value !== undefined && value !== null && value !== '');
    const hasCompleteSchedule = scheduleValues.every((value) => value !== undefined && value !== null && value !== '');
    if (hasSchedule && !hasCompleteSchedule) {
      return 'El día y las horas del bloque de estudio deben definirse juntos';
    }
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
  isValidId,
  isValidDate,
  isBoolean,
  validateSchedule,
};
