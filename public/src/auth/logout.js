import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { firebaseApp } from "../../../models/firebaseModel.js";

document.getElementById('logoutBtn').addEventListener('click', logout);

async function logout() {
    const auth = getAuth(firebaseApp);

    try {
        await auth.signOut();

        alert('Déconnexion réussie');
        console.log('Utilisateur déconnecté :');
        window.location.href = '/public/index.html';

    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur :', error);
        alert('Échec de la déconnexion : ' + error.message);
    }
}
