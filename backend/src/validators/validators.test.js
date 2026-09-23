const test = require('node:test');
const assert = require('node:assert/strict');

const { validateRegisterInput, validateLoginInput } = require('./authValidator');
const { validateSubjectInput } = require('./subjectValidator');
const { validateStudySessionInput } = require('./studySessionValidator');
const { validateNoteInput, validateNoteUpdateInput } = require('./noteValidator');
const { validateExamInput } = require('./examValidator');

test('valida payloads de autenticación por dominio', () => {
  assert.equal(validateRegisterInput({ nombre: 'Ana', email: 'ana@example.com', password: 'secret' }), null);
  assert.equal(validateRegisterInput({ nombre: '', email: 'ana@example.com', password: 'secret' }), 'Nombre, email y password son obligatorios');
  assert.equal(validateLoginInput({ email: 'ana@example.com', password: 'secret' }), null);
  assert.equal(validateLoginInput({ email: 'invalid', password: 'secret' }), 'Email y password son obligatorios');
});

test('valida payloads de materia, sesión y examen', () => {
  assert.equal(validateSubjectInput({ nombre: 'Matemática', favorita: true }), null);
  assert.equal(validateSubjectInput({ nombre: 'Matemática', horaInicio: '10:00', horaFin: '09:00' }), 'La hora de inicio debe ser anterior a la hora de fin');
  assert.equal(validateStudySessionInput({ materiaId: 1, fecha: '2030-01-01T10:00:00Z', duracion: 45 }), null);
  assert.equal(validateStudySessionInput({ materiaId: 1, fecha: 'invalid', duracion: 45 }), 'materiaId, fecha y duracion son obligatorios');
  assert.equal(validateExamInput({ materiaId: 1, titulo: 'Parcial', fecha: '2030-01-01T10:00:00Z' }), null);
});

test('aplica las reglas de tipo y estado de notas', () => {
  assert.equal(validateNoteInput({ materiaId: 1, tipo: 'consulta', contenido: 'Pregunta' }), null);
  assert.equal(validateNoteInput({ materiaId: 1, tipo: 'apunte', contenido: 'Texto', estado: 'pendiente' }), 'materiaId, tipo y contenido son obligatorios');
  assert.equal(validateNoteUpdateInput({ contenido: 'Respuesta', estado: 'respondida' }), null);
});
