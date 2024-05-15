export class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.value = Math.floor(Math.random() * 6 + 1);
        this.width = 10; // Définir la largeur de la pièce
        this.height = 10; // Définir la hauteur de la pièce
        this.color = 'yellow'; // Définir la couleur de la pièce
    }

    // Méthode pour dessiner la pièce
    draw(context, mapStartX, mapStartY) {
        context.fillStyle = 'yellow'; // Couleur de la pièce (à ajuster selon vos besoins)
        context.fillRect(this.x + mapStartX, this.y + mapStartY, this.width, this.height);
    }

    // Ajoutez une méthode pour attirer la pièce vers le joueur
    attractToPlayer(player, isPaused) {
        // Calculez la distance entre la pièce et le joueur
        let dx = player.x - this.x;
        let dy = player.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distance est inférieure à une certaine valeur et que le jeu n'est pas en pause, déplacez la pièce vers le joueur
        if (distance < 5000 && !isPaused) {
            // Calculez le vecteur de direction
            let directionX = dx / distance;
            let directionY = dy / distance;

            // Calculez la vitesse d'attraction en fonction de la proximité de la pièce au joueur
            let attractionSpeed = 5 * (500 - distance) / 500;

            // Vérifiez si la vitesse d'attraction est positive
            if (attractionSpeed > 0) {
                // Déplacez la pièce vers le joueur
                this.x += directionX * attractionSpeed;
                this.y += directionY * attractionSpeed;
            }
        }
    }
}