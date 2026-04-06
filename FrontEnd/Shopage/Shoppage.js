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

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const reservationPlantsByCategory = {
    'Fruit Bearing': [
        ['Rambutan RR Tuklapin', 250], ['Mangosteen', 350], ['Lansones Longkong', 350], ['Durian Puyat', 300],
        ['Sweet Tamarind', 250], ['Bangkok Santol', 250], ["Dian't Duhat", 250], ['Sweet Balimbing', 250],
        ['Atis', 300], ['Chico', 300], ['Macopa Red', 260], ['Avocado Lagkitan', 350], ['Cacao', 200]
    ],
    'Citrus Variety': [
        ['Japanese Orange', 300], ['Davao Pomelo', 250], ['Satsuma Citrus', 250], ['Dalanghita', 250],
        ['Dayap', 250], ['Calamansi', 200], ['Kiat Kiat', 300], ['Poncan', 250], ['Lemon Meyer', 250]
    ],
    'Mangga Variety': [
        ['Carabao Manggo', 350], ['Queen Manggo', 350], ['Sweet Catimon', 350], ['Sweet Catimon Double Rootstock', 800],
        ['Indian Manggo', 250], ['King Manggo', 350], ['Purple Manggo', 350], ['Apple Manggo', 250]
    ],
    'Dwarf Coconut': [
        ['Golden', 400], ['Tacunan Variety', 550], ['Catigan Variety', 250]
    ],
    'Cuttings/Dwarf': [
        ['Red Guaple', 200], ['Green Guaple', 200], ['Marang', 250], ['Lychee', 350], ['Langka', 200], ['Hybrid Mulberry', 200],
        ['Paminta', 250], ['Red Cardinal Grapes', 250], ['Miracle Fruit', 300], ['Magic Fruit', 300], ['Sweet Guyabano', 300],
        ['Karamay', 300], ['Sarguelas/Siniguelas', 300], ['Abiu', 300], ['Caimito', 250], ['Mabolo', 300], ['Cacao', 200],
        ['Kamias/Pias', 250], ['Bignay', 250], ['Pomegranate', 300], ['Longan', 300]
    ],
    'Flowering Trees': [
        ['Golden Trumpet', 700], ['Pink Trumpet', 800], ['Golden Shower', 900], ['Fire Tree', 1200], ['Ilang Ilang', 700],
        ['Jacaranda', 1000], ['Pine Tree', 1200], ['Palm Tree', 1500], ['Dates Palm', 1500], ['Dates Palm Bull Out', 5500],
        ['Palawan Cherry Blossom 3ft', 450], ['Palawan Cherry Blossom Bull Out', 3500]
    ],
    'Forest Trees': [
        ['Gemelina', 250], ['Mahogany', 350], ['Narra', 350], ['Molave', 250], ['Pole Bamboo', 550], ['Thai Bamboo', 550]
    ],
    'Others': [
        ['Arabica Coffee', 150], ['Robusta', 150], ['Barako', 150]
    ]
};

const categoryDisplayMap = {
    'Fruit Bearing': 'Fruit Bearing',
    'Citrus Variety': 'Citrus',
    'Mangga Variety': 'Mango',
    'Dwarf Coconut': 'Coconut',
    'Cuttings/Dwarf': 'Guava',
    'Flowering Trees': 'Flowering',
    'Forest Trees': 'Forest',
    'Others': 'Others'
};

const categoryImageMap = {
    'Fruit Bearing': 'https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Citrus Variety': 'https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Mangga Variety': 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Dwarf Coconut': 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Cuttings/Dwarf': 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=680&q=80',
    'Flowering Trees': 'https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Forest Trees': 'https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    'Others': DEFAULT_PLANT_IMAGE
};

const allPlantsPool = Object.entries(reservationPlantsByCategory).flatMap(([reservationCategory, plants]) => {
    const displayCategory = categoryDisplayMap[reservationCategory] || reservationCategory;
    const categoryImage = categoryImageMap[reservationCategory] || DEFAULT_PLANT_IMAGE;

    return plants.map(([name, price], index) => ({
        id: `${reservationCategory}-${index}`,
        name,
        price,
        category: displayCategory,
        sourceCategory: reservationCategory,
        image: categoryImage
    }));
});

const products = getRandomPlants(Math.min(12, allPlantsPool.length)).map((plant, index) => ({
    id: index + 1,
    name: plant.name,
    image: plant.image,
    category: plant.category,
    price: plant.price
}));

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
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
        name: plant.name,
        category: plant.category,
        image: plant.image,
        price: String(plant.price || 250)
    });

    return `product-detail.html?${params.toString()}`;
}

function getPreferredPlants(count) {
    return getRandomPlants(Math.min(count, allPlantsPool.length));
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
            <a class="all-plant-card" href="${buildProductDetailUrl(plant)}">
                <img src="${plant.image}" alt="${plant.name}" class="all-plant-image">
                <div class="all-plant-content">
                    <h3 class="all-plant-name">${plant.name}</h3>
                    <p class="all-plant-category">${plant.category}</p>
                </div>
            </a>
        `;
    }).join('');
}

function renderPreferredPlants() {
    const preferredPlants = getPreferredPlants(10);
    renderPlants(
        preferredPlants,
        'Preferred Plants',
        `Showing ${preferredPlants.length} random plants from our collection.`
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

    renderPlants(
        plants,
        `${prettyLabel} Plants`,
        `Showing all plants under ${prettyLabel}.`
    );
}

function initAllPlantsSection() {
    renderPreferredPlants();

    const categoryChips = document.querySelectorAll('.shop-category-chip[data-category]');
    const allPlantsSection = document.getElementById('allPlantsSection');

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
    const cart = JSON.parse(localStorage.getItem('reservations') || '[]');
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
    
    localStorage.setItem('reservations', JSON.stringify(cart));

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
