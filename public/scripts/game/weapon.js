import { Projectile, SniperProjectile } from './projectile.js';

export class Weapon {
    constructor(player) {
        this.player = player;
        this.x = 0;
        this.y = 0;
        this.fireRate = 1; // Vitesse de tir en balles par seconde
        this.speed = 1; // Vitesse des balles par défaut
        this.range = 1000; // Portée par défaut
        this.timeoutId = null;
        this.damage = 1; // Dégâts par défaut
    }

    shoot(direction) {
    }

    startShooting() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(() => {
            const closestEnemy = this.player.gameInstance.getClosestEnemy();

            if (closestEnemy && !closestEnemy.isDead) {
                // Coordonnées du centre de l'ennemi
                const enemyCenterX = closestEnemy.x + closestEnemy.width / 2;
                const enemyCenterY = closestEnemy.y + closestEnemy.height / 2;

                // Coordonnées du centre du joueur
                const playerCenterX = this.player.x + this.player.width / 2;
                const playerCenterY = this.player.y + this.player.height / 2;

                // Vecteur de direction du joueur vers l'ennemi
                const dx = enemyCenterX - playerCenterX;
                const dy = enemyCenterY - playerCenterY;

                // Longueur du vecteur direction
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Normalisation du vecteur direction
                if (distance > 0) {
                    const direction = { x: dx / distance, y: dy / distance };
                    this.shoot(direction);
                }
            }

            this.startShooting();
        }, 1000 / this.fireRate);
    }


    stopShooting() {
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    draw(context, mapStartX, mapStartY) {
        if (this.image) {
            const weaponX = this.x + mapStartX;
            const weaponY = this.y + mapStartY;
            const weaponWidth = this.width;
            const weaponHeight = this.height;

            context.drawImage(this.image, weaponX, weaponY, weaponWidth, weaponHeight);

            // Ajout du gestionnaire d'événements de clic pour rendre l'image de l'arme cliquable
            this.player.canvas.addEventListener('click', (event) => {
                const rect = this.player.canvas.getBoundingClientRect();
                const mouseX = event.clientX - rect.left;
                const mouseY = event.clientY - rect.top;

                if (mouseX >= weaponX && mouseX <= weaponX + weaponWidth &&
                    mouseY >= weaponY && mouseY <= weaponY + weaponHeight) {
                    this.selectWeapon();
                }
            });
        }
    }

    selectWeapon() {
        this.player.changeWeapon(this);
    }
}

export class Pistol extends Weapon {
    constructor(player) {
        super(player); // Appel du constructeur de la classe mère
        this.speed = 10; // Initialiser this.speed ici pour la classe Pistol
        this.fireRate = 2; // Initialiser this.fireRate ici pour la classe Pistol
        this.damage = 8; // Initialiser this.damage ici pour la classe Pistol
        this.x = 0; // Initialiser this.x ici pour la classe Pistol
        this.y = 0; // Initialiser this.y ici pour la classe Pistol
        this.image = new Image();
        this.image.src = 'assets/Weapons/Pistol-1.png';
    }

    shoot(direction) {
        // Calculer la position initiale du projectile
        const x = this.player.x + this.player.width / 2;
        const y = this.player.y + this.player.height / 2;

        // Créer un nouveau projectile
        const projectile = new Projectile(x, y, this.speed, this.damage, this.range, this.player);

        // Calculer la direction du projectile
        projectile.calculateDirection(x + direction.x, y + direction.y);

        // Ajouter le projectile à la liste des projectiles du joueur
        this.player.projectiles.push(projectile);
    }
}

export class Shotgun extends Weapon {
    constructor(player) {
        super(player); // Appel du constructeur de la classe mère
        this.speed = 3; // Initialiser this.speed ici pour la classe Shotgun
        this.fireRate = 0.5; // Initialiser this.fireRate ici pour la classe Shotgun
        this.damage = 20; // Initialiser this.damage ici pour la classe Shotgun
        this.x = 0; // Initialiser this.x ici pour la classe Shotgun
        this.y = 0; // Initialiser this.y ici pour la classe Shotgun
        this.image = new Image();
        this.image.src = 'assets/Weapons/Shotgun-1.png';
    }

    shoot(direction) {
        // Le shotgun tire 3 projectiles à la fois
        for (let i = -1; i <= 1; i++) {
            const spreadDirection = { x: direction.x + i * 0.2, y: direction.y };
            const projectile = new Projectile(
                this.player.x + this.player.width / 2,
                this.player.y + this.player.height / 2,
                this.speed,
                this.damage,
                this.range,
                this.player
            );

            // Calculer la direction du projectile
            projectile.calculateDirection(projectile.x + spreadDirection.x, projectile.y + spreadDirection.y);

            // Ajouter le projectile à la liste des projectiles du joueur
            this.player.projectiles.push(projectile);
        }
    }
}

export class SMG extends Weapon {
    constructor(player) {
        super(player); // Appel du constructeur de la classe mère
        this.speed = 5; // Initialiser this.speed ici pour la classe SMG
        this.fireRate = 10; // Initialiser this.fireRate ici pour la classe SMG
        this.damage = 3; // Initialiser this.damage ici pour la classe SMG
        this.x = 0; // Initialiser this.x ici pour la classe SMG
        this.y = 0; // Initialiser this.y ici pour la classe SMG
        this.image = new Image();
        this.image.src = 'assets/Weapons/SMG-2.png';
    }

    shoot(direction) {
        // Calculer la position initiale du projectile
        const x = this.player.x + this.player.width / 2;
        const y = this.player.y + this.player.height / 2;

        // Créer un nouveau projectile
        const projectile = new Projectile(x, y, this.speed, this.damage, this.range, this.player);

        // Calculer la direction du projectile
        projectile.calculateDirection(x + direction.x, y + direction.y);

        // Ajouter le projectile à la liste des projectiles du joueur
        this.player.projectiles.push(projectile);
    }
}

export class Famas extends Weapon {
    constructor(player) {
        super(player);
        this.speed = 5;
        this.burstCount = 500; // Temps de pause de 0.5 secondes
        this.damage = 5; // Chaque balle fait 5 de dégâts
        this.fireRate = 4; // Nombre de tirs dans une rafale
        this.isReloading = false; // Indicateur pour savoir si le Famas est en train de recharger
        this.burstDelay = 50; // Délai entre chaque balle d'une même rafale
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = 'assets/Weapons/SMG-4.png';
    }

    shoot(direction) {
        if (!this.isReloading) {
            this.isReloading = true; // Commencer à recharger

            for (let i = 0; i < this.fireRate; i++) {
                setTimeout(() => {
                    const x = this.player.x + this.player.width / 2;
                    const y = this.player.y + this.player.height / 2;

                    const projectile = new Projectile(x, y, this.speed, this.damage, this.range, this.player);
                    projectile.calculateDirection(x + direction.x, y + direction.y);

                    this.player.projectiles.push(projectile);
                }, i * this.burstDelay);
            }

            setTimeout(() => {
                this.isReloading = false;
            }, this.burstCount);
        }
    }
}

export class Sniper extends Weapon {
    constructor(player) {
        super(player);
        this.speed = 15;
        this.fireRate = 0.5;
        this.damage = 50;
        this.range = 1000;
        this.x = 0;
        this.y = 0;
        this.image = new Image();
        this.image.src = 'assets/Weapons/Sniper-rifle-1-scoped.png';
    }

    shoot(direction) {
        const x = this.player.x + this.player.width / 2;
        const y = this.player.y + this.player.height / 2;

        const projectile = new SniperProjectile(x, y, this.speed, this.damage, this.range, this.player);
        projectile.calculateDirection(x + direction.x, y + direction.y);

        this.player.projectiles.push(projectile);
    }
}