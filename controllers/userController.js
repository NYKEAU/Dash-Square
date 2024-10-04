const { collection, addDoc, query, where, getDocs } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider } = require('firebase/auth');
const db = require('../models/firebaseModel');

const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const auth = getAuth();
        let userEmail = identifier;

        const isEmail = identifier.includes('@');

        if (!isEmail) {
            const userQuery = query(collection(db, 'users'), where('pseudo', '==', identifier));
            const querySnapshot = await getDocs(userQuery);

            if (querySnapshot.empty) {
                throw new Error('Utilisateur non trouvé avec ce pseudo');
            }

            const userDoc = querySnapshot.docs[0];
            userEmail = userDoc.data().email;
        }

        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
        const user = userCredential.user;
        const token = await user.getIdToken();

        await addDoc(collection(db, 'tokens'), { uid: user.uid, token });

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 365 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({ uid: user.uid, email: user.email, token });
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        res.status(401).json({ error: 'Identifiants invalides', details: error.message });
    }
};

// const loginWithGoogle = async (req, res) => {
//     try {
//         const { idToken } = req.body;
//         const auth = getAuth();
//         const credential = GoogleAuthProvider.credential(idToken);
//         const userCredential = await signInWithCredential(auth, credential);
//         const user = userCredential.user;

//         // Gérer la session, créer un token JWT, etc.
//         const token = await user.getIdToken();

//         // Enregistre ou utilise le token
//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict',
//             maxAge: 365 * 24 * 60 * 60 * 1000
//         });

//         res.status(200).json({ uid: user.uid, email: user.email, token });
//     } catch (error) {
//         console.error('Erreur lors de la connexion utilisateur', error);
//         res.status(401).json({ error: 'Identifiants invalides', details: error.message });
//     }
// };

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const auth = getAuth();
        await sendPasswordResetEmail(auth, email);
        res.status(200).json({ message: 'Email de réinitialisation envoyé' });
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
        res.status(400).json({ error: 'Erreur lors de la réinitialisation du mot de passe', details: error.message });
    }
};

const register = async (req, res) => {
    const { pseudo, email, password, score } = req.body;

    try {
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
            pseudo: pseudo,
            email: email,
            bestscore: score ?? 0
        };
        await addDoc(collection(db, 'users'), userData);

        const loginReq = {
            body: {
                identifier: email,
                password: password
            }
        };

        await login(loginReq, res);

    } catch (error) {
        console.error('Erreur lors de l\'inscription utilisateur', error);
        res.status(400).json({ error: 'Erreur lors de l\'inscription', details: error.message });
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Déconnexion réussie' });
    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur', error);
        res.status(500).json({ error: 'Erreur serveur lors de la déconnexion' });
    }
};

const getUser = async (req, res) => {
    try {
        const { uid } = req.user;
        const dataRef = collection(db, 'users');
        const snapshot = await getDocs(dataRef);

        let userDoc;
        snapshot.forEach((doc) => {
            if (doc.data().uid === uid) {
                userDoc = doc;
            }
        });
        if (!userDoc) {
            console.error('Utilisateur non trouvé.');
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
        console.error('Erreur lors de la récupération des données', error);
        res.status(500).send('Erreur serveur');
    }
};

module.exports = { getUser, login, forgotPassword, register, logout };
// module.exports = { getUser, login, loginWithGoogle, forgotPassword, register, logout };