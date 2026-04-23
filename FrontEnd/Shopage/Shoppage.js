// App State
const state = {
    currentImageIndex: 0,
    quantity: 1,
    selectedSize: 'small',
    selectedTab: 'additional',
    currentProductIndex: 0,
};

// Product images
const productImages = [
    'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1481687727648-08e5f80f6bf0?w=800&h=800&fit=crop'
];

let refreshMoreCarousel = null;

const DEFAULT_PLANT_IMAGE = (window.GHPlantData && window.GHPlantData.DEFAULT_PLANT_IMAGE)
    || 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const PLANT_API = {
    async getPlantInventory() {
        try {
            // Fetch all plants
            const plants = await fetch('http://localhost:5007/api/plant').then(r => r.json());
            // Fetch all plant sizes (for pricing and stock)
            const sizes = await fetch('http://localhost:5007/api/plantsize').then(r => r.json());
            // Fetch all categories (for category names)
            const categories = await fetch('http://localhost:5007/api/category').then(r => r.json());
            
            // Create a map of category_id to category_name
            const categoryMap = {};
            if (Array.isArray(categories)) {
                categories.forEach(cat => {
                    categoryMap[cat.category_id] = cat.category_name || `Category ${cat.category_id}`;
                });
            }
            
            // Create a map of plant_id to first available size (for pricing/stock)
            const plantSizeMap = {};
            if (Array.isArray(sizes)) {
                sizes.forEach(size => {
                    if (size.plant_id && !plantSizeMap[size.plant_id]) {
                        plantSizeMap[size.plant_id] = size;
                    }
                });
            }
            
            // Combine plant and size data
            return plants.map(p => {
                const sizeData = plantSizeMap[p.plant_id] || { price: 0, stock_quantity: 0 };
                const categoryName = categoryMap[p.category_id] || 'General';
                return {
                    id: p.plant_id,
                    name: p.plant_name,
                    price: sizeData.price || 0,
                    category: categoryName,
                    image: p.image_path || p.image || DEFAULT_PLANT_IMAGE,
                    stock: sizeData.stock_quantity || 0
                };
            });
        } catch (error) {
            console.error('Failed to fetch plant inventory:', error);
            return [];
        }
    },

    getEffectiveStock(plant) {
        return plant.stock || 0;
    },

    isInStock(plant) {
        return (plant.stock || 0) > 0;
    }
};

// Fetch categories from database at runtime
let categoryDisplayMap = {};
let categoryImageMap = {};
let categoriesLoaded = false;

// Default fallback image map
const DEFAULT_CATEGORY_IMAGES = {
    'Citrus': 'https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Coconut': 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Mango': 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Guava': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=680&q=80',
    'Grafted': 'https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Forest': 'https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Flowering': 'https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Cuttings': 'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=680&q=80'
};

// Function to load categories from backend
async function loadCategoriesFromBackend() {
    try {
        const categories = await categoriesAPI.getAll();
        if (Array.isArray(categories) && categories.length > 0) {
            categories.forEach(cat => {
                const displayName = cat.category_name || cat.name || cat.category_id;
                categoryDisplayMap[displayName] = displayName;
                categoryImageMap[displayName] = cat.image || DEFAULT_CATEGORY_IMAGES[displayName] || DEFAULT_PLANT_IMAGE;
            });
            categoriesLoaded = true;
            console.log('✓ Categories loaded from backend:', categoryDisplayMap);
            return;
        }
    } catch (error) {
        console.warn('Failed to load categories from API, using fallback:', error);
    }
    
    // Fallback to default categories if API fails
    categoryDisplayMap = {
        'Citrus': 'Citrus',
        'Coconut': 'Coconut',
        'Mango': 'Mango',
        'Guava': 'Guava',
        'Grafted': 'Grafted',
        'Forest': 'Forest',
        'Flowering': 'Flowering',
        'Cuttings': 'Cuttings'
    };
    categoryImageMap = DEFAULT_CATEGORY_IMAGES;
    categoriesLoaded = true;
}

let allPlantsPool = [];
let products = [];
let currentBasePlants = [];
let currentPlantsMeta = {
    title: 'Preferred Plants',
    subtitle: 'Showing random plants from our collection.'
};

async function buildAllPlantsPool() {
    const inventory = await PLANT_API.getPlantInventory();
    return inventory.map((plant) => {
        // Use the category directly from the plant data
        // (it's already resolved from category_id in PLANT_API.getPlantInventory)
        const displayCategory = plant.category;
        const categoryImage = categoryImageMap[displayCategory] || DEFAULT_PLANT_IMAGE;

        return {
            id: String(plant.id),
            name: plant.name,
            price: plant.price,
            category: displayCategory,
            sourceCategory: displayCategory,
            image: plant.image || categoryImage,
            availableStock: PLANT_API ? PLANT_API.getEffectiveStock(plant) : 0,
            inStock: PLANT_API ? PLANT_API.isInStock(plant) : false
        };
    });
}

async function refreshPlantsData() {
    allPlantsPool = await buildAllPlantsPool();
    products = getRandomPlants(Math.min(12, allPlantsPool.length));
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    // Load categories first from backend
    await loadCategoriesFromBackend();
    
    // Then load plants
    await refreshPlantsData();
    initAllPlantsSection();
    initProductImageCarousel();
    initQuantityControls();
    initSizeButtons();
    initTabs();
    initMoreProductsCarousel();
    initMorePlantsToggle();
    initAddToCartToast();
    initFooter();
});

function getRandomPlants(count) {
    const shuffled = [...allPlantsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function buildProductDetailUrl(plant) {
    const params = new URLSearchParams({
        id: String(plant.id || ''),
        name: plant.name,
        category: plant.sourceCategory || plant.category,
        image: plant.image,
        price: String(plant.price || 250)
    });

    return `product-detail.html?${params.toString()}`;
}

function getPreferredPlants(count) {
    return getRandomPlants(Math.min(count, allPlantsPool.length));
}

function formatPeso(value) {
    const amount = Number(value || 0);
    return `P${amount.toLocaleString('en-PH')}`;
}

function getShopControlsState() {
    const searchInput = document.getElementById('shopSearchInput');
    const sortSelect = document.getElementById('sortProductsSelect');

    return {
        query: (searchInput?.value || '').trim().toLowerCase(),
        sortValue: sortSelect?.value || 'default'
    };
}

function applyShopControls() {
    const { query, sortValue } = getShopControlsState();

    const sourcePlants = currentBasePlants.length ? currentBasePlants : getPreferredPlants(10);

    const filtered = sourcePlants.filter((plant) => {
        const nameMatch = plant.name.toLowerCase().includes(query);

        return nameMatch;
    });

    if (sortValue === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'price-asc') {
        filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }

    const title = currentPlantsMeta.title || 'Preferred Plants';
    const subtitle = currentPlantsMeta.subtitle || 'Showing our preferred picks.';

    renderPlants(filtered, title, subtitle);
}

function setPlantsBase(list, title, subtitle) {
    currentBasePlants = [...list];
    currentPlantsMeta = { title, subtitle };
    applyShopControls();
}

function renderPlants(plantList, title, subtitle) {
    const grid = document.getElementById('allPlantsGrid');
    const titleEl = document.querySelector('.all-plants-title');
    const subtitleEl = document.querySelector('.all-plants-subtitle');

    if (!grid) {
        return;
    }

    if (titleEl) {
        titleEl.textContent = title;
    }

    if (subtitleEl) {
        subtitleEl.textContent = subtitle;
    }

    if (!plantList.length) {
        grid.innerHTML = '<p class="all-plants-subtitle">No plants found in this category yet.</p>';
        return;
    }

    grid.innerHTML = plantList.map((plant) => {
        return `
            <a class="all-plant-card ${plant.inStock ? '' : 'out'}" href="${buildProductDetailUrl(plant)}">
                <img src="${plant.image}" alt="${plant.name}" class="all-plant-image">
                <div class="all-plant-content">
                    <h3 class="all-plant-name">${plant.name}</h3>
                    <p class="all-plant-price">${formatPeso(plant.price)}</p>
                    <p class="all-plant-category">${plant.category}</p>
                    <p class="all-plant-stock ${plant.inStock ? 'in' : 'out'}">${plant.inStock ? `${plant.availableStock} available` : 'Out of Stock'}</p>
                </div>
            </a>
        `;
    }).join('');
}

function renderPreferredPlants() {
    const preferredPlants = getPreferredPlants(10);
    setPlantsBase(
        preferredPlants,
        'Preferred Plants',
        `Showing ${preferredPlants.length} random plants from our collection.`
    );
}

function renderAllPlants() {
    setPlantsBase(
        [...allPlantsPool],
        'All Plants',
        'Showing all available plants.'
    );
}

function normalizeCategoryName(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function renderPlantsByCategory(categoryKey) {
    const normalized = normalizeCategoryName(categoryKey);
    const plants = allPlantsPool.filter((plant) => {
        const plantCategory = normalizeCategoryName(plant.category);

        return plantCategory === normalized;
    });

    const prettyLabel = categoryKey
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    setPlantsBase(
        plants,
        `${prettyLabel} Plants`,
        `Showing all plants under ${prettyLabel}.`
    );
}

function initShopControls() {
    const searchInput = document.getElementById('shopSearchInput');
    const searchBtn = document.getElementById('shopSearchBtn');
    const sortSelect = document.getElementById('sortProductsSelect');

    if (!searchInput || !searchBtn || !sortSelect) {
        return;
    }

    searchBtn.addEventListener('click', applyShopControls);
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            applyShopControls();
        }
    });

    sortSelect.addEventListener('change', applyShopControls);
}

function initAllPlantsSection() {
    const categoryChips = document.querySelectorAll('.shop-category-chip[data-category]');
    const allPlantsSection = document.getElementById('allPlantsSection');

    initShopControls();

    // Check for incoming category filter from URL (e.g. from landing page category cards)
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategory = (urlParams.get('category') || '').trim();

    if (urlCategory && urlCategory !== 'all' && urlCategory !== 'all-plants') {
        // Activate matching chip visually
        categoryChips.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.category === urlCategory);
        });
        renderPlantsByCategory(urlCategory);
        // Scroll to plant grid after a short delay so the page has rendered
        setTimeout(function() {
            if (allPlantsSection) allPlantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    } else if (urlCategory === 'all-plants') {
        categoryChips.forEach(chip => {
            chip.classList.toggle('active', chip.dataset.category === 'all-plants');
        });
        renderAllPlants();
    } else {
        renderPreferredPlants();
    }

    if (!categoryChips.length || !allPlantsSection) {
        return;
    }

    categoryChips.forEach((chip) => {
        chip.addEventListener('click', function(event) {
            event.preventDefault();

            categoryChips.forEach(item => item.classList.remove('active'));
            chip.classList.add('active');

            const selected = chip.dataset.category;
            if (selected === 'all') {
                renderPreferredPlants();
            } else if (selected === 'all-plants') {
                renderAllPlants();
            } else {
                renderPlantsByCategory(selected);
            }

            allPlantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// Product Image Carousel
function initProductImageCarousel() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.getElementById('thumbnails');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');

    if (!mainImage || !prevBtn || !nextBtn) {
        return;
    }
    
    if (thumbnailsContainer) {
        productImages.forEach((img, index) => {
            const thumbDiv = document.createElement('div');
            thumbDiv.className = `thumbnail ${index === state.currentImageIndex ? 'active' : ''}`;
            thumbDiv.onclick = () => selectImage(index);
            
            const thumbImg = document.createElement('img');
            thumbImg.src = img;
            thumbImg.alt = `Thumbnail ${index + 1}`;
            
            thumbDiv.appendChild(thumbImg);
            thumbnailsContainer.appendChild(thumbDiv);
        });
    }
    
    // Navigation buttons
    prevBtn.onclick = () => {
        state.currentImageIndex = (state.currentImageIndex - 1 + productImages.length) % productImages.length;
        updateMainImage();
    };
    
    nextBtn.onclick = () => {
        state.currentImageIndex = (state.currentImageIndex + 1) % productImages.length;
        updateMainImage();
    };
    
    function selectImage(index) {
        state.currentImageIndex = index;
        updateMainImage();
    }
    
    function updateMainImage() {
        mainImage.src = productImages[state.currentImageIndex];
        
        // Update thumbnail active state
        const thumbnails = document.querySelectorAll('.thumbnail');
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === state.currentImageIndex);
        });
    }
}

// Quantity Controls
function initQuantityControls() {
    const quantityValue = document.getElementById('quantityValue');
    const decrementBtn = document.getElementById('decrementBtn');
    const incrementBtn = document.getElementById('incrementBtn');

    if (!quantityValue || !decrementBtn || !incrementBtn) {
        return;
    }
    
    decrementBtn.onclick = () => {
        if (state.quantity > 1) {
            state.quantity--;
            quantityValue.textContent = state.quantity;
        }
    };
    
    incrementBtn.onclick = () => {
        state.quantity++;
        quantityValue.textContent = state.quantity;
    };
}

// Size Buttons
function initSizeButtons() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    
    sizeButtons.forEach(btn => {
        btn.onclick = () => {
            const size = btn.dataset.size;
            state.selectedSize = size;
            
            // Update active state
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
    });
}

// Tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const additionalTab = document.getElementById('additionalTab');
    const reviewsTab = document.getElementById('reviewsTab');

    if (!tabButtons.length || !additionalTab || !reviewsTab) {
        return;
    }
    
    tabButtons.forEach(btn => {
        btn.onclick = () => {
            const tab = btn.dataset.tab;
            state.selectedTab = tab;
            
            // Update button states
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide content
            if (tab === 'additional') {
                additionalTab.classList.add('active');
                reviewsTab.classList.remove('active');
            } else {
                additionalTab.classList.remove('active');
                reviewsTab.classList.add('active');
            }
        };
    });
}

// More Products Carousel
function initMoreProductsCarousel() {
    const carouselContainer = document.getElementById('productCarousel');
    const progressContainer = document.getElementById('carouselProgress');
    const prevBtn = document.getElementById('prevProductBtn');
    const nextBtn = document.getElementById('nextProductBtn');

    if (!carouselContainer || !progressContainer || !prevBtn || !nextBtn) {
        return;
    }
    
    // Generate product items
    products.forEach((product, index) => {
        const productDetailUrl = buildProductDetailUrl(product);
        const item = document.createElement('div');
        item.className = `carousel-item ${index === state.currentProductIndex ? 'center' : ''}`;
        item.innerHTML = `
            <a class="carousel-item-link" href="${productDetailUrl}">
                <article class="carousel-item-card">
                    <div class="carousel-image-wrap">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-actions" aria-hidden="true">
                            <span class="product-action-icon">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="9" cy="20" r="1"></circle>
                                    <circle cx="19" cy="20" r="1"></circle>
                                    <path d="M3 4h2l2 12h12l2-8H7"></path>
                                </svg>
                            </span>
                        </div>
                    </div>
                </article>
            </a>
        `;
        carouselContainer.appendChild(item);
    });
    
    // Generate progress indicators
    products.forEach((_, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = `progress-bar ${index === state.currentProductIndex ? 'active' : ''}`;
        progressContainer.appendChild(progressBar);
    });
    
    // Navigation
    prevBtn.onclick = () => {
        state.currentProductIndex = (state.currentProductIndex - 1 + products.length) % products.length;
        updateCarousel();
    };
    
    nextBtn.onclick = () => {
        state.currentProductIndex = (state.currentProductIndex + 1) % products.length;
        updateCarousel();
    };

    updateCarousel(true);

    refreshMoreCarousel = () => {
        updateCarousel(true);
    };
    
    function updateCarousel(isInstant = false) {
        // Update product items
        const items = document.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.classList.toggle('center', index === state.currentProductIndex);
        });
        
        // Update progress bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach((bar, index) => {
            bar.classList.toggle('active', index === state.currentProductIndex);
        });

        const activeItem = items[state.currentProductIndex];
        if (!activeItem) {
            return;
        }

        const targetScrollLeft = Math.max(
            0,
            activeItem.offsetLeft - (carouselContainer.clientWidth / 2) + (activeItem.clientWidth / 2)
        );

        carouselContainer.scrollTo({
            left: targetScrollLeft,
            behavior: isInstant ? 'auto' : 'smooth'
        });
    }
}

function initMorePlantsToggle() {
    const moreToggleBtn = document.getElementById('moreToggleBtn');
    const morePlantsPanel = document.getElementById('morePlantsPanel');

    if (!moreToggleBtn || !morePlantsPanel) {
        return;
    }

    moreToggleBtn.addEventListener('click', () => {
        const willExpand = morePlantsPanel.hidden;
        morePlantsPanel.hidden = !willExpand;
        moreToggleBtn.setAttribute('aria-expanded', String(willExpand));
        moreToggleBtn.classList.toggle('expanded', willExpand);

        if (willExpand && typeof refreshMoreCarousel === 'function') {
            requestAnimationFrame(() => {
                refreshMoreCarousel();
            });
        }
    });
}

function initAddToCartToast() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    if (!addToCartBtn) {
        return;
    }

    addToCartBtn.addEventListener('click', () => {
        showAddToCartToast();
    });
}

function showAddToCartToast() {
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) {
        existingToast.remove();
    }

    const productTitle = document.querySelector('.product-title')?.textContent?.trim() || 'Plant Item';
    const selectedSizeLabel = state.selectedSize.charAt(0).toUpperCase() + state.selectedSize.slice(1);
    const productImage = productImages[state.currentImageIndex];

    // Save to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cart.find(item => item.name === productTitle);
    
    if (existingItem) {
        // If item already in cart, increase quantity
        existingItem.quantity += state.quantity;
    } else {
        // Add new item to cart with a generated ID based on the name
        const newId = Math.max(0, ...cart.map(item => item.id || 0)) + 1;
        cart.push({
            id: newId,
            name: productTitle,
            price: 999, // Default price for shop page products
            image: productImage,
            quantity: state.quantity,
            size: state.selectedSize,
            category: 'Shop'
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));

    const toast = document.createElement('aside');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <button class="cart-toast-close" type="button" aria-label="Close">×</button>
        <p class="cart-toast-title">Just added to your cart</p>
        <div class="cart-toast-content">
            <img src="${productImage}" alt="${productTitle}" class="cart-toast-image">
            <div class="cart-toast-details">
                <p class="cart-toast-product">${productTitle} (${selectedSizeLabel})</p>
                <p class="cart-toast-meta">Qty: ${state.quantity}</p>
            </div>
        </div>
        <a href="../CartPage/cart.html" class="cart-toast-view">VIEW CART</a>
        <button class="cart-toast-continue" type="button">Continue shopping</button>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    const closeToast = () => {
        toast.classList.remove('show');
        window.setTimeout(() => {
            toast.remove();
        }, 220);
    };

    toast.querySelector('.cart-toast-close')?.addEventListener('click', closeToast);
    toast.querySelector('.cart-toast-continue')?.addEventListener('click', closeToast);

    window.setTimeout(() => {
        if (document.body.contains(toast)) {
            closeToast();
        }
    }, 4500);
}

function initFooter() {
    const backToTopButton = document.querySelector('.footer-back-to-top');
    if (!backToTopButton) {
        return;
    }

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
