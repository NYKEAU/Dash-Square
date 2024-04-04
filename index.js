// Importer les fonctions d'authentification et de score
import { signUp, signIn, signOut } from './src/bdd/auth.js';
import { saveScore } from './src/bdd/scores.js';

// Importer la classe GameInstance depuis le fichier GameInstance.js (avec la casse correcte)
import { gameInstance } from './src/gameInstance.js';

// Créer un objet canvas à partir de l'élément HTML
const canvas = document.getElementById('gameCanvas');

// Créer un objet du menu de démarrage
const startMenu = document.getElementById('startMenu');

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

    // Ajouter des gestionnaires d'événements pour les boutons du menu de pause si ceux-ci sont existants
    document.getElementById('shopClose').addEventListener('click', () => game.resumeGame());
    document.getElementById('resumeButton').addEventListener('click', () => game.resumeGame());
    document.getElementById('restartButton').addEventListener('click', () => game.quitGame());
    document.getElementById('quitButton').addEventListener('click', () => game.quitGame());

    // Lancer le jeu
    game.start();
});