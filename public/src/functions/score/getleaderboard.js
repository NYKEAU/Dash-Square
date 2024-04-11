const fetchLeaderboard = async () => {
    try {
        const currentURL = window.location.origin;
        const apiUrl = currentURL + '/api/leaderboard';

        const response = await fetch(apiUrl, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération du leaderboard');
        }

        const data = await response.json();
        return data.leaderboard;
    } catch (error) {
        console.error('Erreur lors de la récupération du leaderboard :', error);
        throw error;
    }
};

export { fetchLeaderboard };