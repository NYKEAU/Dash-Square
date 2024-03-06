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
        this.speed = 10; // Définir une vitesse pour le shuriken
        this.direction = { x: 0, y: 0 }; // Ajouter une propriété direction
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
        this.isTouchingEnemy = false; // Ajouter cette variable pour suivre l'état de collision
    }

    calculateDirection(targetX, targetY) {
        // Calculer la direction en fonction de la position du shuriken et de la cible
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.direction = { x: dx / distance, y: dy / distance };
        }
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

        // Vérifiez les collisions avec chaque ennemi
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.collidesWith(this.enemies[i])) {
                this.hitEnemy(this.enemies[i]);
            }
        }

        this.angle += this.rotationSpeed;
    }

    hitEnemy(enemy) {
        // Causer des dégâts à l'ennemi
        enemy.health -= this.damage;
        console.log(`L'ennemi a subi ${this.damage} points de dégâts !`);

        // Vérifier si l'ennemi n'a plus de santé
        if (enemy.health <= 0) {
            const index = this.enemies.indexOf(enemy);
            if (index !== -1) {
                this.enemies.splice(index, 1); // Supprimer l'ennemi du tableau
            }
        }
    }

    draw(context) {
        // Met à jour la position du shuriken pour qu'il tourne autour du joueur
        this.position.x = this.center.x + Math.cos(this.angle) * this.range;
        this.position.y = this.center.y + Math.sin(this.angle) * this.range;

        // Vérifie si le shuriken touche un ennemi avant de dessiner
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.collidesWith(this.enemies[i])) {
                this.hitEnemy(this.enemies[i]);
            }
        }

        context.beginPath();
        context.arc(this.position.x, this.position.y, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'gray';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#003300';
        context.stroke();

        this.angle += this.rotationSpeed;
    }

    collidesWith(enemy) {
        const dx = this.position.x - enemy.x;
        const dy = this.position.y - enemy.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const collision = distance < this.radius + enemy.radius;
        if (collision) {
            console.log('Collision détectée avec un ennemi');
        }

        return collision;
    }
}
