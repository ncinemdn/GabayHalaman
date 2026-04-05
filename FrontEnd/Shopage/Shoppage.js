// App State
const state = {
    currentImageIndex: 0,
    quantity: 1,
    selectedSize: 'small',
    selectedTab: 'additional',
    currentProductIndex: 1, // Start with middle product (Calamansi)
};

// Product images
const productImages = [
    'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1481687727648-08e5f80f6bf0?w=800&h=800&fit=crop'
];

// More products data
const products = [
    {
        id: 1,
        name: 'Calamansi Plant',
        image: 'https://images.unsplash.com/photo-1591958911259-bee2173bdccc?w=600&h=600&fit=crop',
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        id: 2,
        name: 'Palm Plant',
        image: 'https://images.unsplash.com/photo-1545165375-5f08d2eb73e2?w=600&h=600&fit=crop',
        rating: '⭐⭐⭐⭐⭐'
    },
    {
        id: 3,
        name: 'Decorative Plant',
        image: 'https://images.unsplash.com/photo-1506804749661-b288ff6f9f55?w=600&h=600&fit=crop',
        rating: '⭐⭐⭐⭐⭐'
    }
];

const allPlantsPool = [
    { name: 'Hybrid Coconut', category: 'Coconut', image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Golden Coconut', category: 'Coconut', image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Carabao Mango', category: 'Mango', image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Sweet Catimon Mango', category: 'Mango', image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Guapple', category: 'Guava', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=680&q=80' },
    { name: 'Calamansi', category: 'Citrus', image: 'https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Suha Davao', category: 'Citrus', image: 'https://images.unsplash.com/photo-1655082291675-b919ca1c3419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Yellow Lemon', category: 'Citrus', image: 'https://images.unsplash.com/photo-1585931158785-8e8b240c627f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Mangosteen', category: 'Other Varieties', image: 'https://images.unsplash.com/photo-1706698352015-a907c7f8a445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Lychee', category: 'Other Varieties', image: 'https://images.unsplash.com/photo-1705335834319-92a152363ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Rambutan (RR)', category: 'Other Varieties', image: 'https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Sweet Tamarind', category: 'Other Varieties', image: 'https://images.unsplash.com/photo-1597081779002-314055fe24ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Mahogany', category: 'Forest', image: 'https://images.unsplash.com/photo-1544840281-274ae2755620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Narra', category: 'Forest', image: 'https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Thai Bamboo', category: 'Forest', image: 'https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Golden Trumpet', category: 'Flowering', image: 'https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Pink Trumpet', category: 'Flowering', image: 'https://images.unsplash.com/photo-1760135638379-0e749e10c1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Golden Shower', category: 'Flowering', image: 'https://images.unsplash.com/photo-1683613791927-660d0ed2d86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
    { name: 'Fire Tree', category: 'Flowering', image: 'https://images.unsplash.com/photo-1683356478048-ea3261e194b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
];

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initAllPlantsSection();
    initProductImageCarousel();
    initQuantityControls();
    initSizeButtons();
    initTabs();
    initMoreProductsCarousel();
    initAddToCartToast();
});

function getRandomPlants(count) {
    const shuffled = [...allPlantsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function renderAllPlantsRandom() {
    const grid = document.getElementById('allPlantsGrid');
    if (!grid) {
        return;
    }

    const randomPlants = getRandomPlants(12);
    grid.innerHTML = randomPlants.map((plant) => {
        return `
            <a class="all-plant-card" href="product-detail.html">
                <img src="${plant.image}" alt="${plant.name}" class="all-plant-image">
                <div class="all-plant-content">
                    <h3 class="all-plant-name">${plant.name}</h3>
                    <p class="all-plant-category">${plant.category}</p>
                </div>
            </a>
        `;
    }).join('');
}

function initAllPlantsSection() {
    renderAllPlantsRandom();

    const allPlantsChip = document.getElementById('allPlantsChip');
    const allPlantsSection = document.getElementById('allPlantsSection');

    if (!allPlantsChip || !allPlantsSection) {
        return;
    }

    allPlantsChip.addEventListener('click', function(event) {
        event.preventDefault();
        renderAllPlantsRandom();
        allPlantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}

// Product Image Carousel
function initProductImageCarousel() {
    const mainImage = document.getElementById('mainImage');
    const thumbnailsContainer = document.getElementById('thumbnails');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    
    // Generate thumbnails
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
    
    // Generate product items
    products.forEach((product, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === state.currentProductIndex ? 'center' : ''}`;
        item.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-rating">${product.rating}</div>
            </div>
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
    
    function updateCarousel() {
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
        
        // Scroll to center the active item
        const activeItem = items[state.currentProductIndex];
        const containerRect = carouselContainer.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const scrollLeft = itemRect.left - containerRect.left - (containerRect.width / 2) + (itemRect.width / 2);
        
        carouselContainer.scrollBy({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
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
