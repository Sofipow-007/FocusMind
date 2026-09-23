const {
  EMAIL_EXISTS,
  INVALID_CREDENTIALS,
  getAuthenticatedUser,
  loginUser,
  registerUser,
} = require('../services/authService');
const { validateLoginInput, validateRegisterInput } = require('../validators/authValidator');
const envConfig = require('../config/env');

function getCookieMaxAge() {
  const match = String(envConfig.jwtExpiresIn).match(/^(\d+)([dhm])$/);
  if (!match) return undefined;

  const units = { m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 };
  return Number(match[1]) * units[match[2]];
}

function setSessionCookie(res, token) {
  res.cookie(envConfig.cookieName, token, {
    httpOnly: true,
    sameSite: envConfig.isProduction ? 'strict' : 'lax',
    secure: envConfig.isProduction,
    maxAge: getCookieMaxAge(),
  });
}

const register = async (req, res) => {
  try {
    const { email, password, nombre } = req.body || {};

    const validationError = validateRegisterInput({ nombre, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await registerUser({ nombre, email, password });
    setSessionCookie(res, result.token);

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: result.user,
    });
  } catch (error) {
    if (error.code === EMAIL_EXISTS) {
      return res.status(409).json({ message: error.message });
    }
    console.error('Error en registro:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    const validationError = validateLoginInput({ email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const result = await loginUser({ email, password });
    setSessionCookie(res, result.token);

    return res.status(200).json({
      message: 'Login correcto',
      user: result.user,
    });
  } catch (error) {
    if (error.code === INVALID_CREDENTIALS) {
      return res.status(401).json({ message: error.message });
    }
    console.error('Error en login:', error.message);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const me = async (req, res) => {
  try {
    const user = await getAuthenticatedUser(req.user.userId);

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
  res.clearCookie(envConfig.cookieName, {
    httpOnly: true,
    sameSite: envConfig.isProduction ? 'strict' : 'lax',
    secure: envConfig.isProduction,
  });

  return res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

module.exports = {
  register,
  login,
  me,
  logout,
};
