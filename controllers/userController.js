const {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
} = require("firebase/firestore");
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} = require("firebase/auth");
const { db } = require("../models/firebaseModel");

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const auth = getAuth();
    let userEmail = identifier;

    const isEmail = identifier.includes("@");

    if (!isEmail) {
      const userQuery = query(
        collection(db, "users"),
        where("pseudo", "==", identifier)
      );
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        throw new Error("Utilisateur non trouvé avec ce pseudo");
      }

      const userDoc = querySnapshot.docs[0];
      userEmail = userDoc.data().email;
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      userEmail,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ uid: user.uid, email: user.email, token });
  } catch (error) {
    console.error("Erreur lors de la connexion utilisateur", error);
    res
      .status(401)
      .json({ error: "Identifiants invalides", details: error.message });
  }
};

const loginWithGoogle = async (req, res) => {
  try {
    const { idToken, email, suggestedUsername, displayName } = req.body;
    console.log("Données reçues:", {
      idToken,
      email,
      suggestedUsername,
      displayName,
    });

    // Vérifier si l'utilisateur existe déjà
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    let userData;
    if (querySnapshot.empty) {
      // Pour un nouvel utilisateur, on vérifie si le pseudo suggéré est disponible
      let finalUsername = suggestedUsername;
      let counter = 1;

      // Vérifier si le pseudo existe déjà
      while (true) {
        const pseudoQuery = query(
          usersRef,
          where("pseudo", "==", finalUsername)
        );
        const pseudoSnapshot = await getDocs(pseudoQuery);

        if (pseudoSnapshot.empty) {
          break; // Pseudo disponible
        }

        finalUsername = `${suggestedUsername}${counter}`;
        counter++;
      }

      // Créer un nouvel utilisateur avec le pseudo unique
      userData = {
        uid: idToken.user_id || idToken, // Utiliser user_id s'il existe, sinon utiliser idToken
        email: email,
        pseudo: finalUsername,
        bestscore: 0,
      };
      console.log("Création nouvel utilisateur:", userData);
      await addDoc(collection(db, "users"), userData);
    } else {
      userData = querySnapshot.docs[0].data();
      console.log("Utilisateur existant:", userData);
    }

    // Créer le token de session
    res.cookie("token", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      uid: userData.uid,
      email: userData.email,
      pseudo: userData.pseudo,
      bestscore: userData.bestscore,
      token: idToken,
    });
  } catch (error) {
    console.error("Erreur détaillée:", error);
    res.status(401).json({
      error: "Erreur lors de la connexion Google",
      details: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
    res.status(200).json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.error("Erreur lors de la réinitialisation du mot de passe", error);
    res.status(400).json({
      error: "Erreur lors de la réinitialisation du mot de passe",
      details: error.message,
    });
  }
};

const register = async (req, res) => {
  const { pseudo, email, password, score } = req.body;

  try {
    const q = query(collection(db, "users"), where("pseudo", "==", pseudo));
    const userRef = await getDocs(q);

    if (!userRef.empty) {
      return res.status(400).json({
        error: "Le pseudo est déjà pris. Veuillez en choisir un autre.",
      });
    }
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userData = {
      uid: user.uid, // Utiliser l'uid de Firebase Auth
      pseudo: pseudo,
      email: email,
      bestscore: score ?? 0,
    };
    console.log("Création d'un nouvel utilisateur:", userData);
    await addDoc(collection(db, "users"), userData);

    const loginReq = {
      body: {
        identifier: email,
        password: password,
      },
    };

    await login(loginReq, res);
  } catch (error) {
    console.error("Erreur lors de l'inscription utilisateur", error);
    res
      .status(400)
      .json({ error: "Erreur lors de l'inscription", details: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion utilisateur", error);
    res.status(500).json({ error: "Erreur serveur lors de la déconnexion" });
  }
};

const getUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    const usersRef = collection(db, "users");
    let querySnapshot;

    // Chercher d'abord par uid (pour les comptes classiques)
    if (uid) {
      querySnapshot = await getDocs(query(usersRef, where("uid", "==", uid)));
    }

    // Si pas trouvé et qu'on a un email (pour les comptes Google), chercher par email
    if ((!querySnapshot || querySnapshot.empty) && email) {
      querySnapshot = await getDocs(
        query(usersRef, where("email", "==", email))
      );
    }

    if (!querySnapshot || querySnapshot.empty) {
      console.error("Utilisateur non trouvé.");
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const userData = querySnapshot.docs[0].data();
    res.status(200).json({
      uid: userData.uid,
      email: userData.email,
      pseudo: userData.pseudo,
      bestscore: userData.bestscore,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des données", error);
    res.status(500).send("Erreur serveur");
  }
};

const updateUsername = async (req, res) => {
  try {
    console.log("Début de updateUsername");
    console.log("Body reçu:", req.body);
    console.log("User:", req.user);

    const { pseudo } = req.body;
    const { user_id, email } = req.user;

    // Vérifier si le pseudo est valide
    if (!pseudo || pseudo.length < 3 || pseudo.length > 20) {
      return res.status(400).json({
        error: "Le pseudo doit contenir entre 3 et 20 caractères",
      });
    }

    console.log("Recherche de l'utilisateur...");
    // Vérifier si le pseudo est déjà pris
    const usersRef = collection(db, "users");
    const pseudoQuery = query(usersRef, where("pseudo", "==", pseudo));
    const pseudoSnapshot = await getDocs(pseudoQuery);

    if (!pseudoSnapshot.empty) {
      return res.status(400).json({
        error: "Ce pseudo est déjà pris",
      });
    }

    // Trouver l'utilisateur actuel
    let userQuery;
    let userSnapshot;

    // Chercher d'abord par email car c'est la donnée la plus fiable
    console.log("Recherche par email:", email);
    userQuery = query(usersRef, where("email", "==", email));
    userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      // Si pas trouvé par email, essayer avec user_id
      if (user_id) {
        console.log("Recherche par user_id:", user_id);
        userQuery = query(usersRef, where("uid", "==", user_id));
        userSnapshot = await getDocs(userQuery);
      }
    }

    if (userSnapshot.empty) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    // Mettre à jour l'utilisateur existant
    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    await updateDoc(doc(db, "users", userDoc.id), {
      uid: user_id, // Mettre à jour l'uid avec le bon user_id
      pseudo: pseudo,
      // Garder les autres champs inchangés
      email: userData.email,
      bestscore: userData.bestscore || 0,
    });

    return res.status(200).json({ message: "Pseudo mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du pseudo:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = {
  getUser,
  login,
  loginWithGoogle,
  forgotPassword,
  register,
  logout,
  updateUsername,
};
