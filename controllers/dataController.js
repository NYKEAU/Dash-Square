const { collection, addDoc, query, where, getDocs, updateDoc, doc, getDoc, deleteDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const db = require('../models/firebaseModel');
const cookie = require('cookie');
const admin = require('firebase-admin');

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const auth = getAuth();
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        const cookieOptions = {
            httpOnly: true,
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: 'None',
            secure: true
        };

        res.setHeader('Set-Cookie', cookie.serialize('token', token, cookieOptions));

        // Vérifier si l'utilisateur est connecté et renvoyer les informations de l'utilisateur
        res.status(200).json({ uid: user.uid, email: user.email, token, loggedIn: true });
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        res.status(401).json({ error: 'Identifiants invalides', details: error.message });
    }
};

const register = async (req, res) => {
    const { email, password, pseudo } = req.body;

    try {
        // Vérification de l'unicité du pseudo
        const q = query(collection(db, 'users'), where('pseudo', '==', pseudo));
        const userRef = await getDocs(q);

        if (!userRef.empty) {
            return res.status(400).json({ error: 'Le pseudo est déjà pris. Veuillez en choisir un autre.' });
        }

        const auth = getAuth();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userData = {
            uid: user.uid,
            email: user.email,
            pseudo: pseudo,
            bestscore: 0
        };
        const newUserRef = await addDoc(collection(db, 'users'), userData);

        // Connecter l'utilisateur après son inscription
        await login(req, res);
    } catch (error) {
        console.error('Erreur lors de l\'inscription utilisateur', error);
        res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
};




const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        const response = { Status: "Success" };
        res.json(response);
    } catch (error) {
        res.json("Erreur");
    }
};


const getUserInfo = async (req, res) => {
    try {
        const { uid } = req.user;

        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        let userDoc;
        querySnapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });

        if (!userDoc) {
            console.error('Utilisateur non trouvé dans la base de données.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const userData = userDoc.data();
        res.status(200).json({
            uid: userData.uid,
            email: userData.email,
            pseudo: userData.pseudo,
            bestscore: userData.bestscore,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur', error);
        res.status(500).send('Erreur serveur');
    }
};


const updateScore = async (req, res) => {
    try {
        const { uid } = req.user;

        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);
        let userDoc;
        querySnapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });

        if (!userDoc) {
            console.error('Utilisateur non trouvé dans la base de données.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        const { bestscore } = req.body;

        if (bestscore > userDoc.data().bestscore) {
            await updateDoc(userDoc.ref, { bestscore });
            res.status(200).json({ message: 'Nouveau meilleur score mis à jour avec succès' });
        } else {
            res.status(200).json({ message: 'Le score reçu n\'est pas supérieur au meilleur score actuel. Aucune mise à jour effectuée.' });
        }
    } catch (error) {
        console.error('Erreur lors de la modification du score de l\'utilisateur', error);
        res.status(500).send('Erreur serveur');
    }
};

const leaderboard = async (req, res) => {
    try {
        const usersRef = collection(db, 'users');
        const querySnapshot = await getDocs(usersRef);

        let leaderboard = [];

        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            leaderboard.push({
                uid: userData.uid,
                pseudo: userData.pseudo,
                bestscore: userData.bestscore
            });
        });

        leaderboard.sort((a, b) => b.bestscore - a.bestscore);

        leaderboard = leaderboard.slice(0, 10); // Limite le leaderboard à 10 utilisateurs

        res.status(200).json({ leaderboard });
    } catch (error) {
        console.error('Erreur lors de la génération du leaderboard', error);
        res.status(500).send('Erreur serveur');
    }
};

const deleteAccount = async (req, res) => {
    try {
        const { uid } = req.user;

        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('uid', '==', uid));
        const querySnapshot = await getDocs(q);

        let userDoc;
        querySnapshot.forEach((doc) => {
            userDoc = doc;
        });

        if (!userDoc) {
            console.error('Utilisateur non trouvé dans la base de données.');
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        await deleteDoc(userDoc.ref);
        await admin.auth().deleteUser(uid);

        res.status(200).json({ message: 'Compte utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du compte utilisateur', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { login, logout, register, getUserInfo, updateScore, leaderboard, deleteAccount };