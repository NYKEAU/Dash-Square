import { EnemyProjectile } from './projectile.js';
import { HitEffect } from './hitEffect.js';
import { Particle } from './particle.js';
import { Coin } from './coin.js';

class Enemy {
    constructor(player, mapWidth, mapHeight, baseHealth, damage, xpGived) {
        // Dimensions
        this.width = 20;
        this.height = 20;

        // Position
        const initialPosition = this.generateRandomPosition(player, mapWidth, mapHeight);
        this.x = initialPosition.x;
        this.y = initialPosition.y;

        // Mouvement
        this.speed = 1;
        this.knockback = { x: 0, y: 0 };
        this.knockbackSpeed = { x: 0, y: 0 };

        // Apparence
        this.enemyColor = 'green';
        this.hitEffects = [];
        this.particles = [];
        this.hitFlashDuration = 0;

        // Combat
        this.health = baseHealth;
        this.baseHealth = baseHealth;
        this.damage = damage;
        this.lastDamageTime = 0;
        this.lastAttackTime = 0;
        this.projectiles = []; // Initialiser les projectiles comme un tableau vide

        // Récompenses
        this.xpGived = xpGived;
        this.coinGenerated = false;

        // Autre
        this.player = player;
        this.timeoutId = null;
    }

    // Méthode pour dessiner l'ennemi
    draw(context, mapStartX, mapStartY) {
        // Dessiner les particules
        for (let particle of this.particles) {
            particle.draw(context, this.width, mapStartX, mapStartY);
        }

        // Dessiner les effets de coup avant de vérifier si l'ennemi est mort
        for (let hitEffect of this.hitEffects) {
            hitEffect.draw(context, mapStartX - 10, mapStartY);
        }

        // Remplir un rectangle de couleur à la position x et y
        if (this.hitFlashDuration > 0) {
            context.fillStyle = 'white';
            this.hitFlashDuration--;
        } else {
            context.fillStyle = this.enemyColor;
        }
        context.fillRect(mapStartX + this.x, mapStartY + this.y, this.width, this.height);
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

        // Calculer la distance et la direction entre l'ennemi et le joueur
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distance est supérieure à zéro, déplacer l'ennemi vers le joueur
        if (distance > 0) {
            const moveX = dx / distance;
            const moveY = dy / distance;

            this.x += moveX * this.speed;
            this.y += moveY * this.speed;
        }

        // Appliquer le recul
        this.x += this.knockbackSpeed.x;
        this.y += this.knockbackSpeed.y;

        // Réduire progressivement le recul
        this.knockbackSpeed.x *= 0.9;
        this.knockbackSpeed.y *= 0.9;
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
        // Vérifier si le coin supérieur gauche, le coin supérieur droit, le coin inférieur gauche ou le coin inférieur droit de l'ennemi est à l'intérieur du joueur
        return (
            this.isPointInsidePlayer(player, this.x, this.y) ||
            this.isPointInsidePlayer(player, this.x + this.width, this.y) ||
            this.isPointInsidePlayer(player, this.x, this.y + this.height) ||
            this.isPointInsidePlayer(player, this.x + this.width, this.y + this.height)
        );
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
    decreaseHealth(amount, bulletDirection) {
        this.hitFlashDuration = 10; // L'ennemi deviendra blanc pendant 5 frames

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
            this.particles.push(new Particle(this.x, this.y, this.enemyColor, particleDirection, 1));
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

        // Ajouter un effet de recul
        const knockbackFactor = 0.25; // Ajustez cette valeur pour augmenter ou diminuer l'effet de recul
        this.knockbackSpeed.x += direction.x * amount * knockbackFactor;
        this.knockbackSpeed.y += direction.y * amount * knockbackFactor;
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
    generateRandomPosition(player, mapWidth, mapHeight) {
        const minDistance = 400; // Distance minimale de l'ennemi par rapport au joueur
        const maxDistance = 500; // Distance maximale de l'ennemi par rapport au joueur

        // Générer un angle aléatoire en radians
        const angle = Math.random() * Math.PI * 2;

        // Générer une distance aléatoire entre minDistance et maxDistance
        const distance = Math.random() * (maxDistance - minDistance) + minDistance;

        // Calculer les coordonnées x et y de l'ennemi par rapport au joueur
        const enemyX = player.x + Math.cos(angle) * distance;
        const enemyY = player.y + Math.sin(angle) * distance;

        // Vérifier si les coordonnées de l'ennemi sont à l'intérieur de la zone de jeu
        const insideMap = (
            enemyX >= 0 && enemyX <= mapWidth - this.width &&
            enemyY >= 0 && enemyY <= mapHeight - this.height
        );

        if (insideMap) {
            return { x: enemyX, y: enemyY };
        } else {
            // Si les coordonnées ne sont pas dans la zone de jeu, réessayer
            return this.generateRandomPosition(player, mapWidth, mapHeight);
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
                this.particles.push(new Particle(particleX, particleY, this.enemyColor, direction, 3));
            }
        }, 850);
    }
}

export class Slime extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 50, 5, 10);
        this.enemyColor = 'green';
    }
}

export class Ghost extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 35, 10, 20);
        this.enemyColor = 'white';
        this.speed = 2;
    }
}

// Enemy class that inherits from the Enemy class, shooting projectiles at the player
export class Shooter extends Enemy {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 100, 5, 15);
        this.enemyColor = 'purple';
        this.speed = 1.5;
        this.lastProjectileTime = 0;
        this.fireRate = 1; // Temps de pause de 1 seconde
    }

    shoot(direction) {
        console.log('Shooting projectile' + this.projectiles.length);
        // Calculer la position initiale du projectile
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