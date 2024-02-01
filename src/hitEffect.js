export class HitEffect {
    constructor(target, damage, targetType) {
        this.target = target;
        this.targetType = targetType;
        this.x = target.x;
        this.y = target.y;
        this.damage = damage;
        this.duration = 60; // Durée de l'effet en frames, augmentée à 120
        this.fontSize = 20; // Taille de la police
        this.maxFontSize = 40; // Taille maximale de la police
        this.opacity = 1; // Opacité initiale
        this.verticalSpeed = 1; // Vitesse de déplacement vertical, réduite à 1
        this.verticalOffset = -25; // Décalage vertical initial
    }

    draw(context, mapStartX, mapStartY) {
        if (this.duration > 0) {
            const textWidth = context.measureText(this.damage).width;
            const textX = mapStartX + this.x + this.target.width / 2 - textWidth / 2;
            const textY = mapStartY + this.y - this.fontSize - this.verticalOffset; // Décalage vertical

            // Calculer l'opacité en fonction du temps restant
            const normalizedDuration = this.duration / 60; // Normaliser la durée entre 0 et 1

            // Appliquer une animation de couleur
            const color = Math.floor(255 * (1 - normalizedDuration));
            context.fillStyle = `rgba(${color}, ${color}, ${color}, ${this.opacity * normalizedDuration})`;

            // Appliquer une animation de taille de police
            this.fontSize = this.maxFontSize * normalizedDuration;
            if (this.fontSize < 20) this.fontSize = 20;
            context.font = `${this.fontSize}px Arial`;

            // Dessiner le texte et afficher en négatif si la cible est le joueur
            if (this.targetType === 'player') {
                context.fillText("-" + this.damage, textX, textY);
            } else {
                context.fillText(this.damage, textX, textY);
            }

            // Mettre à jour le décalage vertical et la vitesse pour un mouvement progressif
            this.verticalOffset += this.verticalSpeed;
            this.verticalSpeed += 0.1;

            this.duration--;
            this.opacity -= 1 / 60; // Diminuer progressivement l'opacité, ajustée à la nouvelle durée
        }
    }
}