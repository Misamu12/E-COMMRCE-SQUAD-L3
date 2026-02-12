// Page Admin - réservée aux utilisateurs avec rôle admin
document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isAuthenticated()) {
    window.location.href = 'login.html';
    return;
  }

  const user = auth.getCurrentUser();
  if (user?.role !== 'admin') {
    alert('Accès refusé. Réservé aux administrateurs.');
    window.location.href = 'dashboard.html';
    return;
  }

  document.getElementById('adminUserName').textContent = user.fullname;
  document.getElementById('adminUserEmail').textContent = user.email;

  initTabs();
  await loadStats();
  initModals();
  document.getElementById('btnAddProduit')?.addEventListener('click', () => openProduitModal());
  document.getElementById('btnAddCategory')?.addEventListener('click', () => openCategoryModal());
});

function initModals() {
  document.querySelectorAll('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const modalId = btn.dataset.close;
      document.getElementById(modalId)?.classList.remove('show');
    });
  });
  document.querySelectorAll('.admin-modal').forEach((modal) => {
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('show'); });
  });
  document.getElementById('formProduit')?.addEventListener('submit', handleProduitSubmit);
  document.getElementById('formCategory')?.addEventListener('submit', handleCategorySubmit);
}

function initTabs() {
  document.querySelectorAll('.nav-item[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll('.nav-item[data-tab]').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const content = document.getElementById(tab);
      if (content) content.classList.add('active');
      if (tab === 'users') loadUsers();
      if (tab === 'orders') loadOrders();
      if (tab === 'produits') loadProduits();
      if (tab === 'categories') loadCategories();
    });
  });
}

async function loadStats() {
  try {
    const data = await api.admin.getStats();
    document.getElementById('statUsers').textContent = data.users;
    document.getElementById('statProduits').textContent = data.produits;
    document.getElementById('statCommandes').textContent = data.commandes;
    const list = document.getElementById('adminRecentOrders');
    list.innerHTML = (data.recentOrders || []).map(o => `
      <div class="order-card">
        <span>#${o.id} - ${o.user || '-'} - ${o.total}$</span>
        <span class="badge">${o.status}</span>
      </div>
    `).join('') || '<p>Aucune commande</p>';
  } catch (e) {
    console.error(e);
    document.getElementById('adminStats').innerHTML = '<p>Erreur de chargement</p>';
  }
}

async function loadUsers() {
  try {
    const users = await api.admin.getUsers();
    const tbody = document.querySelector('#usersTable tbody');
    tbody.innerHTML = users.map(u => `
      <tr><td>${u.id}</td><td>${u.fullname}</td><td>${u.email}</td><td>${u.role}</td><td>${u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}</td></tr>
    `).join('');
  } catch (e) {
    document.querySelector('#usersTable tbody').innerHTML = '<tr><td colspan="5">Erreur</td></tr>';
  }
}

async function loadOrders() {
  try {
    const orders = await api.admin.getOrders();
    const tbody = document.querySelector('#ordersTable tbody');
    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>#${o.id}</td>
        <td>${o.user?.fullname || '-'}<br><small>${o.user?.email || ''}</small></td>
        <td>${o.total}$</td>
        <td><select class="status-select" data-id="${o.id}"><option value="pending" ${o.status === 'pending' ? 'selected' : ''}>En attente</option><option value="processing" ${o.status === 'processing' ? 'selected' : ''}>En cours</option><option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>Livrée</option><option value="cancelled" ${o.status === 'cancelled' ? 'selected' : ''}>Annulée</option></select></td>
        <td>${o.created_at ? new Date(o.created_at).toLocaleDateString() : '-'}</td>
        <td></td>
      </tr>
    `).join('');
    tbody.querySelectorAll('.status-select').forEach((sel) => {
      sel.addEventListener('change', async () => {
        try {
          await api.admin.updateOrderStatus(sel.dataset.id, sel.value);
          loadOrders();
        } catch (err) { alert(err.message); }
      });
    });
  } catch (e) {
    document.querySelector('#ordersTable tbody').innerHTML = '<tr><td colspan="6">Erreur</td></tr>';
  }
}

async function loadProduits() {
  try {
    const produits = await api.getProduits();
    const categories = await api.getCategories();
    const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));
    const tbody = document.querySelector('#produitsTable tbody');
    tbody.innerHTML = produits.map(p => `
      <tr>
        <td>${p.id}</td>
        <td>${p.name}</td>
        <td>${p.price}$</td>
        <td>${p.category || catMap[p.category_id] || '-'}</td>
        <td>${p.type || '-'}</td>
        <td>${p.alcohol_percent ? p.alcohol_percent + '%' : '-'}</td>
        <td><button class="btn-secondary btn-sm" onclick="editProduit(${p.id})">Modifier</button> <button class="btn-danger btn-sm" onclick="deleteProduit(${p.id}, '${(p.name || '').replace(/'/g, "\\'")}')">Suppr.</button></td>
      </tr>
    `).join('');
  } catch (e) {
    document.querySelector('#produitsTable tbody').innerHTML = '<tr><td colspan="7">Erreur</td></tr>';
  }
}

async function loadCategories() {
  try {
    const categories = await api.getCategories();
    const tbody = document.querySelector('#categoriesTable tbody');
    tbody.innerHTML = categories.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.name}</td>
        <td><button class="btn-secondary btn-sm" onclick="editCategory(${c.id})">Modifier</button> <button class="btn-danger btn-sm" onclick="deleteCategory(${c.id}, '${(c.name || '').replace(/'/g, "\\'")}')">Supprimer</button></td>
      </tr>
    `).join('');
  } catch (e) {
    document.querySelector('#categoriesTable tbody').innerHTML = '<tr><td colspan="3">Erreur</td></tr>';
  }
}

async function openProduitModal(editId = null) {
  const modal = document.getElementById('modalProduit');
  const form = document.getElementById('formProduit');
  const title = document.getElementById('modalProduitTitle');
  form.reset();
  document.getElementById('produitId').value = editId || '';

  const categories = await api.getCategories();
  const select = document.getElementById('produitCategory');
  select.innerHTML = '<option value="">— Aucune —</option>' + categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');

  if (editId) {
    title.textContent = 'Modifier le produit';
    const p = await api.getProduit(editId);
    document.getElementById('produitName').value = p.name || '';
    document.getElementById('produitPrice').value = p.price || '';
    document.getElementById('produitCategory').value = p.category_id || '';
    document.getElementById('produitDescription').value = p.description || '';
    document.getElementById('produitType').value = p.type || '';
    document.getElementById('produitRegion').value = p.region || '';
    document.getElementById('produitAlcohol').value = p.alcohol_percent ?? '';
    document.getElementById('produitRating').value = p.rating ?? '';
    document.getElementById('produitImage').value = p.image || '';
  } else {
    title.textContent = 'Ajouter un produit';
  }
  modal.classList.add('show');
}

async function openCategoryModal(editId = null) {
  const modal = document.getElementById('modalCategory');
  const form = document.getElementById('formCategory');
  const title = document.getElementById('modalCategoryTitle');
  form.reset();
  document.getElementById('categoryId').value = editId || '';
  if (editId) {
    const cats = await api.getCategories();
    const c = cats.find(x => x.id === editId);
    title.textContent = 'Modifier la catégorie';
    document.getElementById('categoryName').value = c?.name || '';
  } else {
    title.textContent = 'Ajouter une catégorie';
  }
  modal.classList.add('show');
}

async function handleProduitSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('produitId').value;
  const data = {
    name: document.getElementById('produitName').value.trim(),
    price: parseFloat(document.getElementById('produitPrice').value),
    description: document.getElementById('produitDescription').value.trim() || null,
    category_id: document.getElementById('produitCategory').value ? parseInt(document.getElementById('produitCategory').value, 10) : null,
    type: document.getElementById('produitType').value || null,
    region: document.getElementById('produitRegion').value || null,
    image: document.getElementById('produitImage').value.trim() || null
  };
  const alc = document.getElementById('produitAlcohol').value;
  const rat = document.getElementById('produitRating').value;
  if (alc && !isNaN(parseFloat(alc))) data.alcohol_percent = parseFloat(alc);
  if (rat && !isNaN(parseFloat(rat))) data.rating = parseFloat(rat);
  try {
    if (id) {
      await api.admin.updateProduit(id, data);
      document.getElementById('modalProduit').classList.remove('show');
      loadProduits();
    } else {
      await api.admin.createProduit(data);
      document.getElementById('modalProduit').classList.remove('show');
      loadProduits();
    }
  } catch (err) { alert(err.message); }
}

async function handleCategorySubmit(e) {
  e.preventDefault();
  const id = document.getElementById('categoryId').value;
  const name = document.getElementById('categoryName').value.trim();
  try {
    if (id) {
      await api.admin.updateCategory(id, { name });
      document.getElementById('modalCategory').classList.remove('show');
      loadCategories();
    } else {
      await api.admin.createCategory({ name });
      document.getElementById('modalCategory').classList.remove('show');
      loadCategories();
    }
  } catch (err) { alert(err.message); }
}

function editProduit(id) {
  openProduitModal(id);
}

function editCategory(id) {
  openCategoryModal(id);
}

async function deleteProduit(id, name) {
  if (!confirm(`Supprimer le produit "${name}" ?`)) return;
  api.admin.deleteProduit(id).then(() => { loadProduits(); }).catch((e) => alert(e.message));
}

async function deleteCategory(id, name) {
  if (!confirm(`Supprimer la catégorie "${name}" ?`)) return;
  api.admin.deleteCategory(id).then(() => { loadCategories(); }).catch((e) => alert(e.message));
}
