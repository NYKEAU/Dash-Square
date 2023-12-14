export class Player {
    // Définir le constructeur de la classe
    constructor(x, y) {
        // Initialiser les propriétés du joueur
        this.x = x; // La position x du joueur
        this.y = y; // La position y du joueur
        this.width = 30; // La largeur du joueur
        this.height = 30; // La hauteur du joueur
        this.speed = 10; // La vitesse de déplacement du joueur
    }

    // Méthode pour dessiner le joueur
    draw(context, x, y) {
        // Remplir un rectangle de couleur rouge à la position x et y
        context.fillStyle = 'red';
        context.fillRect(x, y, this.width, this.height);
    }

    // Méthode pour déplacer le joueur
    move(keys, mapWidth, mapHeight) {
        // Gérer les déplacements du joueur en fonction des touches enfoncées
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x < mapWidth - this.width) {
            this.x += this.speed;
        }
        if (keys['ArrowUp'] && this.y > 0) {
            this.y -= this.speed;
        }
        if (keys['ArrowDown'] && this.y < mapHeight - this.height) {
            this.y += this.speed;
        }

        // Vérifier les limites de la carte pour empêcher le dépassement
        if (this.x < 0) {
            this.x = 0;
        }
        if (this.x > mapWidth - this.width) {
            this.x = mapWidth - this.width;
        }
        if (this.y < 0) {
            this.y = 0;
        }
        if (this.y > mapHeight - this.height) {
            this.y = mapHeight - this.height;
        }
    }
}
