const test = require('node:test');
const assert = require('node:assert/strict');

const {
  isNonEmptyString,
  isPositiveInteger,
  isValidId,
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
  assert.equal(isPositiveInteger(true), false);
  assert.equal(isPositiveInteger('1e2'), false);
  assert.equal(isValidId('42'), true);
  assert.equal(isValidId('0'), false);
  assert.equal(isValidId('1.5'), false);
  assert.equal(isValidDate('2030-06-15T09:00:00Z'), true);
  assert.equal(isValidDate('2030-06-15T09:00:00-03:00'), true);
  assert.equal(isValidDate('2030-02-30T09:00:00Z'), false);
  assert.equal(isValidDate('2030-06-15'), false);
  assert.equal(isValidDate('not-a-date'), false);
});

test('valida horarios y su orden', () => {
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '09:00', horaFin: '10:00' }), null);
  assert.equal(validateSchedule({ diaEstudio: 'otro', horaInicio: '09:00', horaFin: '10:00' }), 'El día de estudio no es válido');
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '11:00', horaFin: '10:00' }), 'La hora de inicio debe ser anterior a la hora de fin');
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '09:00' }), 'El día y las horas del bloque de estudio deben definirse juntos');
  assert.equal(validateSchedule({ diaEstudio: 'lunes', horaInicio: '09:00' }, { partial: true }), null);
});
