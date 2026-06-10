import { gameInstance } from './scripts/game/GameInstance.js';
import { createJoystick } from './scripts/game/joystick.js';

const canvas = document.getElementById('gameCanvas');
const startMenu = document.getElementById('startMenu');
const leaderboardMenu = document.getElementById('leaderboardMenu');
const sandboxMenu = document.getElementById('sandboxMenu');

let alreadyCreatedJoystick = false;

const sandboxLevelBtn = document.getElementById('sandboxLevelBtn');
const levelPickerOverlay = document.getElementById('levelPickerOverlay');
const levelGrid = document.getElementById('levelGrid');
const sandboxHealthSlider = document.getElementById('sandboxHealth');
const sandboxHealthValue = document.getElementById('sandboxHealthValue');
const sandboxMaxHealth = document.getElementById('sandboxMaxHealth');
const sandboxDamage = document.getElementById('sandboxDamage');
const sandboxMaxExp = document.getElementById('sandboxMaxExp');
const sandboxMoney = document.getElementById('sandboxMoney');
const sandboxBonusBtn = document.getElementById('sandboxBonusBtn');
const sandboxBonusSummary = document.getElementById('sandboxBonusSummary');
const bonusPickerOverlay = document.getElementById('bonusPickerOverlay');
const bonusGrid = document.getElementById('bonusGrid');

let selectedLevel = 50;

const bonusTypes = [
    { key: 'VieMax', label: 'Vie Max', unit: '%' },
    { key: 'Vie', label: 'Vie (soin)', unit: '%' },
    { key: 'Dégâts', label: 'Dégâts', unit: '%' },
    { key: 'Cadence', label: 'Cadence', unit: '%' },
    { key: 'Vitesse', label: 'Vitesse', unit: '%' },
    { key: 'Défense', label: 'Défense', unit: '%' },
    { key: 'Exp', label: 'Expérience', unit: '%' },
    { key: 'Argent', label: 'Argent', unit: '%' },
];

let selectedBonuses = {};
bonusTypes.forEach(b => selectedBonuses[b.key] = 0);

for (let i = 5; i <= 500; i += 5) {
    const btn = document.createElement('button');
    btn.className = 'level-btn';
    if (i % 10 === 0) btn.classList.add('boss-level');
    btn.textContent = i;
    btn.dataset.level = i;
    if (i === selectedLevel) btn.classList.add('selected');
    btn.addEventListener('click', function () {
        selectedLevel = parseInt(this.dataset.level);
        sandboxLevelBtn.textContent = selectedLevel;
        levelGrid.querySelectorAll('.level-btn.selected').forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        levelPickerOverlay.style.display = 'none';
        updateSandboxDisplay();
    });
    levelGrid.appendChild(btn);
}

bonusTypes.forEach(bonus => {
    const item = document.createElement('div');
    item.className = 'bonus-item';
    item.innerHTML = `
        <label>${bonus.label} (${bonus.unit})</label>
        <input type="number" data-key="${bonus.key}" value="0" min="0" max="10000" step="10" />
    `;
    const input = item.querySelector('input');
    input.addEventListener('change', function() {
        selectedBonuses[bonus.key] = parseInt(this.value) || 0;
        updateBonusSummary();
        updateSandboxDisplay();
    });
    bonusGrid.appendChild(item);
});

function updateBonusSummary() {
    const activeBonuses = bonusTypes.filter(b => selectedBonuses[b.key] > 0);
    if (activeBonuses.length === 0) {
        sandboxBonusSummary.textContent = 'Aucun bonus';
    } else {
        sandboxBonusSummary.innerHTML = activeBonuses
            .map(b => `<span>${b.label}: +${selectedBonuses[b.key]}%</span>`)
            .join(' | ');
    }
}

updateBonusSummary();

function updateSandboxDisplay() {
    const stats = gameInstance.computeStatsAtLevel(selectedLevel);
    const maxHP = Math.round(stats.maxHealth);
    sandboxMaxHealth.textContent = maxHP;
    sandboxHealthSlider.max = maxHP;
    sandboxHealthSlider.value = maxHP;
    sandboxHealthValue.textContent = maxHP;
    
    // Calculer les dégâts avec le bonus
    let bonusDamage = stats.damage;
    if (selectedBonuses.Dégâts > 0) {
        bonusDamage = bonusDamage + (bonusDamage * selectedBonuses.Dégâts) / 100;
    }
    sandboxDamage.textContent = Math.round(bonusDamage);
    
    // Calculer l'exp max avec le bonus
    let bonusExp = stats.maxExperience;
    if (selectedBonuses.Exp > 0) {
        bonusExp = bonusExp + (bonusExp * selectedBonuses.Exp) / 100;
    }
    sandboxMaxExp.textContent = Math.round(bonusExp);
    
    // Calculer l'argent avec le bonus
    let bonusMoney = selectedLevel * 20;
    if (selectedBonuses.Argent > 0) {
        bonusMoney = bonusMoney + (bonusMoney * selectedBonuses.Argent) / 100;
    }
    sandboxMoney.textContent = Math.round(bonusMoney);
}

updateSandboxDisplay();

sandboxLevelBtn.addEventListener('click', function () {
    levelPickerOverlay.style.display = 'flex';
});

document.getElementById('levelPickerClose').addEventListener('click', function () {
    levelPickerOverlay.style.display = 'none';
});

levelPickerOverlay.addEventListener('click', function (e) {
    if (e.target === levelPickerOverlay) {
        levelPickerOverlay.style.display = 'none';
    }
});

sandboxBonusBtn.addEventListener('click', function () {
    bonusPickerOverlay.style.display = 'flex';
});

document.getElementById('bonusPickerClose').addEventListener('click', function () {
    bonusPickerOverlay.style.display = 'none';
});

bonusPickerOverlay.addEventListener('click', function (e) {
    if (e.target === bonusPickerOverlay) {
        bonusPickerOverlay.style.display = 'none';
    }
});

sandboxHealthSlider.addEventListener('input', function () {
    sandboxHealthValue.textContent = this.value;
});

document.getElementById('sandboxButton').addEventListener('click', function () {
    startMenu.style.display = 'none';
    leaderboardMenu.style.display = 'none';
    sandboxMenu.style.display = 'flex';
});

document.getElementById('sandboxBack').addEventListener('click', function () {
    sandboxMenu.style.display = 'none';
    startMenu.style.display = 'flex';
    leaderboardMenu.style.display = 'flex';
});

function launchGame(sandboxConfig) {
    startMenu.style.display = 'none';
    leaderboardMenu.style.display = 'none';
    sandboxMenu.style.display = 'none';

    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const game = new gameInstance(canvas);

    if (sandboxConfig) {
        game.setupSandbox(sandboxConfig);
    }

    // Synchroniser le toggle constantStats avec la préférence sauvegardée
    const constantStatsToggle = document.getElementById('constantStats');
    const savedShowStats = localStorage.getItem('showStatsInGame');
    if (savedShowStats !== null && constantStatsToggle) {
        constantStatsToggle.checked = savedShowStats === 'true';
    }

    // Afficher le menu de stats si le toggle est activé
    if (constantStatsToggle && constantStatsToggle.checked) {
        document.getElementById('statsMenu').style.display = 'block';
    }

    const parent = document.getElementById('wrapper');

    if (document.getElementById('mobileMode').checked) {
        game.fps = 60;
        parent.style.display = 'block';
        document.getElementById('statsSwitch').style.display = 'none';
        document.getElementById('pauseBtn').style.display = 'block';
        if (alreadyCreatedJoystick === false) {
            createJoystick(parent);
            alreadyCreatedJoystick = true;
        }
    } else {
        game.fps = 120;
        parent.style.display = 'none';
        document.getElementById('statsSwitch').style.display = 'block';
        document.getElementById('pauseBtn').style.display = 'none';
    }

    document.getElementById('shopClose').addEventListener('click', () => game.resumeGame());
    document.getElementById('resumeButton').addEventListener('click', () => game.resumeGame());
    document.getElementById('restartButton').addEventListener('click', () => game.quitGame());
    document.getElementById('quitButton').addEventListener('click', () => game.quitGame());

    game.start();
}

document.getElementById('startButton').addEventListener('click', function () {
    launchGame(null);
});

document.getElementById('sandboxStart').addEventListener('click', function () {
    const health = parseInt(sandboxHealthSlider.value);
    const godMode = document.getElementById('sandboxGodMode').checked;

    launchGame({ level: selectedLevel, health, godMode, bonuses: { ...selectedBonuses } });
});
