(function () {
    const USERS_KEY = 'gh_admin_users_v1';
    const SESSION_KEY = 'gh_admin_session_v1';
    const ADMIN_SETUP_CODE = 'GH-ADMIN-2026';

    function getUsers() {
        try {
            const raw = localStorage.getItem(USERS_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.error('Unable to read admin users from localStorage:', error);
            return [];
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function setMessage(errorElement, successElement, type, text) {
        if (errorElement) {
            errorElement.textContent = type === 'error' ? text : '';
        }
        if (successElement) {
            successElement.textContent = type === 'success' ? text : '';
        }
    }

    function isValidEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function normalizeEmail(value) {
        return String(value || '').trim().toLowerCase();
    }

    function handleSignUp() {
        const form = document.getElementById('signUpForm');
        if (!form) {
            return;
        }

        const errorElement = document.getElementById('signUpError');
        const successElement = document.getElementById('signUpSuccess');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const name = String(document.getElementById('signupName').value || '').trim();
            const email = normalizeEmail(document.getElementById('signupEmail').value);
            const password = String(document.getElementById('signupPassword').value || '');
            const confirmPassword = String(document.getElementById('signupConfirmPassword').value || '');
            const setupCode = String(document.getElementById('signupCode').value || '').trim();

            if (!name) {
                setMessage(errorElement, successElement, 'error', 'Please enter your full name.');
                return;
            }

            if (!isValidEmail(email)) {
                setMessage(errorElement, successElement, 'error', 'Please enter a valid email address.');
                return;
            }

            if (password.length < 8) {
                setMessage(errorElement, successElement, 'error', 'Password must be at least 8 characters long.');
                return;
            }

            if (password !== confirmPassword) {
                setMessage(errorElement, successElement, 'error', 'Passwords do not match.');
                return;
            }

            if (setupCode !== ADMIN_SETUP_CODE) {
                setMessage(errorElement, successElement, 'error', 'Invalid admin setup code.');
                return;
            }

            const users = getUsers();
            const alreadyExists = users.some(function (user) {
                return normalizeEmail(user.email) === email;
            });

            if (alreadyExists) {
                setMessage(errorElement, successElement, 'error', 'An admin account with this email already exists.');
                return;
            }

            users.push({
                id: String(Date.now()),
                name: name,
                email: email,
                password: password,
                role: 'admin',
                createdAt: new Date().toISOString()
            });

            saveUsers(users);
            setMessage(errorElement, successElement, 'success', 'Account created. Redirecting to sign in...');

            setTimeout(function () {
                window.location.href = 'signin.html';
            }, 900);
        });
    }

    function handleSignIn() {
        const form = document.getElementById('signInForm');
        if (!form) {
            return;
        }

        const errorElement = document.getElementById('signInError');
        const successElement = document.getElementById('signInSuccess');

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = normalizeEmail(document.getElementById('signinEmail').value);
            const password = String(document.getElementById('signinPassword').value || '');

            if (!isValidEmail(email)) {
                setMessage(errorElement, successElement, 'error', 'Please enter a valid email address.');
                return;
            }

            if (!password) {
                setMessage(errorElement, successElement, 'error', 'Please enter your password.');
                return;
            }

            const users = getUsers();
            const foundUser = users.find(function (user) {
                return normalizeEmail(user.email) === email && String(user.password || '') === password;
            });

            if (!foundUser) {
                setMessage(errorElement, successElement, 'error', 'Invalid email or password.');
                return;
            }

            localStorage.setItem(SESSION_KEY, JSON.stringify({
                id: foundUser.id,
                name: foundUser.name,
                email: foundUser.email,
                role: foundUser.role,
                signedInAt: new Date().toISOString()
            }));

            setMessage(errorElement, successElement, 'success', 'Sign in successful. Redirecting...');

            setTimeout(function () {
                window.location.href = '../Dashboard/dashboard.html';
            }, 650);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        handleSignUp();
        handleSignIn();
    });
})();
