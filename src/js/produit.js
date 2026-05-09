// Page produit - charge les données depuis l'API ou données statiques (fallback)
let productData = null;
let relatedProducts = [];

/** Retourne un produit depuis les best-sellers (main.js) pour fallback quand l'API est indisponible */
function getStaticProduct(productId) {
  const list = typeof bestSellersData !== 'undefined' ? bestSellersData : [];
  const p = list.find((item) => String(item.id) === String(productId));
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    category: p.category || '',
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.image,
    images: p.images || [p.image],
    description: p.description || `Découvrez ${p.name}, un produit de notre sélection ${p.category}.`,
    rating: p.rating || 4.5,
    reviews: p.reviews || 0
  };
}

/** Liste des produits pour les "produits similaires" en mode fallback */
function getStaticRelatedProducts(excludeId, limit = 4) {
  const list = typeof bestSellersData !== 'undefined' ? bestSellersData : [];
  return list
    .filter((item) => String(item.id) !== String(excludeId))
    .slice(0, limit)
    .map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category || '',
      price: p.price,
      image: p.image,
      rating: p.rating || 4.5
    }));
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id');

  if (!productId) {
    document.getElementById('products-grid')?.closest('section')?.remove();
    return;
  }

  try {
    productData = await api.getProduit(productId);
    loadProductData();
    setupThumbnails();
    setupQuantityControls();
    setupAddToCart();
    setupWishlist();

    const all = await api.getProduits();
    relatedProducts = all.filter((p) => String(p.id) !== String(productData.id) && p.category === productData.category).slice(0, 4);
    if (relatedProducts.length < 4) {
      relatedProducts = all.filter((p) => String(p.id) !== String(productData.id)).slice(0, 4);
    }
    loadRelatedProducts();
  } catch (err) {
    console.warn('API indisponible, utilisation des données statiques:', err);
    productData = getStaticProduct(productId);
    if (productData) {
      loadProductData();
      setupThumbnails();
      setupQuantityControls();
      setupAddToCart();
      setupWishlist();
      relatedProducts = getStaticRelatedProducts(productId, 4);
      loadRelatedProducts();
    } else {
      document.querySelector('.product-detail .container').innerHTML =
        '<p class="error-message">Produit non trouvé ou erreur de chargement.</p>';
    }
  }

  updateCartCount();
  updateWishlistCount();
});

function loadProductData() {
  if (!productData) return;
  document.getElementById('productTitle').textContent = productData.name;
  document.getElementById('productPrice').textContent = productData.price + '$';
  document.getElementById('productDescription').textContent = productData.description || '';
  const mainImg = document.getElementById('mainProductImage');
  mainImg.src = productData.image || productData.images?.[0] || 'public/placeholder.jpg';
  mainImg.alt = productData.name;
  const bc = document.getElementById('breadcrumbProduct');
  if (bc) bc.textContent = productData.name;

  const thumbnails = document.querySelector('.thumbnail-images');
  if (thumbnails && productData.images && productData.images.length > 0) {
    thumbnails.innerHTML = productData.images
      .map((url, i) => `<img src="${url}" alt="View ${i + 1}" class="thumbnail ${i === 0 ? 'active' : ''}">`)
      .join('');
  }
}

function setupThumbnails() {
  const thumbnails = document.querySelectorAll('.thumbnail');
  const mainImage = document.getElementById('mainProductImage');
  thumbnails.forEach((thumb) => {
    thumb.addEventListener('click', function () {
      thumbnails.forEach((t) => t.classList.remove('active'));
      this.classList.add('active');
      if (mainImage) mainImage.src = this.src;
    });
  });
}

function setupQuantityControls() {
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  if (!qtyInput) return;

  qtyMinus?.addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10);
    if (v > 1) qtyInput.value = v - 1;
  });
  qtyPlus?.addEventListener('click', () => {
    const v = parseInt(qtyInput.value, 10);
    if (v < 10) qtyInput.value = v + 1;
  });
  qtyInput.addEventListener('change', function () {
    let v = parseInt(this.value, 10);
    if (isNaN(v) || v < 1) v = 1;
    if (v > 10) v = 10;
    this.value = v;
  });
}

function setupAddToCart() {
  const addToCartBtn = document.getElementById('addToCartBtn');
  const qtyInput = document.getElementById('qtyInput');
  if (!addToCartBtn || !productData) return;

  addToCartBtn.addEventListener('click', () => {
    const qty = parseInt(qtyInput?.value || 1, 10);
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find((item) => String(item.id) === String(productData.id));
    if (existing) existing.quantity += qty;
    else cart.push({ id: productData.id, name: productData.name, price: productData.price, image: productData.image, quantity: qty });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showToast('Produit ajouté au panier !');
  });
}

function setupWishlist() {
  const wishlistBtn = document.getElementById('wishlistProductBtn');
  if (!wishlistBtn || !productData) return;

  const icon = wishlistBtn.querySelector('i');
  const w = JSON.parse(localStorage.getItem('wishlist') || '[]');
  const idStr = String(productData.id);
  const inWishlist = w.some((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)) === idStr);
  if (inWishlist) {
    wishlistBtn.classList.add('active');
    if (icon) icon.className = 'fas fa-heart';
  }

  wishlistBtn.addEventListener('click', function () {
    let wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const idx = wishlist.findIndex((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)) === idStr);
    if (idx >= 0) {
      wishlist.splice(idx, 1);
      this.classList.remove('active');
      if (this.querySelector('i')) this.querySelector('i').className = 'far fa-heart';
      showToast('Produit retiré des favoris');
    } else {
      wishlist.push({ id: productData.id, name: productData.name, price: productData.price, image: productData.image, category: productData.category, rating: productData.rating });
      this.classList.add('active');
      if (this.querySelector('i')) this.querySelector('i').className = 'fas fa-heart';
      showToast('Produit ajouté aux favoris !');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
  });
}

function loadRelatedProducts() {
  const container = document.getElementById('relatedProducts');
  if (!container) return;

  const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
  container.innerHTML = relatedProducts
    .map((p) => {
      const inWishlist = wishlist.some((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)) === String(p.id));
      return `
    <div class="product-card fade-in" data-product-id="${p.id}">
      <div class="product-image">
        <a href="produit.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-product-id="${p.id}"><i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i></button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category || ''}</span>
        <h3 class="product-name"><a href="produit.html?id=${p.id}">${p.name}</a></h3>
        <div class="product-rating">${'★'.repeat(Math.floor(p.rating || 4))} ${p.rating || 4}</div>
        <div class="product-footer">
          <span class="product-price">${p.price}$</span>
          <button class="btn-add" onclick="addToCartQuick(${p.id}, '${(p.name || '').replace(/'/g, "\\'")}', ${p.price}, '${(p.image || '').replace(/'/g, "\\'")}')">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
    </div>
  `;
    })
    .join('');

  container.querySelectorAll('.wishlist-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleWishlistQuick(parseInt(this.dataset.productId, 10));
    });
  });
}

function addToCartQuick(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing = cart.find((item) => String(item.id) === String(id));
  if (existing) existing.quantity += 1;
  else cart.push({ id, name, price, image, quantity: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showToast('Produit ajouté au panier !');
}

function toggleWishlistQuick(productId) {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const idStr = String(productId);
  const product = relatedProducts.find((p) => String(p.id) === idStr);
  const idx = wishlist.findIndex((item) => (typeof item === 'object' && item !== null ? String(item.id) : String(item)) === idStr);
  const btn = document.querySelector(`.wishlist-btn[data-product-id="${productId}"]`);
  const icon = btn?.querySelector('i');

  if (idx >= 0) {
    wishlist.splice(idx, 1);
    btn?.classList.remove('active');
    icon?.classList.replace('fas', 'far');
    showToast('Retiré des favoris');
  } else if (product) {
    wishlist.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, rating: product.rating });
    btn?.classList.add('active');
    icon?.classList.replace('far', 'fas');
    showToast('Ajouté aux favoris !');
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const total = cart.reduce((s, i) => s + (i.quantity || 1), 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}

function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  const el = document.getElementById('wishlistCount');
  if (el) el.textContent = wishlist.length;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMessage');
  if (msg) msg.textContent = message;
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}

document.getElementById('cartBtn')?.addEventListener('click', () => {
  window.location.href = 'panier.html';
});
