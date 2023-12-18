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
        const projectile = new Projectile(
            this.player.x + this.player.width / 2,
            this.player.y + this.player.height / 2,
            direction
        );
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