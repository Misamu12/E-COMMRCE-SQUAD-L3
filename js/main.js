// Product data (let pour permettre le remplacement par les données API)
let bestSellersData = [
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
]

// Cart management - Stockage sous forme de tableau JSON
let cart = JSON.parse(localStorage.getItem("cart")) || []

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart))
}

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
    cart.push({ id: productId, quantity: 1 })
  }

  saveCart()
  updateCartCount()
  showNotification("Produit ajouté au panier !")

  // Afficher le panier dans la console
  console.log(" Panier mis à jour:", cart)
  console.log(" Nombre total d'articles:", cart.reduce((sum, item) => sum + item.quantity, 0))
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
  if (!container) {
    console.warn("Container #bestSellers non trouvé")
    return
  }

  if (!bestSellersData || bestSellersData.length === 0) {
    console.warn("Aucune donnée de produit disponible")
    container.innerHTML = '<p class="text-muted">Aucun produit disponible pour le moment.</p>'
    return
  }

  console.log(`Affichage de ${bestSellersData.length} produits`)
  container.innerHTML = bestSellersData
    .map(
      (product) => `
        <div class="product-card" data-aos="fade-up">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ""}
                <div class="product-actions">
                    <button class="product-action-btn ${isInWishlist(product.id) ? "wishlist-active" : ""}" data-product-id="${product.id}" onclick="toggleWishlist('${product.id}')" aria-label="Ajouter aux favoris">
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
                        <span class="product-price">${product.price}$</span>
                        ${product.originalPrice ? `<span class="product-original-price">${product.originalPrice}$</span>` : ""}
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
  
  // Observer les nouveaux éléments pour les animations
  setTimeout(() => {
    const productObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("aos-animate")
        }
      })
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" })
    
    const newElements = container.querySelectorAll("[data-aos]")
    newElements.forEach((el) => {
      productObserver.observe(el)
      // Si l'élément est déjà visible, activer l'animation immédiatement
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        el.classList.add("aos-animate")
      }
    })
  }, 50)
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

// Wishlist functionality - stocke des objets { id, name, price, image, category, rating } pour le dashboard
function getWishlist() {
  return JSON.parse(localStorage.getItem("wishlist") || "[]")
}

function saveWishlist(wishlist) {
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
}

function isInWishlist(productId) {
  const w = getWishlist()
  const idStr = String(productId)
  return w.some((item) => (typeof item === "object" && item !== null ? String(item.id) : String(item)) === idStr)
}

function toggleWishlist(productId) {
  let wishlist = getWishlist()
  const idStr = String(productId)
  const index = wishlist.findIndex((item) => (typeof item === "object" && item !== null ? String(item.id) : String(item)) === idStr)
  if (index > -1) {
    wishlist.splice(index, 1)
    showNotification("Retiré des favoris")
  } else {
    const product = bestSellersData.find((p) => String(p.id) === idStr)
    const obj = product
      ? { id: product.id, name: product.name, price: product.price, image: product.image, category: product.category || "", rating: product.rating || 4.5 }
      : { id: productId, name: "Produit", price: 0, image: "public/placeholder.jpg", category: "", rating: 4.5 }
    wishlist.push(obj)
    showNotification("Ajouté aux favoris !")
  }
  saveWishlist(wishlist)
  if (typeof updateWishlistCount === "function") updateWishlistCount()
  // Mettre à jour l’icône du bouton sur la page
  const btn = document.querySelector(`.product-action-btn[data-product-id="${idStr}"]`)
  if (btn) btn.classList.toggle("wishlist-active", isInWishlist(productId))
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
document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initialisation de la page - données statiques:", bestSellersData.length, "produits")
  
  if (typeof api !== 'undefined' && api.getProduits) {
    try {
      const prods = await api.getProduits()
      if (prods && prods.length > 0) {
        console.log(`API retourne ${prods.length} produits, utilisation des données API`)
        bestSellersData = prods.slice(0, 4).map(p => ({
          id: String(p.id),
          name: p.name,
          category: p.category || '',
          price: p.price,
          originalPrice: null,
          image: p.image,
          rating: p.rating || 4.5,
          reviews: 0,
          badge: null
        }))
      } else {
        console.log("API retourne un tableau vide, conservation des données statiques")
      }
    } catch (e) { 
      console.warn('API non disponible, données statiques utilisées:', e.message) 
    }
  } else {
    console.log("API non disponible, utilisation des données statiques")
  }
  
  // Limiter à 4 produits maximum pour l'affichage
  if (bestSellersData.length > 4) {
    bestSellersData = bestSellersData.slice(0, 4)
  }
  
  console.log("Rendu de", bestSellersData.length, "produits")
  renderBestSellers()
  updateCartCount()
})
