// app.js
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();

// Configuration CORS
app.use(cors({
    origin: 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("./public"));
app.use('/api', routes);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Le serveur back tourne correctement sur le port ${port}`);
});