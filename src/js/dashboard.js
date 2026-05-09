// Données du dashboard - chargées depuis l'API pour l'utilisateur connecté
let userOrders = []

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
                    ${order.status === "delivered" ? "Livrée" : order.status === "cancelled" ? "Annulée" : "En cours"}
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
                        <div class="order-item-price">${item.price}$</div>
                    </div>
                `,
                  )
                  .join("")}
            </div>
            <div class="order-footer">
                <div class="order-total">Total: ${order.total}$</div>
                <div class="order-actions">
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
      let filteredOrders = userOrders

      if (filter !== "all") {
        filteredOrders = userOrders.filter((order) => order.status === filter)
      }

      renderOrders(filteredOrders, "allOrders")
    })
  })
}

// Normalise un item wishlist (peut être un id seul ou un objet)
function getWishlistItemDisplay(item) {
  if (typeof item === "object" && item !== null && item.name !== undefined) {
    return {
      id: item.id,
      name: item.name || "Produit",
      price: item.price != null ? item.price : 0,
      image: item.image || "public/placeholder.jpg",
    }
  }
  const id = item != null ? String(item) : ""
  return { id, name: "Produit #" + id, price: 0, image: "public/placeholder.jpg" }
}

// Render wishlist
function renderWishlist() {
  const container = document.getElementById("wishlistGrid")
  if (!container) return

  const rawList = JSON.parse(localStorage.getItem("wishlist") || "[]")

  if (rawList.length === 0) {
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

  container.innerHTML = rawList
    .map((item) => {
      const d = getWishlistItemDisplay(item)
      const idSafe = String(d.id).replace(/'/g, "\\'").replace(/"/g, "&quot;")
      return `
        <div class="wishlist-item">
            <img src="${(d.image || "").replace(/"/g, "&quot;")}" alt="${(d.name || "").replace(/"/g, "&quot;")}" class="wishlist-image">
            <div class="wishlist-info">
                <h3>${(d.name || "").replace(/</g, "&lt;")}</h3>
                <div class="wishlist-price">${d.price}$</div>
                <div class="wishlist-actions">
                    <button class="btn-primary" onclick="addToCartFromWishlist('${idSafe}')">
                        <i class="fas fa-shopping-cart"></i> Ajouter
                    </button>
                    <button class="remove-wishlist" onclick="removeFromWishlist('${idSafe}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    })
    .join("")
}

// Remove from wishlist
function removeFromWishlist(productId) {
  let wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  const idStr = String(productId)
  wishlist = wishlist.filter((item) => {
    const itemId = typeof item === "object" && item !== null ? item.id : item
    return String(itemId) !== idStr
  })
  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  renderWishlist()
  if (typeof updateWishlistCount === "function") updateWishlistCount()
}

// Add to cart from wishlist (ne pas écraser addToCart de main.js)
function addToCartFromWishlist(productId) {
  const idStr = String(productId)
  if (typeof cart === "undefined") {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]")
    const existing = cartData.find((i) => String(i.id) === idStr)
    if (existing) existing.quantity += 1
    else cartData.push({ id: productId, quantity: 1 })
    localStorage.setItem("cart", JSON.stringify(cartData))
  } else {
    const existing = cart.find((i) => String(i.id) === idStr)
    if (existing) existing.quantity += 1
    else cart.push({ id: productId, quantity: 1 })
    if (typeof saveCart === "function") saveCart()
  }
  if (typeof updateCartCount === "function") updateCartCount()
  alert("Produit ajouté au panier !")
}

// Render addresses (pas d'API adresses pour l'instant)
function renderAddresses() {
  const container = document.getElementById("addressesGrid")
  if (!container) return

  container.innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1;">
      <i class="fas fa-map-marker-alt"></i>
      <h3>Aucune adresse</h3>
      <p>Cette fonctionnalité sera bientôt disponible</p>
    </div>
  `
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

// Transforme les commandes API au format attendu par renderOrders
function formatOrdersFromApi(commandes) {
  return (commandes || []).map((c) => ({
    id: c.id,
    date: c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR") : "-",
    status: c.status || "pending",
    items: (c.CommandeItems || []).map((ci) => ({
      name: ci.Produit?.name || "Produit",
      quantity: ci.quantity,
      price: parseFloat(ci.price),
      image: ci.Produit?.image || "public/placeholder.jpg"
    })),
    total: parseFloat(c.total)
  }))
}

// Charge les données de l'utilisateur connecté
async function loadUserData() {
  const user = auth.getCurrentUser()
  if (!user) return

  // Remplir le formulaire profil
  const fullnameEl = document.getElementById("profileFullname")
  const emailEl = document.getElementById("profileEmail")
  if (fullnameEl) fullnameEl.value = user.fullname || ""
  if (emailEl) emailEl.value = user.email || ""

  // Charger les commandes depuis l'API
  try {
    const commandes = await api.getMyCommandes()
    userOrders = formatOrdersFromApi(commandes)
    renderOrders(userOrders.slice(0, 2), "recentOrders")
    renderOrders(userOrders, "allOrders")
    updateDashboardStats(userOrders)
  } catch (e) {
    console.warn("Erreur chargement commandes:", e)
    userOrders = []
    renderOrders([], "recentOrders")
    renderOrders([], "allOrders")
  }
}

// Met à jour les stats (commandes, favoris, total dépensé)
function updateDashboardStats(orders) {
  const statCards = document.querySelectorAll('#overview .stat-card')
  if (statCards[0]) statCards[0].querySelector('h3').textContent = (orders || []).length
  const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]")
  if (statCards[1]) statCards[1].querySelector('h3').textContent = wishlist.length
  if (statCards[2]) statCards[2].querySelector('h3').textContent = "0" // Points fidélité (non implémenté)
  const spent = (orders || []).reduce((s, o) => s + (o.total || 0), 0)
  if (statCards[3]) statCards[3].querySelector('h3').textContent = spent.toFixed(0) + "$"
}

// Exposer pour les onclick du HTML dynamique (favoris)
window.removeFromWishlist = removeFromWishlist
window.addToCartFromWishlist = addToCartFromWishlist

// Initialize dashboard
document.addEventListener("DOMContentLoaded", async () => {
  initTabs()
  initOrdersFilter()
  renderWishlist()
  renderAddresses()
  initAddAddress()
  initProfileForm()
  updateCartCount()
  updateWishlistCount()

  await loadUserData()
})
