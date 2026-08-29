const express = require('express');
const authRoutes = require('./auth');
const subjectRoutes = require('./subjects');
const studySessionRoutes = require('./studySessions');
const noteRoutes = require('./notes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funciona correctamente' });
});

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/study-sessions', studySessionRoutes);
router.use('/notes', noteRoutes);

module.exports = router;
