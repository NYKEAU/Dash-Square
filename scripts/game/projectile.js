export class Projectile {
    constructor(initialX, initialY, speed, damage, maxDistance, player) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;
        this.speed = speed;
        this.size = 5;
        this.maxDistance = maxDistance;
        this.distanceTraveled = 0;
        this.damage = damage;
        this.player = player;
        this.piercing = false;
        this.direction = { x: 0, y: 0 };
    }

    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
        this.distanceTraveled += Math.sqrt(this.direction.x * this.direction.x + this.direction.y * this.direction.y) * this.speed;

        if (this.distanceTraveled >= this.maxDistance) {
            // Supprimer le projectile actuel de la liste des projectiles du joueur
            const index = this.player.projectiles.indexOf(this);
            this.player.projectiles.splice(index, 1);
        }
    }

    calculateDirection(newX, newY) {
        // Calculer la direction en fonction de la position initiale et finale
        const dx = newX - this.initialX;
        const dy = newY - this.initialY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.direction = { x: dx / distance, y: dy / distance };
        }
    }

    draw(context, offsetX, offsetY, shooter) {
        // Dessiner le projectile en fonction du tireur
        if (shooter === 'player') {
            context.fillStyle = 'blue';
            context.beginPath();
            context.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
            context.fill();
        } else {
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
            context.fill();
        }
    }
}

export class SniperProjectile extends Projectile {
    constructor(x, y, speed, damage, range, player) {
        super(x, y, speed, damage, range, player);
        // Ajoutez d'autres propriétés spécifiques au SniperProjectile ici si nécessaire
    }
}

export class EnemyProjectile extends Projectile {
    constructor(x, y, speed, damage, range, player) {
        super(x, y, speed, damage, range, player);
        this.calculateDirection(player.x, player.y);
    }

    calculateDirection(playerX, playerY) {
        const dx = playerX - this.x;
        const dy = playerY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.direction = { x: dx / distance, y: dy / distance };
        }
    }
}

export class BulletHellProjectile extends Projectile {
    constructor(x, y, speed, damage, direction, size, color) {
        super(x, y, speed, damage);
        this.direction = direction;
        this.size = size;
        this.color = color;
    }

    draw(context, offsetX, offsetY) {
        const borderSize = 3; // Largeur de la bordure
        const isColor = (color) => {
            const s = new Option().style;
            s.color = 'light' + color;
            return s.color !== '';
        }

        context.fillStyle = isColor(this.color) ? 'light' + this.color : 'black'; // Couleur de la bordure
        context.strokeStyle = this.color; // Couleur de remplissage
        context.lineWidth = borderSize;

        // Dessiner le remplissage
        context.beginPath();
        context.arc(this.x + offsetX, this.y + offsetY, this.size - borderSize / 2, 0, Math.PI * 2);
        context.fill();

        // Dessiner la bordure
        context.beginPath();
        context.arc(this.x + offsetX, this.y + offsetY, this.size - borderSize / 2, 0, Math.PI * 2);
        context.stroke();
    }
}