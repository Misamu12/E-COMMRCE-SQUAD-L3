// Cart page functionality - Stockage sous forme de tableau JSON
const products = [
  {
    id: "1",
    name: "Château Margaux 2015",
    category: "Bordeaux",
    price: 450,
    originalPrice: 520,
    image: "public/bordeaux-wine-bottle-elegant.jpg",
    rating: 4.9,
    reviews: 234,
    badge: "Best-Seller",
  },
  {
    id: "2",
    name: "Dom Pérignon Vintage 2013",
    category: "Champagne",
    price: 280,
    originalPrice: null,
    image: "public/dom-perignon-champagne-bottle.jpg",
    rating: 5.0,
    reviews: 189,
    badge: "Exclusif",
  },
  {
    id: "3",
    name: "Macallan 18 ans Sherry Oak",
    category: "Whisky",
    price: 380,
    originalPrice: null,
    image: "public/macallan-whisky-bottle-premium.jpg",
    rating: 4.8,
    reviews: 156,
    badge: null,
  },
  {
    id: "4",
    name: "Hennessy XO Cognac",
    category: "Cognac",
    price: 220,
    originalPrice: 260,
    image: "public/hennessy-xo-cognac-bottle.jpg",
    rating: 4.7,
    reviews: 198,
    badge: "Promo",
  },
  {
    id: "9",
    name: "Pétrus 2010",
    category: "Vin - Pomerol",
    price: 3200,
    image: "public/petrus-wine-bottle-bordeaux.jpg",
    rating: 5.0,
    reviews: 45,
  },
  {
    id: "12",
    name: "Louis XIII Cognac",
    category: "Cognac - Rémy Martin",
    price: 3800,
    image: "public/louis-xiii-cognac-crystal-bottle.jpg",
    rating: 5.0,
    reviews: 67,
  },
  {
    id: "21",
    name: "Yamazaki 18 ans",
    category: "Whisky Japonais - Single Malt",
    price: 1600,
    image: "public/yamazakib479.jpg",
    rating: 4.9,
    reviews: 89,
  },
]

document.addEventListener("DOMContentLoaded", () => {
  // Afficher le panier dans la console au chargement
  console.log("🛒 Panier chargé depuis localStorage:", cart)
  console.log("📊 Nombre total d'articles:", cart.reduce((sum, item) => sum + item.quantity, 0))

  renderCart()
  updateCartSummary()

  // Checkout button
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Votre panier est vide")
      return
    }
    // Simulate checkout
    alert("Redirection vers le paiement sécurisé...")
  })

  // Apply promo code
  document.getElementById("apply-promo").addEventListener("click", applyPromoCode)
})

function renderCart() {
  const container = document.getElementById("cart-items-container")
  const emptyCart = document.getElementById("empty-cart")

  if (cart.length === 0) {
    container.style.display = "none"
    emptyCart.style.display = "block"
    document.getElementById("suggestions-section").style.display = "none"
    return
  }

  container.style.display = "block"
  emptyCart.style.display = "none"
  document.getElementById("suggestions-section").style.display = "block"

  container.innerHTML = ""

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id)
    if (!product) return

    const itemTotal = (product.price * item.quantity).toFixed(2)
    const cartItem = document.createElement("div")
    cartItem.className = "cart-item fade-in"
    cartItem.innerHTML = `
            <div class="item-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-details">
                <h3 class="item-name">${product.name}</h3>
                <p class="item-category">${product.category}</p>
                <div class="item-pricing">
                    <span class="item-unit-price">${product.price}€</span>
                    <span class="item-quantity">× ${item.quantity}</span>
                    <span class="item-total-price">${itemTotal}€</span>
                </div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity('${product.id}', -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${product.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart('${product.id}')">
                    Retirer
                </button>
            </div>
        `
    container.appendChild(cartItem)
  })

  // Load suggestions
  loadSuggestions()
}

function updateQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId)
  if (!item) return

  item.quantity += change

  if (item.quantity <= 0) {
    removeFromCart(productId)
    return
  }

  saveCart()
  renderCart()
  updateCartSummary()
  updateCartCount()

  // Afficher le panier dans la console après modification
  console.log("🛒 Quantité mise à jour pour produit", productId, ":", cart)
  console.log("📊 Nombre total d'articles:", cart.reduce((sum, item) => sum + item.quantity, 0))
}

function updateCartSummary() {
  let subtotal = 0

  cart.forEach((item) => {
    const product = products.find((p) => p.id === item.id)
    if (product) {
      subtotal += product.price * item.quantity
    }
  })

  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  document.getElementById("subtotal").textContent = subtotal.toFixed(2) + "€"
  document.getElementById("shipping").textContent = shipping === 0 ? "Gratuite" : shipping + "€"
  document.getElementById("total").textContent = total.toFixed(2) + "€"
}

function applyPromoCode() {
  const promoInput = document.getElementById("promo-input")
  const code = promoInput.value.trim().toUpperCase()

  const promoCodes = {
    ELITE10: 10,
    BIENVENUE15: 15,
    VIP20: 20,
  }

  if (promoCodes[code]) {
    const discount = promoCodes[code]
    document.getElementById("discount-line").style.display = "flex"
    document.getElementById("discount").textContent = `-${discount}%`
    alert(`Code promo appliqué! -${discount}% de réduction`)
    promoInput.value = ""
  } else {
    alert("Code promo invalide")
  }
}

function loadSuggestions() {
  const grid = document.getElementById("suggestions-grid")
  const suggestedProducts = products.filter((p) => !cart.find((item) => item.id === p.id)).slice(0, 4)

  grid.innerHTML = ""

  suggestedProducts.forEach((product) => {
    const card = document.createElement("div")
    card.className = "product-card fade-in"
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
                <p class="product-description">${product.category}</p>
                <div class="product-rating">
                    ${"★".repeat(Math.floor(product.rating))}${"☆".repeat(5 - Math.floor(product.rating))}
                    <span>${product.rating}</span>
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
        `
    grid.appendChild(card)
  })
}

function removeFromCart(productId) {
  const product = products.find((p) => p.id === productId)
  cart = cart.filter((item) => item.id !== productId)
  saveCart()
  renderCart()
  updateCartSummary()
  updateCartCount()

  // Afficher le panier dans la console après suppression
  console.log("➖ Produit retiré du panier:", productId, "-", product ? product.name : "Produit inconnu")
  console.log("🛒 Panier mis à jour:", cart)
  console.log("📊 Nombre total d'articles:", cart.reduce((sum, item) => sum + item.quantity, 0))
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.push({ id: productId, quantity: 1 })
  }

  saveCart()
  renderCart()
  updateCartSummary()
  updateCartCount()

  // Afficher le panier dans la console après ajout
  console.log(" Produit ajouté au panier:", productId, "-", product.name)
  console.log(" Panier mis à jour:", cart)
  console.log(" Nombre total d'articles:", cart.reduce((sum, item) => sum + item.quantity, 0))
}

function toggleWishlist(productId) {
  // Logic to toggle product in wishlist
}
