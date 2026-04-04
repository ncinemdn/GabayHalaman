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

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initProductImageCarousel();
    initQuantityControls();
    initSizeButtons();
    initTabs();
    initMoreProductsCarousel();
});

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
