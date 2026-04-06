// Plant description database
const plantDescriptions = {
    // Fruit Bearing
    1: "Rambutan is a hairy tropical fruit rich in vitamin C and antioxidants. Its name comes from the Malay word 'rambut' meaning hair.",
    2: "Mangosteen is a tropical fruit with a creamy, sweet taste. It's often called the 'queen of fruits' and is highly nutritious.",
    3: "Lansones (Longkong) are sweet, juicy golden fruits that grow in clusters. Great for tropical climates.",
    4: "Durian is known as the 'king of fruits'. While pungent, it's rich in nutrients and fiber.",
    5: "Sweet Tamarind produces pod fruits with a tangy flavor. Perfect for culinary and medicinal uses.",
    6: "Bangkok Santol produces golden, tart fruits. Known for its health benefits and culinary versatility.",
    7: "Duhat (Black Plum) produces small, sweet dark purple fruits. Rich in antioxidants and vitamins.",
    8: "Sweet Balimbing (Star Fruit) produces star-shaped fruits that are sweet and juicy with minimal seeds.",
    9: "Atis (Custard Apple) produces creamy, sweet fruits. Extremely popular in tropical regions.",
    10: "Chico (Sapota) produces brown fruits with sweet, creamy flesh. Great source of nutrients.",
    11: "Macopa Red produces crisp, watery fruits with mild sweetness. Excellent for fresh consumption.",
    12: "Avocado Lagkitan is a buttery fruit rich in healthy fats. Perfect for salads and smoothies.",
    13: "Cacao trees produce pods containing cocoa beans. Essential for chocolate production.",
    
    // Citrus Variety
    14: "Japanese Orange (Mikan) produces seedless, sweet oranges that peel easily. Perfect for snacking.",
    15: "Davao Pomelo is the largest citrus variety with sweet, juicy pink flesh. Rich in vitamin C.",
    16: "Satsuma Citrus produces seedless, sweet mandarin oranges. Easy to peel and very juicy.",
    17: "Dalanghita is a hybrid citrus with sweet flavor. Popular in Southeast Asian markets.",
    18: "Dayap (Philippine Lime) is a small citrus used for cooking and beverages. Essential in Filipino cuisine.",
    19: "Calamansi produces small, tart citrus fruits. Staple ingredient in Filipino cooking.",
    20: "Kiat Kiat is a Thai citrus with unique flavor profile. Great for culinary applications.",
    21: "Poncan produces sweet, seedless mandarin oranges. Popular in Asian markets.",
    22: "Lemon Meyer is a hybrid lemon with sweeter taste. Perfect for cooking, baking, and beverages.",
    
    // Mangga Variety
    23: "Carabao Mango is the sweetest and most popular mango variety. Golden color and juicy flesh.",
    24: "Queen Mango produces large fruits with excellent flavor and aroma. Premium eating quality.",
    25: "Sweet Catimon Mango is naturally sweet with minimal fiber. Excellent for fresh consumption.",
    26: "Sweet Catimon Double Rootstock produces premium quality fruits with mature tree characteristics.",
    27: "Indian Mango offers unique flavor profile. Good for both eating and processing.",
    28: "King Mango produces large, attractive fruits with excellent taste. Premium market variety.",
    29: "Purple Mango produces burgundy-colored fruits with unique flavor. Ornamental and edible.",
    30: "Apple Mango is small with crisp, firm flesh. Sweet taste with minimal fiber.",
    
    // Dwarf Coconut
    31: "Dwarf Coconut Golden variety produces golden nuts with sweet water. Compact growth habit.",
    32: "Tacunan Coconut is a dwarf variety with excellent production. Heat and drought tolerant.",
    33: "Catigan Dwarf Coconut produces small nuts. Space-saving for small gardens.",
    
    // Cuttings/Dwarf
    34: "Red Guaple (Guava Apple Cross) produces superior quality fruits with excellent taste.",
    35: "Green Guaple is a guava-apple hybrid with crisp, sweet flesh. High yield variety.",
    36: "Marang is a tropical fruit similar to breadnut. Sweet, creamy, and nutritious.",
    37: "Lychee produces delicate, sweet fruits with thin shell. Premium tropical fruit.",
    38: "Langka (Jackfruit) produces large, starchy fruits used in savory and sweet dishes.",
    39: "Hybrid Mulberry produces large, sweet berries. Extended fruiting season.",
    40: "Paminta (Black Pepper) produces peppercorns for culinary use. Medicinal properties.",
    41: "Red Cardinal Grapes produce seedless, sweet grapes. Premium table fruit.",
    42: "Miracle Fruit produces berries that alter taste perception temporarily. Unique experience.",
    43: "Magic Fruit is similar to miracle fruit with amazing flavor-modifying properties.",
    44: "Sweet Guyabano (Soursop) produces large, creamy fruits with unique flavor. Rich in vitamins.",
    45: "Karamay (Bilimbi) produces cucumber-like fruits. Used for cooking and pickling.",
    46: "Sarguelas (Siniguelas) produces small, tart fruits. Popular in Filipino markets.",
    47: "Abiu produces golden fruits with custard-like flesh. Sweet and creamy.",
    48: "Caimito (Star Apple) produces purple fruits with sweet, juicy flesh. Rich in nutrients.",
    49: "Mabolo (Red Velvet Apple) produces unique fruits with creamy, sweet flesh.",
    50: "Cacao produces cocoa pods. Essential for chocolate and cocoa products.",
    51: "Kamias (Bilimbi) is a souring agent used in Asian cuisine. Medicinal uses.",
    52: "Bignay produces small purple berries. Used for jams and traditional medicine.",
    53: "Pomegranate produces jewel-like arils with sweet-tart flavor. Ancient superfruit.",
    54: "Longan produces small, translucent fruits with sweet flavor. Called 'dragon's eye'.",
    
    // Flowering Trees
    55: "Golden Trumpet produces bright yellow trumpet-shaped flowers. Stunning ornamental tree.",
    56: "Pink Trumpet produces delicate pink flowers. Beautiful landscape specimen.",
    57: "Golden Shower produces abundant yellow flowers. Spectacular flowering display.",
    58: "Fire Tree produces brilliant red flowers. Creates stunning visual impact.",
    59: "Ilang Ilang (Cananga Odorata) produces fragrant, yellowish flowers. Used in perfumes.",
    60: "Jacaranda produces purple-blue flowers that create a purple canopy. Iconic ornamental.",
    61: "Pine Tree is an evergreen conifer. Provides shade and timber.",
    62: "Palm Tree is an iconic tropical plant. Adds tropical ambiance to any landscape.",
    63: "Dates Palm produces edible date fruits. Iconic symbol of desert regions.",
    64: "Dates Palm Bull Out is a mature specimen with established trunk.",
    65: "Palawan Cherry Blossom produces delicate pink blossoms. 3-foot tree.",
    66: "Palawan Cherry Blossom Bull Out is a mature flowering specimen.",
    
    // Forest Trees
    67: "Gemelina is a fast-growing timber tree. Excellent for reforestation.",
    68: "Mahogany is a valuable hardwood tree. Beautiful grain and color.",
    69: "Narra is a precious Philippine timber tree. Strong and durable wood.",
    70: "Molave is a hardwood timber tree. Used for construction and furniture.",
    71: "Pole Bamboo is a structural bamboo variety. Fast-growing and renewable.",
    72: "Thai Bamboo is an ornamental and structural variety. Beautiful foliage.",
    
    // Others
    73: "Arabica Coffee produces premium coffee beans. Ideal for specialty coffee.",
    74: "Robusta Coffee produces robust, full-bodied coffee beans. High yield variety.",
    75: "Barako Coffee (Liberica) produces distinctive, bold coffee. Philippine specialty.",
};

const state = {
    currentImageIndex: 0,
    quantity: 1,
    selectedSize: 'small',
    selectedTab: 'additional',
    currentMoreProductIndex: 0,
    currentPlant: null
};

let moreProducts = [];
let refreshMoreCarousel = null;

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
document.addEventListener('DOMContentLoaded', function() {
    loadPlantData();
    initProductImageCarousel();
    initQuantityControls();
    initSizeButtons();
    initTabs();
    initMoreProductsCarousel();
    initMorePlantsToggle();
    initAddToCartToast();
    initBuyNowButton();
});

function getRandomPlants(count, excludedPlantId) {
    if (typeof plantsByCategory === 'undefined') {
        return [];
    }

    const flattened = Object.entries(plantsByCategory).flatMap(([category, plants]) => {
        return plants.map((plant) => ({ ...plant, category }));
    });

    const filtered = flattened.filter((plant) => plant.id !== excludedPlantId);
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function buildProductDetailUrl(plant) {
    const params = new URLSearchParams({
        id: String(plant.id),
        name: plant.name,
        category: plant.category,
        image: plant.image,
        price: String(plant.price || 250)
    });

    return `product-detail.html?${params.toString()}`;
}

// Load plant data from URL parameters
function loadPlantData() {
    const urlParams = new URLSearchParams(window.location.search);
    const plantId = parseInt(urlParams.get('id'));

    // Find plant in categories by ID when present
    let foundPlant = null;
    if (plantId) {
        for (const category in plantsByCategory) {
            const plant = plantsByCategory[category].find(p => p.id === plantId);
            if (plant) {
                foundPlant = { ...plant, category };
                break;
            }
        }
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
    
    // Update page title and meta
    document.title = `${foundPlant.name} - Gabay Halaman`;
    
    // Update plant details
    document.getElementById('plantName').textContent = foundPlant.name;
    document.getElementById('plantPrice').textContent = `₱${foundPlant.price.toLocaleString()}.00`;
    document.getElementById('plantDescription').textContent = plantDescriptions[plantId] || 'A beautiful plant from our collection, carefully cultivated for optimal health and growth.';
    document.getElementById('additionalInfo').innerHTML = `
        <p><strong>Category:</strong> ${foundPlant.category}</p>
        <p><strong>Price:</strong> ₱${foundPlant.price.toLocaleString()}.00</p>
        <p>${plantDescriptions[plantId] || 'Premium plant selection.'}</p>
        <p><strong>Caring Tips:</strong> Water regularly, ensure proper drainage, and provide appropriate sunlight based on the plant type. Most tropical plants thrive in warm, humid conditions.</p>
        <p><strong>Shipping:</strong> Carefully packaged to ensure safe delivery. Plants arrive in excellent condition.</p>
    `;
    
    // Update main image
    document.getElementById('mainImage').src = foundPlant.image;
    document.getElementById('mainImage').alt = foundPlant.name;
    
    // Generate thumbnail (using same image repeated for demo - in production, you'd have multiple images)
    const thumbnailsContainer = document.getElementById('thumbnails');
    thumbnailsContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        const thumbDiv = document.createElement('div');
        thumbDiv.className = `thumbnail ${i === 0 ? 'active' : ''}`;
        thumbDiv.onclick = () => selectImage(i);
        
        const thumbImg = document.createElement('img');
        thumbImg.src = foundPlant.image;
        thumbImg.alt = `${foundPlant.name} thumbnail ${i + 1}`;
        
        thumbDiv.appendChild(thumbImg);
        thumbnailsContainer.appendChild(thumbDiv);
    }
}

// Product Image Carousel
function initProductImageCarousel() {
    const mainImage = document.getElementById('mainImage');
    const prevBtn = document.getElementById('prevImageBtn');
    const nextBtn = document.getElementById('nextImageBtn');
    
    // Get all thumbnail images for cycling
    const thumbnails = document.querySelectorAll('.thumbnail');
    const productImages = Array.from(thumbnails).map(thumb => thumb.querySelector('img').src);
    
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
        const thumbnails = document.querySelectorAll('.thumbnail');
        if (productImages.length > 0) {
            mainImage.src = productImages[state.currentImageIndex];
        }
        
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

// Add to Cart Toast
function initAddToCartToast() {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.onclick = function(e) {
            e.preventDefault();
            showAddToCartToast();
        };
    }
}

function showAddToCartToast() {
    if (!state.currentPlant) return;
    
    // Save to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('reservations') || '[]');
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
    
    localStorage.setItem('reservations', JSON.stringify(cart));
    
    const existingToast = document.querySelector('.cart-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const selectedSizeLabel = state.selectedSize.charAt(0).toUpperCase() + state.selectedSize.slice(1);
    
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

function initMoreProductsCarousel() {
    const carouselContainer = document.getElementById('productCarousel');
    const progressContainer = document.getElementById('carouselProgress');
    const prevBtn = document.getElementById('prevProductBtn');
    const nextBtn = document.getElementById('nextProductBtn');

    if (!carouselContainer || !progressContainer || !prevBtn || !nextBtn) {
        return;
    }

    const currentPlantId = state.currentPlant ? state.currentPlant.id : null;
    moreProducts = getRandomPlants(12, currentPlantId);
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
