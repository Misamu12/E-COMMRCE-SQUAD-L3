// Panier - charge les détails des produits depuis l'API
let productsCache = {};

document.addEventListener('DOMContentLoaded', async () => {
  await loadCartWithProducts();
  updateCartSummary();

  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (cart.length === 0) {
      alert('Votre panier est vide');
      return;
    }
    window.location.href = 'checkout.html';
  });

  document.getElementById('apply-promo')?.addEventListener('click', applyPromoCode);
});

async function loadCartWithProducts() {
  const container = document.getElementById('cart-items-container');
  const emptyCart = document.getElementById('empty-cart');
  const suggestionsSection = document.getElementById('suggestions-section');

  if (cart.length === 0) {
    if (container) container.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
    if (suggestionsSection) suggestionsSection.style.display = 'none';
    return;
  }

  if (container) container.style.display = 'block';
  if (emptyCart) emptyCart.style.display = 'none';
  if (suggestionsSection) suggestionsSection.style.display = 'block';

  container.innerHTML = '<p>Chargement...</p>';

  const products = [];
  for (const item of cart) {
    let p = productsCache[item.id];
    if (!p) {
      try {
        p = await api.getProduit(item.id);
        productsCache[item.id] = p;
      } catch {
        p = { id: item.id, name: 'Produit inconnu', price: 0, image: 'public/placeholder.jpg', category: '' };
      }
    }
    products.push({ ...p, _qty: item.quantity });
  }

  container.innerHTML = '';

  products.forEach((product) => {
    const qty = product._qty || 1;
    const itemTotal = (product.price * qty).toFixed(2);
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item fade-in';
    cartItem.innerHTML = `
      <div class="item-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="item-details">
        <h3 class="item-name">${product.name}</h3>
        <p class="item-category">${product.category || ''}</p>
        <div class="item-pricing">
          <span class="item-unit-price">${product.price}€</span>
          <span class="item-quantity">× ${qty}</span>
          <span class="item-total-price">${itemTotal}€</span>
        </div>
      </div>
      <div class="item-actions">
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateQuantity('${product.id}', -1)">-</button>
          <span class="quantity-value">${qty}</span>
          <button class="quantity-btn" onclick="updateQuantity('${product.id}', 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCart('${product.id}')">Retirer</button>
      </div>
    `;
    container.appendChild(cartItem);
  });

  loadSuggestions();
}

async function loadSuggestions() {
  const grid = document.getElementById('suggestions-grid');
  if (!grid) return;

  try {
    const all = await api.getProduits();
    const inCartIds = cart.map((i) => String(i.id));
    const suggested = all.filter((p) => !inCartIds.includes(String(p.id))).slice(0, 4);

    grid.innerHTML = suggested
      .map(
        (p) => `
      <div class="product-card fade-in">
        <div class="product-image">
          <a href="produit.html?id=${p.id}"><img src="${p.image}" alt="${p.name}"></a>
        </div>
        <div class="product-info">
          <h3 class="product-name"><a href="produit.html?id=${p.id}">${p.name}</a></h3>
          <p class="product-description">${p.category || ''}</p>
          <div class="product-rating">${'★'.repeat(Math.floor(p.rating || 4))} ${p.rating || 4}</div>
          <div class="product-footer">
            <span class="product-price">${p.price}€</span>
            <button class="btn-add-cart" onclick="addToCartPanier(${p.id})">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `
      )
      .join('');
  } catch (err) {
    grid.innerHTML = '';
  }
}

function updateQuantity(productId, change) {
  const item = cart.find((i) => String(i.id) === String(productId));
  if (!item) return;

  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  loadCartWithProducts();
  updateCartSummary();
  updateCartCount();
}

function updateCartSummary() {
  let subtotal = 0;
  for (const item of cart) {
    const p = productsCache[item.id];
    if (p) subtotal += p.price * item.quantity;
  }

  const shipping = subtotal > 200 ? 0 : 15;
  const total = subtotal + shipping;

  const subEl = document.getElementById('subtotal');
  const shipEl = document.getElementById('shipping');
  const totalEl = document.getElementById('total');
  if (subEl) subEl.textContent = subtotal.toFixed(2) + '€';
  if (shipEl) shipEl.textContent = shipping === 0 ? 'Gratuite' : shipping + '€';
  if (totalEl) totalEl.textContent = total.toFixed(2) + '€';
}

function applyPromoCode() {
  const promoInput = document.getElementById('promo-input');
  const code = (promoInput?.value || '').trim().toUpperCase();
  const promoCodes = { ELITE10: 10, BIENVENUE15: 15, VIP20: 20 };
  if (promoCodes[code]) {
    const discount = promoCodes[code];
    const discountLine = document.getElementById('discount-line');
    const discountEl = document.getElementById('discount');
    if (discountLine) discountLine.style.display = 'flex';
    if (discountEl) discountEl.textContent = `-${discount}%`;
    alert(`Code promo appliqué! -${discount}% de réduction`);
    if (promoInput) promoInput.value = '';
  } else {
    alert('Code promo invalide');
  }
}

function removeFromCart(productId) {
  cart = cart.filter((i) => String(i.id) !== String(productId));
  delete productsCache[productId];
  saveCart();
  loadCartWithProducts();
  updateCartSummary();
  updateCartCount();
}

function addToCartPanier(productId) {
  const existing = cart.find((i) => String(i.id) === String(productId));
  if (existing) existing.quantity++;
  else cart.push({ id: productId, quantity: 1 });
  saveCart();
  loadCartWithProducts();
  updateCartSummary();
  updateCartCount();
}
