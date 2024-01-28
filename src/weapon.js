import { Projectile } from './projectile.js';

class Weapon {
    constructor(player) {
        this.player = player;
        this.fireRate = 1; // Vitesse de tir en balles par seconde
        this.speed = 1; // Vitesse des balles par défaut
        this.range = 1000; // Portée par défaut
        this.timeoutId = null;
    }

    shoot(direction) {
        // Cette méthode sera implémentée par chaque sous-classe
    }

    startShooting() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            const closestEnemy = this.player.gameInstance.getClosestEnemy();
            if (closestEnemy) {
                const dx = closestEnemy.x - this.player.x;
                const dy = closestEnemy.y - this.player.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 0) {
                    const direction = { x: dx / distance, y: dy / distance };
                    this.shoot(direction);
                }
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
}

export class Pistol extends Weapon {
    constructor(player) {
        super(player); // Appel du constructeur de la classe mère
        this.speed = 10; // Initialiser this.speed ici pour la classe Pistol
        this.fireRate = 1; // Initialiser this.fireRate ici pour la classe Pistol
    }

    shoot(direction) {
        // Calculer la position initiale du projectile
        const x = this.player.x + this.player.width / 2;
        const y = this.player.y + this.player.height / 2;

        // Créer un nouveau projectile
        const projectile = new Projectile(x, y, this.speed, this.range, this.player);

        // Calculer la direction du projectile
        projectile.calculateDirection(x + direction.x, y + direction.y);

        // Ajouter le projectile à la liste des projectiles du joueur
        this.player.projectiles.push(projectile);
    }
}

export class Shotgun extends Weapon {
    constructor(player) {
        super(player); // Appel du constructeur de la classe mère
        this.speed = 3; // Initialiser this.speed ici pour la classe Shotgun
        this.fireRate = 0.5; // Initialiser this.fireRate ici pour la classe Shotgun
    }

    shoot(direction) {
        // Le shotgun tire 3 projectiles à la fois
        for (let i = -1; i <= 1; i++) {
            const spreadDirection = { x: direction.x + i * 0.1, y: direction.y };
            const projectile = new Projectile(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                this.speed,
                this.range,
                this.player
            );

            // Calculer la direction du projectile
            projectile.calculateDirection(projectile.x + spreadDirection.x, projectile.y + spreadDirection.y);

            // Ajouter le projectile à la liste des projectiles du joueur
            this.player.projectiles.push(projectile);
        }
    }
}