export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = Math.floor(Math.random() * 10 + 1);
        this.width = 10; // Définir la largeur de la pièce
        this.height = 10; // Définir la hauteur de la pièce
        this.color = 'yellow'; // Définir la couleur de la pièce
    }

    // Méthode pour dessiner la pièce
    draw(context, mapStartX, mapStartY) {
        context.fillStyle = 'yellow'; // Couleur de la pièce (à ajuster selon vos besoins)
        context.fillRect(this.x + mapStartX, this.y + mapStartY, this.width, this.height);
    }
}