// Extended product database for catalogue
const allProducts = [
  {
    id: 1,
    name: "Château Margaux 2015",
    type: "vin",
    region: "france",
    price: 850,
    rating: 4.9,
    image: "public/chateau-margaux-wine-bottle.png",
    description: "Grand Cru Classé",
    alcohol_percent: 13.5,
    category: "Vin Rouge",
  },
  {
    id: 2,
    name: "Dom Pérignon 2012",
    type: "champagne",
    region: "france",
    price: 280,
    rating: 4.8,
    image: "public/dom-perignon-champagne-bottle-gold.jpg",
    description: "Champagne Millésimé",
    alcohol_percent: 12.5,
    category: "Champagne",
  },
  {
    id: 3,
    name: "Macallan 25 ans",
    type: "whisky",
    region: "ecosse",
    price: 2400,
    rating: 5.0,
    image: "public/macallan-25-whisky-bottle.jpg",
    description: "Single Malt Exceptionnel",
    alcohol_percent: 43,
    category: "Whisky",
  },
  {
    id: 4,
    name: "Hennessy Paradis",
    type: "cognac",
    region: "france",
    price: 1200,
    rating: 4.9,
    image: "public/hennessy-paradis-cognac-bottle.jpg",
    description: "Cognac d'Exception",
  },
  {
    id: 5,
    name: "Hibiki 21 ans",
    type: "whisky",
    region: "japon",
    price: 1800,
    rating: 4.9,
    image: "public/hibiki-21-japanese-whisky.jpg",
    description: "Whisky Japonais Premium",
  },
  {
    id: 6,
    name: "Grey Goose Magnum",
    type: "vodka",
    region: "france",
    price: 95,
    rating: 4.5,
    image: "public/grey-goose-vodka.png",
    description: "Vodka Premium",
  },
  {
    id: 7,
    name: "Monkey 47 Gin",
    type: "gin",
    region: "france",
    price: 65,
    rating: 4.7,
    image: "public/monkey-47-gin-bottle.jpg",
    description: "Gin Artisanal",
  },
  {
    id: 8,
    name: "Diplomático Reserva",
    type: "rhum",
    region: "france",
    price: 78,
    rating: 4.6,
    image: "public/diplomatico-rum-bottle-dark.jpg",
    description: "Rhum Vénézuélien",
  },
  {
    id: 9,
    name: "Pétrus 2010",
    type: "vin",
    region: "france",
    price: 3200,
    rating: 5.0,
    image: "public/petrus-wine-bottle-bordeaux.jpg",
    description: "Pomerol Mythique",
  },
  {
    id: 10,
    name: "Krug Grande Cuvée",
    type: "champagne",
    region: "france",
    price: 320,
    rating: 4.8,
    image: "public/krug-champagne-bottle-luxury.jpg",
    description: "Champagne Prestige",
  },
  {
    id: 11,
    name: "Glenfiddich 30 ans",
    type: "whisky",
    region: "ecosse",
    price: 950,
    rating: 4.8,
    image: "public/glenfiddich-30-whisky-bottle.jpg",
    description: "Single Malt Rare",
  },
  {
    id: 12,
    name: "Louis XIII Cognac",
    type: "cognac",
    region: "france",
    price: 3800,
    rating: 5.0,
    image: "public/louis-xiii-cognac-crystal-bottle.jpg",
    description: "Le Roi des Cognacs",
  },
  {
    id: 13,
    name: "Barolo Riserva 2013",
    type: "vin",
    region: "italie",
    price: 180,
    rating: 4.7,
    image: "public/barolo-wine-bottle-italian.jpg",
    description: "Roi des Vins Italiens",
  },
  {
    id: 14,
    name: "Belvedere Intense",
    type: "vodka",
    region: "france",
    price: 120,
    rating: 4.6,
    image: "public/belvedere-vodka.png",
    description: "Vodka Polonaise",
  },
  {
    id: 15,
    name: "Hendrick's Orbium",
    type: "gin",
    region: "ecosse",
    price: 55,
    rating: 4.5,
    image: "public/hendricks-orbium-gin-bottle.jpg",
    description: "Gin Écossais",
  },
  {
    id: 16,
    name: "Zacapa XO",
    type: "rhum",
    region: "france",
    price: 180,
    rating: 4.8,
    image: "public/zacapa-xo-rum-bottle.jpg",
    description: "Rhum Guatémaltèque",
  },
  {
    id: 17,
    name: "Opus One 2016",
    type: "vin",
    region: "usa",
    price: 420,
    rating: 4.8,
    image: "public/opus-one-wine-bottle-napa-valley.jpg",
    description: "Napa Valley Prestige",
  },
  {
    id: 18,
    name: "Bollinger La Grande",
    type: "champagne",
    region: "france",
    price: 195,
    rating: 4.7,
    image: "public/bollinger-champagne-bottle.jpg",
    description: "Champagne d'Excellence",
  },
  {
    id: 19,
    name: "Lagavulin 16 ans",
    type: "whisky",
    region: "ecosse",
    price: 110,
    rating: 4.7,
    image: "public/lugavulun6659.jpg",
    description: "Islay Tourbé",
  },
  {
    id: 20,
    name: "Martell Cordon Bleu",
    type: "cognac",
    region: "france",
    price: 240,
    rating: 4.6,
    image: "public/martel65.jpg",
    description: "Cognac Légendaire",
  },
  {
    id: 21,
    name: "Yamazaki 18 ans",
    type: "whisky",
    region: "japon",
    price: 1600,
    rating: 4.9,
    image: "public/yamazakib479.jpg",
    description: "Single Malt Japonais",
  },
  {
    id: 22,
    name: "Ciroc Black Raspberry",
    type: "vodka",
    region: "france",
    price: 75,
    rating: 4.4,
    image: "public/black_raberi1.jpg",
    description: "Vodka Française",
  },
  {
    id: 23,
    name: "The Botanist Gin",
    type: "gin",
    region: "ecosse",
    price: 48,
    rating: 4.6,
    image: "public/botaniste0.jpg",
    description: "Gin Islay Botanique",
  },
  {
    id: 24,
    name: "Mount Gay XO",
    type: "rhum",
    region: "france",
    price: 95,
    rating: 4.5,
    image: "public/mount_xo.jpg",
    description: "Rhum Barbade Premium",
  },
]

let filteredProducts = [...allProducts]
let currentFilters = {
  type: [],
  price: null,
  region: [],
}

// Initialize catalogue
document.addEventListener("DOMContentLoaded", () => {
  renderProducts(filteredProducts)
  initializeFilters()
  updateResultsCount()
})

function renderProducts(products) {
  const grid = document.getElementById("products-grid")
  grid.innerHTML = ""

  products.forEach((product, index) => {
    const card = document.createElement("div")
    card.className = "product-card fade-in"
    card.style.animationDelay = `${index * 0.1}s`
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
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span class="product-category">${product.category || 'Non spécifié'}</span>
                    <span class="product-alcohol">${product.alcohol_percent ? product.alcohol_percent + '%' : 'N/A'}</span>
                </div>
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

function initializeFilters() {
  // Type filters
  document.querySelectorAll('input[data-filter="type"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (this.checked) {
        currentFilters.type.push(this.value)
      } else {
        currentFilters.type = currentFilters.type.filter((t) => t !== this.value)
      }
      applyFilters()
    })
  })

  // Price filters
  document.querySelectorAll('input[data-filter="price"]').forEach((input) => {
    input.addEventListener("change", function () {
      currentFilters.price = this.value
      applyFilters()
    })
  })

  // Region filters
  document.querySelectorAll('input[data-filter="region"]').forEach((input) => {
    input.addEventListener("change", function () {
      if (this.checked) {
        currentFilters.region.push(this.value)
      } else {
        currentFilters.region = currentFilters.region.filter((r) => r !== this.value)
      }
      applyFilters()
    })
  })

  // Sort
  document.getElementById("sort-select").addEventListener("change", function () {
    sortProducts(this.value)
  })

  // Reset
  document.getElementById("reset-filters").addEventListener("click", resetFilters)
}

function applyFilters() {
  filteredProducts = allProducts.filter((product) => {
    // Type filter
    if (currentFilters.type.length > 0 && !currentFilters.type.includes(product.type)) {
      return false
    }

    // Price filter
    if (currentFilters.price) {
      const [min, max] = currentFilters.price.split("-").map((p) => {
        if (p === "500+") return [500, Number.POSITIVE_INFINITY]
        return Number.parseInt(p)
      })
      if (currentFilters.price === "500+") {
        if (product.price < 500) return false
      } else {
        const [minPrice, maxPrice] = currentFilters.price.split("-").map((p) => Number.parseInt(p))
        if (product.price < minPrice || product.price > maxPrice) return false
      }
    }

    // Region filter
    if (currentFilters.region.length > 0 && !currentFilters.region.includes(product.region)) {
      return false
    }

    return true
  })

  renderProducts(filteredProducts)
  updateResultsCount()
}

function sortProducts(sortBy) {
  switch (sortBy) {
    case "price-asc":
      filteredProducts.sort((a, b) => a.price - b.price)
      break
    case "price-desc":
      filteredProducts.sort((a, b) => b.price - a.price)
      break
    case "name":
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
      break
    case "rating":
      filteredProducts.sort((a, b) => b.rating - a.rating)
      break
    default:
      filteredProducts = [...allProducts]
  }
  renderProducts(filteredProducts)
}

function resetFilters() {
  currentFilters = { type: [], price: null, region: [] }
  document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
    input.checked = false
  })
  document.getElementById("sort-select").value = "featured"
  filteredProducts = [...allProducts]
  renderProducts(filteredProducts)
  updateResultsCount()
}

function updateResultsCount() {
  document.getElementById("results-count").textContent = filteredProducts.length
}
