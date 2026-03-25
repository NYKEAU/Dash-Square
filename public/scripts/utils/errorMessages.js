export const ErrorMessages = {
    // Erreurs d'authentification
    AUTH_INVALID_CREDENTIALS: "Email ou mot de passe incorrect",
    AUTH_USER_NOT_FOUND: "Utilisateur non trouvé",
    AUTH_EMAIL_IN_USE: "Cette adresse email est déjà utilisée",
    AUTH_WEAK_PASSWORD: "Le mot de passe doit contenir au moins 6 caractères",
    AUTH_INVALID_EMAIL: "Adresse email invalide",
    AUTH_PSEUDO_TAKEN: "Ce pseudo est déjà pris",
    
    // Erreurs de connexion
    NETWORK_ERROR: "Problème de connexion, veuillez réessayer",
    SERVER_ERROR: "Une erreur est survenue, veuillez réessayer plus tard",
    
    // Erreurs de score
    SCORE_UPDATE_FAILED: "Impossible de mettre à jour le score",
    
    // Message par défaut
    DEFAULT: "Une erreur est survenue"
};

export function getReadableError(error) {
    // Log l'erreur complète dans la console pour le debugging
    console.error('Erreur détaillée:', error);

    // Firebase Auth errors
    if (error.code) {
        switch (error.code) {
            case 'auth/wrong-password':
            case 'auth/user-not-found':
                return ErrorMessages.AUTH_INVALID_CREDENTIALS;
            case 'auth/email-already-in-use':
                return ErrorMessages.AUTH_EMAIL_IN_USE;
            case 'auth/weak-password':
                return ErrorMessages.AUTH_WEAK_PASSWORD;
            case 'auth/invalid-email':
                return ErrorMessages.AUTH_INVALID_EMAIL;
        }
    }

    // Erreurs réseau
    if (error.message?.includes('Failed to fetch')) {
        return ErrorMessages.NETWORK_ERROR;
    }

    // Erreurs serveur personnalisées
    try {
        const parsedError = JSON.parse(error.message);
        if (parsedError.error === 'Le pseudo est déjà pris') {
            return ErrorMessages.AUTH_PSEUDO_TAKEN;
        }
        // Retourner le message d'erreur personnalisé s'il existe
        return parsedError.error || ErrorMessages.DEFAULT;
    } catch {
        // Si ce n'est pas du JSON, retourner le message par défaut
        return ErrorMessages.DEFAULT;
    }
} 