// Mock data for dashboard
const mockOrders = [
  {
    id: "CMD-2024-001",
    date: "15/04/2024",
    status: "delivered",
    items: [
      { name: "Château Margaux 2015", quantity: 1, price: 450, image: "/wine-bottle-premium.jpg" },
      { name: "Dom Pérignon 2012", quantity: 2, price: 180, image: "/champagne-bottle-luxury.jpg" },
    ],
    total: 810,
  },
  {
    id: "CMD-2024-002",
    date: "22/04/2024",
    status: "pending",
    items: [{ name: "Macallan 18 ans", quantity: 1, price: 280, image: "/whisky-bottle-premium.jpg" }],
    total: 280,
  },
  {
    id: "CMD-2024-003",
    date: "10/03/2024",
    status: "delivered",
    items: [
      { name: "Hennessy XO", quantity: 1, price: 190, image: "/cognac-bottle-luxury.jpg" },
      { name: "Grey Goose", quantity: 1, price: 45, image: "/premium-vodka-bottle.png" },
    ],
    total: 235,
  },
]

const mockWishlist = [
  { id: 1, name: "Château Pétrus 2010", price: 2800, image: "/premium-wine-bottle-luxury.jpg" },
  { id: 2, name: "Louis XIII Cognac", price: 3500, image: "/cognac-bottle-crystal-luxury.jpg" },
  { id: 3, name: "Cristal Roederer 2008", price: 450, image: "/champagne-bottle-luxury-gold.jpg" },
  { id: 4, name: "Glenfiddich 50 ans", price: 18000, image: "/whisky-bottle-rare-premium.jpg" },
]

const mockAddresses = [
  {
    id: 1,
    name: "Domicile",
    address: "123 Rue de la République\n75001 Paris\nFrance",
    isDefault: true,
  },
  {
    id: 2,
    name: "Bureau",
    address: "45 Avenue des Champs-Élysées\n75008 Paris\nFrance",
    isDefault: false,
  },
]

// Tab navigation
function initTabs() {
  const navItems = document.querySelectorAll(".nav-item:not(.logout)")
  const tabContents = document.querySelectorAll(".tab-content")

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      const tabName = item.dataset.tab

      // Update active nav item
      navItems.forEach((nav) => nav.classList.remove("active"))
      item.classList.add("active")

      // Show corresponding tab
      tabContents.forEach((tab) => {
        tab.classList.remove("active")
        if (tab.id === tabName) {
          tab.classList.add("active")
        }
      })
    })
  })

  // Logout button
  const logoutBtn = document.querySelector(".nav-item.logout")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
        window.location.href = "index.html"
      }
    })
  }
}

// Render orders
function renderOrders(orders, containerId) {
  const container = document.getElementById(containerId)
  if (!container) return

  if (orders.length === 0) {
    container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Aucune commande</h3>
                <p>Vous n'avez pas encore passé de commande</p>
            </div>
        `
    return
  }

  container.innerHTML = orders
    .map(
      (order) => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <div class="order-number">${order.id}</div>
                    <div class="order-date">${order.date}</div>
                </div>
                <span class="order-status ${order.status}">
                    ${order.status === "delivered" ? "Livrée" : order.status === "pending" ? "En cours" : "Annulée"}
                </span>
            </div>
            <div class="order-items">
                ${order.items
                  .map(
                    (item) => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}" class="order-item-image">
                        <div class="order-item-details">
                            <h4>${item.name}</h4>
                            <p>Quantité: ${item.quantity}</p>
                        </div>
                        <div class="order-item-price">${item.price}€</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: ${order.total}€</div>
                <div class="order-actions">
                    <button class="btn-secondary"><i class="fas fa-eye"></i> Détails</button>
                    ${order.status === "delivered" ? '<button class="btn-secondary"><i class="fas fa-redo"></i> Racheter</button>' : ""}
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Filter orders
function initOrdersFilter() {
  const filterBtns = document.querySelectorAll(".filter-btn")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const filter = btn.dataset.filter
      let filteredOrders = mockOrders

      if (filter !== "all") {
        filteredOrders = mockOrders.filter((order) => order.status === filter)
      }

      renderOrders(filteredOrders, "allOrders")
    })
  })
}

// Render wishlist
function renderWishlist() {
  const container = document.getElementById("wishlistGrid")
  if (!container) return

  // Get wishlist from localStorage
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")

  if (wishlist.length === 0) {
    container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-heart"></i>
                <h3>Aucun favori</h3>
                <p>Vous n'avez pas encore ajouté de produits à vos favoris</p>
                <a href="catalogue.html" class="btn-primary" style="margin-top: 20px; display: inline-flex;">
                    <i class="fas fa-shopping-bag"></i> Découvrir nos produits
                </a>
            </div>
        `
    return
  }

  container.innerHTML = wishlist
    .map(
      (item) => `
        <div class="wishlist-item">
            <img src="${item.image}" alt="${item.name}" class="wishlist-image">
            <div class="wishlist-info">
                <h3>${item.name}</h3>
                <div class="wishlist-price">${item.price}€</div>
                <div class="wishlist-actions">
                    <button class="btn-primary" onclick="addToCart(${item.id})">
                        <i class="fas fa-shopping-cart"></i> Ajouter
                    </button>
                    <button class="remove-wishlist" onclick="removeFromWishlist(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `,
    )
    .join("")
}

// Remove from wishlist
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  wishlist = wishlist.filter((item) => item.id !== productId)
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  renderWishlist()
  updateWishlistCount()
}

// Add to cart from wishlist
function addToCart(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const product = wishlist.find((item) => item.id === productId)

  if (product) {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item) => item.id === productId)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.push({ ...product, quantity: 1 })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    updateCartCount()

    // Show notification
    alert("Produit ajouté au panier !")
  }
}

// Render addresses
function renderAddresses() {
  const container = document.getElementById("addressesGrid")
  if (!container) return

  container.innerHTML = mockAddresses
    .map(
      (address) => `
        <div class="address-card ${address.isDefault ? "default" : ""}">
            ${address.isDefault ? '<span class="default-badge">Par défaut</span>' : ""}
            <h4>${address.name}</h4>
            <p>${address.address.replace(/\n/g, "<br>")}</p>
            <div class="address-actions">
                <button class="btn-secondary"><i class="fas fa-edit"></i> Modifier</button>
                ${!address.isDefault ? '<button class="btn-secondary"><i class="fas fa-trash"></i> Supprimer</button>' : ""}
            </div>
        </div>
    `,
    )
    .join("")
}

// Add new address
function initAddAddress() {
  const addBtn = document.querySelector(".add-address-btn")
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      alert("Formulaire d'ajout d'adresse (à implémenter)")
    })
  }
}

// Profile form submission
function initProfileForm() {
  const form = document.getElementById("profileForm")
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      alert("Profil mis à jour avec succès !")
    })
  }
}

// Update wishlist count
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const count = document.getElementById("wishlistCount")
  if (count) {
    count.innerText = wishlist.length
  }
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]")
  const count = document.getElementById("cartCount")
  if (count) {
    count.innerText = cart.reduce((total, item) => total + item.quantity, 0)
  }
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  initTabs()
  renderOrders(mockOrders.slice(0, 2), "recentOrders")
  renderOrders(mockOrders, "allOrders")
  initOrdersFilter()
  renderWishlist()
  renderAddresses()
  initAddAddress()
  initProfileForm()
  updateCartCount()
  updateWishlistCount()
})
