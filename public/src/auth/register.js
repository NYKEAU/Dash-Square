import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { Firestore, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-firestore.js";
import { firebaseApp, db } from "../../../models/firebaseModel.js";

document.getElementById('registerBtn').addEventListener('click', register);

async function register() {
    const auth = getAuth(firebaseApp);
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Utilisateur enregistré : ', userCredential.user);

        const uid = userCredential.user.uid;
        await addDoc(collection(db, "scores"), { uid, pseaudo: pseudo, scoreMax: 0 });

        alert('Inscription réussie !');
        window.location.href = '/public/index.html';

    } catch (error) {
        console.error('Erreur lors de l\'inscription :', error);
        alert('Échec de l\'inscription : ' + error.message);
    }
}
