/**
 * Agregador de rutas de la aplicación
 *
 * En esta etapa contiene solo la ruta de health check.
 * Se completará en Etapa 2 con rutas de autenticación y en Etapa 3 con rutas de negocio.
 */

const express = require('express');

const router = express.Router();

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funciona correctamente' });
});

module.exports = router;
