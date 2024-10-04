import { EnemyProjectile } from './projectile.js';
import { HitEffect } from './hitEffect.js';
import { Particle } from './particle.js';
import { Coin } from './coin.js';

export class Enemy {
    constructor(player, mapWidth, mapHeight, baseHealth, damage, xpGived) {
        // Autre
        this.player = player;
        this.timeoutId = null;

        // Dimensions
        this.width = 30;
        this.height = 30;
        this.radius = this.width / 2;

        // Position
        const initialPosition = this.generateRandomPosition(player, mapWidth, mapHeight);
        this.x = initialPosition.x;
        this.y = initialPosition.y;

        // Mouvement
        this.speed = 1;

        // Apparence
        this.enemyColor = 'green';
        this.image = new Image();
        // this.image.src = `../assets/Sprites/${this.constructor.name}.png`;
        this.hitEffects = [];
        this.particles = [];
        this.hitFlashDuration = 0;
        this.pourcentage = 0;

        // Combat
        this.health = this.calculateHealth(baseHealth, this.player.level);;
        this.baseHealth = this.health;
        this.damage = this.calculateDamage(damage, this.player.level);
        this.lastDamageTime = 0;
        this.lastCollisionTime = 0;
        this.lastAttackTime = 0;
        this.projectiles = []; // Initialiser les projectiles comme un tableau vide

        // Récompenses
        this.xpGived = xpGived;
        this.coinGenerated = false;
    }

    calculateDirection(targetX, targetY) {
        const dx = targetX - (this.x + this.width / 2);
        const dy = targetY - (this.y + this.height / 2);
        return Math.atan2(dy, dx);
    }

    // Méthode pour calculer la santé de l'ennemi en fonction du niveau du joueur
    calculateHealth(baseHealth, playerLevel) {
        const health = baseHealth + 2 * Math.exp(playerLevel * 0.075);
        return Math.round(health); // Arrondit à l'entier le plus proche
    }

    // Méthode pour calculer les dégâts de l'ennemi en fonction du niveau du joueur
    calculateDamage(baseDamage, playerLevel) {
        const damage = baseDamage + 2 * Math.exp(playerLevel * 0.075);
        return Math.round(damage); // Arrondit à l'entier le plus proche
    }

    // Méthode pour dessiner l'ennemi
    draw(context, mapStartX, mapStartY) {
        // Dessiner les particules
        for (let particle of this.particles) {
            context.save(); // Sauvegarder l'état actuel du contexte pour chaque particule
            context.shadowBlur = 1;
            particle.draw(context, this.width, mapStartX, mapStartY);
            context.restore(); // Restaurer l'état précédent du contexte pour chaque particule
        }

        // Dessiner les effets de coup avant de vérifier si l'ennemi est mort
        for (let hitEffect of this.hitEffects) {
            context.save(); // Sauvegarder l'état actuel du contexte pour chaque effet de coup
            context.shadowBlur = 2;
            hitEffect.draw(context, mapStartX - 10, mapStartY);
            context.restore(); // Restaurer l'état précédent du contexte pour chaque effet de coup
        }

        context.save(); // Sauvegarder l'état actuel du contexte

        // Calculer l'angle de rotation
        const angle = this.calculateDirection(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

        // Déplacer le contexte au centre de l'ennemi
        context.translate(mapStartX + this.x + this.width / 2, mapStartY + this.y + this.height / 2);

        // Appliquer la rotation avec un décalage de 90 degrés (π/2 radians)
        context.rotate(angle + Math.PI / 2);

        context.shadowColor = this.enemyColor;

        // Dessiner l'image de l'ennemi
        if (this.hitFlashDuration > 0) {
            context.globalAlpha = 0.5; // Appliquer une transparence pour le flash blanc
            this.hitFlashDuration--;
        } else {
            context.globalAlpha = 1; // Opacité normale
        }

        if (this.image && this.image.src) {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            context.fillStyle = this.enemyColor;
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }

        context.globalAlpha = 1; // Réinitialiser l'opacité

        context.restore(); // Restaurer l'état précédent du contexte
    }

    shoot(direction) { }

    // Method to shoot projectiles at the player
    startShooting() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            // Vérifiez si le joueur est vivant
            const player = this.player;

            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance > 0) {
                const direction = { x: dx / distance, y: dy / distance };
                this.shoot(direction);
            }

            // Appeler startShooting à nouveau après le délai
            this.startShooting();
        }, 1000 / this.fireRate); // Le délai est inversément proportionnel à la cadence de tir
    }

    stopShooting() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    // Méthode pour vérifier si tous les effets ont été traités
    allEffectsProcessed() {
        // Vérifier si toutes les particules ont été traitées
        const allParticlesProcessed = this.particles.every(particle => particle.isDone());

        // Vérifier si tous les effets de coup ont été traités
        const allHitEffectsProcessed = this.hitEffects.every(hitEffect => hitEffect.isDone());

        // Retourner true si tous les effets ont été traités, false sinon
        return allParticlesProcessed && allHitEffectsProcessed;
    }

    // Méthode pour dessiner la barre de vie
    drawHealthBar(context, mapStartX, mapStartY) {
        // Si l'ennemi est mort, ne pas dessiner la barre de vie
        if (this.isDead) {
            return;
        }

        const barHeight = 5; // Hauteur de la barre de vie
        const barY = mapStartY + this.y - this.height / 2 - 10; // Position y de la barre de vie au-dessus de l'ennemi

        // La largeur de la barre de vie est égale à la santé de base de l'ennemi
        const barWidth = this.baseHealth;

        // La largeur de la barre de santé est égale à la santé actuelle de l'ennemi
        const healthBarWidth = this.health;

        // Ajustez la position x de la barre de vie pour la centrer
        const barX = mapStartX + this.x + this.width / 2 - barWidth / 2; // Position x de la barre de vie centrée sur l'ennemi

        // Dessinez le contour de la barre de vie
        context.strokeStyle = 'black';
        context.strokeRect(barX, barY, barWidth, barHeight);

        // Remplissez l'intérieur de la barre de vie en rouge
        context.fillStyle = 'red';
        context.fillRect(barX, barY, healthBarWidth, barHeight);
    }

    // Méthode pour déplacer l'ennemi
    move(player) {
        // Si l'ennemi est en collision avec le joueur, ne pas se déplacer
        if (this.isCollidingWithPlayer(player)) {
            return;
        }

        // Calculer la distance et la direction entre le centre de l'ennemi et le joueur
        const dx = player.x + player.width / 2 - (this.x + this.width / 2);
        const dy = player.y + player.height / 2 - (this.y + this.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distance est supérieure à zéro, déplacer l'ennemi vers le joueur
        if (distance > 0) {
            const moveX = dx / distance;
            const moveY = dy / distance;

            this.x += moveX * this.speed;
            this.y += moveY * this.speed;
        }
    }

    // Méthode pour gérer la collision avec le joueur
    handleCollisionWithPlayer(player) {
        // Si l'ennemi est en collision avec le joueur
        if (this.isCollidingWithPlayer(player) && !this.isDead) {
            // Obtenir le temps actuel
            const currentTime = Date.now();

            // Si suffisamment de temps s'est écoulé depuis la dernière fois que l'ennemi a infligé des dégâts
            if (currentTime - this.lastAttackTime >= 1000) { // 1000 millisecondes = 1 seconde
                // Infliger des dégâts au joueur
                player.decreaseHealth(this.damage);

                // Mettre à jour la dernière fois que l'ennemi a attaqué
                this.lastAttackTime = currentTime;
            }
        }
    }

    // Méthode pour vérifier si l'ennemi est en collision avec le joueur
    isCollidingWithPlayer(player) {
        const playerRight = player.x + player.width;
        const playerBottom = player.y + player.height;
        const enemyRight = this.x + this.width;
        const enemyBottom = this.y + this.height;

        return this.x < playerRight &&
            enemyRight > player.x &&
            this.y < playerBottom &&
            enemyBottom > player.y;
    }

    // Méthode pour vérifier si un point est à l'intérieur du joueur
    isPointInsidePlayer(player, x, y) {
        return (
            x >= player.x &&
            x <= player.x + player.width &&
            y >= player.y &&
            y <= player.y + player.height
        );
    }

    // Méthode pour réduire la santé de l'ennemi
    decreaseHealth(amount, bulletDirection, isBossLevel) {
        this.hitFlashDuration = 10; // L'ennemi deviendra blanc pendant 5 frames

        if (bulletDirection) {

            // Utiliser la même direction que le projectile pour la direction des particules
            const direction = {
                x: bulletDirection.x,
                y: bulletDirection.y
            };

            // Créer des particules
            for (let i = 0; i < 10; i++) {
                // Ajouter une petite variation aléatoire à la direction de chaque particule
                const particleDirection = {
                    x: direction.x + (Math.random() - 0.5) * 0.5,
                    y: direction.y + (Math.random() - 0.5) * 0.5
                };

                const oppositeX = this.x + (this.width * direction.x) / 2;
                const oppositeY = this.y + (this.height * direction.y) / 2;
                this.particles.push(new Particle(oppositeX, oppositeY, this.enemyColor, particleDirection, 1, this.width));
            }
        }

        // Afficher sur l'ennemi le nombre de dégâts subis
        this.hitEffects.push(new HitEffect(this, amount, 'enemy'));

        if (this.health > 0) {
            this.health -= amount;
            if (this.health <= 0) {
                this.health = 0;
                this.isDead = true;
            }
        }

    }

    // Méthode pour générer une pièce lorsque l'ennemi meurt
    generateCoin(mapHeight, mapWidth) {
        // Vérifier si la pièce a déjà été générée
        if (this.coinGenerated) {
            return null;
        }

        // Marquer l'ennemi comme ayant généré une pièce
        this.coinGenerated = true;

        // Calculer la position de la pièce en fonction de la position de l'ennemi
        const coinX = this.x + this.width / 4;  // ou ajustez selon votre logique
        const coinY = this.y + this.height / 4;  // ou ajustez selon votre logique

        // Créer et retourner la pièce
        return new Coin(coinX, coinY);
    }


    // Méthode pour générer une position aléatoire de l'ennemi par rapport au joueur
    generateRandomPosition(player, mapWidth, mapHeight, attempts = 10) {
        if (attempts <= 0) {
            // Si nous avons dépassé le nombre maximum d'essais, retourner une position par défaut
            return { x: mapWidth / 2, y: mapHeight / 2 };
        }

        const minDistance = 400;
        const maxDistance = 500;

        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * (maxDistance - minDistance) + minDistance;

        const enemyX = player.x + Math.cos(angle) * distance;
        const enemyY = player.y + Math.sin(angle) * distance;

        const insideMap = (
            enemyX >= 0 && enemyX <= mapWidth - this.width &&
            enemyY >= 0 && enemyY <= mapHeight - this.height
        );

        if (insideMap) {
            return { x: enemyX, y: enemyY };
        } else {
            // Si les coordonnées ne sont pas dans la zone de jeu, réessayer
            return this.generateRandomPosition(player, mapWidth, mapHeight, attempts - 1);
        }
    }

    // Méthode pour créer un effet de mort
    createDeathEffect(enemy) {
        // Créer des particules après une seconde
        setTimeout(() => {
            for (let i = 0; i < 50; i++) {
                const direction = {
                    x: (Math.random() - 0.5) * 2, // Nombre aléatoire entre -1 et 1
                    y: (Math.random() - 0.5) * 2 // Nombre aléatoire entre -1 et 1
                };
                // Ajouter la moitié de la largeur et de la hauteur de l'ennemi à la position x et y
                const particleX = this.x + this.width / 2;
                const particleY = this.y + this.height / 2;
                this.particles.push(new Particle(particleX, particleY, this.enemyColor, direction, 3, this.width));
            }
        }, 10);
    }

    calculateProjectileStartPosition(direction) {
        const offset = 10; // Distance à ajouter pour que le projectile sorte du devant de l'ennemi
        const startX = this.x + this.width / 2 + direction.x * offset;
        const startY = this.y + this.height / 2 + direction.y * offset;
        return { x: startX, y: startY };
    }
}

export class Slime extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 25, 5, 10);
        this.enemyColor = 'green';
        this.image.src = '../assets/Sprites/Slime.png';
        this.pourcentage = 0.3;
        this.speed = 4;
    }
}

export class Ghost extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 20, 10, 25);
        this.enemyColor = 'purple';
        this.image.src = '../assets/Sprites/Ghost.png';
        this.pourcentage = 0.3;
        this.speed = 5;
    }
}

export class Tank extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 50, 10, 30);
        this.enemyColor = 'grey';
        this.image.src = '../assets/Sprites/Tank.png';
        this.pourcentage = 0.2;
        this.speed = 2;
    }
}

export class Shooter extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 50, 5, 20);
        this.enemyColor = 'red';
        this.image.src = '../assets/Sprites/Shooter.png';
        this.pourcentage = 0.2;
        this.speed = 3;
        this.lastProjectileTime = 0;
        this.fireRate = 1; // Temps de pause de 1 seconde
    }

    shoot(direction) {
        // Calculer la position initiale du projectile
        const startPosition = this.calculateProjectileStartPosition(direction);
        const x = this.x + this.width / 2;
        const y = this.y + this.height / 2;

        // Créer un nouveau projectile
        const projectile = new EnemyProjectile(x, y, this.speed, this.damage, this.range, this.player);

        // Calculer la direction du projectile
        projectile.calculateDirection(x + direction.x, y + direction.y);

        // Ajouter le projectile à la liste des projectiles du ennemi
        this.projectiles.push(projectile);
    }
}