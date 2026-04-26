const state = {
    currentImageIndex: 0,
    productImages: [],
    quantity: 1,
    selectedSize: 'medium',
    selectedTab: 'reviews',
    currentMoreProductIndex: 0,
    currentPlant: null,
    currentSizeData: null
};

let moreProducts = [];
let refreshMoreCarousel = null;
const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';
const GALLERY_SLOT_COUNT = 4;
const GALLERY_PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Crect width="160" height="160" fill="%23eef1ec"/%3E%3Cpath d="M45 108h70L92 78l-16 20-11-13-20 23z" fill="%23c6d1be"/%3E%3Ccircle cx="62" cy="56" r="10" fill="%23c6d1be"/%3E%3C/svg%3E';

const PLANT_API = {
    async getPlantInventory() {
        try {
            // Fetch all plants
            const plants = await plantsAPI.getAll();
            // Fetch all plant sizes (for pricing and stock)
            const sizes = await plantSizesAPI.getAll();
            // Fetch all categories (for category names)
            const categories = await categoriesAPI.getAll();
            
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
                    if (!size.plant_id) {
                        return;
                    }

                    if (!plantSizeMap[size.plant_id]) {
                        plantSizeMap[size.plant_id] = [];
                    }

                    plantSizeMap[size.plant_id].push({
                        id: size.plant_size_id,
                        plantId: size.plant_id,
                        name: String(size.size_name || '').trim(),
                        price: Number(size.price) || 0,
                        stock: Number(size.stock_quantity) || 0,
                        available: String(size.is_available || '').toLowerCase() === 'true' || String(size.is_available || '').trim() === '1'
                    });
                });
            }
            
            // Combine plant and size data
            return plants.map(p => {
                const sizeData = plantSizeMap[p.plant_id] || [];
                const categoryName = categoryMap[p.category_id] || 'General';
                const parsedImages = (window.GHPlantData && typeof window.GHPlantData.resolvePlantImagesById === 'function')
                    ? window.GHPlantData.resolvePlantImagesById(p.plant_id, p.image_path || p.image || DEFAULT_PLANT_IMAGE)
                    : [p.image_path || p.image || DEFAULT_PLANT_IMAGE];
                return {
                    id: p.plant_id,
                    name: p.plant_name,
                    description: p.description || '',
                    sizes: sizeData,
                    price: sizeData[0]?.price || 0,
                    category: categoryName,
                    image: parsedImages[0] || DEFAULT_PLANT_IMAGE,
                    images: parsedImages.slice(0, 4),
                    stock: sizeData[0]?.stock || 0
                };
            });
        } catch (error) {
            console.error('Failed to fetch plant inventory:', error);
            return [];
        }
    },

    getPlantById(id, list = []) {
        if (!Array.isArray(list)) {
            return null;
        }

        return list.find(p => String(p.id) === String(id)) || null;
    },

    getEffectiveStock(plant) {
        return plant.stock || 0;
    },

    isInStock(plant) {
        return (plant.stock || 0) > 0;
    },

    getPlantGallery(category, name, fallback) {
        const parsed = (window.GHPlantData && typeof window.GHPlantData.parsePlantImages === 'function')
            ? window.GHPlantData.parsePlantImages(fallback)
            : [fallback].filter(Boolean);
        return parsed.slice(0, 4);
    }
};

async function getInventory() {
    return await PLANT_API.getPlantInventory();
}

function getPlantStockState(plant, inventory = []) {
    if (!PLANT_API) {
        return { inStock: true, stock: 1 };
    }

    const latest = PLANT_API.getPlantById(plant.id, inventory) || plant;
    const sizeData = getCurrentSizeData(latest);
    const stock = sizeData ? Number(sizeData.stock || 0) : PLANT_API.getEffectiveStock(latest);
    return {
        inStock: stock > 0,
        stock
    };
}

function normalizeSizeName(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function isSizeSelectable(size) {
    if (!size) {
        return false;
    }

    const available = String(size.available ?? '').toLowerCase();
    const hasStock = Number(size.stock || 0) > 0;
    const hasPrice = Number(size.price || 0) > 0;

    if (available === 'false' || available === '0') {
        return false;
    }

    return hasStock && hasPrice;
}

function getAvailableSizes(plant) {
    if (!plant || !Array.isArray(plant.sizes)) {
        return [];
    }

    return plant.sizes.filter(isSizeSelectable);
}

function getSizeDataByName(plant, sizeName) {
    if (!plant || !Array.isArray(plant.sizes) || !plant.sizes.length) {
        return null;
    }

    const normalizedRequestedSize = normalizeSizeName(sizeName);
    return plant.sizes.find((size) => normalizeSizeName(size.name) === normalizedRequestedSize) || null;
}

function getCurrentSizeData(plant, selectedSize = state.selectedSize) {
    if (!plant || !Array.isArray(plant.sizes) || !plant.sizes.length) {
        return null;
    }

    const matched = getSizeDataByName(plant, selectedSize);
    if (isSizeSelectable(matched)) {
        return matched;
    }

    return getAvailableSizes(plant)[0] || null;
}

function updateSizeButtonAvailability(plant) {
    const sizeButtons = document.querySelectorAll('.size-btn');

    sizeButtons.forEach((button) => {
        const sizeData = getSizeDataByName(plant, button.dataset.size || button.textContent);
        const selectable = isSizeSelectable(sizeData);

        button.disabled = !selectable;
        button.setAttribute('aria-disabled', String(!selectable));
        button.classList.toggle('unavailable', !selectable);
        if (!selectable) {
            button.classList.remove('active');
        }
    });
}

function applyPlantSizeView(plant, sizeData) {
    const plantPrice = document.getElementById('plantPrice');
    const plantStockStatus = document.getElementById('plantStockStatus');
    const incrementBtn = document.getElementById('incrementBtn');
    const buyNowBtn = document.querySelector('.buy-now-btn');
    const reserveBtn = document.querySelector('.reserve-btn');
    const addToCartBtn = document.querySelector('.add-to-cart-btn');

    if (!plant || !sizeData) {
        return;
    }

    state.currentSizeData = sizeData;

    if (plantPrice) {
        plantPrice.textContent = `₱${Number(sizeData.price || 0).toLocaleString('en-PH')}.00`;
    }

    if (plantStockStatus) {
        const stock = Number(sizeData.stock || 0);
        plantStockStatus.textContent = stock > 0 ? `${stock} available stock` : 'Out of Stock';
        plantStockStatus.classList.toggle('out', stock <= 0);
    }

    const inStock = Number(sizeData.stock || 0) > 0;
    if (addToCartBtn) addToCartBtn.disabled = !inStock;
    if (buyNowBtn) buyNowBtn.disabled = !inStock;
    if (reserveBtn) {
        reserveBtn.disabled = !inStock;
        reserveBtn.textContent = inStock ? 'Reserve Now' : 'Out of Stock';
    }
    if (incrementBtn) incrementBtn.disabled = !inStock;

    state.quantity = Math.min(Math.max(1, state.quantity), Math.max(1, Number(sizeData.stock || 1)));
    const quantityValue = document.getElementById('quantityValue');
    if (quantityValue) {
        quantityValue.textContent = state.quantity;
    }
}

function setActiveSizeButton(selectedSizeName) {
    const normalizedSelected = normalizeSizeName(selectedSizeName);
    const sizeButtons = document.querySelectorAll('.size-btn');

    sizeButtons.forEach((button) => {
        const buttonSize = normalizeSizeName(button.dataset.size || button.textContent);
        button.classList.toggle('active', buttonSize === normalizedSelected);
    });
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
        image: image || DEFAULT_PLANT_IMAGE,
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
        price: String(plant.price)
    });

    return `product-detail.html?${params.toString()}`;
}

function getGalleryDisplaySlots(images) {
    const slots = Array.isArray(images) ? images.slice(0, GALLERY_SLOT_COUNT) : [];

    while (slots.length < GALLERY_SLOT_COUNT) {
        slots.push(GALLERY_PLACEHOLDER_IMAGE);
    }

    return slots;
}

function getDisplayGalleryImages() {
    return getGalleryDisplaySlots(state.productImages);
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
    
    const stockState = getPlantStockState(foundPlant, inventory);
    state.currentPlant = {
        ...foundPlant,
        stock: stockState.stock
    };
    const numericPlantId = Number(foundPlant.id);
    
    // Update page title and meta
    document.title = `${foundPlant.name} - Gabay Halaman`;

    updateSizeButtonAvailability(state.currentPlant);

    const initialSizeData = getCurrentSizeData(state.currentPlant);
    if (initialSizeData) {
        state.selectedSize = normalizeSizeName(initialSizeData.name) || state.selectedSize;
        applyPlantSizeView(state.currentPlant, initialSizeData);
        setActiveSizeButton(initialSizeData.name);
    }
    
    // Update plant details
    document.getElementById('plantName').textContent = foundPlant.name;
    document.getElementById('plantDescription').textContent = foundPlant.description || 'No description available';
    const additionalDescriptionText = `${foundPlant.description || 'Premium plant selection.'} Water regularly, ensure proper drainage, and provide appropriate sunlight based on the plant type. Most tropical plants thrive in warm, humid conditions. Carefully packaged to ensure safe delivery. Plants arrive in excellent condition.`;
    const descriptionFitElement = document.getElementById('plantDescriptionFit');
    if (descriptionFitElement) {
        descriptionFitElement.textContent = additionalDescriptionText;
    }

    const shippingEstimatedArrivalElement = document.getElementById('shippingEstimatedArrivalValue');
    if (shippingEstimatedArrivalElement) {
        const estimatedArrival = new Date();
        estimatedArrival.setDate(estimatedArrival.getDate() + 5);
        shippingEstimatedArrivalElement.textContent = estimatedArrival.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    const additionalInfoElement = document.getElementById('additionalInfo');
    if (additionalInfoElement) {
        additionalInfoElement.innerHTML = `
            <div class="additional-info-list">
                <p class="additional-info-row">
                    <span class="additional-info-label">Category</span>
                    <span class="additional-info-value">${foundPlant.category || 'General'}</span>
                </p>
                <p class="additional-info-row additional-info-row-wide">
                    <span class="additional-info-label">Overview</span>
                    <span class="additional-info-value">${foundPlant.description || 'Premium plant selection.'}</span>
                </p>
                <p class="additional-info-row additional-info-row-wide">
                    <span class="additional-info-label">Caring Tips</span>
                    <span class="additional-info-value">Water regularly, ensure proper drainage, and provide appropriate sunlight based on the plant type. Most tropical plants thrive in warm, humid conditions.</span>
                </p>
                <p class="additional-info-row additional-info-row-wide">
                    <span class="additional-info-label">Shipping</span>
                    <span class="additional-info-value">Carefully packaged to ensure safe delivery. Plants arrive in excellent condition.</span>
                </p>
            </div>
        `;
    }
    
    const explicitImages = Array.isArray(foundPlant.images) ? foundPlant.images.filter(Boolean) : [];
    state.productImages = explicitImages.length
        ? explicitImages.slice(0, 4)
        : (PLANT_API
            ? PLANT_API.getPlantGallery(foundPlant.category, foundPlant.name, foundPlant.image)
            : [foundPlant.image]);

    // Update main image and thumbnails using the real gallery
    const galleryImages = getDisplayGalleryImages();

    const mainImage = document.getElementById('mainImage');
    mainImage.src = galleryImages[0] || foundPlant.image;
    mainImage.alt = foundPlant.name;

    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';

    const thumbnailSlots = galleryImages;
    thumbnailSlots.forEach((image, i) => {
        const isPlaceholder = i >= state.productImages.length;
        const thumbDiv = document.createElement('div');
        thumbDiv.className = `thumbnail ${i === 0 && !isPlaceholder ? 'active' : ''} ${isPlaceholder ? 'placeholder' : ''}`.trim();

        if (!isPlaceholder) {
            thumbDiv.onclick = () => selectImage(i);
        }
        
        const thumbImg = document.createElement('img');
        thumbImg.src = image;
        thumbImg.alt = `${foundPlant.name} thumbnail ${i + 1}`;
        
        thumbDiv.appendChild(thumbImg);
        thumbnailsContainer.appendChild(thumbDiv);
    });

    state.currentImageIndex = 0;
}

function selectImage(index) {
    const galleryImages = getDisplayGalleryImages();
    if (!galleryImages.length) {
        return;
    }

    if (index < 0 || index >= galleryImages.length) {
        return;
    }

    state.currentImageIndex = index;
    updateMainImage();
}

function updateMainImage() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const galleryImages = getDisplayGalleryImages();

    if (galleryImages.length > 0 && mainImage) {
        mainImage.src = galleryImages[state.currentImageIndex];
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
        const galleryImages = getDisplayGalleryImages();
        if (!galleryImages.length) {
            return;
        }
        state.currentImageIndex = (state.currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateMainImage();
    };
    
    nextBtn.onclick = () => {
        const galleryImages = getDisplayGalleryImages();
        if (!galleryImages.length) {
            return;
        }
        state.currentImageIndex = (state.currentImageIndex + 1) % galleryImages.length;
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
        const stockLimit = state.currentSizeData ? Number(state.currentSizeData.stock || 1) : 99;
        state.quantity = Math.min(stockLimit || 1, state.quantity + 1);
        quantityValue.textContent = state.quantity;
    };
}

// Size Buttons
function initSizeButtons() {
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.onclick = function() {
            if (this.disabled) {
                return;
            }

            sizeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            state.selectedSize = this.dataset.size || this.textContent;

            if (state.currentPlant) {
                const sizeData = getCurrentSizeData(state.currentPlant, state.selectedSize);
                if (isSizeSelectable(sizeData)) {
                    applyPlantSizeView(state.currentPlant, sizeData);
                }
            }
        };
    });
}

// Tabs
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabButtons.length || !tabContents.length) {
        return;
    }
    
    tabButtons.forEach(btn => {
        btn.onclick = function() {
            const tabName = this.dataset.tab;
            const targetTab = document.getElementById(tabName + 'Tab');

            if (!targetTab) {
                return;
            }
            
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            this.classList.add('active');
            targetTab.classList.add('active');
            
            state.selectedTab = tabName;
        };
    });
}

function buildReviewStars(rating) {
    const safeRating = Math.max(1, Math.min(5, Number(rating) || 1));
    return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
}

function renderProductReviews(reviews) {
    const reviewsList = document.getElementById('productReviewsList');
    const reviewsNote = document.getElementById('reviewsTabNote');
    const avgValueEl = document.getElementById('reviewsAverageValue');
    const countValueEl = document.getElementById('reviewsCountValue');
    const featuredNameEl = document.getElementById('reviewsFeaturedName');
    const featuredDateEl = document.getElementById('reviewsFeaturedDate');
    const featuredStarsEl = document.getElementById('reviewsFeaturedStars');
    const featuredCommentEl = document.getElementById('reviewsFeaturedComment');
    const featuredAvatarEl = document.getElementById('reviewsFeaturedAvatar');
    const barEls = {
        5: document.getElementById('reviewsBar5'),
        4: document.getElementById('reviewsBar4'),
        3: document.getElementById('reviewsBar3'),
        2: document.getElementById('reviewsBar2'),
        1: document.getElementById('reviewsBar1')
    };

    if (!reviewsList || !reviewsNote) {
        return;
    }

    const safeReviews = Array.isArray(reviews) ? reviews : [];
    const total = safeReviews.length;
    const average = total
        ? safeReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / total
        : 0;

    if (avgValueEl) {
        avgValueEl.textContent = average ? average.toFixed(1).replace('.', ',') : '0,0';
    }

    if (countValueEl) {
        countValueEl.textContent = `(${total} New Review${total === 1 ? '' : 's'})`;
    }

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    safeReviews.forEach(function(review) {
        const rating = Math.max(1, Math.min(5, Number(review.rating) || 1));
        distribution[rating] += 1;
    });

    const maxBucket = Math.max(1, distribution[1], distribution[2], distribution[3], distribution[4], distribution[5]);
    [5, 4, 3, 2, 1].forEach(function(star) {
        if (barEls[star]) {
            barEls[star].style.width = `${(distribution[star] / maxBucket) * 100}%`;
        }
    });

    const featured = safeReviews[0] || null;
    if (featuredNameEl) {
        featuredNameEl.textContent = featured ? featured.name : 'Customer';
    }
    if (featuredDateEl) {
        featuredDateEl.textContent = featured ? (featured.date || '-- --- ----') : '-- --- ----';
    }
    if (featuredStarsEl) {
        featuredStarsEl.textContent = featured ? buildReviewStars(featured.rating) : '☆☆☆☆☆';
    }
    if (featuredCommentEl) {
        featuredCommentEl.textContent = featured ? featured.comment : 'No reviews yet for this plant.';
    }
    if (featuredAvatarEl) {
        const name = String(featured?.name || 'C').trim();
        const initials = name
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map(function(part) { return part.charAt(0); })
            .join('') || 'C';
        featuredAvatarEl.textContent = initials;
    }

    reviewsList.innerHTML = '';
    safeReviews.forEach(function(review) {
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
        reviewDate.textContent = review.date || ('Posted on ' + new Date().toLocaleDateString());

        reviewHeader.appendChild(reviewName);
        reviewHeader.appendChild(reviewStars);
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewComment);
        reviewItem.appendChild(reviewDate);
        reviewsList.appendChild(reviewItem);
    });

    reviewsNote.style.display = safeReviews.length ? 'none' : '';
}

async function resolveProductReviewClientId(name) {
    if (typeof clientsAPI === 'undefined') {
        return null;
    }

    const normalizedName = String(name || '').trim();
    if (!normalizedName) {
        return null;
    }

    try {
        const clients = await clientsAPI.getAll();
        if (Array.isArray(clients)) {
            const existingClient = clients.find(function(client) {
                const clientName = String(client.full_name || '').trim().toLowerCase();
                return clientName === normalizedName.toLowerCase();
            });

            if (existingClient && Number(existingClient.client_id) > 0) {
                return Number(existingClient.client_id);
            }
        }

        const fallbackEmail = `review-${Date.now()}@gabayhalaman.local`;
        await clientsAPI.create({
            full_name: normalizedName,
            email: fallbackEmail,
            contact_number: 0,
            created_at: new Date().toISOString()
        });

        const refreshedClients = await clientsAPI.getAll();
        if (Array.isArray(refreshedClients)) {
            const createdClient = refreshedClients.find(function(client) {
                const clientName = String(client.full_name || '').trim().toLowerCase();
                const clientEmail = String(client.email || '').trim().toLowerCase();
                return clientName === normalizedName.toLowerCase() && clientEmail === fallbackEmail;
            });

            if (createdClient && Number(createdClient.client_id) > 0) {
                return Number(createdClient.client_id);
            }
        }
    } catch (error) {
        console.warn('Failed to resolve review client:', error);
    }

    return null;
}

async function loadProductReviewsFromBackend() {
    const reviewsList = document.getElementById('productReviewsList');
    const reviewsNote = document.getElementById('reviewsTabNote');

    if (!reviewsList || !reviewsNote) {
        return;
    }

    const plantId = Number(state.currentPlant?.id || 0);
    if (!Number.isFinite(plantId) || plantId <= 0 || typeof reviewsAPI === 'undefined') {
        renderProductReviews([]);
        return;
    }

    try {
        const [reviews, clients] = await Promise.all([
            reviewsAPI.getAll(),
            typeof clientsAPI !== 'undefined' ? clientsAPI.getAll() : Promise.resolve([])
        ]);

        const clientMap = {};
        if (Array.isArray(clients)) {
            clients.forEach(function(client) {
                const id = Number(client.client_id);
                if (Number.isFinite(id) && id > 0) {
                    clientMap[id] = String(client.full_name || '').trim() || 'Customer';
                }
            });
        }

        const plantReviews = Array.isArray(reviews)
            ? reviews
                .filter(function(review) {
                    return Number(review.plant_id) === plantId;
                })
                .sort(function(a, b) {
                    const aTime = new Date(a.created_at || 0).getTime();
                    const bTime = new Date(b.created_at || 0).getTime();
                    return bTime - aTime;
                })
                .map(function(review) {
                    return {
                        name: clientMap[Number(review.client_id)] || 'Customer',
                        rating: Number(review.rating || 5),
                        comment: String(review.comment || '').trim() || 'No comment provided.',
                        date: new Date(review.created_at || Date.now()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                        })
                    };
                })
            : [];

        renderProductReviews(plantReviews);
    } catch (error) {
        console.warn('Unable to fetch product reviews from database:', error);
        renderProductReviews([]);
    }
}

async function initReviews() {
    const form = document.getElementById('productReviewForm');
    const nameInput = document.getElementById('reviewUserName');
    const ratingInput = document.getElementById('reviewUserRating');
    const commentInput = document.getElementById('reviewUserComment');
    const starButtons = document.querySelectorAll('.reviews-star-btn');

    if (!form || !nameInput || !ratingInput || !commentInput) {
        return;
    }

    await loadProductReviewsFromBackend();

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

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        const name = String(nameInput.value || '').trim();
        const comment = String(commentInput.value || '').trim();
        const rating = Number(ratingInput.value || 0);
        const plantId = Number(state.currentPlant?.id || 0);

        if (!name || !comment || !rating || !Number.isFinite(plantId) || plantId <= 0) {
            return;
        }

        if (typeof reviewsAPI === 'undefined') {
            alert('Review service is unavailable right now.');
            return;
        }

        const submitBtn = form.querySelector('.reviews-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Posting...';
        }

        try {
            const clientId = await resolveProductReviewClientId(name);
            if (!clientId) {
                throw new Error('Unable to resolve client id');
            }

            await reviewsAPI.create({
                plant_id: Number(plantId),
                client_id: Number(clientId),
                rating: Number(rating),
                comment: String(comment),
                created_at: new Date().toISOString()
            });

            await loadProductReviewsFromBackend();
            form.reset();
            setStarRating(0);
        } catch (error) {
            console.warn('Failed to submit product review:', error);
            alert('Unable to submit your review right now. Please try again later.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Post Review';
            }
        }
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
    const selectedSizeData = getCurrentSizeData(state.currentPlant, state.selectedSize) || state.currentSizeData;
    const stockLimit = Math.max(0, Number(selectedSizeData?.stock || 0));
    if (!selectedSizeData || stockLimit <= 0) return;
    
    // Save to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cart.find(item => {
        const samePlant = String(item.id) === String(state.currentPlant.id);
        if (!samePlant) {
            return false;
        }

        const samePlantSizeId = Number(item.plantSizeId || 0) > 0 && Number(item.plantSizeId || 0) === Number(selectedSizeData.id || 0);
        if (samePlantSizeId) {
            return true;
        }

        return normalizeSizeName(item.size) === normalizeSizeName(selectedSizeData.name || state.selectedSize);
    });
    
    if (existingItem) {
        existingItem.price = Number(selectedSizeData.price || existingItem.price || 0);
        existingItem.size = selectedSizeData.name || existingItem.size || state.selectedSize;
        existingItem.plantId = Number(state.currentPlant.id || 0);
        existingItem.plantSizeId = selectedSizeData.id || existingItem.plantSizeId || null;
        existingItem.availableStock = stockLimit;
        existingItem.quantity = Math.min(stockLimit, Number(existingItem.quantity || 0) + state.quantity);
    } else {
        cart.push({
            id: state.currentPlant.id,
            plantId: Number(state.currentPlant.id || 0),
            plantSizeId: selectedSizeData.id || null,
            name: state.currentPlant.name,
            price: Number(selectedSizeData.price || state.currentPlant.price || 0),
            image: state.currentPlant.image,
            quantity: Math.min(stockLimit, state.quantity),
            size: selectedSizeData.name || state.selectedSize,
            availableStock: stockLimit,
            category: state.currentPlant.category
        });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cart));
    
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const selectedSizeLabel = selectedSizeData.name || state.selectedSize;
    const toastQuantity = existingItem ? existingItem.quantity : Math.min(stockLimit, state.quantity);
    const toastTotal = Number(selectedSizeData.price || 0) * toastQuantity;
    
    const toast = document.createElement('aside');
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `
        <button class="cart-toast-close" type="button" aria-label="Close">×</button>
        <p class="cart-toast-kicker">Cart Updated</p>
        <p class="cart-toast-title">Added to cart</p>
        <div class="cart-toast-content">
            <div class="cart-toast-media">
                <img src="${state.currentPlant.image || DEFAULT_PLANT_IMAGE}" alt="${state.currentPlant.name}" class="cart-toast-image" onerror="this.onerror=null;this.parentElement.classList.add('is-fallback');this.src='${DEFAULT_PLANT_IMAGE}';">
            </div>
            <div class="cart-toast-details">
                <div class="cart-toast-topline">
                    <p class="cart-toast-product">${state.currentPlant.name}</p>
                    <span class="cart-toast-badge">${selectedSizeLabel}</span>
                </div>
                <div class="cart-toast-pills">
                    <span class="cart-toast-pill">Qty ${toastQuantity}</span>
                    <span class="cart-toast-pill accent">₱${toastTotal.toLocaleString()}.00</span>
                </div>
            </div>
        </div>
        <div class="cart-toast-actions">
            <a href="../CartPage/cart.html" class="cart-toast-view">View Cart</a>
            <button class="cart-toast-continue" type="button">Continue shopping</button>
        </div>
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

        const selectedSizeData = getCurrentSizeData(state.currentPlant, state.selectedSize) || state.currentSizeData;
        const stockState = getPlantStockState(state.currentPlant);
        if (!stockState.inStock || !selectedSizeData) {
            return;
        }

        const orderNowItem = {
            id: state.currentPlant.id,
            plantId: Number(state.currentPlant.id || 0),
            name: state.currentPlant.name,
            price: Number(selectedSizeData.price || state.currentPlant.price || 0),
            image: state.currentPlant.image,
            quantity: state.quantity,
            size: selectedSizeData.name || state.selectedSize,
            plantSizeId: selectedSizeData.id || null,
            availableStock: Math.max(0, Number(selectedSizeData.stock || 0)),
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
