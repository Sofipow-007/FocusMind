const test = require('node:test');
const assert = require('node:assert/strict');
const { sequelize } = require('../config');
const { User, Subject, StudySession, Note, Exam } = require('./index');
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

test('un usuario no puede ver ni modificar datos de otro usuario', { concurrency: false }, async () => {
  await setupDatabase();

  const passwordHash = await bcrypt.hash('test123', 10);

  const userA = await User.create({ nombre: 'Alice', email: 'alice@focusmind.com', passwordHash });
  const userB = await User.create({ nombre: 'Bob', email: 'bob@focusmind.com', passwordHash });

  const subject = await Subject.create({
    usuarioId: userA.id,
    nombre: 'Matemática',
    favorita: true,
    prioritaria: true,
  });

  const foundByOtherUser = await Subject.findOne({
    where: { id: subject.id, usuarioId: userB.id },
  });

  assert.equal(foundByOtherUser, null);

  const session = await StudySession.create({
    usuarioId: userA.id,
    materiaId: subject.id,
    fecha: '2026-10-01T09:00:00Z',
    duracion: 60,
    descripcion: 'Tema de prueba',
    estado: 'completada',
  });

  const sessionByOtherUser = await StudySession.findOne({
    where: { id: session.id, usuarioId: userB.id },
  });

  assert.equal(sessionByOtherUser, null);
});

test('la eliminación de un usuario elimina sus materias, sesiones, notas y exámenes', { concurrency: false }, async () => {
  await setupDatabase();

  const passwordHash = await bcrypt.hash('test123', 10);

  const user = await User.create({ nombre: 'Owner', email: 'owner@focusmind.com', passwordHash });

  const subject = await Subject.create({
    usuarioId: user.id,
    nombre: 'Física',
    favorita: false,
    prioritaria: false,
  });

  await StudySession.create({
    usuarioId: user.id,
    materiaId: subject.id,
    fecha: '2026-10-01T09:00:00Z',
    duracion: 50,
    descripcion: 'Repaso',
    estado: 'completada',
  });

  await Note.create({
    usuarioId: user.id,
    materiaId: subject.id,
    tipo: 'consulta',
    contenido: '¿Cómo se resuelve?',
    origen: 'usuario',
    estado: 'pendiente',
  });

  await Exam.create({
    usuarioId: user.id,
    materiaId: subject.id,
    titulo: 'Parcial',
    fecha: '2026-12-01T09:00:00Z',
    descripcion: 'Parcial de física',
  });

  await user.destroy();

  assert.equal(await Subject.count({ where: { usuarioId: user.id } }), 0);
  assert.equal(await StudySession.count({ where: { usuarioId: user.id } }), 0);
  assert.equal(await Note.count({ where: { usuarioId: user.id } }), 0);
  assert.equal(await Exam.count({ where: { usuarioId: user.id } }), 0);
});
