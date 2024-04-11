async function logout() {
    const currentURL = window.location.origin;
    const apiUrl = currentURL + '/api/logout';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        if (response.ok) {
            alert('Déonnexion réussie');
            console.log('Utilisateur déconnecté:');
            window.location.href = 'login.html';
        } else {
            alert('Échec de la déconnexion');
            console.error('Erreur lors de la déconnexion:');
        }

    } catch (error) {
        console.error('Erreur lors de la déconnexion utilisateur', error);
        alert('Échec de la déconnexion: ' + error.message);
    }
}