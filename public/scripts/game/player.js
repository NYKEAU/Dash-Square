import { HitEffect } from './hitEffect.js';
import { Weapon, Pistol, Shotgun, SMG, Famas, Sniper } from './weapon.js';
import { getJoystick } from './joystick.js';

export class Player {
    // Définir le constructeur de la classe
    constructor(x, y, gameInstance) {
        this.gameInstance = gameInstance;
        this.x = x; // La position x du joueur
        this.y = y; // La position y du joueur
        this.width = 30; // La largeur du joueur
        this.maxBarWidth = document.getElementById('gameCanvas').width * 0.4; // La largeur maximale de la barre de vie
        this.height = 30; // La hauteur du joueur
        this.items = []; // Les items du joueur
        this.score = 0; // Le score du joueur
        this.scorePopupText = ''; // Le texte à afficher au-dessus du score
        this.scorePopupTime = 0; // Le temps restant avant que le texte ne disparaisse
        this.scorePopupY = 0; // La position y du texte à afficher au-dessus du score
        this.levelPopupScale = 1; // L'échelle du texte du niveau
        this.image = new Image(); // Initialiser l'image du joueur
        this.image.src = '../../assets/Sprites/Hero_Square.png'; // L'image du joueur

        // Armes et Projectiles
        this.weapon = new Pistol(this); // Initialiser l'arme de base du joueur
        this.weapons = [new Pistol(this)]; // Initialiser l'arsenal du joueur
        this.currentWeaponIndex = 0; // L'arme actuellement équipée par le joueur
        this.projectiles = []; // Initialiser les projectiles comme un tableau vide
        this.previousWeapon = null; // L'arme précédente du joueur

        // Mouvement
        this.speed = 5; // La vitesse de déplacement du joueur

        // Santé et Niveau
        this.health = 100; // La santé du joueur
        this.maxHealth = this.health; // La santé maximale du joueur
        this.level = 1; // Niveau du joueur au début du jeu
        this.experience = 0; // Expérience du joueur au début du jeu
        this.maxExperience = 100; // Expérience maximale du prochain niveau du joueur
        this.totalExp = 0; // Expérience totale du joueur
        this.money = 0; // Argent du joueur au début du jeu

        // Dégâts et Attaque
        this.damage = this.weapon.damage; // Les dégâts du joueur
        this.defense = 0; // La défense du joueur
        this.rof = this.weapon.fireRate; // La cadence de tir du joueur

        // Effets Visuels
        this.hitEffects = []; // Tableau des hitmarkers
        this.duration = 100; // La durée de l'effet de flash quand le joueur subit des dégâts
        this.hitFlash = false; // Si le joueur subit des dégâts

        this.permanentStats = {
            Vie: 0,
            VieMax: 0,
            Exp: 0,
            Argent: 0,
            Dégâts: 0,
            Défense: 0,
            Cadence: 0,
            Vitesse: 0
        };
    }

    draw(ctx) {
        // Remplacer le dessin du carré par le dessin de l'image
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    // Méthode pour ajouter une arme
    addWeapon(weapon) {
        this.weapons.push(weapon);
        this.drawWeapons();
    }

    // Méthode pour vérifier si le joueur possède déjà une arme
    hasWeapon(weaponClass, weaponCount) {
        return this.weapons.some(weapon => weapon instanceof weaponClass) ? false : this.weapons.length >= weaponCount ? null : true;
    }

    // Méthode pour changer d'arme
    changeWeapon(newWeapon) {
        if (newWeapon instanceof Weapon) {
            this.weapon.stopShooting();
            this.weapon = newWeapon; // Mettre à jour l'arme actuellement utilisée
            this.weapon.startShooting();
            this.damage = this.weapon.damage; // Mettre à jour les dégâts du joueur
            this.rof = this.weapon.fireRate; // Mettre à jour la cadence de tir du joueur

            this.damage = this.damage + Math.ceil(this.damage * this.permanentStats.Dégâts / 1000);
            this.rof = this.rof + Math.ceil(this.rof * this.permanentStats.Cadence / 1000);

            this.updateStatsDisplay();

            console.log(this.permanentStats);
        } else {
            console.error('Invalid weapon type');
        }
    }

    draw(context, x, y, mapStartX, mapStartY) {
        // Dessiner les effets de coup avant de vérifier si le joueur est mort
        for (let hitEffect of this.hitEffects) {
            hitEffect.draw(context, mapStartX - 10, mapStartY);
        }

        context.save(); // Sauvegarder l'état actuel du contexte

        // Calculer l'angle de rotation
        const angle = this.getRotationAngleToEnemy();

        // Déplacer le contexte au centre du joueur
        context.translate(x + this.width / 2, y + this.height / 2);

        // Appliquer la rotation
        context.rotate(angle + Math.PI / 2);

        // Dessiner l'image du joueur en tenant compte de la rotation
        context.shadowColor = 'blue';
        context.shadowBlur = 10;

        if (this.hitFlash) {
            context.fillStyle = 'white';
            context.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        } else {
            context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }

        context.shadowBlur = 0;

        context.restore(); // Restaurer l'état précédent du contexte
    }

    // Méthode pour dessiner les armes du joueur
    drawWeapons() {
        // Récupérer le conteneur d'armes dans le DOM
        const weaponsContainer = document.getElementById('weaponsContainer');

        // Effacer le contenu précédent du conteneur d'armes
        weaponsContainer.innerHTML = '';

        // Initialiser this.previousWeapon avec l'élément de l'arme de base
        this.previousWeapon = null;

        // Parcourir les armes et générer les éléments HTML correspondants
        this.weapons.forEach((weapon, index) => {
            weapon.name = weapon.image.src.replace(/^.*[\\/]/, '').slice(0, -4);
            const weaponElement = document.createElement('div');
            weaponElement.id = weapon.name;
            weaponElement.classList.add('weapon');

            const weaponImage = document.createElement('img');
            weaponImage.src = weapon.image.src;
            weaponImage.alt = weapon.name;

            // Événement onclick pour la sélection de l'arme
            weaponElement.onclick = () => {
                // Désélectionner l'arme précédente si elle existe
                if (this.previousWeapon) {
                    this.previousWeapon.classList.remove('selected');
                }

                // Sélectionner l'arme actuelle
                weaponElement.classList.add('selected');

                // Mettre à jour l'arme précédente
                this.previousWeapon = weaponElement;

                // Mettre à jour l'index de l'arme actuelle
                this.currentWeaponIndex = index;

                this.changeWeapon(weapon);
            };

            // Si c'est l'arme de base, la sélectionner
            if (index === this.currentWeaponIndex) {
                weaponElement.classList.add('selected');
                this.previousWeapon = weaponElement;
            }

            // Ajouter l'élément d'arme au conteneur d'armes
            weaponElement.appendChild(weaponImage);
            weaponsContainer.appendChild(weaponElement);
        });
    }

    // Méthode pour dessiner la barre de vie du joueur
    drawHealthBar(context) {
        const barWidth = (this.maxHealth < this.maxBarWidth) ? (this.health / this.maxHealth) * this.maxHealth : (this.health / this.maxHealth) * this.maxBarWidth; // La largeur de la b<arre d'expérience est proportionnelle à l'expérience du joueur
        const barHeight = 25; // La hauteur de la barre de vie
        const barX = 10; // La position x de la barre de vie (10 pixels depuis le bord gauche de l'écran)
        const barY = 10; // La position y de la barre de vie (10 pixels depuis le haut de l'écran)

        // Dessiner le contour de la barre de vie
        context.strokeStyle = 'black';
        if (this.maxHealth < this.maxBarWidth) {
            context.strokeRect(barX, barY, this.maxHealth, barHeight);
        } else {
            context.strokeRect(barX, barY, this.maxBarWidth, barHeight);
        }

        // Remplir l'intérieur de la barre de vie en rouge
        context.fillStyle = 'red';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Préparer le texte
        const healthText = this.health + '/' + this.maxHealth;
        const textWidth = context.measureText(healthText).width;

        // Calculer la position x du texte
        const textX = Math.max(barX + barWidth - textWidth - 5, barX + 5);

        // Dessiner le nombre de points de vie dans la barre de vie
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '16px Roboto'; // Taille et police du texte
        context.fillText(healthText, barX + 5, barY + 17.5); // Position du texte
    }

    // Méthode pour dessiner la barre d'expérience du joueur
    drawExperienceBar(context) {
        // Sauvegarder l'état actuel du contexte
        context.save();

        const barWidth = (this.maxHealth < this.maxBarWidth) ? (this.experience / this.maxExperience) * this.maxHealth : (this.experience / this.maxExperience) * this.maxBarWidth; // La largeur de la barre d'expérience est proportionnelle à l'expérience du joueur
        const barHeight = 12.5; // La hauteur de la barre d'expérience
        const barX = 10; // La position x de la barre d'expérience (10 pixels depuis le bord gauche de l'écran)
        const barY = 40; // La position y de la barre d'expérience (40 pixels depuis le haut de l'écran)


        // Dessiner le contour de la barre d'expérience
        context.strokeStyle = 'black';
        if (this.maxHealth < this.maxBarWidth) {
            context.strokeRect(barX, barY, this.maxHealth, barHeight);
        } else {
            context.strokeRect(barX, barY, this.maxBarWidth, barHeight);
        }

        // Remplir l'intérieur de la barre d'expérience en bleu
        context.fillStyle = 'cyan';
        context.fillRect(barX, barY, barWidth, barHeight);

        // Préparer le texte
        const experienceText = this.experience + '/' + this.maxExperience;

        // Dessiner l'expérience du joueur dans la barre d'expérience
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '10px Roboto'; // Taille et police du texte
        context.textAlign = 'right'; // Aligner le texte à droite
        if (this.maxHealth < this.maxBarWidth) {
            context.fillText(experienceText, barX + this.maxHealth - 5, barY + barHeight / 2 + 4);
        } else {
            context.fillText(experienceText, barX + this.maxBarWidth - 5, barY + barHeight / 2 + 4);
        }

        // Restaurer l'état du contexte
        context.restore();
    }

    // Méthode pour dessiner le niveau du joueur
    drawLevel(context) {
        // Préparer le texte
        const levelText = 'Niveau ' + this.level;

        // Dessiner le niveau du joueur en haut de l'écran
        context.fillStyle = 'black'; // Couleur du texte
        context.font = `${30 * this.levelPopupScale}px Roboto`; // Taille et police du texte
        const textWidth = context.measureText(levelText).width;
        context.fillText(levelText, (this.gameInstance.canvas.width - textWidth) / 2, 50);

        // Réduire l'échelle
        if (this.levelPopupScale > 1) {
            this.levelPopupScale -= 0.01; // Supposer que cette méthode est appelée 60 fois par seconde
        }
    }

    // Méthode pour dessiner l'argent du joueur
    drawMoney(context) {
        // Préparer le texte
        const moneyText = 'Argent: ' + this.money;

        // Dessiner l'argent du joueur en haut de l'écran
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '16px Roboto'; // Taille et police du texte
        context.fillText(moneyText, 10, 70); // Position du texte
    }

    // Méthode pour dessiner le score du joueur
    drawScore(context) {
        // Préparer le texte
        const scoreText = 'Score: ' + this.score;

        // Dessiner le score du joueur en haut de l'écran
        context.fillStyle = 'black'; // Couleur du texte
        context.font = '20px Roboto'; // Taille et police du texte

        const textWidth = context.measureText(scoreText).width;
        context.fillText(scoreText, (this.gameInstance.canvas.width - textWidth) / 2, this.gameInstance.canvas.height - 50);

        // Dessiner le texte au-dessus du score si le temps restant est supérieur à 0
        if (this.scorePopupTime > 0) {
            context.fillStyle = `rgba(0, 0, 0, ${this.scorePopupTime / 2})`; // Couleur du texte (avec opacité)
            context.font = '20px Roboto'; // Taille et police du texte
            context.fillText(this.scorePopupText, (this.gameInstance.canvas.width) / 2, this.scorePopupY); // Position du texte

            // Réduire le temps restant et la position y
            this.scorePopupTime -= 1 / 60; // Supposer que cette méthode est appelée 60 fois par seconde
            this.scorePopupY -= 1; // Faire monter le texte de 1 pixel par frame
        }
    }

    getRotationAngleToEnemy() {
        const closestEnemy = this.gameInstance.getClosestEnemy();
        if (closestEnemy && !closestEnemy.isDead) {
            const dx = closestEnemy.x + closestEnemy.width / 2 - (this.x + this.width / 2);
            const dy = closestEnemy.y + closestEnemy.height / 2 - (this.y + this.height / 2);
            return Math.atan2(dy, dx);
        }
        return 0; // Par défaut, pas de rotation si aucun ennemi n'est trouvé
    }

    // Méthode pour ajouter un item et mettre à jour les statistiques du joueur
    addItem(item) {
        if (item.rarete === 'special') {
            this.gameInstance.specialItems.push(item);
        } else {
            this.items.push(item);
        }
        this.updateStats(item.stats);
    }

    // Supprimer tous les items du joueur
    removeItems() {
        this.items = [];
        this.updateStats({ Vie: -this.health, VieMax: -this.maxHealth, Exp: -this.maxExperience, Argent: -this.money, Dégâts: -this.damage, Défense: -this.defense, Cadence: -this.rof, Vitesse: -this.speed });
    }

    // Méthode pour augmenter le score du joueur
    increaseScore(points) {
        this.score += points;

        // Mettre à jour le texte à afficher et le temps restant
        if (points >= 10) {
            this.scorePopupText = '+' + points;
            this.scorePopupTime = 2; // Le texte sera affiché pendant 2 secondes
            this.scorePopupY = this.gameInstance.canvas.height - 50;
        }
    }

    resetStats() {
        this.health = 100;
        this.maxHealth = 100;
        this.level = 1;
        this.experience = 0;
        this.maxExperience = 100;
        this.totalExp = 0;
        this.money = 0;
        this.score = 0;
        this.damage = this.weapon.damage;
        this.defense = 0;
        this.rof = this.weapon.fireRate;
        this.permanentStats = {
            Vie: 0,
            VieMax: 0,
            Exp: 0,
            Argent: 0,
            Dégâts: 0,
            Défense: 0,
            Cadence: 0,
            Vitesse: 0
        };
    }

    // Méthode pour initialiser les statistiques du joueur dans le tableau de stats
    initStats() {
        document.getElementById('health').innerText = this.health + '/' + this.maxHealth;
        document.getElementById('speed').innerText = this.speed;
        document.getElementById('exp').innerText = this.experience;
        document.getElementById('money').innerText = this.money;
        document.getElementById('defense').innerText = this.defense;
        document.getElementById('damage').innerText = this.damage;
        document.getElementById('cadence').innerText = this.rof;
    }

    // Méthode pour mettre à jour les statistiques du joueur
    updateStats(stats) {
        for (let stat in stats) {
            this.permanentStats[stat] += stats[stat];

            if (stat === 'Vie') {
                this.health = this.health + Math.ceil(this.health * stats[stat] / 1000);
                if (this.health > this.maxHealth) this.health = this.maxHealth;
            } else if (stat === 'VieMax') {
                this.maxHealth = this.maxHealth + Math.ceil(this.maxHealth * stats[stat] / 1000);
            } else if (stat === 'Vitesse') {
                this.speed = this.speed + Math.ceil(this.speed * stats[stat] / 1000);
            } else if (stat === 'Exp') {
                this.experience = this.experience + Math.ceil(this.experience * stats[stat] / 1000);
            } else if (stat === 'Argent') {
                this.money = this.money + Math.ceil(this.money * stats[stat] / 1000);
            } else if (stat === 'Défense') {
                this.defense = this.defense + Math.ceil(this.defense * stats[stat] / 1000);
            } else if (stat === 'Dégâts') {
                this.damage = this.damage + Math.ceil(this.damage * stats[stat] / 1000);
            } else if (stat === 'Cadence') {
                this.rof = this.rof + Math.ceil(this.rof * stats[stat] / 1000);
            }
        }
    }

    // Mettre à jour l'affichage des statistiques du joueur
    updateStatsDisplay() {
        document.getElementById('health').innerText = this.health + '/' + this.maxHealth + ' PV';
        document.getElementById('speed').innerText = this.speed + ' m/s';
        document.getElementById('exp').innerText = this.totalExp;
        document.getElementById('money').innerText = this.money;
        document.getElementById('defense').innerText = this.defense;
        document.getElementById('damage').innerText = this.damage * this.rof + ' dgts/s';
        document.getElementById('cadence').innerText = this.rof + ' tirs/s';
    }

    // Méthode pour déplacer le joueur
    move(keys, mapWidth, mapHeight) {
        let newX = this.x;
        let newY = this.y;

        if (document.getElementById('mobileMode').checked) {
            // Récupérer le joystick
            const joystick = getJoystick();

            // Vérifier si le joystick est utilisé
            const joystickPos = joystick ? joystick.getPosition() : { x: 0, y: 0 };

            // Vérifier si le joystick est utilisé et traiter les entrées du joystick en premier
            if (joystickPos.x !== 0 || joystickPos.y !== 0) {
                // Normaliser les coordonnées du joystick pour qu'elles soient comprises entre -1 et 1
                const maxJoystickPos = 100; // Remplacez par la valeur maximale que peut renvoyer votre joystick
                const normalizedX = joystickPos.x / maxJoystickPos;
                const normalizedY = joystickPos.y / maxJoystickPos;

                // Calculer la nouvelle position du joueur en fonction des coordonnées normalisées du joystick
                newX += normalizedX * this.speed;
                newY += normalizedY * this.speed;
            }
        } else {
            // Logique existante pour les touches du clavier
            if (keys['ArrowUp'] || keys['z'] || keys['Z']) newY -= this.speed;
            if (keys['ArrowDown'] || keys['s'] || keys['S']) newY += this.speed;
            if (keys['ArrowLeft'] || keys['q'] || keys['Q']) newX -= this.speed;
            if (keys['ArrowRight'] || keys['d'] || keys['D']) newX += this.speed;
        }

        // Normaliser la vitesse si le joueur se déplace en diagonale
        if (newX !== this.x && newY !== this.y) {
            const diagonalSpeed = this.speed / Math.sqrt(2);
            newX = this.x + (newX - this.x) * diagonalSpeed / this.speed;
            newY = this.y + (newY - this.y) * diagonalSpeed / this.speed;
        }

        // Vérifier si le joueur est à l'intérieur de la zone de jeu
        this.x = Math.max(0, Math.min(mapWidth - this.width, newX));
        this.y = Math.max(0, Math.min(mapHeight - this.height, newY));
    }

    // Méthode pour gérer la collision avec un ennemi
    isCollidingWithEnemy(object) {
        if (!object.isDead) {
            const playerRight = this.x + this.width;
            const playerBottom = this.y + this.height;
            const objectRight = object.x + object.width;
            const objectBottom = object.y + object.height;

            return this.x < objectRight &&
                playerRight > object.x &&
                this.y < objectBottom &&
                playerBottom > object.y;
        } else {
            return;
        }
    }

    // Méthode pour vérifier la collision avec une pièce
    isCollidingWithCoin(coin) {
        return this.x < coin.x + coin.width &&
            this.x + this.width > coin.x &&
            this.y < coin.y + coin.height &&
            this.y + this.height > coin.y;
    }

    // Méthode pour augmenter l'argent du joueur
    increaseMoney(amount) {
        this.money += amount;
    }

    // Méthode pour réduire la santé du joueur
    decreaseHealth(amount) {
        this.health -= amount;
        this.hitFlash = true;
        setTimeout(() => {
            this.hitFlash = false;
        }, this.duration);

        // Afficher le nombre de dégâts subis
        this.hitEffects.push(new HitEffect(this, amount, 'player'));

        // Vérifier si le joueur est mort
        if (this.health < 1) {
            // Arrêter la génération des ennemis
            this.gameInstance.stopEnemyGeneration();

            // Afficher l'écran de fin de partie
            this.gameInstance.destroy();
        }

        // Jouer l'animation de dégâts
        document.getElementById('ath').style.animation = 'hit 0.25s';
        document.getElementById('ath').style.top = '-50%';
        document.body.style.backgroundColor = 'darkgrey';
        setTimeout(() => {
            document.getElementById('ath').style.animation = '';
            document.body.style.backgroundColor = 'white';
            document.getElementById('ath').style.top = '0';
        }, 251);
    }

    // Méthode pour augmenter le niveau d'expérience du joueur
    levelUp() {
        // Augmenter le niveau du joueur
        this.level += 1;
        let healthPercent = this.health / this.maxHealth;

        // Mettre à jour l'échelle du texte
        this.levelPopupScale = 1.2; // Le texte sera grossi de 20%

        // Augmenter la vie max du joueur en fonction de sa vie max actuelle
        let increment = 10 ** Math.floor(Math.log10(this.maxHealth));
        this.maxHealth += increment / 10;

        // Augmenter le score du joueur
        this.score += this.level * 10;

        if (this.level % 10 === 0) {
            this.maxHealth = Math.ceil(this.maxHealth * 1.025 / 10) * 10;
            this.maxExperience += 50;
        };

        // Augmenter les dégâts du joueur (sans décimales et arrondi au chiffre supérieur)
        this.damage = Math.floor(this.damage * 1.01);
        this.permanentStats.Dégâts = Math.floor(this.permanentStats.Dégâts * 1.01);
        this.health = Math.floor(this.maxHealth * healthPercent / 10) * 10;
        this.permanentStats.Vie = Math.floor(this.permanentStats.Vie * 1.01);

        // Modifier la génération des ennemis et afficher la boutique tous les 5 niveaux
        if (this.level % 5 === 0) {
            this.gameInstance.stopEnemyGeneration();
            this.gameInstance.displayShop();
        }

        // Faire spawn un boss tous les 15 niveaux
        if (this.level % 10 === 0) {
            this.gameInstance.stopEnemyGeneration();
            this.gameInstance.isBossLevel = true;
        }

        // Réinitialiser l'expérience du joueur
        this.experience = 0;
    }

    // Méthode pour augmenter l'expérience du joueur
    increaseExperience(amount) {
        this.experience += amount;
        this.totalExp += amount;

        // Si l'expérience du joueur est supérieure à l'expérience maximale
        if (this.experience >= this.maxExperience) {
            // Augmenter le niveau du joueur
            this.levelUp();
        }
    }
}