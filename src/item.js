import { Shuriken } from './specialItems.js';

export class Item {
    constructor(id, nom, stats, rarete, prix, type) {
        this.id = id;
        this.nom = nom;
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
    static generateItems(player, enemies) {
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

            // Si le nombre aléatoire est inférieur à 0.01 (ce qui correspond à une chance de 1%), générer un item spécial
            if (specialItemRandomNumber < 1) {
                const specialItemName = specialItems[Math.floor(Math.random() * specialItems.length)];
                switch (specialItemName) {
                    case 'Shuriken':
                        selectedItems.push(new Shuriken(player, this.enemies));
                        break;
                    // Ajoutez d'autres cas ici pour d'autres types d'items spéciaux
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
const healthStatsPossibles = ['Vie', 'VieMax', 'Exp', 'Argent'];
const damageStatsPossibles = ['DégâtsJoueur', 'Défense', 'CadenceJoueur'];
const weaponStatsPossibles = ['CadenceTir', 'Vitesse', 'Portée', 'DégâtsArmes'];

let allItems = [];

// Créer des items pour les stats de santé
let potion1 = new Item(1, "Potion", { Vie: 0 }, 1, 0);
let potion2 = new Item(2, "Potion", { Vie: 0 }, 2, 0);
let potion3 = new Item(3, "Potion", { Vie: 0, [randomItem(healthStatsPossibles, "Vie")]: 0 }, 3, 0);
let potion4 = new Item(4, "Potion", { Vie: 0, [randomItem(healthStatsPossibles, "Vie")]: 0 }, 4, 0);
allItems.push(potion1, potion2, potion3, potion4);

// Créer des items pour les stats de dégâts
let bow1 = new Item(5, "Arc", { DégâtsJoueur: 0 }, 1, 0);
let bow2 = new Item(6, "Arc", { DégâtsJoueur: 0 }, 2, 0);
let bow3 = new Item(7, "Arc", { DégâtsJoueur: 0, [randomItem(damageStatsPossibles, "DégâtsJoueur")]: 0 }, 3, 0);
let bow4 = new Item(8, "Arc", { DégâtsJoueur: 0, [randomItem(damageStatsPossibles, "DégâtsJoueur")]: 0 }, 4, 0);
allItems.push(bow1, bow2, bow3, bow4);

// Créer des items pour les armes
let drumLoader1 = new Item(9, "Chargeur tambour", { CadenceTir: 0 }, 1, 0);
let drumLoader2 = new Item(10, "Chargeur tambour", { CadenceTir: 0 }, 2, 0);
let drumLoader3 = new Item(11, "Chargeur tambour", { CadenceTir: 0, [randomItem(weaponStatsPossibles, "CadenceTir")]: 0 }, 3, 0);
let drumLoader4 = new Item(12, "Chargeur tambour", { CadenceTir: 0, [randomItem(weaponStatsPossibles, "CadenceTir")]: 0 }, 4, 0);
allItems.push(drumLoader1, drumLoader2, drumLoader3, drumLoader4);

// Créer des items pour les stats de vitesse
let boots1 = new Item(13, "Bottes", { Vitesse: 0 }, 1, 0);
let boots2 = new Item(14, "Bottes", { Vitesse: 0 }, 2, 0);
let boots3 = new Item(15, "Bottes", { Vitesse: 0, [randomItem(weaponStatsPossibles, "Vitesse")]: 0 }, 3, 0);
let boots4 = new Item(16, "Bottes", { Vitesse: 0, [randomItem(weaponStatsPossibles, "Vitesse")]: 0 }, 4, 0);
allItems.push(boots1, boots2, boots3, boots4);

function randomItem(statsPossibles, exclude) {
    let stat;
    do {
        stat = statsPossibles[Math.floor(Math.random() * statsPossibles.length)];
    } while (stat === exclude);
    return stat;
}