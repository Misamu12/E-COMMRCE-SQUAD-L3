// Authentification via API
class Auth {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.token = localStorage.getItem('token') || null;
        this.init();
    }

    async init() {
        if (this.token && !this.currentUser) {
            try {
                const { user } = await api.me();
                this.currentUser = user;
                localStorage.setItem('currentUser', JSON.stringify(user));
            } catch {
                this.token = null;
                localStorage.removeItem('token');
            }
        }
        this.updateNavigation();
        this.checkAuthRedirect();
    }

    async register(fullname, email, password) {
        const data = await api.register(fullname, email, password);
        localStorage.setItem('token', data.token);
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        this.updateNavigation();
        return data.user;
    }

    async login(email, password) {
        const data = await api.login(email, password);
        localStorage.setItem('token', data.token);
        this.token = data.token;
        this.currentUser = data.user;
        localStorage.setItem('currentUser', JSON.stringify(data.user));
        this.updateNavigation();
        return data.user;
    }

    logout() {
        this.currentUser = null;
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return this.currentUser !== null && this.token !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateNavigation() {
        const navActions = document.querySelector('.nav-actions');
        if (!navActions) return;
        const accountBtn = navActions.querySelector('a[href="dashboard.html"]');
        if (!accountBtn) return;
        if (this.isAuthenticated()) {
            accountBtn.href = 'dashboard.html';
            accountBtn.setAttribute('aria-label', 'Mon compte');
        } else {
            accountBtn.href = 'login.html';
            accountBtn.setAttribute('aria-label', 'Se connecter');
        }
    }

    checkAuthRedirect() {
        const protectedPages = ['dashboard.html', 'checkout.html'];
        const currentPage = window.location.pathname.split('/').pop();
        if (protectedPages.includes(currentPage) && !this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }

    showError(message, containerId = 'errorMessage') {
        const errorDiv = document.getElementById(containerId);
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            const successDiv = document.getElementById('successMessage');
            if (successDiv) successDiv.style.display = 'none';
            setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
        }
    }

    showSuccess(message, containerId = 'successMessage') {
        const successDiv = document.getElementById(containerId);
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
            const errorDiv = document.getElementById('errorMessage');
            if (errorDiv) errorDiv.style.display = 'none';
            setTimeout(() => { successDiv.style.display = 'none'; }, 3000);
        }
    }
}

const auth = new Auth();

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fullname = document.getElementById('fullname')?.value?.trim();
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value;
        const confirmPassword = document.getElementById('confirmPassword')?.value;

        try {
            if (!fullname || !email || !password || !confirmPassword) throw new Error('Tous les champs sont obligatoires');
            if (password !== confirmPassword) throw new Error('Les mots de passe ne correspondent pas');
            if (password.length < 6) throw new Error('Le mot de passe doit contenir au moins 6 caractères');

            await auth.register(fullname, email, password);
            auth.showSuccess('Compte créé avec succès ! Redirection en cours...');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } catch (error) {
            auth.showError(error.message || 'Erreur lors de l\'inscription');
        }
    });
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email')?.value?.trim();
        const password = document.getElementById('password')?.value;

        try {
            if (!email || !password) throw new Error('Veuillez saisir votre email et mot de passe');
            await auth.login(email, password);
            auth.showSuccess('Connexion réussie ! Redirection en cours...');
            setTimeout(() => { window.location.href = 'dashboard.html'; }, 1500);
        } catch (error) {
            auth.showError(error.message || 'Erreur lors de la connexion');
        }
    });
}

const logoutBtn = document.querySelector('.logout');
if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        auth.logout();
    });
}

function updateDashboardUserInfo() {
    const user = auth.getCurrentUser();
    if (!user) return;
    const userName = document.getElementById('userName');
    if (userName) userName.textContent = user.fullname;
    const userEmail = document.querySelector('.user-email');
    if (userEmail) userEmail.textContent = user.email;
    const welcomeMsg = document.querySelector('.section-title .gold');
    if (welcomeMsg) welcomeMsg.textContent = user.fullname;
}

if (window.location.pathname.includes('dashboard.html')) {
    updateDashboardUserInfo();
}
