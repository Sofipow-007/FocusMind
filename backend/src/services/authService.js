const bcrypt = require('bcrypt');
const { User } = require('../models');
const { signToken } = require('../utils/jwt');

const EMAIL_EXISTS = 'EMAIL_EXISTS';
const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';

function toPublicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
  };
}

async function registerUser({ nombre, email, password }) {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    const error = new Error('El email ya está registrado');
    error.code = EMAIL_EXISTS;
    throw error;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ nombre: nombre.trim(), email: email.trim(), passwordHash });
  const token = signToken({ userId: user.id, email: user.email });

  return { user: toPublicUser(user), token };
}

async function loginUser({ email, password }) {
  const user = await User.findOne({ where: { email: email.trim() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    const error = new Error('Credenciales inválidas');
    error.code = INVALID_CREDENTIALS;
    throw error;
  }

  return {
    user: toPublicUser(user),
    token: signToken({ userId: user.id, email: user.email }),
  };
}

async function getAuthenticatedUser(userId) {
  return User.findByPk(userId, {
    attributes: ['id', 'nombre', 'email', 'createdAt', 'updatedAt'],
  });
}

module.exports = {
  EMAIL_EXISTS,
  INVALID_CREDENTIALS,
  getAuthenticatedUser,
  loginUser,
  registerUser,
};
