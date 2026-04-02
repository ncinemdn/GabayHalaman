// Landing Page JavaScript - Functional Implementation


// State management
let currentProductIndex = 1;
let selectedTab = 'new';
const products = ['Calamansi', 'Pine Tree', 'Thai Bamboo'];
let updateCarouselPosition = null;


// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded');
    initializeTabs();
    initializeCarousel();
    initializeFAQs();
    initializeButtons();
    initializeReviewModals();
    initializeFooter();
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
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    const productTrack = document.querySelector('.product-track');
    const productsWrapper = document.querySelector('.products-wrapper');
   
    if (!prevBtn || !nextBtn || !productTrack || !productsWrapper || productCards.length === 0) {
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
        const cardWidth = productCards[0].offsetWidth;
        const trackStyle = window.getComputedStyle(productTrack);
        const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || '0') || 0;
        const step = cardWidth + gap;
        const wrapperWidth = productsWrapper.clientWidth;

        // Keep selected card centered in wrapper.
        const centeredOffset = (wrapperWidth / 2) - ((currentProductIndex * step) + (cardWidth / 2));
        productTrack.style.transform = `translateX(${centeredOffset}px)`;

        productCards.forEach((card, index) => {
            const distance = Math.abs(index - currentProductIndex);
            card.style.opacity = distance === 0 ? '1' : '0.6';
            card.style.transform = distance === 0 ? 'scale(1)' : 'scale(0.9)';
        });
    }

    updateCarouselPosition = updateCarousel;


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


function initializeReviewModals() {
    const reviewsBtn = document.querySelector('.reviews-btn');
    const reviewModal = document.querySelector('#reviewModal');
    const reviewSuccessModal = document.querySelector('#reviewSuccessModal');
    const closeReviewModalBtn = document.querySelector('#closeReviewModal');
    const closeSuccessModalBtn = document.querySelector('#closeSuccessModal');
    const reviewForm = document.querySelector('#reviewForm');
    const reviewStars = document.querySelectorAll('.review-star');
    const reviewRatingInput = document.querySelector('#reviewRating');
    const reviewsList = document.querySelector('#reviewsList');
    const reviewsNote = document.querySelector('.reviews-note');

    if (!reviewsBtn || !reviewModal || !reviewSuccessModal || !reviewForm) {
        return;
    }

    function openModal(modal) {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        if (!reviewModal.classList.contains('is-open') && !reviewSuccessModal.classList.contains('is-open')) {
            document.body.classList.remove('modal-open');
        }
    }

    function setStarRating(rating) {
        reviewStars.forEach(star => {
            const starValue = Number(star.dataset.rating);
            star.classList.toggle('active', starValue <= rating);
        });
        if (reviewRatingInput) {
            reviewRatingInput.value = String(rating);
        }
    }

    function updateReviewsNoteVisibility() {
        if (!reviewsNote || !reviewsList) {
            return;
        }
        reviewsNote.style.display = reviewsList.children.length > 0 ? 'none' : '';
    }

    function buildStars(rating) {
        const safeRating = Math.max(1, Math.min(5, rating));
        return '★'.repeat(safeRating) + '☆'.repeat(5 - safeRating);
    }

    function addReviewToList(reviewData) {
        if (!reviewsList) {
            return;
        }

        const reviewItem = document.createElement('article');
        reviewItem.className = 'review-item';

        const reviewHeader = document.createElement('div');
        reviewHeader.className = 'review-item-header';

        const reviewName = document.createElement('p');
        reviewName.className = 'review-item-name';
        reviewName.textContent = reviewData.name;

        const reviewStarsText = document.createElement('p');
        reviewStarsText.className = 'review-item-stars';
        reviewStarsText.textContent = buildStars(reviewData.rating);

        const reviewComment = document.createElement('p');
        reviewComment.className = 'review-item-comment';
        reviewComment.textContent = reviewData.comment;

        const reviewDate = document.createElement('p');
        reviewDate.className = 'review-item-date';
        reviewDate.textContent = `Posted on ${new Date().toLocaleDateString()}`;

        reviewHeader.appendChild(reviewName);
        reviewHeader.appendChild(reviewStarsText);
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewComment);
        reviewItem.appendChild(reviewDate);

        reviewsList.prepend(reviewItem);
        updateReviewsNoteVisibility();
    }


    function initializeFooter() {
        const backToTopButton = document.querySelector('.footer-back-to-top');

        if (!backToTopButton) {
            return;
        }

        function updateFooterArrow() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const maxScrollTop = Math.max(docHeight - viewportHeight, 0);
            const distanceFromBottom = maxScrollTop - scrollTop;
            const nearTop = scrollTop < 120;
            const nearBottom = distanceFromBottom < 120;

            if (nearTop) {
                backToTopButton.textContent = '⌄';
                backToTopButton.setAttribute('aria-label', 'Scroll to bottom');
                backToTopButton.setAttribute('aria-expanded', 'false');
                backToTopButton.classList.remove('is-bottom');
                backToTopButton.dataset.direction = 'down';
                return;
            }

            if (nearBottom) {
                backToTopButton.textContent = '⌃';
                backToTopButton.setAttribute('aria-label', 'Scroll to top');
                backToTopButton.setAttribute('aria-expanded', 'true');
                backToTopButton.classList.add('is-bottom');
                backToTopButton.dataset.direction = 'up';
                return;
            }

            if (scrollTop < docHeight / 2) {
                backToTopButton.textContent = '⌄';
                backToTopButton.setAttribute('aria-label', 'Scroll to bottom');
                backToTopButton.setAttribute('aria-expanded', 'false');
                backToTopButton.classList.remove('is-bottom');
                backToTopButton.dataset.direction = 'down';
            } else {
                backToTopButton.textContent = '⌃';
                backToTopButton.setAttribute('aria-label', 'Scroll to top');
                backToTopButton.setAttribute('aria-expanded', 'true');
                backToTopButton.classList.add('is-bottom');
                backToTopButton.dataset.direction = 'up';
            }
        }

        backToTopButton.addEventListener('click', function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
            const docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            const maxScrollTop = Math.max(docHeight - viewportHeight, 0);
            const direction = backToTopButton.dataset.direction || (scrollTop > maxScrollTop / 2 ? 'up' : 'down');

            backToTopButton.classList.remove('is-animating-up', 'is-animating-down');
            void backToTopButton.offsetWidth;
            backToTopButton.classList.add(direction === 'up' ? 'is-animating-up' : 'is-animating-down');

            if (direction === 'down') {
                window.scrollTo({ top: maxScrollTop, behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

            window.setTimeout(function() {
                backToTopButton.classList.remove('is-animating-up', 'is-animating-down');
            }, 260);
        });

        updateFooterArrow();
        window.addEventListener('scroll', updateFooterArrow, { passive: true });
        window.addEventListener('resize', updateFooterArrow);
    }

    reviewsBtn.addEventListener('click', function() {
        openModal(reviewModal);
    });

    closeReviewModalBtn?.addEventListener('click', function() {
        closeModal(reviewModal);
    });

    closeSuccessModalBtn?.addEventListener('click', function() {
        closeModal(reviewSuccessModal);
    });

    reviewModal.addEventListener('click', function(event) {
        if (event.target === reviewModal) {
            closeModal(reviewModal);
        }
    });

    reviewSuccessModal.addEventListener('click', function(event) {
        if (event.target === reviewSuccessModal) {
            closeModal(reviewSuccessModal);
        }
    });

    reviewStars.forEach(star => {
        star.addEventListener('click', function() {
            const rating = Number(star.dataset.rating);
            setStarRating(rating);
        });
    });

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.querySelector('#reviewName');
        const commentInput = document.querySelector('#reviewComment');
        const ratingValue = Number(reviewRatingInput?.value || 0);

        const name = (nameInput?.value || '').trim();
        const comment = (commentInput?.value || '').trim();

        if (!name || !comment) {
            return;
        }

        addReviewToList({
            name,
            comment,
            rating: ratingValue > 0 ? ratingValue : 5
        });

        closeModal(reviewModal);
        openModal(reviewSuccessModal);
        reviewForm.reset();
        setStarRating(0);
    });

    updateReviewsNoteVisibility();

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (reviewSuccessModal.classList.contains('is-open')) {
                closeModal(reviewSuccessModal);
            }
            if (reviewModal.classList.contains('is-open')) {
                closeModal(reviewModal);
            }
        }
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
        if (typeof updateCarouselPosition === 'function') {
            updateCarouselPosition();
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
        if (index < 0 || index >= products.length) return;
        currentProductIndex = index;
        if (typeof updateCarouselPosition === 'function') {
            updateCarouselPosition();
        }
    }
};






