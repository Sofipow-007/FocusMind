const express = require('express');
const { getStudyTimeStats } = require('../controllers/statsController');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);
router.get('/study-time', getStudyTimeStats);

module.exports = router;
