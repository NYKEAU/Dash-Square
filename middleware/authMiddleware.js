const admin = require("../config/firebase-admin");

const verifyToken = async (req, res, next) => {
  console.log("Middleware verifyToken appelé");
  console.log("URL appelée:", req.originalUrl);
  console.log("Méthode:", req.method);

  try {
    const authHeader = req.headers["authorization"];
    console.log("Auth Header:", authHeader);

    const token = authHeader && authHeader.split(" ")[1];
    console.log("Token exists:", !!token);

    if (!token) {
      return res.status(401).json({ error: "Token manquant" });
    }

    console.log("Vérification du token...");
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("Token décodé:", decodedToken);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Erreur d'authentification détaillée:", error);
    return res.status(403).json({
      error: "Token invalide",
      details: error.message,
    });
  }
};

module.exports = { verifyToken };
