export class HitEffect {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.duration = 30; // Durée de l'effet en frames
    }

    draw(context, playerX, playerY) {
        if (this.duration > 0) {
            context.fillStyle = 'red';
            context.font = '20px Arial';
            context.fillText(this.damage, this.x - playerX, this.y - playerY);
            this.duration--;
        }
    }
}