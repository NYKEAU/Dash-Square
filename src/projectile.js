export class Projectile {
    constructor(x, y, speed, targetX, targetY) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.targetX = targetX;
        this.targetY = targetY;
        this.width = 5; // Vous pouvez ajuster la taille du projectile
        this.height = 5; // Vous pouvez ajuster la taille du projectile
    }

    // Méthode pour dessiner le projectile
    draw(context, mapWidth, mapHeight) {
        if (this.x >= 0 && this.x <= mapWidth && this.y >= 0 && this.y <= mapHeight) {
            context.fillStyle = 'black';
            // Augmenter le z-index du projectile
            context.fillRect(this.x, this.y, this.width, this.height);
        } else {
            // console.log('Projectile out of bounds:', this);
        }
    }

    // Méthode pour déplacer le projectile vers l'ennemi
    move() {
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    }

    collidesWith(enemy) {
        return this.x < enemy.x + enemy.width &&
            this.x + this.width > enemy.x &&
            this.y < enemy.y + enemy.height &&
            this.y + this.height > enemy.y;
    }
}