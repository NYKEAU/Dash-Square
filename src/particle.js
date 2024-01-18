export class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
    }

    // Méthode pour dessiner la particule
    draw(context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
    }

    // Méthode pour mettre à jour la position de la particule
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Réduire la taille de la particule au fil du temps
        this.size -= 0.1;
    }
}