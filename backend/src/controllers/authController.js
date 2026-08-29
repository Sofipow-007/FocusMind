const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');
const { User } = require('../models');

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

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
      token,
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

    return res.status(200).json({
      message: 'Login correcto',
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  register,
  login,
};
