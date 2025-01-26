// Gestion du menu des paramètres
document.addEventListener("DOMContentLoaded", () => {
  const settingsButton = document.getElementById("settings-button");
  const settingsMenu = document.getElementById("settings-menu");
  const closeSettingsButton = document.getElementById("close-settings");
  const pauseMenu = document.getElementById("pauseMenu");
  const gameCanvas = document.getElementById("gameCanvas");
  const usernameInput = document.getElementById("new-username");
  const changeUsernameForm = document.getElementById("change-username-form");
  const usernameSection = document.querySelector(".settings-section");

  // Fonction pour gérer la visibilité du bouton des paramètres
  const updateSettingsButtonVisibility = () => {
    // Si le jeu est en cours (canvas visible) et pas en pause
    if (
      gameCanvas.style.display === "block" &&
      pauseMenu.style.display === "none"
    ) {
      settingsButton.style.display = "none";
    } else {
      settingsButton.style.display = "block";
    }

    // Désactiver le changement de pseudo si le jeu est en cours
    if (gameCanvas.style.display === "block") {
      usernameInput.disabled = true;
      changeUsernameForm.querySelector("button").disabled = true;
      usernameSection.style.opacity = "0.5";
    } else {
      usernameInput.disabled = false;
      changeUsernameForm.querySelector("button").disabled = false;
      usernameSection.style.opacity = "1";
    }
  };

  // Observer les changements de style du canvas et du menu pause
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "style") {
        updateSettingsButtonVisibility();
      }
    });
  });

  // Observer les deux éléments
  observer.observe(gameCanvas, { attributes: true });
  observer.observe(pauseMenu, { attributes: true });

  // Appel initial pour définir l'état correct
  updateSettingsButtonVisibility();

  // Ouvrir le menu des paramètres
  settingsButton.addEventListener("click", () => {
    settingsMenu.style.display = "block";
  });

  // Fermer le menu des paramètres
  closeSettingsButton.addEventListener("click", () => {
    settingsMenu.style.display = "none";
  });
});
