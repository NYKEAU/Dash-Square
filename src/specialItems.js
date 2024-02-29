export class SpecialItem {
    constructor(name, player, enemies) {
        this.name = name;
        this.player = player;
        this.enemies = enemies;
    }

    // Méthodes et propriétés communes à tous les items spéciaux
    draw(context) {
        // Dessiner l'item spécial
    }
}

export class Shuriken extends SpecialItem {
    constructor(player, enemies) {
        super("Shuriken");
        this.radius = 10;
        this.damage = 10;
        this.rotationSpeed = 0.05;
        this.range = 50;
        this.player = player;
        this.enemies = enemies;
        this.prix = 10;
        this.rarete = 'special';
        this.angle = 0;
        this.center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Initialiser le centre avec les coordonnées du joueur
        this.position = { x: 0, y: 0 };
    }

    update() {
        // Vérifiez les collisions avec chaque ennemi
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.collidesWith(this.enemies[i])) {
                this.enemies[i].health -= this.damage; // Réduisez la santé de l'ennemi
                console.log(`L'ennemi a subi ${this.damage} points de dégâts !`);

                if (this.enemies[i].health <= 0) {
                    this.enemies.splice(i, 1); // Supprimez l'ennemi s'il n'a plus de santé
                }
            }
        }
    }

    collidesWith(enemy) {
        const dx = this.position.x - enemy.x;
        const dy = this.position.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance < this.radius + enemy.radius;
    }

    draw(context) {
        // Met à jour la position du shuriken pour qu'il tourne autour du joueur
        this.position.x = this.center.x + Math.cos(this.angle) * this.range;
        this.position.y = this.center.y + Math.sin(this.angle) * this.range;

        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'gray';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();

        this.angle += this.rotationSpeed;
    }

    damageEnemy(enemy) {
        if (this.isEnemyInRange(enemy)) {
            enemy.health -= this.damage;
            console.log(`L'ennemi a subi ${this.damage} points de dégâts !`);
        }
    }

    isEnemyInRange(enemy) {
        const distance = Math.sqrt(Math.pow(this.position.x - enemy.position.x, 2) + Math.pow(this.position.y - enemy.position.y, 2));
        return distance <= this.range;
    }
}
