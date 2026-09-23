const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isNonEmptyString,
  isPositiveInteger,
  isValidDate,
  isValidEmail,
  validateSchedule,
} = require('./validation');

test('valida emails y textos no vacíos', () => {
  assert.equal(isValidEmail('student@example.com'), true);
  assert.equal(isValidEmail('invalid-email'), false);
  assert.equal(isNonEmptyString(' Matemática '), true);
  assert.equal(isNonEmptyString('   '), false);
});

test('valida enteros positivos y fechas', () => {
  assert.equal(isPositiveInteger(60), true);
  assert.equal(isPositiveInteger(0), false);
  assert.equal(isPositiveInteger('60'), true);
  assert.equal(isValidDate('2030-06-15T09:00:00Z'), true);
  assert.equal(isValidDate('not-a-date'), false);
});

test('valida horarios y su orden', () => {
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '09:00', horaFin: '10:00' }), null);
  assert.equal(validateSchedule({ diaEstudio: 'otro', horaInicio: '09:00', horaFin: '10:00' }), 'El día de estudio no es válido');
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '11:00', horaFin: '10:00' }), 'La hora de inicio debe ser anterior a la hora de fin');
});
