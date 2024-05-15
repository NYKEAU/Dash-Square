import { Shuriken } from './specialItems.js';

export class Item {
    constructor(id, nom, icon, stats, rarete, prix, type) {
        this.id = id;
        this.nom = nom;
        this.icon = icon;
        this.stats = stats;
        this.rarete = rarete;
        this.prix = prix;
        this.type = type;

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
    static generateItems(player, enemies, canvas) {
        this.enemies = enemies;

        const level = player.level;
        const commonItems = allItems.filter((item) => item.rarete === 1);
        const rareItems = allItems.filter((item) => item.rarete === 2);
        const epicItems = allItems.filter((item) => item.rarete === 3);
        const legendaryItems = allItems.filter((item) => item.rarete === 4);

        const specialItems = ['Shuriken'];

        let rareProb, epicProb, legendaryProb;
        let selectedItems = [];

        for (let i = 0; i <= 10; i++) {
            if (level < i * 10) {
                rareProb = 50 - i * 5;
                epicProb = 80 - i * 5;
                legendaryProb = 95 - i * 5;
                break;
            } else {
                rareProb = 0;
                epicProb = 30;
                legendaryProb = 45;
            }
        }

        let randomIndex = 0;

        for (let i = 0; i < 3; i++) {
            const randomNumber = Math.floor(Math.random() * 100);

            // Générez un autre nombre aléatoire pour déterminer si un item spécial doit être généré
            const specialItemRandomNumber = Math.random();

            // Si le nombre aléatoire est inférieur à 0.03 (ce qui correspond à une chance de 3%), générer un item spécial
            if (specialItemRandomNumber < 0.03) {
                const specialItemName = specialItems[Math.floor(Math.random() * specialItems.length)];
                switch (specialItemName) {
                    case 'Shuriken':
                        selectedItems.push(new Shuriken(player, this.enemies, canvas));
                        break;
                }
            } else {
                // Sinon, générer un item normal
                if (randomNumber >= 0 && randomNumber < rareProb) {
                    randomIndex = Math.floor(Math.random() * commonItems.length);
                    selectedItems.push(commonItems[randomIndex]);
                } else if (randomNumber >= rareProb && randomNumber < epicProb) {
                    randomIndex = Math.floor(Math.random() * rareItems.length);
                    selectedItems.push(rareItems[randomIndex]);
                } else if (randomNumber >= epicProb && randomNumber < legendaryProb) {
                    randomIndex = Math.floor(Math.random() * epicItems.length);
                    selectedItems.push(epicItems[randomIndex]);
                } else {
                    randomIndex = Math.floor(Math.random() * legendaryItems.length);
                    selectedItems.push(legendaryItems[randomIndex]);
                }
            }
        }

        return selectedItems;
    }
}


// Définir les stats possibles
const healthStatsPossibles = ['Vie', 'VieMax', 'Exp'];
const damageStatsPossibles = ['Dégâts', 'Défense'];
const weaponStatsPossibles = ['Vitesse', 'Cadence',];
const permanentStatsPossibles = ['Argent', 'Vie'];

let allItems = [];

// ---------- Items permanents ----------
// Créer des items pour les stats de santé
let potion1 = new Item(1, "Potion", "Soin1", { Vie: 0 }, 1, 0);
let potion2 = new Item(2, "Potion", "Soin1", { Vie: 0 }, 2, 0);
let potion3 = new Item(3, "Potion", "Soin1", { Vie: 0, [randomItem(healthStatsPossibles, "Vie")]: 0 }, 3, 0);
let potion4 = new Item(4, "Potion", "Soin1", { Vie: 0, [randomItem(healthStatsPossibles, "Vie")]: 0 }, 4, 0);

// Créer des items pour les stats de santé max
let heart1 = new Item(5, "Coeur", "Vie", { VieMax: 0 }, 1, 0);
let heart2 = new Item(6, "Coeur", "Vie", { VieMax: 0 }, 2, 0);
let heart3 = new Item(7, "Coeur", "Vie", { VieMax: 0, [randomItem(healthStatsPossibles, "VieMax")]: 0 }, 3, 0);
let heart4 = new Item(8, "Coeur", "Vie", { VieMax: 0, [randomItem(healthStatsPossibles, "VieMax")]: 0 }, 4, 0);

// Créer des items pour les stats d'expérience
let exp1 = new Item(9, "Expérience", "Jauge", { Exp: 0 }, 1, 0);
let exp2 = new Item(10, "Expérience", "Jauge", { Exp: 0 }, 2, 0);
let exp3 = new Item(11, "Expérience", "Jauge", { Exp: 0, [randomItem(healthStatsPossibles, "Exp")]: 0 }, 3, 0);
let exp4 = new Item(12, "Expérience", "Jauge", { Exp: 0, [randomItem(healthStatsPossibles, "Exp")]: 0 }, 4, 0);

// Créer des items pour les stats de dégâts
let bow1 = new Item(13, "Arc", "Pistolet", { Dégâts: 0 }, 1, 0);
let bow2 = new Item(14, "Arc", "Pistolet", { Dégâts: 0 }, 2, 0);
let bow3 = new Item(15, "Arc", "Pistolet", { Dégâts: 0, [randomItem(damageStatsPossibles, "Dégâts")]: 0 }, 3, 0);
let bow4 = new Item(16, "Arc", "Pistolet", { Dégâts: 0, [randomItem(damageStatsPossibles, "Dégâts")]: 0 }, 4, 0);

// Créer des items pour les stats de défense
let shield1 = new Item(17, "Bouclier", "Shield", { Défense: 0 }, 1, 0);
let shield2 = new Item(18, "Bouclier", "Shield", { Défense: 0 }, 2, 0);
let shield3 = new Item(19, "Bouclier", "Shield", { Défense: 0, [randomItem(damageStatsPossibles, "Défense")]: 0 }, 3, 0);
let shield4 = new Item(20, "Bouclier", "Shield", { Défense: 0, [randomItem(damageStatsPossibles, "Défense")]: 0 }, 4, 0);

// Créer des items pour les stats de vitesse
let boots1 = new Item(21, "Bottes", "Speed", { Vitesse: 0 }, 1, 0);
let boots2 = new Item(22, "Bottes", "Speed", { Vitesse: 0 }, 2, 0);
let boots3 = new Item(23, "Bottes", "Speed", { Vitesse: 0, [randomItem(weaponStatsPossibles, "Vitesse")]: 0 }, 3, 0);
let boots4 = new Item(24, "Bottes", "Speed", { Vitesse: 0, [randomItem(weaponStatsPossibles, "Vitesse")]: 0 }, 4, 0);

// Créer des items pour les armes
let drumLoader1 = new Item(25, "Chargeur tambour", "Ammo1", { Cadence: 0 }, 1, 0);
let drumLoader2 = new Item(26, "Chargeur tambour", "Ammo1", { Cadence: 0 }, 2, 0);
let drumLoader3 = new Item(27, "Chargeur tambour", "Ammo1", { Cadence: 0, [randomItem(weaponStatsPossibles, "Cadence")]: 0 }, 3, 0);
let drumLoader4 = new Item(28, "Chargeur tambour", "Ammo1", { Cadence: 0, [randomItem(weaponStatsPossibles, "Cadence")]: 0 }, 4, 0);

// ---------- Items temporaires ----------
// Créer des items pour les stats d'argent
let coin1 = new Item(29, "Porte-monnaie", "", { Argent: 0 }, 1, 0, "Pièces");
let coin2 = new Item(30, "Porte-monnaie", "", { Argent: 0 }, 2, 0, "Pièces");
let coin3 = new Item(31, "Bourse", "", { Argent: 0 }, 3, 0, "Pièces");
let coin4 = new Item(32, "Bourse", "", { Argent: 0 }, 4, 0, "Pièces");

// Créer des items pour les stats de santé
let potionTemp1 = new Item(33, "Fiole de vie", "", { Vie: 0 }, 1, 0, "PV");
let potionTemp2 = new Item(34, "Fiole de vie", "", { Vie: 0 }, 2, 0, "PV");
let potionTemp3 = new Item(35, "Potion instantanée", "", { Vie: 0 }, 3, 0, "PV");
let potionTemp4 = new Item(36, "Potion instantanée", "", { Vie: 0 }, 4, 0, "PV");

// Créer des items pour les stats d'expérience
let expTemp1 = new Item(37, "Echantillon d'exp", "", { Exp: 0 }, 1, 0, "Exp");
let expTemp2 = new Item(38, "Echantillon d'exp", "", { Exp: 0 }, 2, 0, "Exp");
let expTemp3 = new Item(39, "Expérience instantanée", "", { Exp: 0 }, 3, 0, "Exp");
let expTemp4 = new Item(40, "Expérience instantanée", "", { Exp: 0 }, 4, 0, "Exp");

// Ajouter les items à la liste des items
allItems.push(potion1, potion2, potion3, potion4, heart1, heart2, heart3, heart4, exp1, exp2, exp3, exp4, bow1, bow2, bow3, bow4, shield1, shield2, shield3, shield4, boots1, boots2, boots3, boots4, drumLoader1, drumLoader2, drumLoader3, drumLoader4, coin1, coin2, coin3, coin4, potionTemp1, potionTemp2, potionTemp3, potionTemp4, expTemp1, expTemp2, expTemp3, expTemp4);

function randomItem(statsPossibles, exclude) {
    let stat;
    do {
        stat = statsPossibles[Math.floor(Math.random() * statsPossibles.length)];
    } while (stat === exclude);
    return stat;
}