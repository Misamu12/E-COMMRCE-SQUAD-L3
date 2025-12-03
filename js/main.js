// Product data
const bestSellersData = [
  {
    id: "1",
    name: "Château Margaux 2015",
    category: "Bordeaux",
    price: 450,
    originalPrice: 520,
    image: "ruinard.jpg",
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
    image: "ruinard.jpg",
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
    image: "ruinard.jpg",
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
    image: "ruinard.jpg",
    rating: 4.7,
    reviews: 198,
    badge: "Promo",
  },
]

// Cart management
const cart = JSON.parse(localStorage.getItem("cart")) || []

function updateCartCount() {
  const cartCount = document.getElementById("cartCount")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
  }
}

function addToCart(productId) {
  const product = bestSellersData.find((p) => p.id === productId)
  if (!product) return

  const existingItem = cart.find((item) => item.id === productId)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({ ...product, quantity: 1 })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showNotification("Produit ajouté au panier !")
}

function showNotification(message) {
  // Simple notification - can be enhanced
  const notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--color-gold);
        color: var(--color-background);
        padding: 1rem 1.5rem;
        border-radius: var(--radius-md);
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `
  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Render products
function renderBestSellers() {
  const container = document.getElementById("bestSellers")
  if (!container) return

  container.innerHTML = bestSellersData
    .map(
      (product) => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
                <div class="product-actions">
                    <button class="product-action-btn" onclick="toggleWishlist('${product.id}')" aria-label="Ajouter aux favoris">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="product-action-btn" onclick="quickView('${product.id}')" aria-label="Aperçu rapide">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">
                    <div class="stars">
                        ${generateStars(product.rating)}
                    </div>
                    <span class="reviews-count">(${product.reviews})</span>
                </div>
                <div class="product-footer">
                    <div class="product-price-group">
                        <span class="product-price">${product.price}€</span>
                        ${product.originalPrice ? `<span class="product-original-price">${product.originalPrice}€</span>` : ""}
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart('${product.id}')" aria-label="Ajouter au panier">
                        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="9" cy="21" r="1"></circle>
                            <circle cx="20" cy="21" r="1"></circle>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = ""

  for (let i = 0; i < fullStars; i++) {
    stars += '<span class="star">★</span>'
  }
  if (hasHalfStar) {
    stars += '<span class="star">★</span>'
  }
  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars += '<span class="star" style="color: var(--color-muted)">★</span>'
  }

  return stars
}

// Wishlist functionality
const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId)
  if (index > -1) {
    wishlist.splice(index, 1)
    showNotification("Retiré des favoris")
  } else {
    wishlist.push(productId)
    showNotification("Ajouté aux favoris !")
  }
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

function quickView(productId) {
  // Navigate to product page
  window.location.href = `produit.html?id=${productId}`
}

// Header scroll effect
window.addEventListener("scroll", () => {
  const header = document.getElementById("header")
  if (window.scrollY > 50) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
})

// Mobile menu toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn")
const navLinks = document.getElementById("navLinks")

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active")
    mobileMenuBtn.classList.toggle("active")
  })
}

// Newsletter form
const newsletterForm = document.getElementById("newsletterForm")
if (newsletterForm) {
  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const email = e.target.querySelector('input[type="email"]').value
    console.log("[v0] Newsletter subscription:", email)
    showNotification("Merci de vous être inscrit !")
    e.target.reset()
  })
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderBestSellers()
  updateCartCount()
})
