let selectedTab = 'new';
let trendingCenterIndex = 1;
let categoryIndex = 0;

const productsByTab = {
    new: [
        { name: 'Calamansi', image: '../LandingPage/calamansi.jpg' },
        { name: 'Pine Tree', image: '../LandingPage/pine_tree.jpg' },
        { name: 'Thai Bamboo', image: '../LandingPage/thai_bamboo.jpg' },
        { name: 'Meyer Lemon', image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=680&q=80' },
        { name: 'Dwarf Coconut', image: 'https://images.unsplash.com/photo-1629730071038-f0f445fdf5b6?auto=format&fit=crop&w=680&q=80' },
        { name: 'Blossom Guava', image: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?auto=format&fit=crop&w=680&q=80' }
    ],
    bestseller: [
        { name: 'Mango Deluxe', image: 'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?auto=format&fit=crop&w=680&q=80' },
        { name: 'Sun Citrus', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=680&q=80' },
        { name: 'Forest Shade', image: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=680&q=80' },
        { name: 'Ruby Flowering', image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=680&q=80' },
        { name: 'Evergreen Palm', image: 'https://images.unsplash.com/photo-1520315342629-6ea920342047?auto=format&fit=crop&w=680&q=80' },
        { name: 'Fruit King Mix', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=680&q=80' }
    ]
};

function getVisibleCards() {
    if (window.innerWidth <= 768) {
        return 1;
    }
    if (window.innerWidth <= 1024) {
        return 2;
    }
    return 3;
}

function buildActionButton(type) {
    if (type === 'cart') {
        return '<button class="action-btn" title="Add to cart"><svg class="action-icon" fill="none" viewBox="0 0 24 24"><path d="M7.3 21C6.67 21 6.13 20.77 5.68 20.31C5.23 19.85 5 19.31 5 18.68V9.4L3.18 5H1V3H4.53L6.18 7H20.95C21.33 7 21.63 7.16 21.83 7.48C22.03 7.79 22.03 8.12 21.85 8.45L19 14.02C19.85 14.16 20.56 14.55 21.14 15.2C21.71 15.85 22 16.62 22 17.5C22 18.47 21.66 19.29 20.99 19.98C20.31 20.66 19.49 21 18.52 21C17.54 21 16.71 20.66 16.04 19.98C15.36 19.29 15.02 18.47 15.02 17.5C15.02 17.17 15.07 16.86 15.15 16.58C15.23 16.29 15.35 16.02 15.5 15.75L12.22 15.45L9.23 19.95C9.01 20.28 8.73 20.54 8.39 20.73C8.05 20.91 7.68 21 7.3 21Z" fill="#3c5830"/></svg></button>';
    }

    return '<button class="action-btn" title="Sale"><svg class="action-icon" fill="none" viewBox="0 0 24 24"><path d="M5 7.5V5h2.5L14.4 11.9a2.8 2.8 0 0 1 0 4l-2.5 2.5a2.8 2.8 0 0 1-4 0L1 11.5V9h2.5L9.3 14.8a.95.95 0 1 0 1.35-1.35L5 7.5Zm11.25-2.25A2.25 2.25 0 1 1 18.5 7.5a2.25 2.25 0 0 1-2.25-2.25Z" fill="#3c5830"/></svg></button>';
}

function renderTrendingProducts() {
    const track = document.querySelector('#trendingTrack');
    const items = productsByTab[selectedTab] || [];
    const visibleCards = getVisibleCards();

    if (!track || items.length === 0) {
        return;
    }

    track.innerHTML = items.map(function(item, index) {
        const isCenter = index === trendingCenterIndex;
        return '<article class="product-card' + (isCenter ? ' is-center' : '') + '" data-index="' + index + '">' +
            '<div class="product-card-inner">' +
                '<div class="product-image"><img src="' + item.image + '" alt="' + item.name + '"></div>' +
            '</div>' +
            '<div class="product-info">' +
                '<h3 class="product-name">' + item.name + '</h3>' +
                '<div class="product-actions">' + buildActionButton('cart') + buildActionButton('sale') + '</div>' +
            '</div>' +
        '</article>';
    }).join('');

    const shift = Math.max(trendingCenterIndex - Math.floor(visibleCards / 2), 0);
    const maxShift = Math.max(items.length - visibleCards, 0);
    const clampedShift = Math.min(shift, maxShift);
    const percentage = 100 / visibleCards;
    track.style.transform = 'translateX(-' + (clampedShift * percentage) + '%)';
}

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-btn');

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(item) {
                item.classList.remove('active');
            });

            tab.classList.add('active');
            selectedTab = tab.dataset.tab;
            trendingCenterIndex = 1;
            renderTrendingProducts();
        });
    });
}

function initializeTrendingCarousel() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');

    if (!prevBtn || !nextBtn) {
        return;
    }

    prevBtn.addEventListener('click', function() {
        const products = productsByTab[selectedTab] || [];
        if (!products.length) {
            return;
        }

        trendingCenterIndex = trendingCenterIndex === 0 ? products.length - 1 : trendingCenterIndex - 1;
        renderTrendingProducts();
    });

    nextBtn.addEventListener('click', function() {
        const products = productsByTab[selectedTab] || [];
        if (!products.length) {
            return;
        }

        trendingCenterIndex = trendingCenterIndex === products.length - 1 ? 0 : trendingCenterIndex + 1;
        renderTrendingProducts();
    });
}

function initializeCategoryCarousel() {
    const track = document.querySelector('#categoryTrack');
    const cards = Array.from(document.querySelectorAll('.category-slide'));
    const prevBtn = document.querySelector('.category-nav-prev');
    const nextBtn = document.querySelector('.category-nav-next');

    if (!track || !cards.length || !prevBtn || !nextBtn) {
        return;
    }

    function updateCategoryTrack() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(cards.length - visibleCards, 0);
        categoryIndex = Math.max(0, Math.min(categoryIndex, maxIndex));
        const percentage = 100 / visibleCards;
        track.style.transform = 'translateX(-' + (categoryIndex * percentage) + '%)';
    }

    prevBtn.addEventListener('click', function() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(cards.length - visibleCards, 0);
        categoryIndex = categoryIndex <= 0 ? maxIndex : categoryIndex - 1;
        updateCategoryTrack();
    });

    nextBtn.addEventListener('click', function() {
        const visibleCards = getVisibleCards();
        const maxIndex = Math.max(cards.length - visibleCards, 0);
        categoryIndex = categoryIndex >= maxIndex ? 0 : categoryIndex + 1;
        updateCategoryTrack();
    });

    updateCategoryTrack();
    window.addEventListener('resize', updateCategoryTrack);
}

function initializeFAQs() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        if (!question) {
            return;
        }

        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            faqItems.forEach(function(faq) {
                faq.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

function initializeButtons() {
    const heroBtn = document.querySelector('.hero-btn');
    if (heroBtn) {
        heroBtn.addEventListener('click', function() {
            const categorySection = document.querySelector('.category-section');
            if (categorySection) {
                categorySection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
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
        reviewStars.forEach(function(star) {
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
        reviewDate.textContent = 'Posted on ' + new Date().toLocaleDateString();

        reviewHeader.appendChild(reviewName);
        reviewHeader.appendChild(reviewStarsText);
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewComment);
        reviewItem.appendChild(reviewDate);

        reviewsList.prepend(reviewItem);
        updateReviewsNoteVisibility();
    }

    reviewsBtn.addEventListener('click', function() {
        openModal(reviewModal);
    });

    closeReviewModalBtn.addEventListener('click', function() {
        closeModal(reviewModal);
    });

    closeSuccessModalBtn.addEventListener('click', function() {
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

    reviewStars.forEach(function(star) {
        star.addEventListener('click', function() {
            const rating = Number(star.dataset.rating);
            setStarRating(rating);
        });
    });

    reviewForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const nameInput = document.querySelector('#reviewName');
        const commentInput = document.querySelector('#reviewComment');
        const ratingValue = Number(reviewRatingInput.value || 0);
        const name = (nameInput.value || '').trim();
        const comment = (commentInput.value || '').trim();

        if (!name || !comment) {
            return;
        }

        addReviewToList({
            name: name,
            comment: comment,
            rating: ratingValue > 0 ? ratingValue : 5
        });

        closeModal(reviewModal);
        openModal(reviewSuccessModal);
        reviewForm.reset();
        setStarRating(0);
    });

    updateReviewsNoteVisibility();
}

function initializeFooter() {
    const backToTopButton = document.querySelector('.footer-back-to-top');
    if (!backToTopButton) {
        return;
    }

    backToTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeTrendingCarousel();
    initializeCategoryCarousel();
    initializeFAQs();
    initializeButtons();
    initializeReviewModals();
    initializeFooter();
    renderTrendingProducts();

    window.addEventListener('resize', renderTrendingProducts);
});

