import { user } from "./user.js";
import { score } from "./score.js";
import { getReadableError } from '../utils/errorMessages.js';
const { auth } = user;

// Variables globales
let currentUser = null;
let isLoggedIn = false;

document.addEventListener("DOMContentLoaded", async (event) => {
    // Initialisation
    initUser();
    isLogged();
    getScores();

    // Récupération des éléments DOM
    const loginTabBtn = document.getElementById('loginTab');
    const registerTabBtn = document.getElementById('registerTab');
    const loginFormDiv = document.getElementById('loginForm');
    const registerFormDiv = document.getElementById('registerForm');
    const loginForm = document.getElementById("login-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");
    const googleLoginButton = document.getElementById('googleLoginButton');
    const googleRegisterButton = document.getElementById('googleRegisterButton');
    const backArrow = document.getElementById("backArrow");

    // Gestion des tabs
    if (loginTabBtn && registerTabBtn) {
        loginTabBtn.classList.add('active');
        registerTabBtn.classList.remove('active');
        if (loginFormDiv) loginFormDiv.style.display = 'block';
        if (registerFormDiv) registerFormDiv.style.display = 'none';

        loginTabBtn.addEventListener('click', () => {
            loginTabBtn.classList.add('active');
            registerTabBtn.classList.remove('active');
            loginFormDiv.style.display = 'block';
            registerFormDiv.style.display = 'none';
        });

        registerTabBtn.addEventListener('click', () => {
            registerTabBtn.classList.add('active');
            loginTabBtn.classList.remove('active');
            loginFormDiv.style.display = 'none';
            registerFormDiv.style.display = 'block';
        });
    }

    // Gestion des formulaires et boutons
    if (loginForm) {
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
    }

    if (forgotPasswordForm) {
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
    }

    if (googleLoginButton) {
        googleLoginButton.addEventListener('click', async () => {
            try {
                const data = await user.auth.loginWithGoogle();
                console.log('Connexion Google réussie:', data);
                initUser();
                document.getElementById('loginRegisterMenu').style.display = 'none';
                document.getElementById('connectDiv').style.display = 'none';
                document.getElementById('mobileSwitch').style.display = 'block';
                document.getElementById('userDiv').style.display = 'flex';
                document.getElementById('leaderboardMenu').style.display = 'flex';
                document.getElementById('startMenu').style.display = 'flex';
            } catch (error) {
                console.error('Erreur lors de la connexion Google:', error);
                displayError('Échec de la connexion Google: ' + error.message);
            }
        });
    }

    if (googleRegisterButton) {
        googleRegisterButton.addEventListener('click', async () => {
            try {
                const data = await user.auth.loginWithGoogle();
                console.log('Inscription Google réussie:', data);
                initUser();
                document.getElementById('loginRegisterMenu').style.display = 'none';
                document.getElementById('connectDiv').style.display = 'none';
                document.getElementById('mobileSwitch').style.display = 'block';
                document.getElementById('userDiv').style.display = 'flex';
                document.getElementById('leaderboardMenu').style.display = 'flex';
                document.getElementById('startMenu').style.display = 'flex';
            } catch (error) {
                console.error('Erreur lors de l\'inscription Google:', error);
                displayError('Échec de l\'inscription Google: ' + error.message);
            }
        });
    }

    // Gestion du retour
    if (backArrow) {
        backArrow.addEventListener("click", (event) => {
            event.preventDefault();
            document.getElementById('loginRegisterMenu').style.display = 'none';
            document.getElementById('mobileSwitch').style.display = 'block';
            document.getElementById('startMenu').style.display = 'flex';
            document.getElementById('leaderboardMenu').style.display = 'flex';
        });
    }

    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
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
    }

    // Gestion du bouton de déconnexion
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async (event) => {
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
    }

    // Gestion du bouton de connexion
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            document.getElementById('loginRegisterMenu').style.display = 'block';
            document.getElementById('mobileSwitch').style.display = 'none';
            document.getElementById('startMenu').style.display = 'none';
            document.getElementById('leaderboardMenu').style.display = 'none';
        });
    }
});

function displayError(error) {
    const errorSection = document.getElementById('errorSection');
    const message = typeof error === 'string' ? error : getReadableError(error);
    
    errorSection.textContent = message;
    errorSection.style.opacity = 1;
    errorSection.style.zIndex = 1000;
    
    setTimeout(() => {
        errorSection.style.opacity = 0;
        errorSection.style.zIndex = 0;
    }, 5000);
}

async function initUser() {
    const profil = document.getElementById("leaderboardPlace");
    try {
        const data = await user.auth.getUser();
        if (data) {
            profil.innerHTML = `
                <span id="position"></span> <b><span class="txt__label">${data.pseudo} -</span> <span class="txt__number">${data.bestscore}</span></b>
            `;
            currentUser = data;
        } else {
            profil.innerHTML = '';
            currentUser = null;
        }
    } catch (error) {
        console.error('Erreur initUser:', error);
        profil.innerHTML = '';
        currentUser = null;
    }
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
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
            isLoggedIn = false;
        }
    }).catch((error) => {
        console.error('Erreur isLogged:', error);
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
            if(user.bestscore > 0) {
                const listItem = document.createElement('tr');
                listItem.classList.add('score-item');

                let emoji = '';
                if(index === 0) {
                    emoji = '🥇';
                    listItem.innerHTML = `
                        <td class="txt__label">${emoji} - ${user.pseudo}</td>
                    `;
                } else if(index === 1) {
                    emoji = '🥈';
                    listItem.innerHTML = `
                        <td class="txt__label">${emoji} - ${user.pseudo}</td>
                    `;
                } else if(index === 2) {
                    emoji = '🥉';
                    listItem.innerHTML = `
                        <td class="txt__label">${emoji}- ${user.pseudo}</td>
                    `;
                } else {
                    listItem.innerHTML = `
                        <td class="txt__label">${index + 1} - ${user.pseudo}</td>
                    `;
                }

                listItem.innerHTML += `
                    <td class="txt__number">${user.bestscore}</td>
                `;
                board.appendChild(listItem);
            }

            if (currentUser !== null && user.pseudo === currentUser.pseudo) {
                const position = document.getElementById("position");
                position.textContent = `[${index + 1}e place]`;
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des scores', error);
    }
}

// Écouter les changements d'état d'authentification
window.addEventListener('authStateChanged', async (event) => {
    const { isLoggedIn, user } = event.detail;
    
    if (isLoggedIn) {
        try {
            // Utiliser notre fonction auth.getUser() au lieu de user.auth.getUser()
            const userData = await auth.getUser();
            if (userData) {
                document.getElementById('connectDiv').style.display = 'none';
                document.getElementById('userDiv').style.display = 'flex';
                
                const profil = document.getElementById("leaderboardPlace");
                profil.innerHTML = `
                    <span id="position"></span> <b><span class="txt__label">${userData.pseudo} -</span> <span class="txt__number">${userData.bestscore}</span></b>
                `;
                currentUser = userData;
            }
            // Rafraîchir les scores
            getScores();
        } catch (error) {
            console.error('Erreur lors de la récupération des données utilisateur:', error);
        }
    } else {
        // Réinitialiser l'interface pour un utilisateur déconnecté
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
        document.getElementById("leaderboardPlace").innerHTML = '';
        currentUser = null;
    }
});
