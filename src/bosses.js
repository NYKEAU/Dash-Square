import { Enemy } from './enemy.js';
import { BulletHellProjectile } from './projectile.js';
import { Pistol, Shotgun, SMG, Famas, Sniper } from './weapon.js';

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
        const weaponClasses = [Pistol, Shotgun, SMG, Famas, Sniper];

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
            // Tirer des projectiles vers le haut, le bas, la gauche et la droite
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 0, y: -1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 0, y: 1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: -1, y: 0 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 1, y: 0 }, bulletSize, this.enemyColor));

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
            // Tirer des projectiles vers le haut, le bas, la gauche et la droite
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 0, y: -1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 0, y: 1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: -1, y: 0 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 1, y: 0 }, bulletSize, this.enemyColor));

            // Tirer des projectiles en diagonale
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: -1, y: -1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 1, y: -1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: -1, y: 1 }, bulletSize, this.enemyColor));
            this.projectiles.push(new BulletHellProjectile(this.x + this.width / 2, this.y + this.height / 2, bulletSpeed, bulletDamage, { x: 1, y: 1 }, bulletSize, this.enemyColor));

            // Réinitialiser le temps écoulé
            this.lastBallThrowTime = currentTime;
        }
    }
}