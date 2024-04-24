async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const currentURL = window.location.origin;
    const apiUrl = currentURL + '/api/login';
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Connexion réussie');
            console.log('Utilisateur connecté:', data);
            window.location.href = 'index.html';
        } else {
            displayError(data.error || 'Échec de la connexion');
        }

    } catch (error) {
        displayError('Échec de la connexion: ' + error.message);
    }
}

function displayError(errorMessage) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = errorMessage;
    errorSection.classList.remove('hidden');
}