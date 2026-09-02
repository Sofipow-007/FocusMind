const express = require('express');
const authRoutes = require('./auth');
const subjectRoutes = require('./subjects');
const studySessionRoutes = require('./studySessions');
const noteRoutes = require('./notes');
const examRoutes = require('./exams');
const statsRoutes = require('./stats');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API funciona correctamente' });
});

router.use('/auth', authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/study-sessions', studySessionRoutes);
router.use('/notes', noteRoutes);
router.use('/exams', examRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
