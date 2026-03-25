const admin = require("firebase-admin");
require("dotenv").config();

// Vérifier que les variables d'environnement sont bien chargées
if (
  !process.env.PROJECT_ID ||
  !process.env.CLIENT_EMAIL ||
  !process.env.PRIVATE_KEY
) {
  console.error("Variables d'environnement manquantes pour Firebase Admin");
  process.exit(1);
}

const serviceAccount = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

console.log("Configuration Firebase Admin:", {
  projectId: serviceAccount.project_id,
  clientEmail: serviceAccount.client_email,
  privateKeyExists: !!serviceAccount.private_key,
});

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialisé avec succès");

    // Tester la connexion
    admin
      .auth()
      .listUsers(1)
      .then(() => console.log("Connexion Firebase Admin vérifiée avec succès"))
      .catch((error) =>
        console.error("Erreur de connexion Firebase Admin:", error)
      );
  } catch (error) {
    console.error("Erreur d'initialisation Firebase Admin:", error);
    process.exit(1);
  }
}

module.exports = admin;
