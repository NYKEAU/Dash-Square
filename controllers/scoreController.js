const {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  where,
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
    const { uid } = req.user;
    const { bestscore } = req.body;

    console.log("=== Debug setScore ===");
    console.log("1. User data:", {
      uid,
      bestscore,
      userObject: req.user,
    });
    console.log("2. Request headers:", req.headers);

    if (!uid) {
      console.log("3. Error: No UID found");
      return res.status(401).json({ error: "Utilisateur non authentifié" });
    }

    const usersRef = collection(db, "users");
    console.log("4. Collection reference created");

    const q = query(usersRef, where("uid", "==", uid));
    console.log("5. Query created:", q);

    try {
      const querySnapshot = await getDocs(q);
      console.log("6. Query executed, empty?", querySnapshot.empty);
      console.log("7. Number of docs found:", querySnapshot.size);

      if (querySnapshot.empty) {
        console.log("8. No user document found for uid:", uid);
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }

      const userDoc = querySnapshot.docs[0];
      console.log("9. User document found:", {
        id: userDoc.id,
        path: userDoc.ref.path,
        exists: userDoc.exists(),
      });

      const userData = userDoc.data();
      console.log("10. Current user data:", userData);

      const currentScore = userData.bestscore || 0;
      console.log("11. Score comparison:", {
        current: currentScore,
        new: bestscore,
        willUpdate: bestscore > currentScore
      });

      if (bestscore > currentScore) {
        try {
          await updateDoc(userDoc.ref, { bestscore });
          console.log("12. Score updated successfully");
          res.status(200).json({ message: "Score mis à jour", bestscore });
        } catch (updateError) {
          console.error("13. Update error:", updateError);
          console.error("14. Update error details:", {
            code: updateError.code,
            message: updateError.message,
            stack: updateError.stack
          });
          throw updateError;
        }
      } else {
        console.log("12. Score not updated (new score not higher)");
        res.status(200).json({ 
          message: "Score non mis à jour", 
          bestscore: currentScore 
        });
      }
    } catch (queryError) {
      console.error("Error during query:", queryError);
      throw queryError;
    }
  } catch (error) {
    console.error("=== Error in setScore ===");
    console.error("Error object:", {
      code: error.code,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message,
      stack: error.stack,
    });
  }
};

module.exports = { getScores, setScore };
