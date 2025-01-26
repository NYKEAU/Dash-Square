import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { auth as firebaseAuth } from "./firebaseConfig.js";
import { getReadableError } from "../utils/errorMessages.js";

export const auth = {
  register: (pseudo, email, password) =>
    fetch("/api/register", {
      method: "POST",
      body: JSON.stringify({ pseudo, email, password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
      return res.json();
    }),
  login: (identifier, password) =>
    fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ identifier, password }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Détails de l'erreur:", errorData);
          throw new Error(JSON.stringify(errorData));
        }
        const data = await res.json();
        // Stocker le token
        localStorage.setItem("firebaseToken", data.token);
        return data;
      })
      .catch((error) => {
        console.error("Erreur complète:", error);
        throw new Error(getReadableError(error));
      }),
  loginWithGoogle: async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;

      // Envoyer le token au backend
      const response = await fetch("/api/loginWithGoogle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: await user.getIdToken(),
          email: user.email,
          // On suggère un pseudo basé sur l'email pour les nouveaux comptes
          suggestedUsername: user.email.split("@")[0],
          displayName: user.displayName,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la connexion avec Google");
      }

      const data = await response.json();
      localStorage.setItem("firebaseToken", data.token);
      return data;
    } catch (error) {
      console.error("Erreur Google Auth:", error);
      throw error;
    }
  },
  forgotPassword: (email) =>
    fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      if (!res.ok) {
        return res.text().then((text) => {
          throw new Error(text);
        });
      }
      return res.json();
    }),
  logout: async () => {
    try {
      // Déconnexion de Firebase Auth
      await signOut(firebaseAuth);

      // Déconnexion du backend
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }

      // Nettoyer le stockage local
      localStorage.removeItem("firebaseToken");
      localStorage.removeItem("token");

      return response.json();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
  },
  getUser: async () => {
    try {
      const token = localStorage.getItem("firebaseToken");
      if (!token) return null;

      const response = await fetch("/api/user", {
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        // Token invalide ou expiré
        localStorage.removeItem("firebaseToken");
        return null;
      }

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données utilisateur:",
        error
      );
      return null;
    }
  },
  updateUsername: async (newUsername) => {
    try {
      const token = localStorage.getItem("firebaseToken");
      if (!token) {
        throw new Error("Non authentifié");
      }

      const response = await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pseudo: newUsername }),
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error.error || "Erreur lors de la mise à jour du pseudo"
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du pseudo:", error);
      throw error;
    }
  },
  handleUsernameChange: async (event, statusElement) => {
    event.preventDefault();
    const newUsername = document.getElementById("new-username").value;

    try {
      statusElement.textContent = "Modification en cours...";
      statusElement.className = "status-message";

      await auth.updateUsername(newUsername);

      statusElement.textContent = "Pseudo mis à jour avec succès !";
      statusElement.className = "status-message success";

      // Recharger la page pour mettre à jour l'interface
      window.location.reload();
    } catch (error) {
      statusElement.textContent = error.message;
      statusElement.className = "status-message error";
    }
  },
};

export const user = {
  auth,
};
