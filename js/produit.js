// Product Detail Page JavaScript

// Sample product data (in real app, this would come from an API)
const productData = {
  id: 1,
  name: "Château Margaux 2015",
  category: "Vin Rouge",
  price: 890,
  originalPrice: 950,
  rating: 4.8,
  reviewCount: 127,
  stock: 15,
  description:
    "Un grand cru exceptionnel de Bordeaux. Ce millésime 2015 offre une complexité aromatique remarquable avec des notes de fruits noirs, de violette et d'épices douces. Élevé 18 mois en barriques de chêne français.",
  image: "public/4_4e.jpg",
  images: [
    "public/4_4e.jpg",
    "public/1_8.jpg",
    "public/2_9c.jpg",
    "public/3_b.jpg",
  ],
  origin: "Bordeaux, France",
  volume: "750 ml",
  alcohol: "13.5%",
  vintage: "2015",
}

// Related products
const relatedProducts = [
  {
    id: 2,
    name: "Pétrus Pomerol 2016",
    category: "Vin Rouge",
    price: 3200,
    rating: 4.9,
    image: "public/petrus-wine-bottle-bordeaux.jpg",
  },
  {
    id: 3,
    name: "Château Latour 2014",
    category: "Vin Rouge",
    price: 780,
    rating: 4.7,
    image: "public/bollinger-champagne-bottle.jpg",
  },
  {
    id: 4,
    name: "Domaine de la Romanée-Conti",
    category: "Vin Rouge",
    price: 15000,
    rating: 5.0,
    image: "public/champagne-bottle-luxury.jpg",
  },
  {
    id: 5,
    name: "Château d'Yquem 2015",
    category: "Vin Blanc",
    price: 450,
    rating: 4.8,
    image: "public/chateau-margaux-wine-bottle.png",
  },
]

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadProductData()
  setupThumbnails()
  setupQuantityControls()
  setupAddToCart()
  setupWishlist()
  loadRelatedProducts()
  updateCartCount()
  updateWishlistCount()
})

// Load product data
function loadProductData() {
  document.getElementById("productTitle").textContent = productData.name
  document.getElementById("productPrice").textContent = productData.price + "€"
  document.getElementById("productDescription").textContent = productData.description
  document.getElementById("mainProductImage").src = productData.image
  document.getElementById("breadcrumbProduct").textContent = productData.name
}

// Thumbnail image switching
function setupThumbnails() {
  const thumbnails = document.querySelectorAll(".thumbnail")
  const mainImage = document.getElementById("mainProductImage")

  thumbnails.forEach((thumb, index) => {
    thumb.addEventListener("click", function () {
      // Remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"))

      // Add active class to clicked thumbnail
      this.classList.add("active")

      // Update main image
      mainImage.src = productData.images[index]
    })
  })
}

// Quantity controls
function setupQuantityControls() {
  const qtyInput = document.getElementById("qtyInput")
  const qtyMinus = document.getElementById("qtyMinus")
  const qtyPlus = document.getElementById("qtyPlus")

  qtyMinus.addEventListener("click", () => {
    const currentValue = Number.parseInt(qtyInput.value)
    if (currentValue > 1) {
      qtyInput.value = currentValue - 1
    }
  })

  qtyPlus.addEventListener("click", () => {
    const currentValue = Number.parseInt(qtyInput.value)
    if (currentValue < 10) {
      qtyInput.value = currentValue + 1
    }
  })

  // Prevent invalid input
  qtyInput.addEventListener("change", function () {
    const value = Number.parseInt(this.value)
    if (isNaN(value) || value < 1) {
      this.value = 1
    } else if (value > 10) {
      this.value = 10
    }
  })
}

// Add to cart functionality
function setupAddToCart() {
  const addToCartBtn = document.getElementById("addToCartBtn")
  const qtyInput = document.getElementById("qtyInput")

  addToCartBtn.addEventListener("click", () => {
    const quantity = Number.parseInt(qtyInput.value)

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("cart")) || []

    // Check if product already in cart
    const existingIndex = cart.findIndex((item) => item.id === productData.id)

    if (existingIndex !== -1) {
      // Update quantity
      cart[existingIndex].quantity += quantity
    } else {
      // Add new item
      cart.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        quantity: quantity,
      })
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Show toast notification
    showToast("Produit ajouté au panier avec succès !")

    // Add animation to button
    addToCartBtn.style.transform = "scale(0.95)"
    setTimeout(() => {
      addToCartBtn.style.transform = "scale(1)"
    }, 200)
  })
}

// Wishlist functionality
function setupWishlist() {
  const wishlistBtn = document.getElementById("wishlistProductBtn")
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  // Check if product is in wishlist
  if (wishlist.some((item) => item.id === productData.id)) {
    wishlistBtn.classList.add("active")
  }

  wishlistBtn.addEventListener("click", function () {
    wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
    const existingIndex = wishlist.findIndex((item) => item.id === productData.id)

    if (existingIndex !== -1) {
      // Remove from wishlist
      wishlist.splice(existingIndex, 1)
      this.classList.remove("active")
      showToast("Produit retiré des favoris")
    } else {
      // Add to wishlist
      wishlist.push({
        id: productData.id,
        name: productData.name,
        price: productData.price,
        image: productData.image,
        category: productData.category,
        rating: productData.rating,
      })
      this.classList.add("active")
      showToast("Produit ajouté aux favoris !")
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    updateWishlistCount()
  })
}

// Load related products
function loadRelatedProducts() {
  const container = document.getElementById("relatedProducts")
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []

  relatedProducts.forEach((product) => {
    const isInWishlist = wishlist.some((item) => item.id === product.id)
    const heartClass = isInWishlist ? "fas" : "far"

    const productCard = `
            <div class="product-card fade-in" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="wishlist-btn ${isInWishlist ? "active" : ""}" data-product-id="${product.id}">
                        <i class="${heartClass} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <span class="product-category">${product.category}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span>${product.rating}</span>
                    </div>
                    <div class="product-footer">
                        <span class="product-price">${product.price}€</span>
                        <button class="btn-add" onclick="addToCartQuick(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `

    container.innerHTML += productCard
  })

  // Setup wishlist buttons for related products
  document.querySelectorAll(".product-card .wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation()
      const productId = Number.parseInt(this.dataset.productId)
      toggleWishlistQuick(productId)
    })
  })
}

// Quick add to cart for related products
function addToCartQuick(id, name, price, image) {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const existingIndex = cart.findIndex((item) => item.id === id)

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  localStorage.setItem("cart", JSON.stringify(cart))
  updateCartCount()
  showToast("Produit ajouté au panier !")
}

// Quick wishlist toggle for related products
function toggleWishlistQuick(productId) {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const product = relatedProducts.find((p) => p.id === productId)
  const existingIndex = wishlist.findIndex((item) => item.id === productId)

  const btn = document.querySelector(`.product-card .wishlist-btn[data-product-id="${productId}"]`)
  const icon = btn.querySelector("i")

  if (existingIndex !== -1) {
    wishlist.splice(existingIndex, 1)
    btn.classList.remove("active")
    icon.classList.remove("fas")
    icon.classList.add("far")
    showToast("Retiré des favoris")
  } else {
    wishlist.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      rating: product.rating,
    })
    btn.classList.add("active")
    icon.classList.remove("far")
    icon.classList.add("fas")
    showToast("Ajouté aux favoris !")
  }

  localStorage.setItem("wishlist", JSON.stringify(wishlist))
  updateWishlistCount()
}

// Generate stars HTML
function generateStars(rating) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0
  let starsHtml = ""

  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>'
  }

  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>'
  }

  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>'
  }

  return starsHtml
}

// Update cart count in header
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const cartCountElement = document.getElementById("cartCount")
  if (cartCountElement) {
    cartCountElement.textContent = totalItems
  }
}

// Update wishlist count in header
function updateWishlistCount() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || []
  const wishlistCountElement = document.getElementById("wishlistCount")
  if (wishlistCountElement) {
    wishlistCountElement.textContent = wishlist.length
  }
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast")
  const toastMessage = document.getElementById("toastMessage")

  toastMessage.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, 3000)
}

// Cart button redirect
document.getElementById("cartBtn")?.addEventListener("click", () => {
  window.location.href = "panier.html"
})
