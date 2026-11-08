const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const bcrypt = require('bcrypt');
const { createServer } = require('node:http');

const TEST_DATABASE_NAME = 'focusmind_test';
if (process.env.DB_NAME && process.env.DB_NAME !== TEST_DATABASE_NAME) {
  throw new Error(`API integration tests require DB_NAME=${TEST_DATABASE_NAME}`);
}
process.env.NODE_ENV = 'test';
process.env.DB_NAME = TEST_DATABASE_NAME;

const { sequelize } = require('../config');
const { User } = require('../models');
const app = require('../app');
const { signToken } = require('../utils/jwt');
const envConfig = require('../config/env');

function createTestEmail(label) {
  const safeLabel = label.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
  return `${safeLabel}-${randomUUID()}@example.com`;
}

async function createUser(label) {
  return User.create({
    nombre: label,
    email: createTestEmail(label.toLowerCase()),
    passwordHash: await bcrypt.hash('test-password', 4),
  });
}

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test('la API valida entradas y limita CRUD de recursos al usuario autenticado', async () => {
  assert.equal(sequelize.config.database, TEST_DATABASE_NAME);
  await sequelize.sync();

  const firstUser = await createUser('First User');
  const secondUser = await createUser('Second User');
  const firstToken = signToken({ userId: firstUser.id });
  const secondToken = signToken({ userId: secondUser.id });
  const server = createServer(app);

  server.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('listening', resolve);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}/api`;

  async function request(path, token, { method = 'GET', body } = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...(token ? { Cookie: `${envConfig.cookieName}=${token}` } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    return { status: response.status, data };
  }

  try {
    assert.equal((await request('/subjects')).status, 401);

    const subjectResult = await request('/subjects', firstToken, {
      method: 'POST',
      body: { nombre: 'Matemática' },
    });
    assert.equal(subjectResult.status, 201);
    const subjectId = subjectResult.data.subject.id;
    assert.equal((await request('/subjects', firstToken)).data.length, 1);

    const scheduledSubject = await request('/subjects', firstToken, {
      method: 'POST',
      body: {
        nombre: 'Física',
        diaEstudio: 'lunes',
        horaInicio: '09:00',
        horaFin: '10:00',
      },
    });
    assert.equal(scheduledSubject.status, 201);
    assert.equal((await request('/subjects/not-an-id', firstToken)).status, 400);
    assert.equal((await request(`/subjects/${subjectId}`, firstToken)).status, 200);
    assert.equal((await request(`/subjects/${subjectId}`, firstToken, {
      method: 'PUT',
      body: { nombre: 'Matemática avanzada' },
    })).status, 200);
    assert.equal((await request(`/subjects/${scheduledSubject.data.subject.id}`, firstToken, {
      method: 'PUT',
      body: { horaInicio: '11:00' },
    })).status, 400);
    assert.equal((await request('/subjects', secondToken)).data.length, 0);

    const secondSubject = await request('/subjects', secondToken, {
      method: 'POST',
      body: { nombre: 'Química' },
    });
    const foreignSubjectId = secondSubject.data.subject.id;
    assert.equal((await request(`/subjects/${foreignSubjectId}`, firstToken)).status, 404);
    assert.equal((await request(`/subjects/${foreignSubjectId}`, firstToken, {
      method: 'PUT',
      body: { nombre: 'No autorizado' },
    })).status, 404);
    assert.equal((await request(`/subjects/${foreignSubjectId}`, firstToken, {
      method: 'DELETE',
    })).status, 404);

    const invalidSession = await request('/study-sessions', firstToken, {
      method: 'POST',
      body: { materiaId: subjectId, fecha: '2030-02-30T09:00:00Z', duracion: 30 },
    });
    assert.equal(invalidSession.status, 400);
    assert.equal((await request('/study-sessions?materiaId=nope', firstToken)).status, 400);
    const sessionResult = await request('/study-sessions', firstToken, {
      method: 'POST',
      body: {
        materiaId: subjectId,
        fecha: new Date().toISOString(),
        duracion: 45,
        estado: 'completada',
      },
    });
    assert.equal(sessionResult.status, 201);
    const sessionId = sessionResult.data.session.id;
    assert.equal((await request('/study-sessions', firstToken, {
      method: 'POST',
      body: {
        materiaId: foreignSubjectId,
        fecha: new Date().toISOString(),
        duracion: 30,
      },
    })).status, 404);
    assert.equal((await request(`/study-sessions/${sessionId}`, secondToken)).status, 404);
    assert.equal((await request('/study-sessions', secondToken)).data.length, 0);
    assert.equal((await request(`/study-sessions/not-an-id`, firstToken)).status, 400);
    assert.equal((await request(`/study-sessions/${sessionId}`, firstToken)).status, 200);
    assert.equal((await request(`/study-sessions/${sessionId}`, secondToken, {
      method: 'PUT',
      body: { duracion: 90 },
    })).status, 404);
    assert.equal((await request(`/study-sessions/${sessionId}`, secondToken, {
      method: 'DELETE',
    })).status, 404);
    assert.equal((await request(`/study-sessions?materiaId=${subjectId}`, firstToken)).data.length, 1);
    assert.equal((await request(`/study-sessions/${sessionId}`, firstToken, {
      method: 'PUT',
      body: { estado: 'unknown' },
    })).status, 400);
    assert.equal((await request(`/study-sessions/${sessionId}`, firstToken, {
      method: 'PUT',
      body: { duracion: 50 },
    })).status, 200);

    assert.equal((await request('/notes?tipo=unknown', firstToken)).status, 400);
    const noteResult = await request('/notes', firstToken, {
      method: 'POST',
      body: { materiaId: subjectId, tipo: 'consulta', contenido: '¿Cómo se calcula?' },
    });
    assert.equal(noteResult.status, 201);
    const noteId = noteResult.data.note.id;
    assert.equal((await request(`/notes/${noteId}`, firstToken)).status, 200);
    assert.equal((await request('/notes', secondToken)).data.length, 0);
    assert.equal((await request(`/notes?materiaId=${subjectId}&tipo=consulta`, firstToken)).data.length, 1);
    assert.equal((await request('/notes?materiaId=NaN', firstToken)).status, 400);
    assert.equal((await request(`/notes/not-an-id`, firstToken)).status, 400);
    assert.equal((await request('/notes', firstToken, {
      method: 'POST',
      body: { materiaId: foreignSubjectId, tipo: 'apunte', contenido: 'Ajeno' },
    })).status, 404);
    assert.equal((await request(`/notes/${noteId}`, secondToken)).status, 404);
    assert.equal((await request(`/notes/${noteId}`, secondToken, {
      method: 'DELETE',
    })).status, 404);
    assert.equal((await request(`/notes/${noteId}`, secondToken, {
      method: 'PUT',
      body: { contenido: 'No autorizado' },
    })).status, 404);
    assert.equal((await request(`/notes/${noteId}`, firstToken, {
      method: 'PUT',
      body: { contenido: 'Respuesta', estado: 'respondida' },
    })).status, 200);
    assert.equal((await request(`/notes/${noteId}`, firstToken, {
      method: 'PUT',
      body: { estado: 'unknown' },
    })).status, 400);

    assert.equal((await request('/exams?materiaId=0', firstToken)).status, 400);
    assert.equal((await request('/exams?upcoming=sometimes', firstToken)).status, 400);
    const examResult = await request('/exams', firstToken, {
      method: 'POST',
      body: {
        materiaId: subjectId,
        titulo: 'Parcial',
        fecha: '2030-12-01T09:00:00Z',
      },
    });
    assert.equal(examResult.status, 201);
    const examId = examResult.data.exam.id;
    assert.equal((await request(`/exams/${examId}`, firstToken)).status, 200);
    assert.equal((await request('/exams', secondToken)).data.length, 0);
    assert.equal((await request(`/exams/not-an-id`, firstToken)).status, 400);
    assert.equal((await request(`/exams?materiaId=${subjectId}&upcoming=true`, firstToken)).data.length, 1);
    assert.equal((await request('/exams', firstToken, {
      method: 'POST',
      body: {
        materiaId: foreignSubjectId,
        titulo: 'Ajeno',
        fecha: '2030-12-01T09:00:00Z',
      },
    })).status, 404);
    assert.equal((await request(`/exams/${examId}`, secondToken)).status, 404);
    assert.equal((await request(`/exams/${examId}`, firstToken, {
      method: 'PUT',
      body: { fecha: '2030-12-02T09:00:00Z' },
    })).status, 200);
    assert.equal((await request(`/exams/${examId}`, secondToken, {
      method: 'PUT',
      body: { titulo: 'No autorizado' },
    })).status, 404);
    assert.equal((await request(`/exams/${examId}`, secondToken, {
      method: 'DELETE',
    })).status, 404);
    assert.equal((await request(`/exams/${examId}`, firstToken, {
      method: 'DELETE',
    })).status, 200);

    const stats = await request('/stats/study-time', firstToken);
    assert.equal(stats.status, 200);
    assert.equal(stats.data.totalMinutos, 50);
    assert.equal(stats.data.totalSesiones, 1);
    assert.ok(stats.data.semanaActual);
    assert.ok(stats.data.mesActual);
    assert.equal(typeof stats.data.rachaDias, 'number');
    assert.equal((await request('/stats/study-time', secondToken)).data.totalSesiones, 0);

    assert.equal((await request(`/notes/${noteId}`, firstToken, {
      method: 'DELETE',
    })).status, 200);
    assert.equal((await request(`/study-sessions/${sessionId}`, firstToken, {
      method: 'DELETE',
    })).status, 200);
    assert.equal((await request(`/subjects/${subjectId}`, firstToken, {
      method: 'DELETE',
    })).status, 200);
  } finally {
    await closeServer(server);
    await firstUser.destroy();
    await secondUser.destroy();
  }
});
