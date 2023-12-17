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
        this.maxHealth = this.health; // La santé maximale du joueur
        this.damage = 10; // Les dégâts du joueur
        this.experience = 0; // Ajouter cette ligne
        this.maxExperience = 100; // Ajouter cette ligne
        this.level = 1; // Ajouter cette ligne
    }

    // Méthode pour dessiner le joueur
    draw(context, x, y) {
        // Remplir un rectangle de couleur rouge à la position x et y
        context.fillStyle = 'red';
        context.fillRect(x, y, this.width, this.height);
    }

    // Méthode pour dessiner la barre de vie du joueur
    drawHealthBar(context) {
        const barWidth = this.health; // La largeur de la barre de vie est égale à la santé du joueur
        const barHeight = 25; // La hauteur de la barre de vie
        const barX = 10; // La position x de la barre de vie (10 pixels depuis le bord gauche de l'écran)
        const barY = 10; // La position y de la barre de vie (10 pixels depuis le haut de l'écran)

        // Dessiner le contour de la barre de vie
        context.strokeStyle = 'black';
        context.strokeRect(barX, barY, this.maxHealth, barHeight); // La largeur du contour est toujours de 100 pixels, indépendamment de la santé du joueur

        // Remplir l'intérieur de la barre de vie en rouge
        context.fillStyle = 'red';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Préparer le texte
        const healthText = this.health + '/' + this.maxHealth;
        const textWidth = context.measureText(healthText).width;

        // Calculer la position x du texte
        const textX = Math.max(barX + barWidth - textWidth - 5, barX + 5);

        // Dessiner le nombre de points de vie dans la barre de vie
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '16px Arial'; // Taille et police du texte
        context.fillText(healthText, textX, barY + 17.5); // Position du texte
    }

    // Méthode pour dessiner la barre d'expérience du joueur
    drawExperienceBar(context) {
        // Sauvegarder l'état actuel du contexte
        context.save();

        const barWidth = (this.experience / this.maxExperience) * this.maxHealth; // La largeur de la barre d'expérience est proportionnelle à l'expérience du joueur
        const barHeight = 10; // La hauteur de la barre d'expérience
        const barX = 10; // La position x de la barre d'expérience (10 pixels depuis le bord gauche de l'écran)
        const barY = 40; // La position y de la barre d'expérience (40 pixels depuis le haut de l'écran)

        // Dessiner le contour de la barre d'expérience
        context.strokeStyle = 'black';
        context.strokeRect(barX, barY, this.maxHealth, barHeight); // La largeur du contour est maintenant égale à la santé maximale du joueur

        // Remplir l'intérieur de la barre d'expérience en bleu
        context.fillStyle = 'blue';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Préparer le texte
        const experienceText = this.experience + '/' + this.maxExperience;

        // Dessiner l'expérience du joueur dans la barre d'expérience
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '10px Arial'; // Taille et police du texte
        context.textAlign = 'right'; // Aligner le texte à droite
        context.fillText(experienceText, barX + this.maxHealth - 5, barY + 7.5); // Position du texte

        // Restaurer l'état du contexte
        context.restore();
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

        // Vérifier si le joueur est à l'intérieur de la zone de jeu
        this.x = Math.max(0, Math.min(mapWidth - this.width, newX));
        this.y = Math.max(0, Math.min(mapHeight - this.height, newY));
    }

    // Méthode pour réduire la santé du joueur
    decreaseHealth(amount) {
        this.health -= amount;
    }
}
