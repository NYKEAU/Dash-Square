// Définir la classe Enemy
export class Enemy {
    // Définir le constructeur de la classe
    constructor(player, mapWidth, mapHeight) {
        // Initialiser les propriétés de l'ennemi
        this.width = 20; // La largeur de l'ennemi
        this.height = 20; // La hauteur de l'ennemi
        this.speed = 2.5; // La vitesse de déplacement de l'ennemi
        // Générer une position aléatoire de l'ennemi par rapport au joueur
        const initialPosition = this.generateRandomPosition(player, mapWidth, mapHeight);
        this.x = initialPosition.x; // La position x de l'ennemi
        this.y = initialPosition.y; // La position y de l'ennemi
    }

    // Méthode pour dessiner l'ennemi
    draw(context, mapStartX, mapStartY) {
        // Remplir un rectangle de couleur verte à la position x et y
        context.fillStyle = 'green';
        context.fillRect(mapStartX + this.x, mapStartY + this.y, this.width, this.height);
    }

    // Méthode pour déplacer l'ennemi
    move(player) {
        // Calculer la distance et la direction entre l'ennemi et le joueur
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Si la distance est supérieure à zéro, déplacer l'ennemi vers le joueur
        if (distance > 0) {
            const moveX = dx / distance;
            const moveY = dy / distance;

            this.x += moveX * this.speed;
            this.y += moveY * this.speed;
        }
    }

    // Méthode pour générer une position aléatoire de l'ennemi par rapport au joueur
    generateRandomPosition(player, mapWidth, mapHeight) {
        const minDistance = 200; // Distance minimale de l'ennemi par rapport au joueur
        const maxDistance = 500; // Distance maximale de l'ennemi par rapport au joueur

        // Générer un angle aléatoire en radians
        const angle = Math.random() * Math.PI * 2;

        // Générer une distance aléatoire entre minDistance et maxDistance
        const distance = Math.random() * (maxDistance - minDistance) + minDistance;

        // Calculer les coordonnées x et y de l'ennemi par rapport au joueur
        const enemyX = player.x + Math.cos(angle) * distance;
        const enemyY = player.y + Math.sin(angle) * distance;

        // Vérifier si les coordonnées de l'ennemi sont à l'intérieur de la zone de jeu
        const insideMap = (
            enemyX >= 0 && enemyX <= mapWidth - this.width &&
            enemyY >= 0 && enemyY <= mapHeight - this.height
        );

        if (insideMap) {
            return { x: enemyX, y: enemyY };
        } else {
            // Si les coordonnées ne sont pas dans la zone de jeu, réessayer
            return this.generateRandomPosition(player, mapWidth, mapHeight);
        }
    }
}
