const state = {
    currentImageIndex: 0,
    productImages: [],
    quantity: 1,
    selectedSize: 'medium',
    selectedTab: 'additional',
    currentMoreProductIndex: 0,
    currentPlant: null
};

let moreProducts = [];
let refreshMoreCarousel = null;

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
            
            const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
            
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

    getPlantById(id, list) {
        return list.find(p => String(p.id) === String(id));
    },

    getEffectiveStock(plant) {
        return plant.stock || 0;
    },

    isInStock(plant) {
        return (plant.stock || 0) > 0;
    },

    getPlantGallery(category, name, fallback) {
        return fallback ? [fallback] : [];
    }
};

const REVIEW_STORAGE_KEY = 'productDetailReviewsByPlant';

async function getInventory() {
    return await PLANT_API.getPlantInventory();
}

function getPlantStockState(plant) {
    if (!PLANT_API) {
        return { inStock: true, stock: 1 };
    }

    const latest = PLANT_API.getPlantById(plant.id) || plant;
    const stock = PLANT_API.getEffectiveStock(latest);
    return {
        inStock: stock > 0,
        stock
    };
}

function buildPlantFromQuery(urlParams) {
    const name = (urlParams.get('name') || '').trim();
    if (!name) {
        return null;
    }

    const category = (urlParams.get('category') || 'Shop').trim();
    const image = (urlParams.get('image') || '').trim();
    const parsedPrice = Number(urlParams.get('price'));
    const price = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : 250;
    const generatedId = Math.abs(name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0));

    return {
        id: generatedId,
        name,
        category,
        image: image || 'https://images.unsplash.com/photo-1509937528035-ad76254b0356?w=800&h=800&fit=crop',
        price
    };
}

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    await loadPlantData();
    initProductImageCarousel();
    initQuantityControls();
    initSizeButtons();
    initTabs();
    initReviews();
    await initMoreProductsCarousel();
    initMorePlantsToggle();
    initAddToCartToast();
    initBuyNowButton();
    initReserveNowButton();
    initFooter();
});

async function getRandomPlants(count, excludedPlantId) {    
    const flattened = await getInventory();
    const filtered = flattened.filter((plant) => String(plant.id) !== String(excludedPlantId));
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function buildProductDetailUrl(plant) {
    const params = new URLSearchParams({
        id: String(plant.id),
        name: plant.name,
        category: plant.category,
        image: plant.image,
        price: String(plant.price)
    });

    return `product-detail.html?${params.toString()}`;
}

// Load plant data from URL parameters
async function loadPlantData() {
    const urlParams = new URLSearchParams(window.location.search);
    const plantId = String(urlParams.get('id') || '').trim();
    const inventory = await getInventory();

    // Find plant in categories by ID when present
    let foundPlant = null;
    if (plantId) {
        foundPlant = inventory.find(plant => String(plant.id) === plantId) || null;
    }

    // Fallback for category pages that pass plant data as query params
    if (!foundPlant) {
        foundPlant = buildPlantFromQuery(urlParams);
    }
    
    if (!foundPlant) {
        console.error('Plant not found');
        return;
    }
    
    state.currentPlant = foundPlant;
    const stockState = getPlantStockState(foundPlant);
    const numericPlantId = Number(foundPlant.id);
    
    // Update page title and meta
    document.title = `${foundPlant.name} - Gabay Halaman`;
    
    // Update plant details
    document.getElementById('plantName').textContent = foundPlant.name;
    document.getElementById('plantPrice').textContent = `₱${foundPlant.price.toLocaleString()}.00`;
    document.getElementById('plantDescription').textContent = foundPlant.description || 'No description available'
    const stockStatus = document.getElementById('plantStockStatus');
    stockStatus.textContent = stockState.inStock ? `${stockState.stock} available stock` : 'Out of Stock';
    stockStatus.classList.toggle('out', !stockState.inStock);
    document.getElementById('additionalInfo').innerHTML = `
        <p><strong>Category:</strong> ${foundPlant.category}</p>
        <p><strong>Price:</strong> ₱${foundPlant.price.toLocaleString()}.00</p>
        <p><strong>Stock:</strong> ${stockState.inStock ? `${stockState.stock} available` : 'Out of Stock'}</p>
        <p>${foundPlant.description || 'Premium plant selection.'}</p>
        <p><strong>Caring Tips:</strong> Water regularly, ensure proper drainage, and provide appropriate sunlight based on the plant type. Most tropical plants thrive in warm, humid conditions.</p>
        <p><strong>Shipping:</strong> Carefully packaged to ensure safe delivery. Plants arrive in excellent condition.</p>
    `;

    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const reserveBtn = document.querySelector('.reserve-btn');
    const incrementBtn = document.getElementById('incrementBtn');

    if (!stockState.inStock) {
        if (addToCartBtn) addToCartBtn.disabled = true;
        if (buyNowBtn) buyNowBtn.disabled = true;
        if (reserveBtn) {
            reserveBtn.disabled = true;
            reserveBtn.textContent = 'Out of Stock';
        }
        if (incrementBtn) incrementBtn.disabled = true;
    }
    
    state.productImages = PLANT_API
        ? PLANT_API.getPlantGallery(foundPlant.category, foundPlant.name, foundPlant.image)
        : [foundPlant.image];

    // Update main image and thumbnails using the real gallery
    const mainImage = document.getElementById('mainImage');
    mainImage.src = state.productImages[0] || foundPlant.image;
    mainImage.alt = foundPlant.name;

    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    state.productImages.forEach((image, i) => {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = `thumbnail ${i === 0 ? 'active' : ''}`;
        thumbDiv.onclick = () => selectImage(i);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = image;
        thumbImg.alt = `${foundPlant.name} thumbnail ${i + 1}`;
        
        thumbDiv.appendChild(thumbImg);
        thumbnailsContainer.appendChild(thumbDiv);
    });

    state.currentImageIndex = 0;
}

function selectImage(index) {
    if (!state.productImages.length) {
        return;
    }
    state.currentImageIndex = index;
    updateMainImage();
}

function updateMainImage() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (state.productImages.length > 0 && mainImage) {
        mainImage.src = state.productImages[state.currentImageIndex];
    }

    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === state.currentImageIndex);
    });
}

// Product Image Carousel
function initProductImageCarousel() {
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');

    if (!prevBtn || !nextBtn) {
        return;
    }
    
    prevBtn.onclick = () => {
        if (!state.productImages.length) {
            return;
        }
        state.currentImageIndex = (state.currentImageIndex - 1 + state.productImages.length) % state.productImages.length;
        updateMainImage();
    };
    
    nextBtn.onclick = () => {
        if (!state.productImages.length) {
            return;
        }
        state.currentImageIndex = (state.currentImageIndex + 1) % state.productImages.length;
        updateMainImage();
    };
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
        const stockState = state.currentPlant ? getPlantStockState(state.currentPlant) : { stock: 99 };
        state.quantity = Math.min(stockState.stock || 1, state.quantity + 1);
        quantityValue.textContent = state.quantity;
    };
}

// Size Buttons
function initSizeButtons() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.onclick = function() {
            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.selectedSize = this.dataset.size;
        };
    });
}

// Tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.onclick = function() {
            const tabName = this.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(tabName + 'Tab').classList.add('active');
            
            state.selectedTab = tabName;
        };
    });
}

function getReviewStorage() {
    try {
        const parsed = JSON.parse(localStorage.getItem(REVIEW_STORAGE_KEY) || '{}');
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

function getCurrentPlantReviewKey() {
    if (!state.currentPlant) {
        return null;
    }
    const id = String(state.currentPlant.id || '').trim();
    if (id) {
        return id;
    }
    return String(state.currentPlant.name || '').toLowerCase().trim();
}

function buildReviewStars(rating) {
    const safeRating = Math.max(1, Math.min(5, Number(rating) || 1));
    return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
}

function renderProductReviews(reviews) {
    const reviewsList = document.getElementById('productReviewsList');
    const reviewsNote = document.getElementById('reviewsTabNote');

    if (!reviewsList || !reviewsNote) {
        return;
    }

    reviewsList.innerHTML = '';
    reviews.forEach(function(review) {
        const reviewItem = document.createElement('article');
        reviewItem.className = 'review-item';

        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-item-header';

        const reviewName = document.createElement('p');
        reviewName.className = 'review-item-name';
        reviewName.textContent = review.name;

        const reviewStars = document.createElement('p');
        reviewStars.className = 'review-item-stars';
        reviewStars.textContent = buildReviewStars(review.rating);

        const reviewComment = document.createElement('p');
        reviewComment.className = 'review-item-comment';
        reviewComment.textContent = review.comment;

        const reviewDate = document.createElement('p');
        reviewDate.className = 'review-item-date';
        reviewDate.textContent = review.date;

        reviewHeader.appendChild(reviewName);
        reviewHeader.appendChild(reviewStars);
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewComment);
        reviewItem.appendChild(reviewDate);
        reviewsList.appendChild(reviewItem);
    });

    reviewsNote.style.display = reviews.length ? 'none' : '';
}

function initReviews() {
    const form = document.getElementById('productReviewForm');
    const nameInput = document.getElementById('reviewUserName');
    const ratingInput = document.getElementById('reviewUserRating');
    const commentInput = document.getElementById('reviewUserComment');
    const starButtons = document.querySelectorAll('.reviews-star-btn');

    if (!form || !nameInput || !ratingInput || !commentInput) {
        return;
    }

    const key = getCurrentPlantReviewKey();
    const storage = getReviewStorage();
    const existingReviews = key && Array.isArray(storage[key]) ? storage[key] : [];
    renderProductReviews(existingReviews);

    const setStarRating = function(ratingValue) {
        const rating = Math.max(0, Math.min(5, Number(ratingValue) || 0));
        ratingInput.value = String(rating);
        starButtons.forEach(function(starBtn) {
            const starValue = Number(starBtn.dataset.value || 0);
            starBtn.classList.toggle('is-active', starValue <= rating);
        });
    };

    starButtons.forEach(function(starBtn) {
        starBtn.addEventListener('click', function() {
            setStarRating(Number(starBtn.dataset.value || 0));
        });
    });

    setStarRating(0);

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const keyForSave = getCurrentPlantReviewKey();
        if (!keyForSave) {
            return;
        }

        const name = String(nameInput.value || '').trim();
        const comment = String(commentInput.value || '').trim();
        const rating = Number(ratingInput.value || 0);

        if (!name || !comment || !rating) {
            return;
        }

        const nextStorage = getReviewStorage();
        const current = Array.isArray(nextStorage[keyForSave]) ? nextStorage[keyForSave] : [];
        const newReview = {
            name,
            rating,
            comment,
            date: 'Posted on ' + new Date().toLocaleDateString()
        };

        nextStorage[keyForSave] = [newReview, ...current].slice(0, 20);
        localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(nextStorage));
        renderProductReviews(nextStorage[keyForSave]);
        form.reset();
        setStarRating(0);
    });
}

// Add to Cart Toast
function initAddToCartToast() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = async function(e) {
            e.preventDefault();

            if (addToCartBtn.dataset.busy === 'true') {
                return;
            }

            addToCartBtn.dataset.busy = 'true';
            await animateAddToCartToCartIcon();
            showAddToCartToast();
            addToCartBtn.dataset.busy = 'false';
        };
    }
}

function animateAddToCartToCartIcon() {
    const mainImage = document.getElementById('mainImage');
    const cartButton = document.querySelector('.cart-dropdown .icon-btn');

    if (!mainImage || !cartButton) {
        return Promise.resolve();
    }

    const start = mainImage.getBoundingClientRect();
    const end = cartButton.getBoundingClientRect();

    const flyer = document.createElement('img');
    flyer.className = 'fly-to-cart-image';
    flyer.src = state.currentPlant?.image || mainImage.src;
    flyer.alt = '';

    const startX = start.left + (start.width / 2) - 36;
    const startY = start.top + (start.height / 2) - 36;
    const deltaX = (end.left + (end.width / 2)) - (startX + 36);
    const deltaY = (end.top + (end.height / 2)) - (startY + 36);

    flyer.style.left = `${startX}px`;
    flyer.style.top = `${startY}px`;
    document.body.appendChild(flyer);

    return new Promise((resolve) => {
        const animation = flyer.animate(
            [
                { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 0.95 },
                { transform: `translate(${deltaX * 0.62}px, ${deltaY * 0.42 - 90}px) scale(0.75) rotate(8deg)`, opacity: 1, offset: 0.62 },
                { transform: `translate(${deltaX}px, ${deltaY}px) scale(0.2) rotate(16deg)`, opacity: 0.2 }
            ],
            {
                duration: 680,
                easing: 'cubic-bezier(0.22, 0.8, 0.2, 1)',
                fill: 'forwards'
            }
        );

        animation.onfinish = () => {
            flyer.remove();

            cartButton.classList.add('cart-bounce');
            window.setTimeout(() => {
                cartButton.classList.remove('cart-bounce');
            }, 420);

            resolve();
        };

        animation.oncancel = () => {
            flyer.remove();
            resolve();
        };
    });
}

function showAddToCartToast() {
    if (!state.currentPlant) return;
    const stockState = getPlantStockState(state.currentPlant);
    if (!stockState.inStock) return;
    
    // Save to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cart.find(item => item.id === state.currentPlant.id);
    
    if (existingItem) {
        // If item already in cart, increase quantity
        existingItem.quantity += state.quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: state.currentPlant.id,
            name: state.currentPlant.name,
            price: state.currentPlant.price,
            image: state.currentPlant.image,
            quantity: state.quantity,
            size: state.selectedSize,
            category: state.currentPlant.category
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const selectedSizeLabel = state.selectedSize === 'xl' ? 'Extra Large (XL)' : 'Medium';
    
    const toast = document.createElement('aside');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <button class="cart-toast-close" type="button" aria-label="Close">×</button>
        <p class="cart-toast-title">Just added to your cart</p>
        <div class="cart-toast-content">
            <img src="${state.currentPlant.image}" alt="${state.currentPlant.name}" class="cart-toast-image">
            <div class="cart-toast-details">
                <p class="cart-toast-product">${state.currentPlant.name} (${selectedSizeLabel})</p>
                <p class="cart-toast-meta">Qty: ${state.quantity}</p>
                <p class="cart-toast-meta">₱${(state.currentPlant.price * state.quantity).toLocaleString()}.00</p>
            </div>
        </div>
        <a href="../CartPage/cart.html" class="cart-toast-view">VIEW CART</a>
        <button class="cart-toast-continue" type="button">Continue shopping</button>
    `;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    const closeToast = () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 220);
    };
    
    toast.querySelector('.cart-toast-close')?.addEventListener('click', closeToast);
    toast.querySelector('.cart-toast-continue')?.addEventListener('click', closeToast);
    
    // Auto-remove after 4.5 seconds
    setTimeout(() => {
        if (document.body.contains(toast)) {
            closeToast();
        }
    }, 4500);
}

function initBuyNowButton() {
    const buyNowBtn = document.querySelector('.buy-now-btn');
    if (!buyNowBtn) {
        return;
    }

    buyNowBtn.addEventListener('click', function(event) {
        event.preventDefault();

        if (!state.currentPlant) {
            return;
        }

        const stockState = getPlantStockState(state.currentPlant);
        if (!stockState.inStock) {
            return;
        }

        const orderNowItem = {
            id: state.currentPlant.id,
            name: state.currentPlant.name,
            price: state.currentPlant.price,
            image: state.currentPlant.image,
            quantity: state.quantity,
            size: state.selectedSize,
            category: state.currentPlant.category
        };

        localStorage.setItem('orderNowItem', JSON.stringify(orderNowItem));
        window.location.href = '../CartPage/order-now.html';
    });
}

function initReserveNowButton() {
    const reserveBtn = document.querySelector('.reserve-btn');
    if (!reserveBtn) {
        return;
    }

    reserveBtn.addEventListener('click', function(event) {
        event.preventDefault();

        if (!state.currentPlant) {
            return;
        }

        const stockState = getPlantStockState(state.currentPlant);
        if (!stockState.inStock) {
            return;
        }

        const sizeForReservation = state.selectedSize === 'xl' ? 'XL' : 'Medium';
        const prefillReservationPlant = {
            id: state.currentPlant.id,
            name: state.currentPlant.name,
            category: state.currentPlant.category,
            quantity: Number(state.quantity || 1),
            size: sizeForReservation
        };

        localStorage.setItem('reservationPrefillPlant', JSON.stringify(prefillReservationPlant));
        window.location.href = '../Reservation/reservation.html';
    });
}

async function initMoreProductsCarousel() {    
    const carouselContainer = document.getElementById('productCarousel');
    const progressContainer = document.getElementById('carouselProgress');
    const prevBtn = document.getElementById('prevProductBtn');
    const nextBtn = document.getElementById('nextProductBtn');

    if (!carouselContainer || !progressContainer || !prevBtn || !nextBtn) {
        return;
    }

    const currentPlantId = state.currentPlant ? state.currentPlant.id : null;
    moreProducts = await getRandomPlants(12, currentPlantId);
    state.currentMoreProductIndex = 0;

    if (!moreProducts.length) {
        carouselContainer.innerHTML = '<p class="all-plants-subtitle">No plants available yet.</p>';
        progressContainer.innerHTML = '';
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    carouselContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    prevBtn.disabled = false;
    nextBtn.disabled = false;

    moreProducts.forEach((product, index) => {
        const productDetailUrl = buildProductDetailUrl(product);
        const item = document.createElement('div');
        item.className = `carousel-item ${index === state.currentMoreProductIndex ? 'center' : ''}`;
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

    moreProducts.forEach((_, index) => {
        const progressBar = document.createElement('div');
        progressBar.className = `progress-bar ${index === state.currentMoreProductIndex ? 'active' : ''}`;
        progressContainer.appendChild(progressBar);
    });

    prevBtn.onclick = () => {
        state.currentMoreProductIndex = (state.currentMoreProductIndex - 1 + moreProducts.length) % moreProducts.length;
        updateCarousel();
    };

    nextBtn.onclick = () => {
        state.currentMoreProductIndex = (state.currentMoreProductIndex + 1) % moreProducts.length;
        updateCarousel();
    };

    updateCarousel(true);

    refreshMoreCarousel = () => {
        updateCarousel(true);
    };

    function updateCarousel(isInstant = false) {
        const items = carouselContainer.querySelectorAll('.carousel-item');
        items.forEach((item, index) => {
            item.classList.toggle('center', index === state.currentMoreProductIndex);
        });

        const progressBars = progressContainer.querySelectorAll('.progress-bar');
        progressBars.forEach((bar, index) => {
            bar.classList.toggle('active', index === state.currentMoreProductIndex);
        });

        const activeItem = items[state.currentMoreProductIndex];
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

function initFooter() {
    const backToTopButton = document.querySelector('.footer-back-to-top');
    if (!backToTopButton) {
        return;
    }

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
