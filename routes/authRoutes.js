const express = require('express');
const router = express.Router();

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

// Vos autres routes d'authentification
router.post('/login', /* ... */);
router.post('/register', /* ... */);
router.post('/loginWithGoogle', /* ... */);
// etc.

module.exports = router; 