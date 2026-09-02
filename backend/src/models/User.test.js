const test = require('node:test');
const assert = require('node:assert/strict');
const { sequelize } = require('../config');
const { User } = require('./index');
const bcrypt = require('bcrypt');

test.after(async () => {
  await sequelize.close();
});

// Limpieza de la BD antes de los tests
async function setupDatabase() {
  await sequelize.sync({ force: true });
}

// Test 1: Crear un usuario en la BD
test('Crear un usuario en la base de datos', { concurrency: false }, async () => {
  await setupDatabase();

  const password = 'test123secure';
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    nombre: 'Demo User',
    email: 'demo@focusmind.com',
    passwordHash,
  });

  assert.equal(user.nombre, 'Demo User');
  assert.equal(user.email, 'demo@focusmind.com');
  assert.ok(user.id);

});

// Test 2: Buscar usuario por email
test('Buscar usuario por email', { concurrency: false }, async () => {
  await setupDatabase();

  const password = 'test123secure';
  const passwordHash = await bcrypt.hash(password, 10);

  await User.create({
    nombre: 'Search Test',
    email: 'search@focusmind.com',
    passwordHash,
  });

  const foundUser = await User.findOne({ where: { email: 'search@focusmind.com' } });

  assert.ok(foundUser);
  assert.equal(foundUser.nombre, 'Search Test');

});

// Test 3: Validación de email único
test('No permite crear dos usuarios con el mismo email', { concurrency: false }, async () => {
  await setupDatabase();

  const passwordHash = await bcrypt.hash('test123', 10);

  await User.create({
    nombre: 'User 1',
    email: 'unique@focusmind.com',
    passwordHash,
  });

  try {
    await User.create({
      nombre: 'User 2',
      email: 'unique@focusmind.com',
      passwordHash,
    });
    assert.fail('Debería haber lanzado un error de unicidad');
  } catch (error) {
    assert.equal(error.name, 'SequelizeUniqueConstraintError');
  }

});

// Test 4: Validación de contraseña
test('bcrypt valida correctamente la contraseña', async () => {
  const password = 'myPassword123';
  const passwordHash = await bcrypt.hash(password, 10);

  const isValid = await bcrypt.compare(password, passwordHash);
  assert.equal(isValid, true);

  const isInvalid = await bcrypt.compare('wrongPassword', passwordHash);
  assert.equal(isInvalid, false);
});
