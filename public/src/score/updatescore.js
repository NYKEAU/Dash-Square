
async function updateScore() {
    const currentURL = window.location.origin;
    const apiUrl = currentURL + '/api/update-score';

    try {
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok) {
            alert('Score mis à jour avec succès');
            console.log('Nouveau score:', data);
        } else {
            displayError(data.error || 'Échec de la mise à jour du score');
        }

    } catch (error) {
        displayError('Échec de la mise à jour du score: ' + error.message);
    }
}

function displayError(errorMessage) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = errorMessage;
}
