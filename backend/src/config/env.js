const nodeEnv = process.env.NODE_ENV || 'development';
const jwtSecret = process.env.JWT_SECRET || (
  nodeEnv === 'production' ? '' : 'focusmind-dev-secret'
);
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const jwtExpiration = jwtExpiresIn.match(/^([1-9]\d*)([mhd])$/);
const jwtExpiresInMilliseconds = jwtExpiration
  ? Number(jwtExpiration[1]) * {
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }[jwtExpiration[2]]
  : NaN;

if (!Number.isSafeInteger(jwtExpiresInMilliseconds) || jwtExpiresInMilliseconds <= 0) {
  throw new Error('JWT_EXPIRES_IN debe ser una duración positiva en minutos, horas o días (por ejemplo, 15m o 7d)');
}

if (nodeEnv === 'production' && jwtSecret.length < 32) {
  throw new Error('En producción, JWT_SECRET debe configurarse con al menos 32 caracteres');
}

const envConfig = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT || 3001),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  cookieName: process.env.COOKIE_NAME || 'focusmind_session',
  jwtSecret,
  jwtExpiresIn,
  jwtExpiresInMilliseconds,
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'focusmind',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
};

module.exports = envConfig;
