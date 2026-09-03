const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const { User } = require('../models');

const COOKIE_NAME = 'focusmind_session';

function getCookieMaxAge() {
  const match = String(process.env.JWT_EXPIRES_IN || '7d').match(/^(\d+)([dhm])$/);
  if (!match) return undefined;

  const units = { m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return Number(match[1]) * units[match[2]];
}

function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: getCookieMaxAge(),
  });
}

const register = async (req, res) => {
  try {
    const { email, password, nombre } = req.body || {};

    if (!email || !password || !nombre) {
      return res.status(400).json({ message: 'Nombre, email y password son obligatorios' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      nombre,
      email,
      passwordHash,
    });

    const token = signToken({ userId: user.id, email: user.email });
    setSessionCookie(res, token);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y password son obligatorios' });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = signToken({ userId: user.id, email: user.email });
    setSessionCookie(res, token);

    return res.status(200).json({
      message: 'Login correcto',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: ['id', 'nombre', 'email', 'createdAt', 'updatedAt'],
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener usuario autenticado:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const logout = (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = {
  register,
  login,
  me,
  logout,
};
