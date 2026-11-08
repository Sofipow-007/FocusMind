const test = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
const { createServer } = require('node:http');

const TEST_DATABASE_NAME = 'focusmind_test';
if (process.env.DB_NAME && process.env.DB_NAME !== TEST_DATABASE_NAME) {
  throw new Error(`Auth integration tests require DB_NAME=${TEST_DATABASE_NAME}`);
}
process.env.NODE_ENV = 'test';
process.env.DB_NAME = TEST_DATABASE_NAME;

const { sequelize } = require('../config');
const { User } = require('../models');
const app = require('../app');
const envConfig = require('../config/env');

async function closeServer(server) {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

test('la API cumple registro, login, recuperación de sesión y logout con cookie HttpOnly', async () => {
  assert.equal(sequelize.config.database, TEST_DATABASE_NAME);
  await sequelize.sync();

  const email = `auth-${randomUUID()}@example.com`;
  const concurrentEmail = `auth-race-${randomUUID()}@example.com`;
  const server = createServer(app);
  server.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.once('listening', resolve);
  });
  const baseUrl = `http://127.0.0.1:${server.address().port}/api/auth`;

  async function request(path, { method = 'GET', body, cookie } = {}) {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        ...(cookie ? { Cookie: cookie } : {}),
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    return {
      status: response.status,
      data: await response.json(),
      setCookie: response.headers.get('set-cookie') || '',
    };
  }

  let sessionCookie;
  try {
    const invalidRegistration = await request('/register', {
      method: 'POST',
      body: { nombre: '', email, password: 'valid-password' },
    });
    assert.equal(invalidRegistration.status, 400);
    assert.equal((await request('/register', {
      method: 'POST',
      body: { nombre: 'Auth Integration', email, password: 'short' },
    })).status, 400);

    const registration = await request('/register', {
      method: 'POST',
      body: { nombre: 'Auth Integration', email, password: 'valid-password' },
    });
    assert.equal(registration.status, 201);
    assert.equal(registration.data.user.email, email);
    assert.equal('token' in registration.data, false);
    assert.match(registration.setCookie, new RegExp(`^${envConfig.cookieName}=`));
    assert.match(registration.setCookie, /HttpOnly/i);
    assert.match(registration.setCookie, /Max-Age=604800/i);
    sessionCookie = registration.setCookie.split(';')[0];

    const duplicateRegistration = await request('/register', {
      method: 'POST',
      body: { nombre: 'Auth Integration', email, password: 'valid-password' },
    });
    assert.equal(duplicateRegistration.status, 409);

    const concurrentRegistrations = await Promise.all([
      request('/register', {
        method: 'POST',
        body: { nombre: 'Concurrent One', email: concurrentEmail, password: 'valid-password' },
      }),
      request('/register', {
        method: 'POST',
        body: { nombre: 'Concurrent Two', email: concurrentEmail, password: 'valid-password' },
      }),
    ]);
    assert.deepEqual(
      concurrentRegistrations.map(({ status }) => status).sort(),
      [201, 409],
    );

    assert.equal((await request('/me')).status, 401);
    const me = await request('/me', { cookie: sessionCookie });
    assert.equal(me.status, 200);
    assert.deepEqual(me.data.user.email, email);

    const invalidLogin = await request('/login', {
      method: 'POST',
      body: { email, password: 'wrong-password' },
    });
    assert.equal(invalidLogin.status, 401);

    const login = await request('/login', {
      method: 'POST',
      body: { email, password: 'valid-password' },
    });
    assert.equal(login.status, 200);
    assert.equal('token' in login.data, false);
    assert.match(login.setCookie, /HttpOnly/i);
    sessionCookie = login.setCookie.split(';')[0];
    assert.equal((await request('/me', { cookie: sessionCookie })).status, 200);

    const logout = await request('/logout', { method: 'POST', cookie: sessionCookie });
    assert.equal(logout.status, 200);
    assert.match(logout.setCookie, /Expires=Thu, 01 Jan 1970/i);
    assert.equal((await request('/me')).status, 401);
  } finally {
    await closeServer(server);
    const users = await User.findAll({ where: { email: [email, concurrentEmail] } });
    await Promise.all(users.map((user) => user.destroy()));
  }
});
