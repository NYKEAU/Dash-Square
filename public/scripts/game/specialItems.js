export class SpecialItem {
    constructor(nom, player, enemies, canvas) {
        this.nom = nom;
        this.player = player;
        this.enemies = enemies;
        this.canvas = canvas;
    }

    // Méthodes et propriétés communes à tous les items spéciaux
    draw(context) {
        // Dessiner l'item spécial
    }
}

export class Shuriken extends SpecialItem {
    constructor(player, enemies, canvas) {
        super("Shuriken");
        this.speed = 10; // Définir une vitesse pour le shuriken
        this.direction = { x: 0, y: 0 }; // Ajouter une propriété direction
        this.radius = 10;
        this.type = 'Dégâts';
        this.damage = 10;
        this.rotationSpeed = 0.05;
        this.range = 50;
        this.player = player;
        this.enemies = enemies;
        this.prix = 150;
        this.rarete = 'special';
        this.icon = 'Couteau';
        this.angle = 0;
        this.center = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // Initialiser le centre avec les coordonnées du joueur
        this.position = { x: 0, y: 0 };
        this.isTouchingEnemy = false; // Ajouter cette variable pour suivre l'état de collision
        this.canvas = canvas;
    }

    move() {
        // Mettre à jour la position du shuriken en fonction de la direction et de la vitesse
        this.position.x += this.speed * this.direction.x;
        this.position.y += this.speed * this.direction.y;
    }

    update() {
        // Met à jour la position du shuriken pour qu'il tourne autour du joueur
        this.position.x = this.center.x + Math.cos(this.angle) * this.range;
        this.position.y = this.center.y + Math.sin(this.angle) * this.range;

        // Mettre à jour l'angle pour faire tourner le shuriken
        this.angle += this.rotationSpeed;
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'gray';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();
    }

    collidesWith(enemy) {
        const mapStartX = this.canvas.width / 2 - this.player.x - this.player.width / 2;
        const mapStartY = this.canvas.height / 2 - this.player.y - this.player.height / 2;

        return (
            this.position.x + 5 + 2.5 > enemy.x + mapStartX &&
            this.position.x - 5 - 2.5 < enemy.x + mapStartX + enemy.width &&
            this.position.y + 5 + 2.5 > enemy.y + mapStartY &&
            this.position.y - 5 - 2.5 < enemy.y + mapStartY + enemy.height
        );
    }
}
