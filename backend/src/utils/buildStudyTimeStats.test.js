const test = require('node:test');
const assert = require('node:assert/strict');

const { buildStudyTimeStats } = require('./buildStudyTimeStats');

function createSession(materiaId, materia, duracion) {
  return {
    duracion,
    Subject: { id: materiaId, nombre: materia },
  };
}

test('agrega correctamente minutos totales y desglose por materia', () => {
  // Valida el caso feliz: varias sesiones completadas en distintas materias deben
  // sumarse en totalMinutos y agruparse correctamente en porMateria.
  const sessions = [
    createSession(1, 'Matemática', 30),
    createSession(1, 'Matemática', 45),
    createSession(2, 'Física', 60),
  ];

  const stats = buildStudyTimeStats(sessions);

  assert.equal(stats.totalMinutos, 135);
  assert.equal(stats.totalSesiones, 3);
  assert.equal(stats.porMateria.length, 2);
  assert.deepEqual(stats.porMateria, [
    { materiaId: 1, materia: 'Matemática', sesiones: 2, minutos: 75 },
    { materiaId: 2, materia: 'Física', sesiones: 1, minutos: 60 },
  ]);
});

test('devuelve totales en cero y porMateria vacío sin sesiones completadas', () => {
  // Valida el caso límite: un usuario sin sesiones completadas debe recibir ceros
  // y un arreglo vacío, sin lanzar errores ni valores undefined.
  const stats = buildStudyTimeStats([]);

  assert.equal(stats.totalMinutos, 0);
  assert.equal(stats.totalSesiones, 0);
  assert.deepEqual(stats.porMateria, []);
});
