const nodeEnv = process.env.NODE_ENV || 'development';

const envConfig = {
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: Number(process.env.PORT || 3001),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  cookieName: process.env.COOKIE_NAME || 'focusmind_session',
  jwtSecret: process.env.JWT_SECRET || 'focusmind-dev-secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'focusmind',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
};

module.exports = envConfig;
