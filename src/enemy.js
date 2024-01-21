import { HitEffect } from './hitEffect.js';
import { Particle } from './particle.js';

export class Enemy {
    // Définir le constructeur de la classe
    constructor(player, mapWidth, mapHeight, baseHealth, damage, xpGived) {
        this.width = 20; // La largeur de l'ennemi
        this.height = 20; // La hauteur de l'ennemi
        this.speed = 1; // La vitesse de déplacement de l'ennemi
        this.enemyColor = 'green'; // La couleur de l'ennemi
        this.xpGived = xpGived; // L'expérience donnée par l'ennemi
        const initialPosition = this.generateRandomPosition(player, mapWidth, mapHeight);
        this.x = initialPosition.x; // La position x de l'ennemi
        this.y = initialPosition.y; // La position y de l'ennemi
        this.health = baseHealth; // Santé initiale de l'ennemi
        this.baseHealth = baseHealth; // Santé de base de l'ennemi
        this.damage = damage; // Les dégâts de l'ennemi
        this.lastDamageTime = 0; // Le dernier moment où l'ennemi a subi des dégâts
        this.hitEffects = []; // Tableau des hitmarkers
        this.lastAttackTime = 0; // Le dernier moment où l'ennemi a attaqué
        this.hitFlashDuration = 0; // La durée de l'effet de flash quand l'ennemi subit des dégâts
        this.particles = []; // Tableau pour stocker les particules
    }

    // Méthode pour dessiner l'ennemi
    draw(context, mapStartX, mapStartY) {
        // Dessiner les particules
        for (let particle of this.particles) {
            particle.draw(context, this.width, mapStartX, mapStartY);
        }

        // Dessiner les effets de coup avant de vérifier si l'ennemi est mort
        for (let hitEffect of this.hitEffects) {
            hitEffect.draw(context, mapStartX, mapStartY);
        }

        // Si l'ennemi est mort, ne pas le dessiner
        if (this.isDead) {
            return;
        }

        // Remplir un rectangle de couleur verte à la position x et y
        if (this.hitFlashDuration > 0) {
            context.fillStyle = 'white';
            this.hitFlashDuration--;
        } else {
            context.fillStyle = this.enemyColor;
        }
        context.fillRect(mapStartX + this.x, mapStartY + this.y, this.width, this.height);
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
    }

    // Méthode pour gérer la collision avec le joueur
    handleCollisionWithPlayer(player) {
        // Si l'ennemi est en collision avec le joueur
        if (this.isCollidingWithPlayer(player)) {
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
    decreaseHealth(amount) {
        this.hitFlashDuration = 10; // L'ennemi deviendra blanc pendant 5 frames
        if (this.health > 0) {
            this.health -= amount;
            // Afficher sur l'ennemi le nombre de dégâts subis
            this.hitEffects.push(new HitEffect(this, amount));
            if (this.health <= 0) {
                this.health = 0;
                this.isDead = true;
            }
        }
        // Créer des particules
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(this.x, this.y, this.enemyColor));
        }
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
}
