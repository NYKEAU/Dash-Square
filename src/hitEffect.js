export class HitEffect {
    constructor(x, y, damage) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.duration = 30; // Durée de l'effet en frames
    }

    draw(context) {
        if (this.duration > 0) {
            context.fillStyle = 'black';
            context.font = '20px Arial';
            const textWidth = context.measureText(this.damage).width;
            context.fillText(this.damage, this.x - textWidth / 2, this.y);
            this.duration--;
        }
    }
}