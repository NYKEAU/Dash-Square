const { collection, query, orderBy, limit, getDocs, updateDoc, where } = require('firebase/firestore');
const { db } = require('../models/firebaseModel');

const getScores = async (req, res) => {
    try {
        const scoresRef = collection(db, 'users');
        const q = query(scoresRef, orderBy('bestscore', 'desc'), limit(100));
        const querySnapshot = await getDocs(q);
        
        const scores = [];
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            scores.push({
                pseudo: userData.pseudo,
                bestscore: userData.bestscore
            });
        });

        res.status(200).json(scores);
    } catch (error) {
        console.error('Erreur lors de la récupération des scores:', error);
        res.status(500).json({ 
            error: "Erreur serveur", 
            details: error.message 
        });
    }
};

const setScore = async (req, res) => {
    try {
        const { uid } = req.user;
        const { bestscore } = req.body;

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ error: "Utilisateur non trouvé" });
        }

        const userDoc = querySnapshot.docs[0];
        const currentScore = userDoc.data().bestscore || 0;

        if (bestscore > currentScore) {
            await updateDoc(userDoc.ref, { bestscore });
            res.status(200).json({ message: "Score mis à jour", bestscore });
        } else {
            res.status(200).json({ message: "Score non mis à jour", bestscore: currentScore });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du score:', error);
        res.status(500).json({ 
            error: "Erreur serveur", 
            details: error.message 
        });
    }
};

module.exports = { getScores, setScore };