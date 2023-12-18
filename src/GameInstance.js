import { Player } from './player.js';
import { Enemy } from './enemy.js';

// Définir la classe GameInstance
export class gameInstance {
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
        this.logPlayerPosition(); // Ajoutez cette ligne pour démarrer le suivi de la position du joueur
        this.addEnemyInterval = setInterval(() => this.addEnemy(), 5000); // Ajouter un nouvel ennemi toutes les 5 secondes
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
        const enemy = new Enemy(this.player, this.mapWidth, this.mapHeight, 100, 10);

        // Ajouter l'ennemi au tableau des ennemis
        this.enemies.push(enemy);
    }

    // Méthode pour lancer le jeu
    start() {
        // Appeler les méthodes de mise à jour et de dessin du jeu
        this.draw();
        this.update();
    }

    // Ajoutez cette fonction à la classe GameInstance
    logPlayerPosition() {
        setInterval(() => {
            console.log('Player position:', this.player.x, this.player.y);
        }, 2000);
    }

    // Méthode pour mettre à jour le jeu
    update() {
        // Appeler la méthode de déplacement du joueur
        this.player.move(this.keys, this.mapWidth, this.mapHeight, this.enemies);

        // Mettre à jour la position et la santé de chaque ennemi
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];

            // Si l'ennemi n'est pas en collision avec le joueur, mettre à jour sa position
            if (!enemy.isCollidingWithPlayer(this.player)) {
                enemy.move(this.player);
            }

            // Gérer la collision entre l'ennemi et le joueur
            enemy.handleCollisionWithPlayer(this.player);

            // Si l'ennemi est mort, le retirer de la liste des ennemis
            if (enemy.isDead) {
                this.enemies.splice(i, 1);
                i--;
            }
        }

        // Appeler la méthode de vérification des collisions entre les ennemis
        this.checkEnemyCollisions();

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
            enemy.drawHealthBar(this.context, mapStartX, mapStartY);
        }

        // Dessiner l'ATH
        this.player.drawHealthBar(this.context);
        this.player.drawExperienceBar(this.context);

        // Dessiner les effets de hit
        for (let hitEffect of this.player.hitEffects) {
            hitEffect.draw(this.context, this.canvas.width, this.canvas.height);
        }

        // Supprimer les effets de hit qui ont expiré
        this.player.hitEffects = this.player.hitEffects.filter(hitEffect => hitEffect.duration > 0);

        // Dessiner les effets de hit des ennemis
        for (let enemy of this.enemies) {
            for (let hitEffect of enemy.hitEffects) {
                hitEffect.draw(this.context, this.canvas.width, this.canvas.height);
            }
            // Supprimer les effets de hit qui ont expiré
            enemy.hitEffects = enemy.hitEffects.filter(hitEffect => hitEffect.duration > 0);
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
