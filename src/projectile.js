export class Projectile {
    constructor(initialX, initialY, direction) {
        this.initialX = initialX;
        this.initialY = initialY;
        this.x = initialX;
        this.y = initialY;
        this.direction = direction;
        this.speed = 10;
        this.size = 5;
    }

    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
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
