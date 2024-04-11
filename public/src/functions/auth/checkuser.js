let currentUser;

const getUserInfo = async () => {
    try {
        const currentURL = window.location.origin;
        const apiUrl = currentURL + '/api/user';

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations de l\'utilisateur');
        }

        const data = await response.json();
        currentUser = data;

        return data;
    } catch (error) {
        console.error('Erreur lors de la récupération des informations de l\'utilisateur :', error);
        throw error;
    }
};

export { getUserInfo };