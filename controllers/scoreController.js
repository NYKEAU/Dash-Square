const {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  where,
  doc,
} = require("firebase/firestore");
const { db } = require("../models/firebaseModel");

const getScores = async (req, res) => {
  try {
    const scoresRef = collection(db, "users");
    const q = query(scoresRef, orderBy("bestscore", "desc"), limit(100));
    const querySnapshot = await getDocs(q);

    const scores = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      scores.push({
        pseudo: userData.pseudo,
        bestscore: userData.bestscore,
      });
    });

    res.status(200).json(scores);
  } catch (error) {
    console.error("Erreur lors de la récupération des scores:", error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
    });
  }
};

const setScore = async (req, res) => {
  try {
    const { score } = req.body;
    const { uid, email } = req.user;

    console.log("Score reçu (brut):", {
      body: req.body,
      score: score,
      type: typeof score,
    });

    // Conversion du score en nombre
    let newScore = score;
    if (typeof score === "string") {
      newScore = parseInt(score, 10);
    } else if (typeof score === "number") {
      newScore = score;
    } else {
      console.error("Type de score inattendu:", typeof score);
      return res.status(400).json({
        error: "Score invalide",
        details: `Type inattendu: ${typeof score}`,
        recu: score,
      });
    }

    // Vérification du score après conversion
    if (isNaN(newScore)) {
      console.error("Score invalide après conversion:", {
        original: score,
        converti: newScore,
      });
      return res.status(400).json({
        error: "Score invalide",
        details: "Conversion impossible en nombre",
        recu: score,
      });
    }

    const usersRef = collection(db, "users");
    let querySnapshot;

    // Chercher d'abord par uid
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
      console.log("Utilisateur non trouvé pour:", { uid, email });
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    const currentScore = Number(userData.bestscore || 0);

    console.log("Comparaison des scores:", {
      nouveau: newScore,
      nouveauType: typeof newScore,
      actuel: currentScore,
      actuelType: typeof currentScore,
    });

    if (newScore > currentScore) {
      await updateDoc(doc(db, "users", userDoc.id), {
        bestscore: newScore,
      });
      console.log("Score mis à jour avec succès");
      res.status(200).json({
        message: "Score mis à jour avec succès",
        oldScore: currentScore,
        newScore: newScore,
      });
    } else {
      console.log("Score non mis à jour car pas meilleur");
      res.status(200).json({
        message: "Score non mis à jour (pas meilleur que le précédent)",
        currentScore: currentScore,
        tentativeScore: newScore,
      });
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du score:", error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la mise à jour du score" });
  }
};

module.exports = { getScores, setScore };
