// register.js - Handle registration form submission

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission
            
            // Get form data
            const formData = new FormData(registerForm);
            const formDataObject = {};
            
            // Convert FormData to object
            for (let [key, value] of formData.entries()) {
                formDataObject[key] = value;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('registerBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="btn-text">Creating Account...</span>';
            submitBtn.disabled = true;
            
            try {
                // Send data to server - UPDATE THIS URL to match Task 4.1
                const response = await fetch('/api/register_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formDataObject)
                });
                
                const data = await response.json();
                
                if (response.ok && data.status === 'success') {
                    // Show success message
                    alert('Registration successful! Redirecting to login...');
                    
                    // Redirect to login page
                    window.location.href = '/login';
                } else {
                    // Show error message
                    alert('Registration failed: ' + (data.message || 'Unknown error'));
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again.');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Optional: Add password strength indicator
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updatePasswordStrengthIndicator(strength);
        });
    }
});

// Optional helper functions for password strength
function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    
    return strength;
}

function updatePasswordStrengthIndicator(strength) {
    // You can implement this to show password strength visually
    console.log('Password strength:', strength);
}