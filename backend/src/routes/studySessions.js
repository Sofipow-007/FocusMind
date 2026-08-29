const express = require('express');
const {
  createStudySession,
  getStudySessions,
  getStudySessionById,
  updateStudySession,
  deleteStudySession,
} = require('../controllers/studySessionController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

router.post('/', createStudySession);
router.get('/', getStudySessions);
router.get('/:id', getStudySessionById);
router.put('/:id', updateStudySession);
router.delete('/:id', deleteStudySession);

module.exports = router;
