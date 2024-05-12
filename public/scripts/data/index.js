import { user } from "./user.js";
import { score } from "./score.js";

let currentUser = null;

function displayRegisterUserError(errorMessage) {
    const errorSection = document.getElementById('userRegisterError');
    errorSection.textContent = errorMessage;
    errorSection.style.opacity = 1;
    errorSection.style.display = 'block';
    setTimeout(() => {
        errorSection.style.opacity = 0;
        errorSection.style.display = 'none';
    }, 5000);
}
function displayLoginUserError(errorMessage) {
    const errorSection = document.getElementById('userLoginError');
    errorSection.textContent = errorMessage;
    errorSection.style.opacity = 1;
    errorSection.style.display = 'block';
    setTimeout(() => {
        errorSection.style.opacity = 0;
        errorSection.style.display = 'none';
    }, 5000);
}

const backArrow = document.getElementById("backArrow");
backArrow.addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById('loginRegisterMenu').style.display = 'none';
    document.getElementById('startMenu').style.display = 'flex';
    document.getElementById('leaderboardMenu').style.display = 'flex';
});

const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const pseudoInput = document.getElementById("text");
    const passwordInput = document.getElementById("password");
    const passwordConfirmInput = document.getElementById("password2");

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
        displayRegisterUserError("Veuillez remplir tous les champs.");
        return;
    }

    if (passwordInput.value !== passwordConfirmInput.value) {
        displayRegisterUserError("Les mots de passe ne correspondent pas.");
        return;
    }

    if (passwordInput.value.length < 6) {
        displayRegisterUserError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
    }

    try {
        const response = await user.auth.register(pseudoInput.value, passwordInput.value);
        if (response.error) {
            displayRegisterUserError(response.error);
        } else {
            console.log("Inscription réussie:", response);
            document.getElementById('loginRegisterMenu').style.display = 'none';
            document.getElementById('startMenu').style.display = 'flex';
            document.getElementById('leaderboardMenu').style.display = 'flex';
        }
    } catch (error) {
        console.error("Registration error:", error);
        displayRegisterUserError(error.message);
    }
});

const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const pseudoInput = document.getElementById("login-text");
    const passwordInput = document.getElementById("login-password");

    if (pseudoInput.value.trim() === '' || passwordInput.value.trim() === '') {
        displayLoginUserError("Veuillez remplir tous les champs.");
        return;
    }

    try {
        const data = await user.auth.login(pseudoInput.value, passwordInput.value);
        if (data.error) {
            console.error('Login error:', data.error);
            displayLoginUserError('Échec de la connexion: ' + data.error);
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
        } else {
            console.log('Connexion réussie');
            console.log('Utilisateur connecté:', data);
            initUser();
            document.getElementById('loginRegisterMenu').style.display = 'none';
            document.getElementById('connectDiv').style.display = 'none';
            document.getElementById('userDiv').style.display = 'flex';
            document.getElementById('leaderboardMenu').style.display = 'flex';
            document.getElementById('startMenu').style.display = 'flex';
        }
    } catch (error) {
        console.error('Erreur lors de la connexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
        displayLoginUserError('Échec de la connexion: ' + error.message);
    }
});

function isLogged() {
    user.auth.getUser().then((data) => {
        if (data) {
            console.log('Utilisateur connecté:', data);
            document.getElementById('connectDiv').style.display = 'none';
            document.getElementById('userDiv').style.display = 'flex';
        } else {
            console.log('Utilisateur non connecté');
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
        }
    }).catch((error) => {
        console.error('Erreur lors de la vérification de la connexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
    });
}

const logout = document.getElementById("logoutBtn");
logout.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const data = await user.auth.logout();
        if (data.error) {
            console.error('Logout error:', data.error);
            document.getElementById('connectDiv').style.display = 'none';
            document.getElementById('userDiv').style.display = 'flex';
        } else {
            console.log('Déconnexion réussie');
            console.log('Utilisateur déconnecté:', data);
            document.getElementById('connectDiv').style.display = 'flex';
            document.getElementById('userDiv').style.display = 'none';
            initUser();
        }
    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur', error);
        document.getElementById('connectDiv').style.display = 'none';
        document.getElementById('userDiv').style.display = 'flex';
    }
});

document.addEventListener("DOMContentLoaded", async (event) => {
    initUser();
    isLogged();
    getScores();
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
initUser();

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