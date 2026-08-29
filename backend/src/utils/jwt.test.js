const test = require('node:test');
const assert = require('node:assert/strict');

const { signToken, verifyToken } = require('./jwt');

test('signToken crea un token válido para un payload', () => {
  const token = signToken({ userId: 1, email: 'demo@focusmind.com' });

  assert.equal(typeof token, 'string');
  assert.ok(token.length > 20);
});

test('verifyToken verifica un token firmado correctamente', () => {
  const payload = { userId: 42, email: 'demo@focusmind.com' };
  const token = signToken(payload);

  const decoded = verifyToken(token);

  assert.equal(decoded.userId, payload.userId);
  assert.equal(decoded.email, payload.email);
});
