const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const scoreController = require('../controllers/scoreController');
const middleware = require('../middlewares');

router.get('/', (req, res) => {
    res.send('Bienvenue sur votre API !');
});

router.get('/firebase-config', (req, res) => {
    res.json({
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID
    });
});

router.get('/user', middleware.verifyToken, userController.getUser);
router.post('/login', userController.login);
router.post('/loginWithGoogle', userController.loginWithGoogle);
router.post('/forgot-password', userController.forgotPassword);
router.post('/register', userController.register);
router.post('/logout', userController.logout);

router.get('/scores', scoreController.getScores);
router.put('/score', middleware.verifyToken, scoreController.setScore);

module.exports = router;