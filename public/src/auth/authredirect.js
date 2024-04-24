const checkAuthAndRedirect = async () => {
    try {
        const currentURL = window.location.origin;
        const apiUrl = currentURL + '/api/user';

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        if (!response.ok) {
            window.location.href = 'login.html';
            return;
        }

        const data = await response.json();

        currentUser = data;

        return data;
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification de l\'utilisateur :', error);
        throw error;
    }
};

checkAuthAndRedirect()