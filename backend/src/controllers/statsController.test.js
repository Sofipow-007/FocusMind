const test = require('node:test');
const assert = require('node:assert/strict');

const { StudySession } = require('../models');
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
  const originalFindAll = StudySession.findAll;
  let findAllCalled = false;

  StudySession.findAll = async () => {
    findAllCalled = true;
    return [];
  };

  try {
    const req = { user: undefined };
    const res = createMockResponse();

    await getStudyTimeStats(req, res);

    assert.equal(res.statusCode, 401);
    assert.deepEqual(res.body, { message: 'No autorizado' });
    assert.equal(findAllCalled, false);
  } finally {
    StudySession.findAll = originalFindAll;
  }
});

test('devuelve estadísticas en cero cuando el usuario no tiene sesiones completadas', async () => {
  // Valida el caso límite: usuario autenticado con consulta vacía debe responder 200
  // con totales en cero y porMateria vacío, sin errores.
  const originalFindAll = StudySession.findAll;

  StudySession.findAll = async () => [];

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
    StudySession.findAll = originalFindAll;
  }
});
