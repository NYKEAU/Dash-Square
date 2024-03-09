import { Player } from './player.js';
import { Slime, Ghost, Shooter, Tank } from './enemy.js';
import { SniperProjectile } from './projectile.js';
import { Item } from './item.js';
import { Shuriken } from './specialItems.js';

// Définir la classe GameInstance
export class gameInstance {
    // Définir le constructeur de la classe
    constructor(canvas) {
        // Initialiser les propriétés de l'instance de jeu
        this.startTime = Date.now();
        this.canvas = canvas; // L'objet canvas
        this.context = canvas.getContext('2d'); // Le contexte de dessin du canvas
        this.screenWidth = window.innerWidth; // La largeur de l'écran du navigateur
        this.screenHeight = window.innerHeight; // La hauteur de l'écran du navigateur
        this.mapWidth = this.screenWidth * 1.5; // La largeur de la carte (1.5 fois la largeur de l'écran)
        this.mapHeight = this.screenHeight * 1.5; // La hauteur de la carte (1.5 fois la hauteur de l'écran)
        this.player = new Player(this.mapWidth / 2, this.mapHeight / 2, this); // Le joueur
        this.enemies = []; // Le tableau des ennemis
        this.keys = {}; // L'objet pour stocker l'état des touches enfoncées
        this.addEventListeners(); // Ajouter les écouteurs d'événements
        // this.logPlayerPosition(); // Ajoutez cette ligne pour démarrer le suivi de la position du joueur
        this.addEnemyInterval = null; // L'identifiant de l'intervalle pour ajouter des ennemis
        this.spawnFrequency = 200;
        this.coins = []; // Le tableau des pièces
        this.enemiesWithGeneratedCoins = [];
        this.enemiesWithGeneratedCoins = new Set();
        this.isPaused = false;
        this.pausedTime = 0;
        this.specialItems = []; // Les items spéciaux du joueur
    }

    // Méthode pour ajouter les écouteurs d'événements
    addEventListeners() {
        document.addEventListener('keydown', (event) => {
            this.keys[event.key] = true;

            // Si la touche Echap est enfoncée, basculer la pause
            if (event.key === 'Escape') {
                this.togglePause();
            }
        });

        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
        });

        // Ajouter un écouteur d'événements pour visibilitychange
        document.addEventListener('visibilitychange', () => {
            // Si l'onglet est devenu invisible, mettre le jeu en pause
            if (document.hidden && !this.isPaused) {
                this.togglePause();
            }
        });
    }

    // Méthode pour basculer la pause
    togglePause() {
        if (this.isPaused) {
            const shop = document.getElementById('shop');
            const pause = document.getElementById('pauseMenu');

            if (shop.style.display === 'block' && pause.style.display === 'block') {
                shop.style.display = 'none';
            } else if (shop.style.display === 'block' && pause.style.display === 'none') {
                shop.style.display = 'none';
                this.resumeGame();
            } else {
                pause.style.display = 'none';
                this.resumeGame();
            }
        } else {
            this.pauseGame();
            document.getElementById('pauseMenu').style.display = 'block';
        }
    }

    // Méthode pour démarrer la génération d'ennemis
    startEnemyGeneration(level) {
        // Arrêter l'ancien intervalle de génération d'ennemis
        if (this.addEnemyInterval !== null) {
            this.stopEnemyGeneration();
        }

        // Définir la fréquence de spawn des ennemis en fonction de l'avancement du jeu
        if (level % 5 == 0) {
            this.spawnFrequency = Math.floor(this.spawnFrequency * 0.9);
        }

        // Ajouter différents types d'ennemis en fonction des ennemis déjà présent (65% de chance de spawn un slime, 35% de chance de spawn un ghost)
        this.addEnemyInterval = setInterval(() => {
            if (this.enemies.length < 10) {
                let enemyType = Math.random() < 0.65 ? 'shooter' : 'ghost';
                this.addEnemy(enemyType);
            }
        }, this.spawnFrequency);
    }

    // Nouvelle méthode pour arrêter la génération d'ennemis
    stopEnemyGeneration() {
        clearInterval(this.addEnemyInterval);
        this.addEnemyInterval = null;
    }

    // Méthode pour afficher le magasin
    displayShop() {
        // Mettre le jeu en pause
        this.pauseGame();

        // Afficher le magasin
        document.getElementById('shop').style.display = 'block';

        // Créez trois options d'amélioration (via la méthode generateItems de la classe item.js)
        let items = Item.generateItems(this.player, this.enemies, this.canvas);

        // Obtenir le conteneur de la boutique
        let itemsContainer = document.getElementById('shopItems');

        // Supprimer les éléments de la boutique précédente
        itemsContainer.innerHTML = '';

        // Parcourir les items
        for (let i = 0; i < items.length; i++) {
            // Vérifier si l'item est défini
            if (items[i]) {
                // Créer un nouvel élément de liste
                let shopItem = document.createElement('li');
                shopItem.className = 'shopItem';

                // Créer les éléments de l'item
                let title = document.createElement('h2');
                let rarete = document.createElement('h3');
                // let image = document.createElement('img');
                let stats = document.createElement('p');
                let price = document.createElement('div');
                let error = document.createElement('p');

                // Mettre à jour les éléments de l'item
                title.textContent = items[i].nom;
                error.textContent = 'Pas assez d\'argent!';

                switch (items[i].rarete) {
                    case 1:
                        rarete.textContent = 'Commun';
                        shopItem.style.border = '1px green solid';
                        rarete.style.color = 'green';
                        break;
                    case 2:
                        rarete.textContent = 'Rare'
                        shopItem.style.border = '1px blue solid';
                        rarete.style.color = 'blue';
                        break;
                    case 3:
                        rarete.textContent = 'Épique';
                        shopItem.style.border = '1px purple solid';
                        rarete.style.color = 'purple';
                        break;
                    case 4:
                        rarete.textContent = 'Légendaire';
                        shopItem.style.border = '1px orange solid';
                        rarete.style.color = 'orange';
                        break;
                    case 'special':
                        rarete.textContent = 'Spécial';
                        shopItem.style.border = '1px red solid';
                        rarete.style.color = 'red';
                        break;
                }
                // image.src = items[i].image;

                if (items[i].rarete === 3 || items[i].rarete === 4) {
                    stats.innerHTML = Object.keys(items[i].stats)[0] + ': +' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '%' + '<br>' + Object.keys(items[i].stats)[1] + ': +' + items[i].stats[Object.keys(items[i].stats)[1]] / 10 + '%';
                } else if (items[i].rarete === 2 || items[i].rarete === 1) {
                    stats.innerHTML = Object.keys(items[i].stats)[0] + ': +' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '%';
                } else { // Si l'item est spécialstats.innerHTML = Object.keys(items[i].stats)[0] + ': +' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '%';
                    stats.innerHTML = items[i].type + ' : +' + items[i].damage;
                }

                price.innerHTML += items[i].prix + '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9.5 3C11.9853 3 14 7.02944 14 12M9.5 3C7.01472 3 5 7.02944 5 12C5 16.9706 7.01472 21 9.5 21M9.5 3H15C17.2091 3 19 7.02944 19 12M14 12C14 16.9706 11.9853 21 9.5 21M14 12H19M9.5 21H15C17.2091 21 19 16.9706 19 12M18.3264 17H13.2422M18.3264 7H13.2422M9.5 8C10.3284 8 11 9.79086 11 12C11 14.2091 10.3284 16 9.5 16C8.67157 16 8 14.2091 8 12C8 9.79086 8.67157 8 9.5 8Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';

                // Ajouter les éléments à l'élément de la liste
                shopItem.appendChild(title);
                shopItem.appendChild(rarete);
                // shopItem.appendChild(image);
                shopItem.appendChild(stats);
                shopItem.appendChild(price);

                // Ajouter l'élément de la liste à l'élément ul
                itemsContainer.appendChild(shopItem);

                shopItem.addEventListener('click', () => {
                    if (this.player.money >= items[i].prix) {
                        this.player.money -= items[i].prix;
                        this.player.addItem(items[i]);
                        console.log(this.player.items);

                        // Créer un nouvel élément div pour représenter l'item récupéré
                        let itemDiv = document.createElement('div');
                        itemDiv.style.width = '20px';
                        itemDiv.style.height = '20px';
                        itemDiv.style.backgroundColor = rarete.style.color;
                        itemDiv.style.position = 'absolute';
                        itemDiv.style.bottom = '0';
                        itemDiv.style.left = `${25 * this.player.items.length}px`; // Positionner les carrés côte à côte
                        itemDiv.style.border = '1px solid black';
                        itemDiv.style.margin = '5px';
                        if (items[i].rarete === 3 || items[i].rarete === 4) {
                            itemDiv.title = Object.keys(items[i].stats)[0] + ' +' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '% \u000d' + Object.keys(items[i].stats)[1] + '+' + items[i].stats[Object.keys(items[i].stats)[1]] / 10 + '%';
                        } else if (items[i].rarete === 2 || items[i].rarete === 1) {
                            itemDiv.title = Object.keys(items[i].stats)[0] + ' +' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '%';
                        } else { // Si l'item est spécial
                            itemDiv.title = items[i].nom;
                        }
                        // itemDiv.title = items[i].nom + ' (+' + items[i].stats[Object.keys(items[i].stats)[0]] / 10 + '%)';

                        // Ajouter le nouvel élément div au body du document
                        document.body.appendChild(itemDiv);

                        this.resumeGame();
                    } else {
                        shopItem.style.borderColor = 'red';
                        price.style.color = 'red';
                        price.style.fontWeight = 'bold';
                        // Mettre la piece en rouge
                        price.children[0].querySelector("#SVGRepo_iconCarrier > path").style.stroke = 'red';
                        // price.children[0].lastChild.getElementsByTagName('path').style.stroke = 'red';
                        shopItem.style.animation = 'horizontal-shaking 0.5s';
                        shopItem.insertBefore(error, title);
                        error.style.color = 'red';
                        error.style.margin = '0';
                    }
                });
            }
        }
    }

    // Méthode pour redémarrer le jeu ------ Non fonctionnelle pour le moment
    restartGame() {
        // // Réinitialiser les propriétés de l'instance de jeu
        // this.startTime = Date.now();
        // this.player = new Player(this.mapWidth / 2, this.mapHeight / 2, this); // Le joueur
        // this.enemies = []; // Le tableau des ennemis
        // this.keys = {}; // L'objet pour stocker l'état des touches enfoncées
        // this.addEnemyInterval = null; // L'identifiant de l'intervalle pour ajouter des ennemis
        // this.spawnFrequency = 250;
        // this.coins = []; // Le tableau des pièces
        // this.enemiesWithGeneratedCoins = new Set();
        // this.isPaused = false;
        // this.pausedTime = 0;

        // // Arrêter le tir du joueur
        // this.player.weapon.stopShooting();

        // // Arrêter l'ajout d'ennemis
        // clearInterval(this.addEnemyInterval);
        // this.addEnemyInterval = null;

        // // Cacher le menu de pause
        // document.getElementById('pauseMenu').style.display = 'none';

        // // Redémarrer le jeu
        // this.start();
    }

    // Méthode pour mettre en pause le jeu
    pauseGame() {

        // Mettre le jeu en pause
        this.isPaused = true;

        // Mettre en pause le timer
        this.pausedTime = Date.now() - this.startTime;

        // Arrêtez la génération d'ennemis
        this.stopEnemyGeneration();

        clearInterval(this.shopInterval);
        clearTimeout(this.shopTimeout);

        // Cacher le timer
        this.showTimer = false;

        // Arrêtez de tirer
        this.player.weapon.stopShooting();

        // Arrêtez de tirer les ennemis
        for (let enemy of this.enemies) {
            if (enemy instanceof Shooter) {
                enemy.stopShooting();
            }
        }
    }

    resumeGame() {
        const shop = document.getElementById('shop');
        const pause = document.getElementById('pauseMenu');
        if (shop.style.display === 'block') {
            shop.style.display = 'none';
        } else if (pause.style.display === 'block') {
            pause.style.display = 'none';
        }

        // Une fois que le joueur a fait son choix, reprenez le jeu
        this.isPaused = false;

        // Reprendre le temps de jeu à partir du moment où le jeu a été mis en pause
        this.startTime = Date.now() - this.pausedTime;

        // Reprendre la génération d'ennemis
        this.stopEnemyGeneration();
        this.startEnemyGeneration(this.player.level);

        // Afficher le timerText avec this.context.fillText
        this.showTimer = true;

        // Reprendre le tir
        this.player.weapon.stopShooting();
        this.player.weapon.startShooting();

        // Reprendre le tir des ennemis (unquement pour les ennemis de type Shooter)
        for (let enemy of this.enemies) {
            if (enemy instanceof Shooter) {
                enemy.stopShooting();
                enemy.startShooting();
            }
        }
    }

    // Méthode pour quitter le jeu
    quitGame() {
        // Cacher le menu de pause
        document.getElementById('pauseMenu').style.display = 'none';

        // Afficher le menu de démarrage
        document.getElementById('startMenu').style.display = 'block';

        // Cacher le jeu
        this.canvas.style.display = 'none';
    }

    // Méthode pour ajouter un nouvel ennemi
    addEnemy(enemyType) {
        let enemy;
        switch (enemyType) {
            case 'slime':
                enemy = new Slime(this.player, this.mapWidth, this.mapHeight);
                break;
            case 'ghost':
                enemy = new Ghost(this.player, this.mapWidth, this.mapHeight);
                break;
            case 'tank':
                enemy = new Tank(this.player, this.mapWidth, this.mapHeight);
                break;
            case 'shooter':
                enemy = new Shooter(this.player, this.mapWidth, this.mapHeight);
                enemy.startShooting();
                break;
            default:
                console.error(`Unknown enemy type: ${enemyType}`);
                return;
        }

        // Ajouter l'ennemi au tableau des ennemis
        this.enemies.push(enemy);
    }

    // Méthode pour lancer le jeu
    start() {
        // Appeler les méthodes de mise à jour et de dessin du jeu
        this.draw();
        this.update();

        this.startEnemyGeneration(this.player.level);
        console.log("STARTED");

        // Commencer à tirer le joueur
        this.player.weapon.startShooting();
    }

    // Méthode pour obtenir le temps écoulé depuis le début du jeu en format "00:00"
    getElapsedTime() {
        if (!this.isPaused) {
            const totalSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        } else {
            const totalSeconds = Math.floor(this.pausedTime / 1000);
            const minutes = Math.floor(totalSeconds / 60);
            const seconds = totalSeconds % 60;
            return minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0');
        }
    }

    // Méthode pour mettre à jour le jeu
    update() {
        if (!this.isPaused) {
            // Appeler la méthode de déplacement du joueur
            this.player.move(this.keys, this.mapWidth, this.mapHeight, this.enemies);


            // Mettre à jour la position de chaque projectile de l'ennemi
            for (let enemy of this.enemies) {
                for (let projectile of enemy.projectiles) {
                    projectile.move();

                    // Supprimer le projectile s'il est sorti des limites de la carte
                    if (projectile.x < 0 || projectile.y < 0 || projectile.x > this.mapWidth || projectile.y > this.mapHeight) {
                        enemy.projectiles.splice(enemy.projectiles.indexOf(projectile), 1);
                        continue;
                    }
                }
            }

            // Mettre à jour la position de chaque projectile
            for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
                const projectile = this.player.projectiles[i];

                // Vérifier si le projectile est défini
                if (projectile) {
                    // Déplacer le projectile
                    projectile.move();

                    // Supprimer le projectile s'il est sorti des limites de la carte
                    if (projectile.x < 0 || projectile.y < 0 || projectile.x > this.mapWidth || projectile.y > this.mapHeight) {
                        this.player.projectiles.splice(i, 1);
                        continue;
                    }
                }

                // Vérifier la collision avec chaque ennemi
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];

                    // Vérifier la collision avec chaque ennemi
                    for (let i = this.player.projectiles.length - 1; i >= 0; i--) {
                        const projectile = this.player.projectiles[i];

                        const dx = projectile.x - enemy.x - enemy.width / 2;
                        const dy = projectile.y - enemy.y - enemy.height / 2;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance < projectile.size + Math.hypot(enemy.width / 2, enemy.height / 2)) {
                            // Collision détectée, réduire la santé de l'ennemi
                            this.enemies[j].decreaseHealth(this.player.damage, projectile.direction, projectile.speed);

                            this.player.increaseExperience(enemy.xpGived);

                            // Si le projectile n'est pas un projectile de Sniper, le supprimer
                            if (!(projectile instanceof SniperProjectile)) {
                                this.player.projectiles.splice(i, 1);
                            }
                            break;
                        }
                    }
                }
            }

            // Mettez à jour chaque item spécial
            for (let i = 0; i < this.specialItems.length; i++) {
                this.specialItems[i].update();
                this.specialItems[i].drawCollisionBox(this.context);

                // Vérifiez les collisions avec chaque ennemi
                for (let j = 0; j < this.enemies.length; j++) {
                    if (this.specialItems[i].collidesWith(this.enemies[j])) {
                        // Vérifiez si la dernière collision a eu lieu il y a moins de 500 ms
                        let currentTime = new Date().getTime();
                        if (!this.enemies[j].lastCollisionTime || currentTime - this.enemies[j].lastCollisionTime > 500) {
                            this.enemies[j].decreaseHealth(this.specialItems[i].damage);
                            this.enemies[j].lastCollisionTime = currentTime; // Enregistrez le moment de la collision
                            if (this.enemies[j].isDead) {
                                this.enemies.splice(j, 1); // Supprimez l'ennemi s'il n'a plus de santé
                                j--; // Ajustez l'index pour compenser l'ennemi supprimé
                            }
                        }
                    }
                }
            }

            // Mettre à jour la position de chaque projectile de l'ennemi
            for (let enemy of this.enemies) {
                for (let projectile of enemy.projectiles) {
                    projectile.move();

                    // Supprimer le projectile s'il est sorti des limites de la carte
                    if (projectile.x < 0 || projectile.y < 0 || projectile.x > this.mapWidth || projectile.y > this.mapHeight) {
                        enemy.projectiles.splice(enemy.projectiles.indexOf(projectile), 1);
                        continue;
                    }
                }

                // Vérifier la collision avec le joueur
                for (let i = enemy.projectiles.length - 1; i >= 0; i--) {
                    const projectile = enemy.projectiles[i];

                    const dx = projectile.x - this.player.x - this.player.width / 2;
                    const dy = projectile.y - this.player.y - this.player.height / 2;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < projectile.size + Math.hypot(this.player.width / 2, this.player.height / 2)) {
                        // Collision détectée, réduire la santé du joueur
                        this.player.decreaseHealth(enemy.damage, projectile.direction, projectile.speed);

                        // Supprimer le projectile
                        enemy.projectiles.splice(i, 1);
                    }
                }
            }

            // Supprimer les ennemis morts dont tous les effets ont été traités
            this.enemies = this.enemies.filter(enemy => !(enemy.isDead && enemy.allEffectsProcessed()));

            // Mettre à jour la position et la santé de chaque ennemi
            for (let i = this.enemies.length - 1; i >= 0; i--) {
                const enemy = this.enemies[i];

                // Mettre à jour les particules de chaque ennemi
                for (let j = enemy.particles.length - 1; j >= 0; j--) {
                    const particle = enemy.particles[j];

                    // Décrémentez l'opacité de la particule indépendamment de l'opacité de l'ennemi
                    particle.opacity -= 1 / 60;

                    particle.update();

                    // Supprimer la particule si sa taille est inférieure ou égale à zéro
                    if (particle.size <= 0) {
                        enemy.particles.splice(j, 1);
                    }
                }

                // Si l'ennemi est mort, vérifier si tous les effets de coup associés à cet ennemi ont fini de s'afficher
                if (enemy.isDead && !enemy.coinGenerated) {
                    // Générer la pièce
                    const coin = enemy.generateCoin(this.mapHeight, this.mapWidth);
                    if (coin) {
                        this.coins.push(coin);
                        enemy.coinGenerated = true;
                    }

                    // Créer un effet de mort pour l'ennemi
                    enemy.createDeathEffect(enemy);
                    this.player.increaseExperience(enemy.xpGived);
                    i--;
                }

                // Si l'ennemi n'est pas en collision avec le joueur, mettre à jour sa position
                if (!enemy.isCollidingWithPlayer(this.player) && !enemy.isDead) {
                    enemy.move(this.player);
                }

                // Vérifier les collisions entre le joueur et les ennemis
                if (this.player.isCollidingWithEnemy(enemy)) {
                    // Gérer la collision entre le joueur et l'ennemi
                    enemy.handleCollisionWithPlayer(this.player);
                }
            }

            // Mettre à jour la position de chaque projectile
            for (let projectile of this.player.projectiles) {
                projectile.move();
            }

            // Appeler la méthode de vérification des collisions entre les ennemis
            this.checkEnemyCollisions();

        }

        // Demander une nouvelle animation
        requestAnimationFrame(() => this.update());
    }

    // Méthode pour dessiner le jeu
    draw() {
        // Effacer le canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Calculer la position de départ pour dessiner la carte centrée sur le joueur
        const mapStartX = this.canvas.width / 2 - this.player.x - this.player.width / 2;
        const mapStartY = this.canvas.height / 2 - this.player.y - this.player.height / 2;

        // Dessiner le décor (arrière-plan) centré sur le joueur
        this.context.fillStyle = 'lightblue'; // Couleur de la carte
        this.context.fillRect(mapStartX, mapStartY, this.mapWidth, this.mapHeight);

        // Dessiner toutes les pièces et vérifier la collision avec le joueur
        for (let i = 0; i < this.coins.length; i++) {
            if (this.player.isCollidingWithCoin(this.coins[i])) {
                // Supprimer la pièce si le joueur est en collision avec elle
                this.player.increaseMoney(this.coins[i].value);
                this.coins.splice(i, 1);
                i--; // Ajuster l'index après la suppression
            } else {
                this.coins[i].attractToPlayer(this.player, this.isPaused);
                this.coins[i].draw(this.context, mapStartX, mapStartY);
            }
        }

        // Dessiner tous les projectiles
        for (let projectile of this.player.projectiles) {
            projectile.draw(this.context, mapStartX, mapStartY, 'player');
        }

        // Dessiner tous les projectiles des ennemis
        for (let enemy of this.enemies) {
            for (let projectile of enemy.projectiles) {
                projectile.draw(this.context, mapStartX, mapStartY, 'enemy');
            }
        }

        // Dessiner le joueur au milieu de l'écran
        this.player.draw(this.context, this.canvas.width / 2 - this.player.width / 2, this.canvas.height / 2 - this.player.height / 2, mapStartX, mapStartY);

        // Dessiner tous les ennemis
        for (let enemy of this.enemies) {
            enemy.draw(this.context, mapStartX, mapStartY);
            enemy.drawHealthBar(this.context, mapStartX, mapStartY);
        }

        // Dessinez les items spéciaux
        for (let specialItem of this.specialItems) {
            specialItem.draw(this.context, mapStartX, mapStartY);
        }

        // Dessiner l'ATH
        this.player.drawHealthBar(this.context);
        this.player.drawExperienceBar(this.context);
        this.player.drawMoney(this.context);

        // Supprimer les effets de hit qui ont expiré
        this.player.hitEffects = this.player.hitEffects.filter(hitEffect => hitEffect.duration > 0);

        // Timer
        this.context.fillStyle = 'black';
        this.context.font = '30px Arial';
        const timerText = this.getElapsedTime();
        const textWidth = this.context.measureText(timerText).width;
        this.context.fillText(timerText, (this.canvas.width - textWidth) / 2, this.canvas.height - 10);

        // Demander une nouvelle animation
        requestAnimationFrame(() => this.draw());
    }

    // Trouver l'ennemi le plus proche
    getClosestEnemy() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        for (let enemy of this.enemies) {
            if (enemy.isDead) {
                enemy.width = 0;
                enemy.height = 0;
                continue;
            }

            const dx = this.player.x - enemy.x;
            const dy = this.player.y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        }

        return closestEnemy;
    }

    // Méthode pour vérifier les collisions entre les ennemis
    checkEnemyCollisions() {
        for (let i = 0; i < this.enemies.length; i++) {
            for (let j = i + 1; j < this.enemies.length; j++) {
                const dx = this.enemies[i].x - this.enemies[j].x;
                const dy = this.enemies[i].y - this.enemies[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.enemies[i].width / 2 + this.enemies[j].width / 2) {
                    // Les ennemis se chevauchent, les déplacer hors de collision
                    const overlap = this.enemies[i].width / 2 + this.enemies[j].width / 2 - distance;
                    const angle = Math.atan2(dy, dx);
                    const sin = Math.sin(angle);
                    const cos = Math.cos(angle);

                    this.enemies[i].x += overlap * cos / 2;
                    this.enemies[i].y += overlap * sin / 2;
                    this.enemies[j].x -= overlap * cos / 2;
                    this.enemies[j].y -= overlap * sin / 2;

                    // Vérifier si les ennemis sont à l'intérieur de la zone de jeu
                    this.enemies[i].x = Math.max(0, Math.min(this.mapWidth - this.enemies[i].width, this.enemies[i].x));
                    this.enemies[i].y = Math.max(0, Math.min(this.mapHeight - this.enemies[i].height, this.enemies[i].y));
                    this.enemies[j].x = Math.max(0, Math.min(this.mapWidth - this.enemies[j].width, this.enemies[j].x));
                    this.enemies[j].y = Math.max(0, Math.min(this.mapHeight - this.enemies[j].height, this.enemies[j].y));
                }
            }
        }
    }
}