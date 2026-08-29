const express = require('express');
const authRoutes = require('./auth');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funciona correctamente' });
});

router.use('/auth', authRoutes);

module.exports = router;
