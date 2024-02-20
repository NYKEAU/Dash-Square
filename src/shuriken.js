export class Shuriken {
    constructor(playerPosition) {
        this.damage = 10; // dégâts infligés par le shuriken
        this.rotationSpeed = 5; // vitesse de rotation du shuriken
        this.range = 50; // portée du shuriken
        this.position = playerPosition; // position initiale du shuriken
    }

    // Méthode pour dessiner le shuriken
    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'gray';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    // Méthode pour infliger des dégâts à un ennemi
    damageEnemy(enemy) {
        if (this.isEnemyInRange(enemy)) {
            enemy.health -= this.damage; // inflige des dégâts à l'ennemi
        }
    }

    // Méthode pour déterminer si un ennemi est à portée
    isEnemyInRange(enemy) {
        const distance = Math.sqrt(Math.pow(this.position.x - enemy.position.x, 2) + Math.pow(this.position.y - enemy.position.y, 2));
        return distance <= this.range;
    }

    // Méthode pour mettre à jour la position du shuriken
    updatePosition(playerPosition) {
        // Met à jour la position du shuriken pour qu'il tourne autour du joueur
        this.position.x = playerPosition.x + Math.cos(this.rotationSpeed) * this.range;
        this.position.y = playerPosition.y + Math.sin(this.rotationSpeed) * this.range;
        this.rotationSpeed += 0.05; // Augmente la vitesse de rotation
    }
}