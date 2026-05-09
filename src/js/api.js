/**
 * Configuration API - Connexion frontend avec le backend Express
 */
const API_BASE = 'http://localhost:3000/api'


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
    getMyCommandes: () => apiFetch('/commandes/me'),

    // Admin (nécessite token + rôle admin)
    admin: {
        getStats: () => apiFetch('/admin/stats'),
        getUsers: () => apiFetch('/admin/users'),
        getOrders: () => apiFetch('/admin/orders'),
        updateOrderStatus: (id, status) => apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
        createProduit: (data) => apiFetch('/admin/produits', { method: 'POST', body: JSON.stringify(data) }),
        updateProduit: (id, data) => apiFetch(`/admin/produits/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteProduit: (id) => apiFetch(`/admin/produits/${id}`, { method: 'DELETE' }),
        createCategory: (data) => apiFetch('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
        updateCategory: (id, data) => apiFetch(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
        deleteCategory: (id) => apiFetch(`/admin/categories/${id}`, { method: 'DELETE' })
    }
};
