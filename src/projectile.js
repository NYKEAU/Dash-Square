export class Projectile {
    constructor(initialX, initialY, speed, maxDistance, player) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;
        this.speed = speed;
        this.size = 5;
        this.maxDistance = maxDistance;
        this.distanceTraveled = 0;
        this.player = player;
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

    draw(context, offsetX, offsetY) {
        context.fillStyle = '#FF4500';
        context.beginPath();
        context.arc(this.x + offsetX, this.y + offsetY, this.size, 0, Math.PI * 2);
        context.fill();
    }
}
