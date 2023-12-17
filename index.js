// Importer la classe GameInstance depuis le fichier GameInstance.js (avec la casse correcte)
import { gameInstance } from './src/GameInstance.js';

// Créer un objet canvas à partir de l'élément HTML
const canvas = document.getElementById('gameCanvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Créer une nouvelle instance de jeu à partir de la classe GameInstance
const game = new gameInstance(canvas);

// Lancer le jeu
game.start();