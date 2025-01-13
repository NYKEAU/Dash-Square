import { Enemy } from './enemy.js';
import { BulletHellProjectile } from './projectile.js';
import { Pistol, Shotgun, SMG, P90, Sniper } from './weapon.js';

class Boss extends Enemy {
    constructor(player, mapWidth, mapHeight, baseHealth, damage, xpGived) {
        super(player, mapWidth, mapHeight, baseHealth, damage, xpGived);
        // Dimensions
        this.width = 200;
        this.height = 200;
        this.radius = this.width / 2;
        this.speed = 0.5;
        this.player = player;
    }

    dropWeapon() {
        // Liste de toutes les classes d'armes possibles
        const weaponClasses = [Pistol, Shotgun, SMG, P90, Sniper];

        // Choisissez une classe d'arme aléatoire et que le joueur n'a pas déjà
        let weaponClass = null;
        let attempts = 0;
        while (weaponClass === null && attempts <= weaponClasses.length) {
            const randomIndex = Math.floor(Math.random() * weaponClasses.length);
            const randomWeaponClass = weaponClasses[randomIndex];
            const hasWeaponResult = this.player.hasWeapon(randomWeaponClass, weaponClasses.length);
            if (hasWeaponResult === true) {
                weaponClass = randomWeaponClass;
            }
            attempts++;
        }

        // Si le joueur a déjà toutes les armes, retournez null
        if (weaponClass === null) {
            return null;
        }

        // Créez une nouvelle instance de l'arme
        const weapon = new weaponClass();

        // Définissez la position de l'arme à la position du boss
        weapon.x = this.x;
        weapon.y = this.y;
        weapon.player = this.player;

        return weapon;
    }

    calculateProjectileStartPosition(direction) {
        const offset = 10;
        const startX = this.x + this.width / 2 + direction.x * (this.width / 2 + offset);
        const startY = this.y + this.height / 2 + direction.y * (this.height / 2 + offset);
        return { x: startX, y: startY };
    }
}

export class IceBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 600, 25, 150);
        this.enemyColor = 'blue';
        this.lastBallThrowTime = new Date().getTime();
    }

    useSpecialAbility(currentTime) {
        // Implémentez la capacité spéciale de l'IceBoss ici
        const bulletSpeed = 1; // Vitesse des projectiles
        const bulletSize = 20; // Taille des projectiles
        const bulletDamage = 15; // Dégâts des projectiles

        if (currentTime - this.lastBallThrowTime >= 500) {
            const directions = [
                { x: 0, y: -1 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 }
            ];

            directions.forEach(direction => {
                const startPosition = this.calculateProjectileStartPosition(direction);
                this.projectiles.push(new BulletHellProjectile(startPosition.x, startPosition.y, bulletSpeed, bulletDamage, direction, bulletSize, this.enemyColor));
            });

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}

export class EarthBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 600, 25, 150);
        this.enemyColor = 'brown';
        this.lastBallThrowTime = new Date().getTime();
    }

    useSpecialAbility(currentTime) {
        // Implémentez la capacité spéciale de l'IceBoss ici
        const bulletSpeed = 1; // Vitesse des projectiles
        const bulletSize = 20; // Taille des projectiles
        const bulletDamage = 15; // Dégâts des projectiles

        if (currentTime - this.lastBallThrowTime >= 500) {
            const directions = [
                { x: -1, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: 1 }
            ];

            directions.forEach(direction => {
                const startPosition = this.calculateProjectileStartPosition(direction);
                this.projectiles.push(new BulletHellProjectile(startPosition.x, startPosition.y, bulletSpeed, bulletDamage, direction, bulletSize, this.enemyColor));
            });

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}

export class WindBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 600, 25, 150);
        this.enemyColor = 'green';
        this.lastBallThrowTime = new Date().getTime();
        this.isDiagonalShoot = false; // Ajout de la nouvelle propriété
    }

    useSpecialAbility(currentTime) {
        const bulletSpeed = 1;
        const bulletSize = 20;
        const bulletDamage = 15;

        if (currentTime - this.lastBallThrowTime >= 500) {
            let directions;
            if (this.isDiagonalShoot) {
                // Directions des projectiles en diagonales
                directions = [
                    { x: -1, y: -1 },
                    { x: 1, y: -1 },
                    { x: -1, y: 1 },
                    { x: 1, y: 1 }
                ];
            } else {
                // Directions des projectiles vers le haut, le bas, la gauche et la droite
                directions = [
                    { x: 0, y: -1 },
                    { x: 0, y: 1 },
                    { x: -1, y: 0 },
                    { x: 1, y: 0 }
                ];
            }

            directions.forEach(direction => {
                const startPosition = this.calculateProjectileStartPosition(direction);
                this.projectiles.push(new BulletHellProjectile(startPosition.x, startPosition.y, bulletSpeed, bulletDamage, direction, bulletSize, this.enemyColor));
            });

            // Basculer l'état de tir
            this.isDiagonalShoot = !this.isDiagonalShoot;

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}

export class FireBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 500, 10, 100);
        this.enemyColor = 'red';
        this.lastBallThrowTime = new Date().getTime();
    }

    useSpecialAbility(currentTime) {
        // Implémentez la capacité spéciale du FireBoss ici
        const bulletSpeed = 1; // Vitesse des projectiles
        const bulletSize = 20; // Taille des projectiles
        const bulletDamage = 10; // Dégâts des projectiles

        if (currentTime - this.lastBallThrowTime >= 500) {
            const directions = [
                { x: 0, y: -1 },
                { x: 0, y: 1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 1 },
                { x: 1, y: 1 }
            ];

            directions.forEach(direction => {
                const startPosition = this.calculateProjectileStartPosition(direction);
                this.projectiles.push(new BulletHellProjectile(startPosition.x, startPosition.y, bulletSpeed, bulletDamage, direction, bulletSize, this.enemyColor));
            });

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}

export class VoidBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 500, 10, 100);
        this.enemyColor = 'indigo';
        this.lastBallThrowTime = new Date().getTime();
        this.angle = 0; // Nouvelle propriété pour l'angle
        this.rotationSpeed = Math.PI / 8; // Nouvelle propriété pour la vitesse de rotation
        this.lastHealthCheck = this.health; // Nouvelle propriété pour garder la trace de la dernière vérification de santé
    }

    useSpecialAbility(currentTime) {
        const bulletSpeed = 1; // Vitesse des projectiles
        const bulletSize = 20; // Taille des projectiles
        const bulletDamage = 10; // Dégâts des projectiles

        if (currentTime - this.lastBallThrowTime >= 25) {
            // Calculer la direction des projectiles en utilisant l'angle
            const directionX = Math.cos(this.angle);
            const directionY = Math.sin(this.angle);

            const directions = [
                { x: directionX, y: directionY },
                { x: -directionX, y: -directionY }
            ];

            directions.forEach(direction => {
                const startPosition = this.calculateProjectileStartPosition(direction);
                this.projectiles.push(new BulletHellProjectile(startPosition.x, startPosition.y, bulletSpeed, bulletDamage, direction, bulletSize, this.enemyColor));
            });

            // Augmenter l'angle pour le prochain tir avec la vitesse de rotation actuelle
            this.angle += this.rotationSpeed;

            // Vérifier si la santé a diminué de 10% depuis la dernière vérification
            if (this.lastHealthCheck - this.health >= this.health / 10) {
                // Augmenter la vitesse de rotation
                this.rotationSpeed += Math.PI / 15;

                // Mettre à jour la santé de référence pour la prochaine vérification
                this.lastHealthCheck = this.health;
            }

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}