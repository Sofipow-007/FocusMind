const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { sequelize } = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Flag para saber si la BD está lista
let dbReady = false;

// Sincronizar base de datos (sin bloquear el arranque)
const initializeDatabase = async () => {
  if (process.env.NODE_ENV === 'development' && process.env.SKIP_DB_SYNC !== 'true') {
    try {
      await sequelize.sync({ alter: false });
      console.log('✓ Base de datos sincronizada');
      dbReady = true;
    } catch (error) {
      console.warn('⚠ No se pudo sincronizar la base de datos');
      console.warn(`Detalles: ${error.message}`);
      console.warn('Continuando sin BD. Para usar BD, configura MySQL y establece credenciales correctas');
    }
  } else if (process.env.NODE_ENV !== 'development') {
    try {
      await sequelize.sync({ alter: false });
      dbReady = true;
    } catch (error) {
      console.error('✗ Error crítico: No se pudo sincronizar la base de datos en producción');
      console.error(`Detalles: ${error.message}`);
      process.exit(1);
    }
  }
};

// Inicializar BD de forma asíncrona
initializeDatabase().catch((error) => {
  console.error('Error inesperado durante la inicialización:', error.message);
  if (process.env.NODE_ENV !== 'development') {
    process.exit(1);
  }
});

// Middleware para verificar disponibilidad de BD en rutas que la requieren
app.use((req, res, next) => {
  if (!dbReady && req.path.startsWith('/api/auth')) {
    return res.status(503).json({ message: 'Servicio no disponible: base de datos inicializándose' });
  }
  next();
});

// Rutas de la aplicación
app.use('/api', routes);

module.exports = app;
