/**
 * Configuration API - Connexion frontend avec le backend Express
 */
const API_BASE = window.location.origin.includes('localhost')
    ? 'http://localhost:3000/api'
    : '/api';

function getToken() {
    return localStorage.getItem('token');
}

async function apiFetch(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.error || `Erreur ${res.status}`);
    }
    return data;
}

const api = {
    // Auth
    register: (fullname, email, password) =>
        apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ fullname, email, password }) }),
    login: (email, password) =>
        apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    me: () => apiFetch('/auth/me'),

    // Produits
    getProduits: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return apiFetch(`/produits${qs ? '?' + qs : ''}`);
    },
    getProduit: (id) => apiFetch(`/produits/${id}`),

    // Catégories
    getCategories: () => apiFetch('/categories'),

    // Livraison
    getLivraisons: () => apiFetch('/livraison'),

    // Commandes
    createCommande: (items, livraison_id) =>
        apiFetch('/commandes', { method: 'POST', body: JSON.stringify({ items, livraison_id }) }),
    getMyCommandes: () => apiFetch('/commandes/me')
};
