const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const scoreController = require('../controllers/scoreController');

router.get('/scores', scoreController.getScores);  // public
router.put('/score', authenticateToken, scoreController.setScore);  // protégé

module.exports = router; 