export class Item {
    constructor(id, nom, stats, rarete, prix) {
        this.id = id;
        this.nom = nom;
        this.stats = stats;
        this.rarete = rarete;
        this.prix = prix;

        // Modifier les stats et le prix en fonction de la rareté
        let min, max;
        switch (rarete) {
            case 1:
                min = 20;
                max = 40;
                break;
            case 2:
                min = 40;
                max = 60;
                break;
            case 3:
                min = 60;
                max = 80;
                break;
            case 4:
                min = 80;
                max = 100;
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

    // Sélectionner au hasard les 3 items à afficher dans la boutique en fonction du niveau du joueur
    static generateItems(level) {
        let items = [...allItems].filter(item => item.stats[Object.keys(item.stats)[0]] >= level / 10 + 1);
        let selectedItems = [];

        for (let i = 0; i < 3; i++) {
            let randomIndex = Math.floor(Math.random() * items.length);
            selectedItems.push(items[randomIndex]);
            items.splice(randomIndex, 1);
        }

        console.log(allItems);

        return selectedItems;
    }
}

// Définir les stats possibles
const healthStatsPossibles = ['Vie', 'VieMax', 'Exp', 'Argent'];
const damageStatsPossibles = ['DégâtsJoueur', 'Défense', 'CadenceJoueur'];
const weaponStatsPossibles = ['CadenceTir', 'Vitesse', 'Portée', 'DégâtsArmes'];

let allItems = [];

// Créer des items pour les stats de santé
let potion1 = new Item(1, "Potion", { Vie: 0 }, 1, 0);
let potion2 = new Item(2, "Potion", { Vie: 0 }, 2, 0);
let potion3 = new Item(3, "Potion", { Vie: 0, [healthStatsPossibles[Math.floor(Math.random() * healthStatsPossibles.length)]]: 0 }, 3, 0);
let potion4 = new Item(4, "Potion", { Vie: 0, [healthStatsPossibles[Math.floor(Math.random() * healthStatsPossibles.length)]]: 0 }, 4, 0);
allItems.push(potion1, potion2, potion3, potion4);

// Créer des items pour les stats de dégâts
let bow1 = new Item(5, "Arc", { Dégâts: 0 }, 1, 0);
let bow2 = new Item(6, "Arc", { Dégâts: 0 }, 2, 0);
let bow3 = new Item(7, "Arc", { Dégâts: 0, [damageStatsPossibles[Math.floor(Math.random() * damageStatsPossibles.length)]]: 0 }, 3, 0);
let bow4 = new Item(8, "Arc", { Dégâts: 0, [damageStatsPossibles[Math.floor(Math.random() * damageStatsPossibles.length)]]: 0 }, 4, 0);
allItems.push(bow1, bow2, bow3, bow4);

// Créer des items pour les armes
let drumLoader1 = new Item(9, "Chargeur tambour", { CadenceTir: 0 }, 1, 0);
let drumLoader2 = new Item(10, "Chargeur tambour", { CadenceTir: 0 }, 2, 0);
let drumLoader3 = new Item(11, "Chargeur tambour", { CadenceTir: 0, [weaponStatsPossibles[Math.floor(Math.random() * weaponStatsPossibles.length)]]: 0 }, 3, 0);
let drumLoader4 = new Item(12, "Chargeur tambour", { CadenceTir: 0, [weaponStatsPossibles[Math.floor(Math.random() * weaponStatsPossibles.length)]]: 0 }, 4, 0);
allItems.push(drumLoader1, drumLoader2, drumLoader3, drumLoader4);


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