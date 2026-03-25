// app.js
const express = require("express");
const cors = require("cors");
const routes = require("./routes/routes");
const cookieParser = require("cookie-parser");

const app = express();

// Configuration CORS plus permissive pour le développement
app.use(
  cors({
    origin: true, // Autorise toutes les origines en développement
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use("/api", routes);
app.use("/", express.static("./public"));

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Le serveur back tourne correctement sur le port ${port}`);
});
