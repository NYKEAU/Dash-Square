import { gameInstance } from './src/game/GameInstance.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-auth.js";
import { firebaseApp } from "../models/firebaseModel.js";
import { createJoystick } from './src/game/joystick.js';

const auth = getAuth(firebaseApp);

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('connectDiv').style.display = 'none';
        document.getElementById('userDiv').style.display = 'flex';
    } else {
        document.getElementById('connectDiv').style.display = 'flex';
        document.getElementById('userDiv').style.display = 'none';
    }
});

// Créer un objet canvas à partir de l'élément HTML
const canvas = document.getElementById('gameCanvas');

// Créer un objet du menu de démarrage
const startMenu = document.getElementById('startMenu');

// Créer une variable pour savoir si le joystick a déjà été créé durant la session
let alreadyCreatedJoystick = false;

document.getElementById('startButton').addEventListener('click', function () {
    // Cacher le menu "Start"
    startMenu.style.display = 'none';

    // Afficher le jeu
    canvas.style.display = 'block';

    // Commencer le jeu
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Créer une nouvelle instance de jeu à partir de la classe GameInstance
    const game = new gameInstance(canvas);

    const parent = document.getElementById('wrapper');

    // Vérifier si le mode mobile est activé
    if (document.getElementById('mobileMode').checked) {
        console.log('Mode mobile activé');
        parent.style.display = 'block';
        if (alreadyCreatedJoystick === false) {
            createJoystick(parent);
            alreadyCreatedJoystick = true;
        }
    }

    // Ajouter des gestionnaires d'événements pour les boutons du menu de pause si ceux-ci sont existants
    document.getElementById('shopClose').addEventListener('click', () => game.resumeGame());
    document.getElementById('resumeButton').addEventListener('click', () => game.resumeGame());
    document.getElementById('restartButton').addEventListener('click', () => game.quitGame());
    document.getElementById('quitButton').addEventListener('click', () => game.quitGame());

    // Lancer le jeu
    game.start();
});