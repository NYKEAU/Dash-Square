async function register() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const pseudo = document.getElementById('pseudo').value;

    if (password.length < 4) {
        displayError('Le mot de passe doit avoir au moins 4 caractères.');
        return;
    }

    if (password !== confirmPassword) {
        displayError('Les mots de passe ne correspondent pas.');
        return;
    }

    const currentURL = window.location.origin;
    const apiUrl = currentURL + '/api/register';

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, pseudo }),
        });

        const data = await response.json();

        if (response.ok) {
            alert('Inscription réussie. Vous pouvez maintenant vous connecter.');
            window.location.href = 'index.html';
        } else {
            displayError(data.error || 'Échec de l\'inscription');
        }
    } catch (error) {
        displayError('Échec de l\'inscription: ' + error.message);
    }
}

function displayError(errorMessage) {
    const errorSection = document.getElementById('errorSection');
    errorSection.textContent = errorMessage;
    errorSection.classList.remove('hidden');
}