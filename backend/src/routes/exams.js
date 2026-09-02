const express = require('express');
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require('../controllers/examController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);
router.post('/', createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', updateExam);
router.delete('/:id', deleteExam);

module.exports = router;
