const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');
const cookieParser = require('cookie-parser');

const app = express();
// app.use(cors({
//     origin: ['https://tape-taupe.vercel.app', 'http://127.0.0.1:5500'], 
//     credentials: true,
// }));
app.use(express.json());
app.use(cookieParser());
app.use("/", express.static("./public"));

// // Middleware global pour les en-têtes CORS
// app.use((req, res, next) => {
//     const allowedOrigins = ['https://tape-taupe.vercel.app', 'http://localhost:5500'];
//     const origin = req.headers.origin;

//     if (allowedOrigins.includes(origin)) {
//       res.header('Access-Control-Allow-Origin', origin);
//     }

//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

app.use('/api', routes);

const port = process.env.PORT || 8081;

app.listen(port, () => {
    console.log(`Le serveur back tourne correctement sur le port ${port}`);
});