const test = require('node:test');
const assert = require('node:assert/strict');

const statsService = require('../services/statsService');
const { getStudyTimeStats } = require('./statsController');

function createMockResponse() {
  const response = {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };

  return response;
}

test('responde 401 sin consultar la base de datos cuando falta req.user.userId', async () => {
  // Valida el caso inválido: sin usuario autenticado el controller debe cortar
  // antes de acceder a Sequelize y devolver el mismo contrato de error 401.
  const originalGetStudyTimeStats = statsService.getStudyTimeStats;
  let serviceCalled = false;

  statsService.getStudyTimeStats = async () => {
    serviceCalled = true;
    return {};
  };

  try {
    const req = { user: undefined };
    const res = createMockResponse();

    await getStudyTimeStats(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'No autorizado' });
    assert.equal(serviceCalled, false);
  } finally {
    statsService.getStudyTimeStats = originalGetStudyTimeStats;
  }
});

test('devuelve estadísticas en cero cuando el usuario no tiene sesiones completadas', async () => {
  // Valida el caso límite: usuario autenticado con consulta vacía debe responder 200
  // con totales en cero y porMateria vacío, sin errores.
  const originalGetStudyTimeStats = statsService.getStudyTimeStats;

  statsService.getStudyTimeStats = async () => ({
    totalMinutos: 0,
    totalSesiones: 0,
    porMateria: [],
  });

  try {
    const req = { user: { userId: 1 } };
    const res = createMockResponse();

    await getStudyTimeStats(req, res);

    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, {
      totalMinutos: 0,
      totalSesiones: 0,
      porMateria: [],
    });
  } finally {
    statsService.getStudyTimeStats = originalGetStudyTimeStats;
  }
});
