class Item {
    constructor(id, nom, stats, rarete, prix) {
        this.id = id;
        this.nom = nom;
        this.stats = stats;
        this.rarete = rarete;
        this.prix = prix;

        // Modifier les stats et le prix en fonction de la rareté
        let min, max;
        switch (rarete) {
            case "commun":
                min = 40;
                max = 60;
                break;
            case "rare":
                min = 60;
                max = 80;
                break;
            case "epique":
                min = 80;
                max = 100;
                break;
            case "legendaire":
                min = 100;
                max = 120;
                break;
        }

        // Modifier les stats et le prix
        for (let stat in this.stats) {
            this.stats[stat] = this.randomInt(min, max);
        }
        this.prix = this.randomInt(min, max);
    }

    // Générer un nombre aléatoire entre min et max (inclus)
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

// Définir les stats possibles
const healthStatsPossibles = ['health', 'maxHealth', 'exp', 'money'];
const damageStatsPossibles = ['damage', 'defense', 'rof'];
const weaponStatsPossibles = ['fireRate', 'speed', 'range', 'damage'];

// Créer des items avec des stats prédéfinies
let potion1 = new Item(1, "Potion", { vie: 0 }, "commun", 0);
let potion2 = new Item(2, "Potion", { vie: 0 }, "rare", 0);
let potion3 = new Item(3, "Potion", { vie: 0, [healthStatsPossibles[Math.floor(Math.random() * healthStatsPossibles.length)]]: 1.1 }, "epique", 0);
let potion4 = new Item(4, "Potion", { vie: 0, [healthStatsPossibles[Math.floor(Math.random() * healthStatsPossibles.length)]]: 1.1 }, "legendaire", 0);



// STATS JOUEUR
// // Santé et Niveau
// this.health = 100; // La santé du joueur
// this.maxHealth = this.health; // La santé maximale du joueur
// this.level = 1; // Niveau du joueur au début du jeu
// this.experience = 0; // Expérience du joueur au début du jeu
// this.maxExperience = 100; // Expérience maximale du prochain niveau du joueur
// this.money = 0; // Argent du joueur au début du jeu

// // Dégâts et Attaque
// this.damage = this.weapon.damage; // Les dégâts du joueur
// this.defense = 0; // La défense du joueur
// this.rof = 0; // La cadence de tir du joueur

// STATS ARMES
// this.fireRate = 1; // Vitesse de tir en balles par seconde
// this.speed = 1; // Vitesse des balles par défaut
// this.range = 1000; // Portée par défaut
// this.damage = 1; // Dégâts par défaut