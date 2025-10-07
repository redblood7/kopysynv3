document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is initialized
    if (typeof firebase === 'undefined') {
        console.error("Firebase is not loaded. Make sure the SDKs are included and firebase-config.js is correct.");
        const authContainer = document.querySelector('.auth-container');
        if(authContainer) {
            showError(authContainer, "Could not connect to authentication service. Please try again later.");
        }
        return;
    }

    const auth = firebase.auth();
    const database = firebase.database();

    const loginForm = document.querySelector('.auth-form[action="#"]');
    const signupForm = document.querySelector('.auth-form[action="signup.html"]');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const email = loginForm.querySelector('input[name="email"]').value;
            const password = loginForm.querySelector('input[name="password"]').value;

            auth.signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed in
                    console.log('User logged in:', userCredential.user);
                    window.location.href = 'login-success.html';
                })
                .catch((error) => {
                    console.error("Login Error:", error);
                    const form = loginForm;
                    const generalErrorContainer = form.querySelector('.form-group:last-of-type');
                    showError(generalErrorContainer, error.message);
                });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateSignupForm()) {
                return;
            }
            clearErrors();

            const username = signupForm.querySelector('input[name="username"]').value;
            const email = signupForm.querySelector('input[name="email"]').value;
            const password = signupForm.querySelector('input[name="password"]').value;

            auth.createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    // Signed up
                    const user = userCredential.user;
                    console.log('User created:', user);

                    // Now, save the username to the Realtime Database
                    return database.ref('users/' + user.uid).set({
                        username: username,
                        email: email
                    });
                })
                .then(() => {
                    console.log('User data saved to database.');
                    // Redirect to the success page after successful signup
                    window.location.href = 'signup-success.html';
                })
                .catch((error) => {
                    console.error("Signup Error:", error);
                    const form = signupForm;
                    // Display a general error message at the bottom of the form
                    const generalErrorContainer = form.querySelector('.form-group:last-of-type');
                    showError(generalErrorContainer, error.message);
                });
        });
    }
});

function validateSignupForm() {
    let isValid = true;
    clearErrors(); // Clear previous errors at the start

    const username = document.querySelector('input[name="username"]');
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');
    const confirmPassword = document.querySelector('input[name="confirm-password"]');

    if (username && username.value.trim() === '') {
        showError(username, 'Username cannot be empty.');
        isValid = false;
    }

    if (email && !isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
    }

    if (password && password.value.length < 6) { // Firebase default is 6
        showError(password, 'Password must be at least 6 characters long.');
        isValid = false;
    }

    if (confirmPassword && password.value !== confirmPassword.value) {
        showError(confirmPassword, 'Passwords do not match.');
        isValid = false;
    }

    return isValid;
}


function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showError(inputElement, message) {
    // If the element is an input, find its parent. Otherwise, it's the container itself.
    const container = inputElement.matches('input') ? inputElement.parentElement : inputElement;
    
    // Check if an error message already exists to avoid duplicates
    if (container.querySelector('.error-message')) {
        return;
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    container.appendChild(errorElement);

    if (inputElement.matches('input')) {
        inputElement.classList.add('error-input');
    }
}


function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());

    const errorInputs = document.querySelectorAll('.error-input');
    errorInputs.forEach(el => el.classList.remove('error-input'));
}
