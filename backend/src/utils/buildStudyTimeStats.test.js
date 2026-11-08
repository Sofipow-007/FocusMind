const test = require('node:test');
const assert = require('node:assert/strict');

const { buildStudyTimeStats } = require('./buildStudyTimeStats');

function createSession(materiaId, materia, fecha, duracion, estado = 'completada') {
  return {
    duracion,
    estado,
    fecha: new Date(fecha),
    Subject: { id: materiaId, nombre: materia },
  };
}

test('mantiene totales históricos y agrupa por materia', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-11-03T09:00:00Z', 30),
    createSession(1, 'Matemática', '2026-11-04T09:00:00Z', 45),
    createSession(2, 'Física', '2026-10-25T09:00:00Z', 60),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T12:00:00Z'));

  assert.equal(stats.totalMinutos, 135);
  assert.equal(stats.totalSesiones, 3);
  assert.deepEqual(stats.porMateria, [
    { materiaId: 1, materia: 'Matemática', sesiones: 2, minutos: 75 },
    { materiaId: 2, materia: 'Física', sesiones: 1, minutos: 60 },
  ]);
});

test('calcula la semana de lunes a domingo UTC, con límites inclusivos', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-11-01T23:59:59Z', 10),
    createSession(1, 'Matemática', '2026-11-02T00:00:00Z', 20),
    createSession(2, 'Física', '2026-11-08T23:59:59Z', 30),
    createSession(2, 'Física', '2026-11-09T00:00:00Z', 40),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T12:00:00Z'));

  assert.deepEqual(stats.semanaActual, {
    inicio: '2026-11-02',
    fin: '2026-11-08',
    totalMinutos: 50,
    totalSesiones: 2,
    porMateria: [
      { materiaId: 1, materia: 'Matemática', sesiones: 1, minutos: 20 },
      { materiaId: 2, materia: 'Física', sesiones: 1, minutos: 30 },
    ],
  });
});

test('calcula el mes calendario actual UTC, con límites inclusivos', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-10-31T23:59:59Z', 10),
    createSession(1, 'Matemática', '2026-11-01T00:00:00Z', 20),
    createSession(1, 'Matemática', '2026-11-30T23:59:59Z', 30),
    createSession(1, 'Matemática', '2026-12-01T00:00:00Z', 40),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T12:00:00Z'));

  assert.equal(stats.mesActual.inicio, '2026-11-01');
  assert.equal(stats.mesActual.fin, '2026-11-30');
  assert.equal(stats.mesActual.totalMinutos, 50);
  assert.equal(stats.mesActual.totalSesiones, 2);
});

test('cuenta días únicos; la racha vigente puede anclarse hoy o ayer', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-11-03T08:00:00Z', 20),
    createSession(1, 'Matemática', '2026-11-04T08:00:00Z', 20),
    createSession(1, 'Matemática', '2026-11-05T08:00:00Z', 20),
    createSession(1, 'Matemática', '2026-11-06T08:00:00Z', 20),
    createSession(2, 'Física', '2026-11-06T18:00:00Z', 30),
    createSession(1, 'Matemática', '2026-11-08T08:00:00Z', 60),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T12:00:00Z'));

  assert.equal(stats.rachaDias, 4);
  assert.equal(stats.ultimoDiaEstudiado, '2026-11-06');
});

test('la racha se ancla en hoy cuando ya hubo estudio hoy', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-11-06T08:00:00Z', 20),
    createSession(1, 'Matemática', '2026-11-07T08:00:00Z', 20),
    createSession(2, 'Física', '2026-11-07T18:00:00Z', 30),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T20:00:00Z'));

  assert.equal(stats.rachaDias, 2);
  assert.equal(stats.ultimoDiaEstudiado, '2026-11-07');
});

test('racha vencida vale cero; sesiones planificadas y canceladas no cuentan', () => {
  const sessions = [
    createSession(1, 'Matemática', '2026-11-04T08:00:00Z', 30),
    createSession(1, 'Matemática', '2026-11-06T08:00:00Z', 45, 'planificada'),
    createSession(1, 'Matemática', '2026-11-07T08:00:00Z', 60, 'cancelada'),
    createSession(1, 'Matemática', '2026-11-08T08:00:00Z', 60, 'completada'),
  ];

  const stats = buildStudyTimeStats(sessions, new Date('2026-11-07T12:00:00Z'));

  assert.equal(stats.rachaDias, 0);
  assert.equal(stats.ultimoDiaEstudiado, '2026-11-04');
  assert.equal(stats.totalMinutos, 90);
});

test('devuelve ceros y períodos vacíos cuando no hay sesiones completadas', () => {
  const stats = buildStudyTimeStats([], new Date('2026-11-07T12:00:00Z'));

  assert.equal(stats.totalMinutos, 0);
  assert.equal(stats.totalSesiones, 0);
  assert.deepEqual(stats.porMateria, []);
  assert.equal(stats.semanaActual.totalMinutos, 0);
  assert.deepEqual(stats.semanaActual.porMateria, []);
  assert.equal(stats.mesActual.totalSesiones, 0);
  assert.equal(stats.rachaDias, 0);
  assert.equal(stats.ultimoDiaEstudiado, null);
});
