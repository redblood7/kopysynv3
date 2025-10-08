document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
            }
        });
    });

    // User State Handling (Firebase or LocalStorage/SessionStorage)
    const userStateContainer = document.getElementById('user-state');

    function updateUserState() {
        const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

        if (userStateContainer) {
            if (loggedInUser) {
                // User is signed in via local storage
                userStateContainer.innerHTML = `
                    <li class="user-greeting"><span>Welcome, ${loggedInUser.username}</span></li>
                    <li><a href="#" id="logout-btn" class="profile-icon" aria-label="Logout"><i class="fas fa-user-circle"></i></a></li>
                `;
                const logoutBtn = document.getElementById('logout-btn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        sessionStorage.removeItem('loggedInUser'); // Clear local session
                        window.location.href = 'login.html';
                    });
                }
            } else if (typeof firebase !== 'undefined' && firebase.auth) {
                // Fallback to Firebase if available and no local user is logged in
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        // User is signed in via Firebase
                        const dbRef = firebase.database().ref();
                        dbRef.child('users').child(user.uid).get().then((snapshot) => {
                            let username = 'User'; // Default username
                            if (snapshot.exists()) {
                                username = snapshot.val().username;
                            }
                            userStateContainer.innerHTML = `
                                <li class="user-greeting"><span>Welcome, ${username}</span></li>
                                <li><a href="#" id="logout-btn" class="profile-icon" aria-label="Logout"><i class="fas fa-user-circle"></i></a></li>
                            `;
                            const logoutBtn = document.getElementById('logout-btn');
                            if (logoutBtn) {
                                logoutBtn.addEventListener('click', (e) => {
                                    e.preventDefault();
                                    firebase.auth().signOut().then(() => {
                                        window.location.href = 'login.html';
                                    }).catch((error) => {
                                        console.error('Logout Error:', error);
                                    });
                                });
                            }
                        }).catch((error) => {
                            console.error(error);
                            userStateContainer.innerHTML = '<li><a href="login.html" class="profile-icon" aria-label="Login"><i class="fas fa-user-circle"></i></a></li>';
                        });
                    } else {
                        // User is signed out (Firebase)
                        userStateContainer.innerHTML = '<li><a href="login.html" class="profile-icon" aria-label="Login"><i class="fas fa-user-circle"></i></a></li>';
                    }
                });
            } else {
                // No user logged in (neither local nor Firebase)
                userStateContainer.innerHTML = '<li><a href="login.html" class="profile-icon" aria-label="Login"><i class="fas fa-user-circle"></i></a></li>';
            }
        }
    }

    updateUserState(); // Call on page load

    function updateWalletBalanceHeader() {
        const walletBalanceElement = document.getElementById('wallet-balance-header');
        if (walletBalanceElement) {
            let currentBalance = localStorage.getItem('walletBalance') || 0;
            walletBalanceElement.textContent = `₹${parseFloat(currentBalance).toFixed(2)}`;
        }
    }
    // Cart Functionality
    const cartContainer = document.getElementById('cart-container');

    function getCart() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    }

    function saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function clearCart() {
        localStorage.removeItem('cart');
    }

    function updateCartCount() {
        const cart = getCart();
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = cart.length;
            if (cart.length > 0) {
                cartCountElement.classList.add('visible');
            } else {
                cartCountElement.classList.remove('visible');
            }
        }
    }

    function handleResponsiveWallet() {
        const walletIcon = document.querySelector('.wallet-icon');
        const walletBalanceHeader = document.getElementById('wallet-balance-header');

        if (window.innerWidth <= 768) {
            walletBalanceHeader.style.display = 'none';
        } else {
            walletBalanceHeader.style.display = 'inline';
        }

        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                walletBalanceHeader.style.display = 'none';
            } else {
                walletBalanceHeader.style.display = 'inline';
            }
        });
    }

    function addToCart(course) {
        let cart = getCart();
        if (!cart.find(item => item.id === course.id)) {
            cart.push(course);
            saveCart(cart);
            updateCartCount();
        } else {
            alert(`${course.name} is already in your cart.`);
        }
    }

    function removeFromCart(courseId) {
        let cart = getCart();
        cart = cart.filter(item => item.id !== courseId);
        saveCart(cart);
        displayCart();
        updateCartCount();
    }

    function displayCart() {
        if (!cartContainer) return;
        let cart = getCart();
        cartContainer.innerHTML = '';
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p id="cart-empty-message">Your cart is currently empty.</p>';
        } else {
            let total = 0;
            const cartItemsContainer = document.createElement('div');
            cart.forEach(item => {
                total += item.price;
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${item.description}</p>
                    </div>
                    <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                    <div class="cart-item-remove">
                        <button data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            cartContainer.appendChild(cartItemsContainer);
            const cartTotal = document.createElement('div');
            cartTotal.classList.add('cart-total');
            cartTotal.innerHTML = `
                <p>Total: <span>₹${total.toFixed(2)}</span></p>
                <a href="payment.html" class="btn btn-primary">Checkout</a>
            `;
            cartContainer.appendChild(cartTotal); // This line was missing
            cartContainer.querySelectorAll('.cart-item-remove button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const courseId = e.currentTarget.getAttribute('data-id');
                    removeFromCart(courseId);
                });
            });
        }
    }

    const buyButtons = document.querySelectorAll('.add-to-cart');
    buyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const card = e.target.closest('.course-card');
            const course = {
                id: e.target.dataset.courseId,
                name: e.target.dataset.courseName,
                description: card.querySelector('p').textContent,
                price: parseFloat(e.target.dataset.coursePrice),
                image: card.querySelector('.course-image').src
            };
            addToCart(course);
        });
    });

    if (window.location.pathname.endsWith('cart.html')) {
        displayCart();
    }

    // Clear cart on successful payment
    if (window.location.pathname.endsWith('payment-successful.html')) {
        clearCart();
        updateCartCount();
    }

    // Payment Page Logic
    const paymentTabs = document.querySelectorAll('.payment-method-tab');
    const paymentContents = document.querySelectorAll('.payment-method-content');
    const upiButtons = document.querySelectorAll('.upi-payment-button');
    const qrCodeDisplay = document.getElementById('qr-code-display');
    const qrTimerContainer = document.getElementById('qr-timer-container');
    const upiConfirmationButton = document.getElementById('upi-confirmation-button');
    let qrCodeTimer;

    if (paymentTabs.length > 0) {
        paymentTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const method = tab.getAttribute('data-method');
                paymentTabs.forEach(t => t.classList.remove('active'));
                paymentContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(`${method}-payment`).classList.add('active');
            });
        });
    }

    function startQrCodeTimer() {
        if (qrCodeTimer) {
            clearInterval(qrCodeTimer);
        }

        let timeLeft = 180; // 3 minutes in seconds
        
        function updateTimerDisplay() {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            qrTimerContainer.textContent = `QR code expires in ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

        updateTimerDisplay();

        qrCodeTimer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();

            if (timeLeft === 80) { // 1 minute 20 seconds
                sessionStorage.removeItem('walletAddAmount');
                window.location.href = 'payment-successful.html';
            }

            if (timeLeft <= 0) {
                clearInterval(qrCodeTimer);
                qrTimerContainer.textContent = 'QR Code Expired';
                qrCodeDisplay.innerHTML = '';
                if (upiConfirmationButton) {
                    upiConfirmationButton.style.display = 'none';
                }
            }
        }, 1000);
    }

    if (upiButtons.length > 0 && qrCodeDisplay) {
        let currentQRCode = null;
        upiButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove selection from other buttons
                upiButtons.forEach(btn => btn.classList.remove('selected'));
                // Select the clicked button
                button.classList.add('selected');

                const upiId = button.getAttribute('data-upi-id');
                qrCodeDisplay.innerHTML = ''; // Clear previous QR code

                if (currentQRCode) {
                    currentQRCode.clear();
                }

                currentQRCode = new QRCode(qrCodeDisplay, {
                    text: upiId,
                    width: 200,
                    height: 200,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });
                
                if (upiConfirmationButton) {
                    upiConfirmationButton.style.display = 'block';
                }

                startQrCodeTimer();
            });
        });
    }

    // Wallet Page
    if (window.location.pathname.endsWith('wallet.html')) {
        const addMoneyBtn = document.getElementById('add-money-btn');
        const amountInput = document.getElementById('amount-to-add');
        const balanceAmount = document.getElementById('wallet-balance-amount');
        const errorMessage = document.getElementById('wallet-error-message');

        let currentBalance = localStorage.getItem('walletBalance') || 0;
        balanceAmount.textContent = `₹${parseFloat(currentBalance).toFixed(2)}`;
        updateWalletBalanceHeader();

        if (addMoneyBtn && amountInput && errorMessage) {
            addMoneyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const amount = amountInput.value.trim();
                const parsedAmount = parseFloat(amount);

                if (amount === '' || isNaN(parsedAmount) || parsedAmount <= 0) {
                    errorMessage.textContent = 'Please enter a valid amount greater than zero.';
                    errorMessage.style.display = 'block';
                } else {
                    errorMessage.style.display = 'none';
                    sessionStorage.setItem('walletAddAmount', parsedAmount.toString());
                    window.location.href = 'payment.html';
                }
            });

            amountInput.addEventListener('input', () => {
                if (errorMessage.style.display === 'block') {
                    errorMessage.style.display = 'none';
                }
            });
        }
    }

    // Update payment page for wallet funding
    if (window.location.pathname.endsWith('payment.html')) {
        const amount = sessionStorage.getItem('walletAddAmount');
        if (amount) {
            const cartTotal = document.querySelector('.cart-total');
            if(cartTotal) {
              cartTotal.innerHTML = `<p>Amount to Add: <span>₹${parseFloat(amount).toFixed(2)}</span></p>`;
            }
            const pageTitle = document.querySelector('.section-title');
            if (pageTitle) {
                pageTitle.textContent = 'Add Money to Wallet';
            }
            const cartItemsContainer = document.querySelector('.cart-container');
            if(cartItemsContainer) {
              const cartItems = cartItemsContainer.querySelector('.cart-item');
              if(cartItems) {
                cartItems.style.display = 'none';
              }
            }
        }
    }

    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const email = loginForm.querySelector('#loginEmail').value;
            const password = loginForm.querySelector('#loginPassword').value;

            // --- Local Storage Login Logic ---
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
            const user = storedUsers.find(u => u.email === email && u.password === password);

            if (user) {
                console.log('User logged in locally:', user.email);
                // Store logged-in user in sessionStorage (clears on browser close)
                sessionStorage.setItem('loggedInUser', JSON.stringify({ email: user.email, username: user.username }));
                window.location.href = 'login-success.html';
            } else {
                console.error("Login Error: Invalid credentials");
                showError(loginForm, "Invalid email or password.");
            }
            // --- End Local Storage Login Logic ---
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (!validateSignupForm()) {
                return;
            }
            clearErrors();

            const username = signupForm.querySelector('#signupName').value;
            const email = signupForm.querySelector('#signupEmail').value;
            const password = signupForm.querySelector('#signupPassword').value;

            // --- Local Storage Signup Logic ---
            const storedUsers = JSON.parse(localStorage.getItem('users')) || [];

            if (storedUsers.some(u => u.email === email)) {
                console.error("Signup Error: Email already exists");
                showError(signupForm, "An account with this email already exists.");
                return;
            }

            storedUsers.push({ username, email, password });
            localStorage.setItem('users', JSON.stringify(storedUsers));
            console.log('User signed up locally:', email);
            window.location.href = 'signup-success.html';
            // --- End Local Storage Signup Logic ---
        });
    }
    
    updateCartCount();
    updateWalletBalanceHeader();
    handleResponsiveWallet();
});

function validateSignupForm() {
    let isValid = true;
    clearErrors(); // Clear previous errors at the start

    const username = document.getElementById('signupName');
    const email = document.getElementById('signupEmail');
    const password = document.getElementById('signupPassword');
    const confirmPassword = document.getElementById('confirmPassword');

    if (username && username.value.trim() === '') {
        showError(username.parentElement, 'Username cannot be empty.');
        isValid = false;
    }

    if (email && !isValidEmail(email.value)) {
        showError(email.parentElement, 'Please enter a valid email address.');
        isValid = false;
    }

    if (password && password.value.length < 6) { // Firebase default is 6
        showError(password.parentElement, 'Password must be at least 6 characters long.');
        isValid = false;
    }

    if (confirmPassword && password.value !== confirmPassword.value) {
        showError(confirmPassword.parentElement, 'Passwords do not match.');
        isValid = false;
    }

    return isValid;
}


function isValidEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showError(inputOrForm, message) {
    const container = inputOrForm.matches('form') ? inputOrForm : inputOrForm.parentElement;
    
    // Check if an error message already exists to avoid duplicates
    if (container.querySelector('.error-message')) {
        return;
    }

    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.style.color = '#ff6464';
    errorElement.style.marginTop = '1rem';
    errorElement.textContent = message;
    container.appendChild(errorElement);

    if (inputOrForm.matches('input')) {
        inputOrForm.classList.add('error-input');
    }
}


function clearErrors() {
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(el => el.remove());

    const errorInputs = document.querySelectorAll('.error-input');
    errorInputs.forEach(el => el.classList.remove('error-input'));
}
