const {
  NOTE_ORIGINS,
  NOTE_STATES,
  NOTE_TYPES,
  isNonEmptyString,
  isPositiveInteger,
} = require('../utils/validation');

function validateNoteInput({ materiaId, tipo, contenido, origen, estado } = {}) {
  if (!isPositiveInteger(materiaId) || !NOTE_TYPES.includes(tipo) || !isNonEmptyString(contenido) ||
    (origen !== undefined && !NOTE_ORIGINS.includes(origen)) ||
    (estado !== undefined && !NOTE_STATES.includes(estado)) ||
    (tipo !== 'consulta' && estado !== undefined)) {
    return 'materiaId, tipo y contenido son obligatorios';
  }

  return null;
}

function validateNoteUpdateInput({ contenido, estado } = {}) {
  if ((contenido !== undefined && !isNonEmptyString(contenido)) ||
    (estado !== undefined && !NOTE_STATES.includes(estado))) {
    return 'Los datos de la nota no son válidos';
  }

  return null;
}

module.exports = { validateNoteInput, validateNoteUpdateInput };
