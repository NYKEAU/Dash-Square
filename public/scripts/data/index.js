import { user } from "./user.js";
import { score } from "./score.js";

let currentUser = null;
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", async (event) => {
    initUser();
    isLogged();
    getScores();
});

function displayError(errorMessage) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = errorMessage;
    errorSection.style.opacity = 1;
    errorSection.style.zIndex = 1000;
    setTimeout(() => {
        errorSection.style.opacity = 0;
        errorSection.style.zIndex = 0;
    }, 5000);
}

const backArrow = document.getElementById("backArrow");
backArrow.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById('loginRegisterMenu').style.display = 'none';
    document.getElementById('mobileSwitch').style.display = 'block';
    document.getElementById('startMenu').style.display = 'flex';
    document.getElementById('leaderboardMenu').style.display = 'flex';
});

async function initUser() {
    const profil = document.getElementById("leaderboardPlace");
    try {
        const data = await user.auth.getUser();
        if (data) {
            profil.innerHTML = `
                  <span id="position"></span> <b><span class="txt__label">${data.pseudo} -</span> <span class="txt__number">${data.bestscore}</span></b>
              `;
        }
    } catch (error) {
        profil.innerHTML = '';
    }
    currentUser = await user.auth.getUser();
    getScores();
}

// document.addEventListener('DOMContentLoaded', function () {
//     const watchAdButton = document.getElementById('watchAdButton');
//     if (watchAdButton) {
//         watchAdButton.addEventListener('click', function () {
//             console.log('Button clicked');
//             const adElement = document.querySelector('.adsbygoogle');
//             adElement.style.display = 'block'; // Assurez-vous que l'élément est visible
//             if (typeof adsbygoogle !== 'undefined') {
//                 (adsbygoogle = window.adsbygoogle || []).push({});
//             }
//         });
//     }

//     // Ajouter un écouteur d'événements pour le bouton de connexion Google
//     const googleLoginButton = document.getElementById('googleLoginButton');
//     if (googleLoginButton) {
//         googleLoginButton.addEventListener('click', function () {
//             fetch('/api/loginWithGoogle', { // Mise à jour de l'URL pour inclure /api
//                 method: 'POST',
//                 credentials: 'include'
//             }).then(response => {
//                 if (response.ok) {
//                     return response.json();
//                 } else {
//                     throw new Error('Erreur lors de la connexion avec Google');
//                 }
//             }).then(data => {
//                 console.log('Utilisateur connecté avec Google:', data);
//                 document.getElementById('connectDiv').style.display = 'none';
//                 document.getElementById('userDiv').style.display = 'flex';
//                 isLoggedIn = true;
//             }).catch(error => {
//                 console.error('Erreur lors de la connexion avec Google', error);
//                 document.getElementById('errorSection').style.opacity = 1;
//             });
//         });
//     }
// });

function isLogged() {
    user.auth.getUser().then((data) => {
        if (data) {
            console.log('Utilisateur connecté:', data);
            document.getElementById('connectDiv').style.display = 'none';
            document.getElementById('userDiv').style.display = 'flex';
            isLoggedIn = true;
        } else {
            console.log('Utilisateur non connecté');
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
            isLoggedIn = false;
        }
    }).catch((error) => {
        console.error('Erreur lors de la vérification de la connexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
        isLoggedIn = false;
    });
}

export async function setScore(newScore) {
    try {
        const data = await score.board.setScore(newScore);
        if (data.error) {
            console.error('Update score error:', data.error);
        } else {
            console.log('Score modifié:', data);
            initUser()
        }
    } catch (error) {
        console.error('Échec de la modification du score', error);
    }
}

export async function getScores() {
    const board = document.getElementById("leaderboard");

    try {
        const data = await score.board.getScores();

        if (data.error) {
            console.error('Scores error:', data.error);
        }

        board.innerHTML = '';

        data.forEach((user, index) => {
            const listItem = document.createElement('tr');
            listItem.classList.add('score-item');

            let emoji = '';
            if (index === 0) {
                emoji = '🥇';
            } else if (index === 1) {
                emoji = '🥈';
            } else if (index === 2) {
                emoji = '🥉';
            }

            listItem.innerHTML = `
                <td class="txt__label">${emoji}${index + 1} - ${user.pseudo}</td>
                <td class="txt__number">${user.bestscore}</td>
            `;
            board.appendChild(listItem);

            if (currentUser !== null && user.pseudo === currentUser.pseudo) {
                const position = document.getElementById("position");
                position.textContent = `[${index + 1}e place]`;
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des scores', error);
    }
}

const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudoInput = document.getElementById("text");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '' || emailInput.value.trim() === '') {
        displayError("Veuillez remplir tous les champs.");
        return;
    }

    if (!emailInput.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
        displayError("L'adresse email n'est pas valide.");
        return;
    }

    if (passwordInput.value.length < 6) {
        displayError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
        const response = await user.auth.register(pseudoInput.value, emailInput.value, passwordInput.value);
        if (response.error) {
            displayError(response.error);
        } else {
            console.log("Inscription réussie:", response);
            document.getElementById('loginRegisterMenu').style.display = 'none';
            document.getElementById('mobileSwitch').style.display = 'block';
            document.getElementById('startMenu').style.display = 'flex';
            document.getElementById('leaderboardMenu').style.display = 'flex';
        }
    } catch (error) {
        console.error("Registration error:", error);
        displayError(error.message);
    }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pseudoInput = document.getElementById("login-text");
    const passwordInput = document.getElementById("login-password");

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
        displayError("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const data = await user.auth.login(pseudoInput.value, passwordInput.value);
        if (data.error) {
            console.error('Login error:', data.error);
            displayError('Échec de la connexion: ' + data.error);
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
        } else {
            console.log('Connexion réussie');
            console.log('Utilisateur connecté:', data);
            initUser();
            document.getElementById('loginRegisterMenu').style.display = 'none';
            document.getElementById('connectDiv').style.display = 'none';
            document.getElementById('mobileSwitch').style.display = 'block';
            document.getElementById('userDiv').style.display = 'flex';
            document.getElementById('leaderboardMenu').style.display = 'flex';
            document.getElementById('startMenu').style.display = 'flex';
        }
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
        displayError('Échec de la connexion: ' + error.message);
    }
});

const forgotPasswordForm = document.getElementById("forgot-password-form");
forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const emailInput = document.getElementById("emailRecover");

    if (emailInput.value.trim() === '') {
        displayError("Veuillez entrer votre adresse email.");
        return;
    }

    try {
        const data = await user.auth.forgotPassword(emailInput.value);
        if (data.error) {
            console.error('Forgot password error:', data.error);
            displayError('Échec de la réinitialisation du mot de passe: ' + data.error);
        } else {
            console.log('Réinitialisation du mot de passe réussie:', data);
            displayError('Un email de réinitialisation du mot de passe a été envoyé.');
        }
    } catch (error) {
        console.error('Erreur lors de la réinitialisation du mot de passe', error);
        displayError('Échec de la réinitialisation du mot de passe: ' + error.message);
    }
});

const logout = document.getElementById("logoutBtn");
logout.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        await user.auth.logout();
        initUser();
        isLogged();
    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'none';
        document.getElementById('userDiv').style.display = 'flex';
    }
});
