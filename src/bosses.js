import { Enemy } from './enemy.js';

class Boss extends Enemy {
    constructor(player, mapWidth, mapHeight, baseHealth, damage, xpGived) {
        super(player, mapWidth, mapHeight, baseHealth, damage, xpGived);
        // Dimensions
        this.width = 200;
        this.height = 200;
        this.radius = this.width / 2;
    }
}

export class FireBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 500, 20, 100);
        this.enemyColor = 'red';
    }

    useSpecialAbility() {
        // Implémentez la capacité spéciale du FireBoss ici
    }
}

export class IceBoss extends Boss {
    constructor(player, mapWidth, mapHeight) {
        super(player, mapWidth, mapHeight, 600, 25, 150);
        this.enemyColor = 'blue';
    }

    useSpecialAbility() {
        // Implémentez la capacité spéciale de l'IceBoss ici
    }
}