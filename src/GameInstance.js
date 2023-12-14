// Importer les classes Player et Enemy depuis les fichiers player.js et enemy.js
import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { Projectile } from './projectile.js';

// Définir la classe GameInstance
export class GameInstance {
    // Définir le constructeur de la classe
    constructor(canvas) {
        // Initialiser les propriétés de l'instance de jeu
        this.canvas = canvas; // L'objet canvas
        this.context = canvas.getContext('2d'); // Le contexte de dessin du canvas
        this.screenWidth = window.innerWidth; // La largeur de l'écran du navigateur
        this.screenHeight = window.innerHeight; // La hauteur de l'écran du navigateur
        this.mapWidth = this.screenWidth * 1.5; // La largeur de la carte (1.5 fois la largeur de l'écran)
        this.mapHeight = this.screenHeight * 1.5; // La hauteur de la carte (1.5 fois la hauteur de l'écran)
        this.player = new Player(this.mapWidth / 2, this.mapHeight / 2); // Le joueur
        this.enemies = []; // Le tableau des ennemis
        this.keys = {}; // L'objet pour stocker l'état des touches enfoncées
        this.addEventListeners(); // Ajouter les écouteurs d'événements
        this.addEnemy(); // Ajouter un premier ennemi
        this.addEnemyInterval = setInterval(() => this.addEnemy(), 5000); // Ajouter un nouvel ennemi toutes les 5 secondes
        this.player = new Player(this.mapWidth / 2, this.mapHeight / 2);
        this.projectiles = [];
    }

    // Méthode pour ajouter les écouteurs d'événements
    addEventListeners() {
        // Gestion des touches enfoncées
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    // Méthode pour ajouter un nouvel ennemi
    addEnemy() {
        // Créer une nouvelle instance d'ennemi à partir de la classe Enemy
        const enemy = new Enemy(this.player, this.mapWidth, this.mapHeight);

        // Ajouter l'ennemi au tableau des ennemis
        this.enemies.push(enemy);
    }

    // Méthode pour lancer le jeu
    start() {
        // Appeler les méthodes de mise à jour et de dessin du jeu
        this.update();
        this.draw();
        this.shootProjectile();
    }

    // Tirer un projectile toutes les 2 secondes
    shootProjectile() {
        setInterval(() => {
            const projectile = this.player.shoot(this.enemies);
            if (projectile) {
                this.projectiles.push(projectile);
            }
            console.log(this.enemies);
        }, 2000);
    }

    // Méthode pour mettre à jour le jeu
    update() {
        // Appeler la méthode de déplacement du joueur
        this.player.move(this.keys, this.mapWidth, this.mapHeight);

        // Appeler la méthode de déplacement de chaque ennemi
        for (let enemy of this.enemies) {
            enemy.move(this.player);
        }

        // Appeler la méthode de vérification des collisions entre les ennemis
        this.checkEnemyCollisions();

        // Déplacer et dessiner chaque projectile
        for (let i = 0; i < this.projectiles.length; i++) {
            this.projectiles[i].move();
            this.projectiles[i].draw(this.context);
        }

        for (let i = 0; i < this.projectiles.length; i++) {
            for (let j = 0; j < this.enemies.length; j++) {
                if (this.projectiles[i].collidesWith(this.enemies[j])) {
                    // Supprimer l'ennemi
                    this.enemies.splice(j, 1);
                    break;
                }
            }
        }

        // Autres mises à jour du jeu...
        // ...

        // Demander une nouvelle animation
        requestAnimationFrame(() => this.update());
    }

    // Méthode pour dessiner le jeu
    draw() {
        // Effacer le canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculer la position de départ pour dessiner la carte centrée sur le joueur
        const mapStartX = this.canvas.width / 2 - this.player.x - this.player.width / 2;
        const mapStartY = this.canvas.height / 2 - this.player.y - this.player.height / 2;

        // Dessiner le décor (arrière-plan) centré sur le joueur
        this.context.fillStyle = 'lightblue'; // Couleur de la carte
        this.context.fillRect(mapStartX, mapStartY, this.mapWidth, this.mapHeight);

        // Dessiner le joueur au milieu de l'écran
        this.player.draw(this.context, this.canvas.width / 2 - this.player.width / 2, this.canvas.height / 2 - this.player.height / 2);

        // Dessiner tous les ennemis
        for (let enemy of this.enemies) {
            enemy.draw(this.context, mapStartX, mapStartY);
        }

        // Demander une nouvelle animation
        requestAnimationFrame(() => this.draw());
    }

    // Méthode pour vérifier les collisions entre les ennemis
    checkEnemyCollisions() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                const dx = this.enemies[i].x - this.enemies[j].x;
                const dy = this.enemies[i].y - this.enemies[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.enemies[i].width / 2 + this.enemies[j].width / 2) {
                    // Les ennemis se chevauchent, les faire rebondir dans des directions opposées
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    this.enemies[i].x += this.enemies[i].speed * cos;
                    this.enemies[i].y += this.enemies[i].speed * sin;
                    this.enemies[j].x -= this.enemies[j].speed * cos;
                    this.enemies[j].y -= this.enemies[j].speed * sin;

                    // Vérifier si les ennemis sont à l'intérieur de la zone de jeu
                    this.enemies[i].x = Math.max(0, Math.min(this.mapWidth - this.enemies[i].width, this.enemies[i].x));
                    this.enemies[i].y = Math.max(0, Math.min(this.mapHeight - this.enemies[i].height, this.enemies[i].y));
                    this.enemies[j].x = Math.max(0, Math.min(this.mapWidth - this.enemies[j].width, this.enemies[j].x));
                    this.enemies[j].y = Math.max(0, Math.min(this.mapHeight - this.enemies[j].height, this.enemies[j].y));
                }
            }
        }
    }
}
