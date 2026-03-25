const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');

// ... vos autres routes et middleware ...

// Ajouter les routes d'authentification
app.use('/api', authRoutes);

// ... reste de votre configuration ... 