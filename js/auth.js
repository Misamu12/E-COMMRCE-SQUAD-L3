// Authentication system using localStorage
class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.init();
    }

    init() {
        this.updateNavigation();
        this.checkAuthRedirect();
    }

    // Register a new user
    register(fullname, email, password) {
        // Check if user already exists
        if (this.users.find(user => user.email === email)) {
            throw new Error('Un compte avec cet email existe déjà');
        }

        // Create new user
        const newUser = {
            id: Date.now(),
            fullname,
            email,
            password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Auto login after registration
        this.login(email, password);

        return newUser;
    }

    // Login user
    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);

        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.updateNavigation();

        return user;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Update navigation based on auth state
    updateNavigation() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;

        // Find the account button
        const accountBtn = navActions.querySelector('a[href="dashboard.html"]');
        if (!accountBtn) return;

        if (this.isAuthenticated()) {
            // User is logged in - show dashboard link
            accountBtn.href = 'dashboard.html';
            accountBtn.setAttribute('aria-label', 'Mon compte');
        } else {
            // User is not logged in - show login link
            accountBtn.href = 'login.html';
            accountBtn.setAttribute('aria-label', 'Se connecter');
        }
    }

    // Check if user needs to be redirected (for protected pages)
    checkAuthRedirect() {
        const protectedPages = ['dashboard.html'];
        const currentPage = window.location.pathname.split('/').pop();

        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    // Show error message
    showError(message, containerId = 'errorMessage') {
        const errorDiv = document.getElementById(containerId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';

            // Hide success message if visible
            const successDiv = document.getElementById('successMessage');
            if (successDiv) successDiv.style.display = 'none';

            // Auto hide after 5 seconds
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }
    }

    // Show success message
    showSuccess(message, containerId = 'successMessage') {
        const successDiv = document.getElementById(containerId);
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';

            // Hide error message if visible
            const errorDiv = document.getElementById('errorMessage');
            if (errorDiv) errorDiv.style.display = 'none';

            // Auto hide after 3 seconds
            setTimeout(() => {
                successDiv.style.display = 'none';
            }, 3000);
        }
    }
}

// Initialize auth system
const auth = new Auth();

// Handle registration form
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        try {
            // Validate form
            if (!fullname || !email || !password || !confirmPassword) {
                throw new Error('Tous les champs sont obligatoires');
            }

            if (password !== confirmPassword) {
                throw new Error('Les mots de passe ne correspondent pas');
            }

            if (password.length < 6) {
                throw new Error('Le mot de passe doit contenir au moins 6 caractères');
            }

            // Register user
            const user = auth.register(fullname, email, password);
            auth.showSuccess('Compte créé avec succès ! Redirection en cours...');

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            auth.showError(error.message);
        }
    });
}

// Handle login form
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        try {
            // Validate form
            if (!email || !password) {
                throw new Error('Veuillez saisir votre email et mot de passe');
            }

            // Login user
            const user = auth.login(email, password);
            auth.showSuccess('Connexion réussie ! Redirection en cours...');

            // Redirect to dashboard after short delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);

        } catch (error) {
            auth.showError(error.message);
        }
    });
}

// Handle logout
const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
}

// Update dashboard with user info
function updateDashboardUserInfo() {
    const user = auth.getCurrentUser();
    if (!user) return;

    const userName = document.getElementById('userName');
    if (userName) {
        userName.textContent = user.fullname;
    }

    const userEmail = document.querySelector('.user-email');
    if (userEmail) {
        userEmail.textContent = user.email;
    }

    // Update welcome message
    const welcomeMsg = document.querySelector('.section-title .gold');
    if (welcomeMsg) {
        welcomeMsg.textContent = user.fullname;
    }
}

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    updateDashboardUserInfo();
}
