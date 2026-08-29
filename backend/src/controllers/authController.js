const bcrypt = require('bcrypt');
const { signToken } = require('../utils/jwt');

const register = async (req, res) => {
  const { email, password, nombre } = req.body || {};

  if (!email || !password || !nombre) {
    return res.status(400).json({ message: 'Nombre, email y password son obligatorios' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  return res.status(201).json({
    message: 'Usuario registrado correctamente',
    user: {
      nombre,
      email,
      passwordHash,
    },
    token: signToken({ email, nombre }),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email y password son obligatorios' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const isValid = await bcrypt.compare(password, passwordHash);

  if (!isValid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  return res.status(200).json({
    message: 'Login correcto',
    token: signToken({ email }),
  });
};

module.exports = {
  register,
  login,
};
