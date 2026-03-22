// Landing Page JavaScript - Functional Implementation

// State management
let currentProductIndex = 0;
let selectedTab = 'new';
const products = ['Calamansi', 'Pine Tree', 'Thai Bamboo'];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded');
    initializeTabs();
    initializeCarousel();
    initializeFAQs();
    initializeButtons();
    initializeNavigation();
});

// Tab functionality
function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Update selected tab
            selectedTab = this.dataset.tab;
            
            console.log(`Switched to ${selectedTab} tab`);
            
            // Here you could filter/load different products based on the tab
            // For now, we'll just log the change
        });
    });
}

// Carousel functionality
function initializeCarousel() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const productCards = document.querySelectorAll('.product-card');
    const productTrack = document.querySelector('.product-track');
    
    if (!prevBtn || !nextBtn || !productTrack) {
        console.error('Carousel elements not found');
        return;
    }

    // Previous button
    prevBtn.addEventListener('click', function() {
        currentProductIndex = currentProductIndex === 0 
            ? products.length - 1 
            : currentProductIndex - 1;
        
        updateCarousel();
        console.log(`Previous product: ${products[currentProductIndex]}`);
    });

    // Next button
    nextBtn.addEventListener('click', function() {
        currentProductIndex = currentProductIndex === products.length - 1 
            ? 0 
            : currentProductIndex + 1;
        
        updateCarousel();
        console.log(`Next product: ${products[currentProductIndex]}`);
    });

    // Update carousel position and styling
    function updateCarousel() {
        const cardWidth = 398; // Width of each card
        const gap = 32; // Gap between cards (2rem)
        const totalWidth = cardWidth + gap;
        
        // Calculate the offset to center the current product
        const offset = -currentProductIndex * totalWidth;
        
        // Apply transform to slide the carousel
        productTrack.style.transform = `translateX(${offset}px)`;
        
        // Update card opacity and scale
        productCards.forEach((card, index) => {
            const distance = Math.abs(index - currentProductIndex);
            
            if (distance === 0) {
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            } else {
                card.style.opacity = '0.6';
                card.style.transform = 'scale(0.9)';
            }
        });
    }

    // Initialize carousel position
    updateCarousel();
}

// FAQ accordion functionality
function initializeFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all FAQs
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // If this FAQ wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                console.log(`FAQ ${index + 1} opened`);
            } else {
                console.log(`FAQ ${index + 1} closed`);
            }
        });
    });
}

// Button functionality
function initializeButtons() {
    // Hero button
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            console.log('Shop now clicked');
            // Scroll to category section
            const categorySection = document.querySelector('.category-section');
            if (categorySection) {
                categorySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Reviews button
    const reviewsBtn = document.querySelector('.reviews-btn');
    if (reviewsBtn) {
        reviewsBtn.addEventListener('click', function() {
            console.log('Write a review clicked');
            alert('Review form would open here!');
            // In a real implementation, this would open a modal or redirect to a review page
        });
    }

    // Search button
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            console.log('Search clicked');
            alert('Search functionality would open here!');
            // In a real implementation, this would open a search modal
        });
    }

    // Cart button
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            console.log('Cart clicked');
            alert('Shopping cart would open here!');
            // In a real implementation, this would open the cart sidebar
        });
    }

    // Product action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach((btn, index) => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = btn.getAttribute('title');
            console.log(`${action} button clicked`);
            
            // Visual feedback
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 200);
        });
    });
}

// Navigation functionality
function initializeNavigation() {
    // Category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const label = this.querySelector('.category-label');
            const categoryName = label ? label.textContent.trim() : 'category';
            console.log(`Category clicked: ${categoryName}`);
            // In a real app, navigate to category page
        });
        
        // Hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '4px 8px 16px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '2px 4px 4px rgba(0, 0, 0, 0.25)';
        });
    });

    // Product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function() {
            const productName = this.querySelector('.product-name').textContent;
            console.log(`Product clicked: ${productName}`);
            // In a real app, navigate to product detail page
        });
    });

    // Navigation dropdowns
    const navDropdowns = document.querySelectorAll('.nav-dropdown');
    navDropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function() {
            const text = this.querySelector('.nav-link').textContent;
            console.log(`Navigation clicked: ${text}`);
            // In a real app, show dropdown menu
        });
    });

    // Smooth scroll for internal links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Utility function for adding items to cart
function addToCart(productName) {
    console.log(`Adding ${productName} to cart`);
    // In a real implementation, this would:
    // 1. Update cart state
    // 2. Show notification
    // 3. Update cart icon badge
    alert(`${productName} added to cart!`);
}

// Utility function for adding to favorites
function addToFavorites(productName) {
    console.log(`Adding ${productName} to favorites`);
    // In a real implementation, this would:
    // 1. Update favorites state
    // 2. Change heart icon to filled
    // 3. Show notification
    alert(`${productName} added to favorites!`);
}

// Scroll animations (optional enhancement)
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.category-card, .feature-item, .product-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize scroll animations after a short delay
setTimeout(initializeScrollAnimations, 500);

// Keyboard navigation for carousel
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        document.querySelector('.carousel-btn-prev')?.click();
    } else if (e.key === 'ArrowRight') {
        document.querySelector('.carousel-btn-next')?.click();
    }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Window resized, recalculating layout');
        // Recalculate carousel position if needed
        const productTrack = document.querySelector('.product-track');
        if (productTrack) {
            const cardWidth = 398;
            const gap = 32;
            const totalWidth = cardWidth + gap;
            const offset = -currentProductIndex * totalWidth;
            productTrack.style.transform = `translateX(${offset}px)`;
        }
    }, 250);
});

// Loading animation (optional)
window.addEventListener('load', function() {
    console.log('All resources loaded');
    document.body.classList.add('loaded');
});

// Export functions for potential use in other scripts
window.LandingPage = {
    addToCart,
    addToFavorites,
    goToProduct: (index) => {
        currentProductIndex = index;
        const productTrack = document.querySelector('.product-track');
        if (productTrack) {
            const cardWidth = 398;
            const gap = 32;
            const totalWidth = cardWidth + gap;
            const offset = -currentProductIndex * totalWidth;
            productTrack.style.transform = `translateX(${offset}px)`;
        }
    }
};

