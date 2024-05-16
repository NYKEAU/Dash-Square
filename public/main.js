import { gameInstance } from './scripts/game/GameInstance.js';
import { createJoystick } from './scripts/game/joystick.js';

const canvas = document.getElementById('gameCanvas');
const startMenu = document.getElementById('startMenu');
const leaderboardMenu = document.getElementById('leaderboardMenu');

// Créer une variable pour savoir si le joystick a déjà été créé durant la session
let alreadyCreatedJoystick = false;

document.getElementById('startButton').addEventListener('click', function () {
    // Cacher le menu "Start"
    startMenu.style.display = 'none';
    leaderboardMenu.style.display = 'none';

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
        parent.style.display = 'block';
        document.getElementById('statsSwitch').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'block';
        if (alreadyCreatedJoystick === false) {
            createJoystick(parent);
            alreadyCreatedJoystick = true;
        }
    } else {
        parent.style.display = 'none';
        document.getElementById('statsSwitch').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    // Ajouter des gestionnaires d'événements pour les boutons du menu de pause si ceux-ci sont existants
    document.getElementById('shopClose').addEventListener('click', () => game.resumeGame());
    document.getElementById('resumeButton').addEventListener('click', () => game.resumeGame());
    document.getElementById('restartButton').addEventListener('click', () => game.quitGame());
    document.getElementById('quitButton').addEventListener('click', () => game.quitGame());

    // Lancer le jeu
    game.start();
});