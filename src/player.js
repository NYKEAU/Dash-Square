export class Player {
    // Définir le constructeur de la classe
    constructor(x, y) {
        // Initialiser les propriétés du joueur
        this.x = x; // La position x du joueur
        this.y = y; // La position y du joueur
        this.width = 30; // La largeur du joueur
        this.height = 30; // La hauteur du joueur
        this.speed = 10; // La vitesse de déplacement du joueur
        this.health = 100; // La santé du joueur
        this.damage = 10; // Les dégâts du joueur
    }

    // Méthode pour dessiner le joueur
    draw(context, x, y) {
        // Remplir un rectangle de couleur rouge à la position x et y
        context.fillStyle = 'red';
        context.fillRect(x, y, this.width, this.height);
    }

    // Méthode pour déplacer le joueur
    move(keys, mapWidth, mapHeight, enemies) {
        // Calculer la nouvelle position du joueur
        let newX = this.x;
        let newY = this.y;

        if (keys['ArrowUp'] || keys['w']) newY -= this.speed;
        if (keys['ArrowDown'] || keys['s']) newY += this.speed;
        if (keys['ArrowLeft'] || keys['a']) newX -= this.speed;
        if (keys['ArrowRight'] || keys['d']) newX += this.speed;

        // Vérifier les collisions avec les ennemis
        for (let enemy of enemies) {
            const dx = newX - enemy.x;
            const dy = newY - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.width / 2 + enemy.width / 2) {
                // Le joueur est en collision avec l'ennemi, repousser l'ennemi
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                enemy.x -= this.speed * cos;
                enemy.y -= this.speed * sin;
            }
        }

        // Vérifier si le joueur est à l'intérieur de la zone de jeu
        this.x = Math.max(0, Math.min(mapWidth - this.width, newX));
        this.y = Math.max(0, Math.min(mapHeight - this.height, newY));
    }

    // Méthode pour réduire la santé du joueur
    decreaseHealth(amount) {
        this.health -= amount;
    }
}
