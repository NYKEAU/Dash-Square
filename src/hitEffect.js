export class HitEffect {
    constructor(enemy, damage) {
        this.enemy = enemy;
        this.x = enemy.x;
        this.y = enemy.y;
        this.damage = damage;
        this.duration = 30; // Durée de l'effet en frames
    }

    draw(context, mapStartX, mapStartY) {
        if (this.duration > 0) {
            context.fillStyle = 'black';
            context.font = '20px Arial';
            const textWidth = context.measureText(this.damage).width;
            const textHeight = 20; // Hauteur du texte basée sur la taille de la police
            const textX = mapStartX + this.x + this.enemy.width / 2 - textWidth / 2;
            const textY = mapStartY + this.y - textHeight;
            context.fillText(this.damage, textX, textY);
            this.duration--;
        }
    }
}