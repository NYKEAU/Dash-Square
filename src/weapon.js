import { Projectile } from './projectile.js';

class Weapon {
    constructor(player) {
        this.player = player;
    }

    shoot(direction) {
        // Cette méthode sera implémentée par chaque sous-classe
    }
}

export class Pistol extends Weapon {
    shoot(direction) {
        // Calculer la position initiale du projectile
        const x = this.player.x + this.player.width / 2;
        const y = this.player.y + this.player.height / 2;

        // Calculer la longueur de la direction
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);

        // Normaliser la direction
        if (length > 0) {
            direction.x /= length;
            direction.y /= length;
        }

        // Créer un nouveau projectile
        const projectile = new Projectile(x, y, direction);
        this.player.projectiles.push(projectile);
    }
}

export class Shotgun extends Weapon {
    shoot(direction) {
        // Le shotgun tire 3 projectiles à la fois
        for (let i = -1; i <= 1; i++) {
            const spreadDirection = { x: direction.x + i * 0.1, y: direction.y };
            const projectile = new Projectile(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                spreadDirection
            );
            this.player.projectiles.push(projectile);
        }
    }
}