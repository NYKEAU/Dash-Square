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

export class Orbe extends SpecialItem {
    constructor(player, enemies, canvas, color) {
        super("Orbe");
        this.speed = 10; // Définir une vitesse pour l'orbe
        this.direction = { x: 0, y: 0 }; // Ajouter une propriété direction
        this.color = color;
        this.type = 'Dégâts';
        this.damage = 25;
        this.rotationSpeed = 0.05;
        this.range = 50;
        this.isGoingCloser = false;
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
        // Mettre à jour la position de l'orbe en fonction de la direction et de la vitesse
        this.position.x += this.speed * this.direction.x;
        this.position.y += this.speed * this.direction.y;
    }

    update() {
        // Met à jour la position de l'orbe pour qu'il tourne autour du joueur
        this.position.x = this.center.x + Math.cos(this.angle) * this.range;
        this.position.y = this.center.y + Math.sin(this.angle) * this.range;

        // Mettre à jour l'angle pour faire tourner l'orbe
        this.angle += this.rotationSpeed;

        // Varier le range de l'orbe
        if (this.isGoingCloser) {
            this.range -= 0.5;
        } else {
            this.range += 0.5;
        }

        // Inverser la direction si l'orbe atteint une certaine distance
        if (this.range >= 200) {
            this.isGoingCloser = true;
        } else if (this.range <= 50) {
            this.isGoingCloser = false;
        }
    }

    draw(context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = this.color;
        context.lineWidth = 2;
        context.strokeStyle = context.fillStyle;
        context.shadowColor = context.fillStyle;
        context.shadowBlur = 10;
        context.stroke();
        context.shadowBlur = 0;
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
