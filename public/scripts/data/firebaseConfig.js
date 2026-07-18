import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

let auth = null;

// Initialiser Firebase de manière asynchrone
async function initializeFirebase() {
    try {
        const response = await fetch('/api/firebase-config');
        const config = await response.json();
        const app = initializeApp(config);
        auth = getAuth(app);

        // Observer les changements d'état d'authentification
        onAuthStateChanged(auth, (user) => {
            if (user) {
                user.getIdToken(true).then((token) => {
                    localStorage.setItem('firebaseToken', token);
                    window.dispatchEvent(new CustomEvent('authStateChanged', { 
                        detail: { isLoggedIn: true, user } 
                    }));
                }).catch((err) => {
                    console.error('Échec du rafraîchissement du token:', err);
                    const fallbackToken = localStorage.getItem('firebaseToken');
                    if (!fallbackToken) {
                        localStorage.removeItem('firebaseToken');
                        localStorage.removeItem('token');
                        window.dispatchEvent(new CustomEvent('authStateChanged', { 
                            detail: { isLoggedIn: false } 
                        }));
                    }
                });
            } else {
                localStorage.removeItem('firebaseToken');
                localStorage.removeItem('token');
                window.dispatchEvent(new CustomEvent('authStateChanged', { 
                    detail: { isLoggedIn: false } 
                }));
            }
        });
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Firebase:', error);
    }
}

// Initialiser immédiatement
initializeFirebase();

export { auth }; 