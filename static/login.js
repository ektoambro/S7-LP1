// login.js
document.getElementById('LoginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const form = document.getElementById('LoginForm');
    const formData = new FormData(form);
    
    try {
        const response = await fetch('/api/login_user', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        if (data.status === 'success') {
            window.location.href = data.redirect; // Redirection vers page de succès
        } else {
            alert(data.message || 'Échec de la connexion');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue.');
    }
});