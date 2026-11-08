const test = require('node:test');
const assert = require('node:assert/strict');

const envPath = require.resolve('./env');
const ENV_KEYS = ['NODE_ENV', 'JWT_SECRET', 'JWT_EXPIRES_IN'];

function loadEnv(overrides) {
  const originalValues = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
  for (const key of ENV_KEYS) {
    delete process.env[key];
  }
  Object.assign(process.env, overrides);
  delete require.cache[envPath];

  try {
    return require('./env');
  } finally {
    for (const key of ENV_KEYS) {
      if (originalValues[key] === undefined) delete process.env[key];
      else process.env[key] = originalValues[key];
    }
    delete require.cache[envPath];
  }
}

test('exige secreto JWT robusto en producción y rechaza duraciones inválidas', () => {
  assert.throws(
    () => loadEnv({ NODE_ENV: 'production' }),
    /JWT_SECRET debe configurarse con al menos 32 caracteres/,
  );
  assert.throws(
    () => loadEnv({ NODE_ENV: 'production', JWT_SECRET: 'short' }),
    /JWT_SECRET debe configurarse con al menos 32 caracteres/,
  );
  assert.throws(
    () => loadEnv({
      NODE_ENV: 'test',
      JWT_EXPIRES_IN: '0d',
    }),
    /JWT_EXPIRES_IN debe ser una duración positiva/,
  );
  assert.throws(
    () => loadEnv({
      NODE_ENV: 'test',
      JWT_EXPIRES_IN: '999999999999999999999d',
    }),
    /JWT_EXPIRES_IN debe ser una duración positiva/,
  );

  const config = loadEnv({
    NODE_ENV: 'production',
    JWT_SECRET: '0123456789abcdef0123456789abcdef',
    JWT_EXPIRES_IN: '15m',
  });
  assert.equal(config.jwtExpiresInMilliseconds, 15 * 60 * 1000);
});
