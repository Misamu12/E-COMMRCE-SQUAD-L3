// Catalogue - charge les produits depuis l'API
let allProducts = [];
let filteredProducts = [];
let currentFilters = { type: [], price: null, region: [] };

document.addEventListener('DOMContentLoaded', async () => {
  try {
    allProducts = await api.getProduits();
    filteredProducts = [...allProducts];
    renderProducts(filteredProducts);
    initializeFilters();
    updateResultsCount();
  } catch (err) {
    console.error('Erreur chargement produits:', err);
    document.getElementById('products-grid').innerHTML =
      '<p class="error-msg">Impossible de charger les produits. Vérifiez que l\'API est démarrée (npm run dev dans /api).</p>';
  }
});

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;
  grid.innerHTML = '';

  products.forEach((product, index) => {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.style.animationDelay = `${index * 0.1}s`;
    card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || ''}</p>
                <div class="product-details">
                    <span class="product-category">${product.category || 'Non spécifié'}</span>
                    <span class="product-alcohol">${product.alcohol_percent ? product.alcohol_percent + '%' : 'N/A'}</span>
                </div>
                <div class="product-rating">
                    ${'★'.repeat(Math.floor(product.rating || 4))}${'☆'.repeat(5 - Math.floor(product.rating || 4))}
                    <span>${product.rating || 4}</span>
                </div>
                <div class="product-footer">
                    <span class="product-price">${product.price}€</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    grid.appendChild(card);
  });
}

function initializeFilters() {
  document.querySelectorAll('input[data-filter="type"]').forEach((input) => {
    input.addEventListener('change', function () {
      if (this.checked) currentFilters.type.push(this.value);
      else currentFilters.type = currentFilters.type.filter((t) => t !== this.value);
      applyFilters();
    });
  });

  document.querySelectorAll('input[data-filter="price"]').forEach((input) => {
    input.addEventListener('change', function () {
      currentFilters.price = this.value;
      applyFilters();
    });
  });

  document.querySelectorAll('input[data-filter="region"]').forEach((input) => {
    input.addEventListener('change', function () {
      if (this.checked) currentFilters.region.push(this.value);
      else currentFilters.region = currentFilters.region.filter((r) => r !== this.value);
      applyFilters();
    });
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.addEventListener('change', function () { sortProducts(this.value); });

  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) resetBtn.addEventListener('click', resetFilters);
}

function applyFilters() {
  filteredProducts = allProducts.filter((product) => {
    if (currentFilters.type.length > 0 && !currentFilters.type.includes(product.type)) return false;
    if (currentFilters.price) {
      if (currentFilters.price === '500+') {
        if (product.price < 500) return false;
      } else {
        const [minPrice, maxPrice] = currentFilters.price.split('-').map((p) => parseInt(p, 10));
        if (product.price < minPrice || product.price > maxPrice) return false;
      }
    }
    if (currentFilters.region.length > 0 && !currentFilters.region.includes(product.region)) return false;
    return true;
  });
  renderProducts(filteredProducts);
  updateResultsCount();
}

function sortProducts(sortBy) {
  switch (sortBy) {
    case 'price-asc': filteredProducts.sort((a, b) => a.price - b.price); break;
    case 'price-desc': filteredProducts.sort((a, b) => b.price - a.price); break;
    case 'name': filteredProducts.sort((a, b) => a.name.localeCompare(b.name)); break;
    case 'rating': filteredProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0)); break;
    default: filteredProducts = [...allProducts];
  }
  renderProducts(filteredProducts);
}

function resetFilters() {
  currentFilters = { type: [], price: null, region: [] };
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => { input.checked = false; });
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'featured';
  filteredProducts = [...allProducts];
  renderProducts(filteredProducts);
  updateResultsCount();
}

function updateResultsCount() {
  const el = document.getElementById('results-count');
  if (el) el.textContent = filteredProducts.length;
}

function toggleWishlist(productId) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const idx = wishlist.findIndex((w) => w.id === productId);
  if (idx >= 0) wishlist.splice(idx, 1);
  else wishlist.push({ id: productId, ...allProducts.find((p) => p.id === productId) });
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

function addToCart(productId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find((item) => String(item.id) === String(productId));
  if (existing) existing.quantity += 1;
  else cart.push({ id: productId, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  if (typeof updateCartCount === 'function') updateCartCount();
  if (typeof showNotification === 'function') showNotification('Produit ajouté au panier !');
}
