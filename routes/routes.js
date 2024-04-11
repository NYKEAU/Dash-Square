// routes/routes.js
const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');
const middleware = require('../middlewares');

router.get('/', (req, res) => {
    res.send('Bienvenue sur votre API !');
});

router.post('/login', dataController.login);
router.post('/register', dataController.register);
router.post('/logout', dataController.logout);
router.get('/user', middleware.jwtMiddleware, dataController.getUserInfo);
router.get('/leaderboard', dataController.leaderboard);
router.put('/update-score', middleware.jwtMiddleware, dataController.updateScore);
router.delete('/delete', middleware.jwtMiddleware, dataController.deleteAccount);

module.exports = router;