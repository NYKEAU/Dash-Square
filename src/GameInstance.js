import { Player } from './player.js';
import { Enemy } from './enemy.js';
import { SniperProjectile } from './projectile.js';

// Définir la classe GameInstance
export class gameInstance {
    // Définir le constructeur de la classe
    constructor(canvas) {
        // Initialiser les propriétés de l'instance de jeu
        this.startTime = Date.now();
        this.canvas = canvas; // L'objet canvas
        this.context = canvas.getContext('2d'); // Le contexte de dessin du canvas
        this.screenWidth = window.innerWidth; // La largeur de l'écran du navigateur
        this.screenHeight = window.innerHeight; // La hauteur de l'écran du navigateur
        this.mapWidth = this.screenWidth * 1.5; // La largeur de la carte (1.5 fois la largeur de l'écran)
        this.mapHeight = this.screenHeight * 1.5; // La hauteur de la carte (1.5 fois la hauteur de l'écran)
        this.player = new Player(this.mapWidth / 2, this.mapHeight / 2, this); // Le joueur
        this.enemies = []; // Le tableau des ennemis
        this.keys = {}; // L'objet pour stocker l'état des touches enfoncées
        this.addEventListeners(); // Ajouter les écouteurs d'événements
        // this.logPlayerPosition(); // Ajoutez cette ligne pour démarrer le suivi de la position du joueur
        this.addEnemyInterval = null; // L'identifiant de l'intervalle pour ajouter des ennemis
        this.spawnFrequency = 5000;
        this.coins = []; // Le tableau des pièces
        this.enemiesWithGeneratedCoins = [];
        this.enemiesWithGeneratedCoins = new Set();
    }

    // Méthode pour ajouter les écouteurs d'événements
    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });
    }

    // Méthode pour démarrer la génération d'ennemis
    startEnemyGeneration(level) {
        // Définir la fréquence de spawn des ennemis en fonction de l'avancement du jeu
        if (level % 5 == 0) {
            this.spawnFrequency = Math.floor(this.spawnFrequency * 0.9);
        }

        console.log('Spawn frequency:', this.spawnFrequency);

        this.addEnemyInterval = setInterval(() => this.addEnemy(50, 5, 10), this.spawnFrequency);
    }

    // Méthode pour ajouter un nouvel ennemi
    addEnemy(baseHealth, damage, xpGived) {
        // Créer une nouvelle instance d'ennemi à partir de la classe Enemy
        const enemy = new Enemy(this.player, this.mapWidth, this.mapHeight, baseHealth, damage, xpGived);

        // Ajouter l'ennemi au tableau des ennemis
        this.enemies.push(enemy);
    }

    // Nouvelle méthode pour arrêter la génération d'ennemis
    stopEnemyGeneration() {
        clearInterval(this.addEnemyInterval);
        this.addEnemyInterval = null;
    }

    // Méthode pour lancer le jeu
    start() {
        // Appeler les méthodes de mise à jour et de dessin du jeu
        this.draw();
        this.update();
        this.startEnemyGeneration();

        this.player.weapon.startShooting();
    }

    // Méthode pour obtenir le temps écoulé depuis le début du jeu en format "00:00"
    getElapsedTime() {
        const totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
    }

    // Méthode pour mettre à jour le jeu
    update() {
        // Appeler la méthode de déplacement du joueur
        this.player.move(this.keys, this.mapWidth, this.mapHeight, this.enemies);

        // Mettre à jour la position de chaque projectile
        for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
            const projectile = this.player.projectiles[i];

            // Vérifier si le projectile est défini
            if (projectile) {
                // Déplacer le projectile
                projectile.move();

                // Supprimer le projectile s'il est sorti des limites de la carte
                if (projectile.x < 0 || projectile.y < 0 || projectile.x > this.mapWidth || projectile.y > this.mapHeight) {
                    this.player.projectiles.splice(i, 1);
                    continue;
                }
            }

            // Vérifier la collision avec chaque ennemi
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];

                // Vérifier la collision avec chaque ennemi
                for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
                    const projectile = this.player.projectiles[i];

                    const dx = projectile.x - enemy.x - enemy.width / 2;
                    const dy = projectile.y - enemy.y - enemy.height / 2;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < projectile.size + Math.hypot(enemy.width / 2, enemy.height / 2)) {
                        // Collision détectée, réduire la santé de l'ennemi
                        this.enemies[j].decreaseHealth(this.player.damage, projectile.direction, projectile.speed);

                        // Si le projectile n'est pas un projectile de Sniper, le supprimer
                        if (!(projectile instanceof SniperProjectile)) {
                            this.player.projectiles.splice(i, 1);
                        }
                        break;
                    }
                }
            }
        }

        // Mettre à jour la position et la santé de chaque ennemi
        for (let i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];

            // Si l'ennemi est mort, vérifier si tous les effets de coup associés à cet ennemi ont fini de s'afficher
            if (enemy.isDead && !enemy.coinGenerated) {
                // Générer la pièce
                const coin = enemy.generateCoin(this.mapHeight, this.mapWidth);
                if (coin) {
                    // Ajouter la pièce à la liste des objets à dessiner ou gérer
                    this.coins.push(coin);
                    // Marquer l'ennemi comme ayant généré une pièce
                    enemy.coinGenerated = true;
                }

                // Supprimer l'ennemi
                this.enemies.splice(i, 1);
                this.player.increaseExperience(enemy.xpGived);
                i--;
            }

            // Mettre à jour les particules de chaque ennemi
            for (let j = enemy.particles.length - 1; j >= 0; j--) {
                const particle = enemy.particles[j];
                particle.update();

                // Supprimer la particule si sa taille est inférieure ou égale à zéro
                if (particle.size <= 0) {
                    enemy.particles.splice(j, 1);
                }
            }

            // Si l'ennemi n'est pas en collision avec le joueur, mettre à jour sa position
            if (!enemy.isCollidingWithPlayer(this.player)) {
                enemy.move(this.player);
            }

            // Vérifier les collisions entre le joueur et les ennemis
            if (this.player.isCollidingWithEnemy(enemy)) {
                // Gérer la collision entre le joueur et l'ennemi
                enemy.handleCollisionWithPlayer(this.player);
            }
        }

        // Mettre à jour la position de chaque projectile
        for (let projectile of this.player.projectiles) {
            projectile.move();
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

        // Dessiner toutes les pièces et vérifier la collision avec le joueur
        for (let i = 0; i < this.coins.length; i++) {
            if (this.player.isCollidingWithCoin(this.coins[i])) {
                // Supprimer la pièce si le joueur est en collision avec elle
                this.player.increaseMoney(this.coins[i].value);
                this.coins.splice(i, 1);
                i--; // Ajuster l'index après la suppression
            } else {
                this.coins[i].draw(this.context, mapStartX, mapStartY);
            }
        }

        // Dessiner tous les projectiles
        for (let projectile of this.player.projectiles) {
            projectile.draw(this.context, mapStartX, mapStartY);
        }

        // Dessiner le joueur au milieu de l'écran
        this.player.draw(this.context, this.canvas.width / 2 - this.player.width / 2, this.canvas.height / 2 - this.player.height / 2, mapStartX, mapStartY);

        // Dessiner tous les ennemis
        for (let enemy of this.enemies) {
            enemy.draw(this.context, mapStartX, mapStartY);
            enemy.drawHealthBar(this.context, mapStartX, mapStartY);
        }

        // Dessiner l'ATH
        this.player.drawHealthBar(this.context);
        this.player.drawExperienceBar(this.context);
        this.player.drawMoney(this.context);

        // Supprimer les effets de hit qui ont expiré
        this.player.hitEffects = this.player.hitEffects.filter(hitEffect => hitEffect.duration > 0);

        // Timer
        this.context.fillStyle = 'black';
        this.context.font = '30px Arial';
        const timerText = this.getElapsedTime();
        const textWidth = this.context.measureText(timerText).width;
        this.context.fillText(timerText, (this.canvas.width - textWidth) / 2, this.canvas.height - 10);

        // Demander une nouvelle animation
        requestAnimationFrame(() => this.draw());
    }

    // Trouver l'ennemi le plus proche
    getClosestEnemy() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (let enemy of this.enemies) {
            if (enemy.isDead) {
                enemy.width = 0;
                enemy.height = 0;
                continue;
            }

            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    // Méthode pour vérifier les collisions entre les ennemis
    checkEnemyCollisions() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                const dx = this.enemies[i].x - this.enemies[j].x;
                const dy = this.enemies[i].y - this.enemies[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.enemies[i].width / 2 + this.enemies[j].width / 2) {
                    // Les ennemis se chevauchent, les déplacer hors de collision
                    const overlap = this.enemies[i].width / 2 + this.enemies[j].width / 2 - distance;
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    this.enemies[i].x += overlap * cos / 2;
                    this.enemies[i].y += overlap * sin / 2;
                    this.enemies[j].x -= overlap * cos / 2;
                    this.enemies[j].y -= overlap * sin / 2;

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
