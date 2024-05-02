import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { firebaseApp } from "../../../models/firebaseModel.js";

const auth = getAuth(firebaseApp);

document.getElementById('loginBtn').addEventListener('click', login);

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await signInWithEmailAndPassword(auth, email, password);

        if (response.user) {
            sessionStorage.setItem('connexion_reussie', true);
            window.location.href = '/public/index.html';
        } else {
            displayError(data.error || 'Échec de la connexion');
        }

    } catch (error) {
        displayError('Échec de la connexion: ' + error.message);
    }
}

function displayError(errorMessage) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = errorMessage;
    errorSection.classList.remove('hidden');
}