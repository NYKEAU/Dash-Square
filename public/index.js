import { gameInstance } from './src/game/GameInstance.js';
import '../models/firebaseModel.js';

// Créer un objet canvas à partir de l'élément HTML
const canvas = document.getElementById('gameCanvas');

// Créer un objet du menu de démarrage
const startMenu = document.getElementById('startMenu');

// Ajouter un gestionnaire de connexion pour afficher ou cacher le menu de connexion
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // L'utilisateur est connecté
        document.getElementById('connectDiv').style.display = 'none';
        document.getElementById('userDiv').style.display = 'block';
    } else {
        // L'utilisateur n'est pas connecté
        document.getElementById('connectDiv').style.display = 'block';
        document.getElementById('userDiv').style.display = 'none';
    }
});

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