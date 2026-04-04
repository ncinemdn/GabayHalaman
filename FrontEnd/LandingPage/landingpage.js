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

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

const reservationPlantsByCategory = {
    'Fruit Bearing': [
        { name: 'Rambutan RR Tuklapin', price: 250, image: 'https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Mangosteen', price: 350, image: 'https://images.unsplash.com/photo-1706698352015-a907c7f8a445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Lansones Longkong', price: 350, image: DEFAULT_PLANT_IMAGE },
        { name: 'Durian Puyat', price: 300, image: 'https://images.unsplash.com/photo-1630510526315-aba311212355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Sweet Tamarind', price: 250, image: 'https://images.unsplash.com/photo-1597081779002-314055fe24ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Bangkok Santol', price: 250, image: 'https://images.unsplash.com/photo-1737992468893-9c109da39f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: "Dian't Duhat", price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Sweet Balimbing', price: 250, image: 'https://images.unsplash.com/photo-1760509614441-e9ca05cba0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Citrus Variety': [
        { name: 'Japanese Orange', price: 300, image: 'https://images.unsplash.com/photo-1769968065899-832195e26d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Davao Pomelo', price: 250, image: 'https://images.unsplash.com/photo-1655082291675-b919ca1c3419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Satsuma Citrus', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Dalanghita', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Dayap', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Calamansi', price: 200, image: 'https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Kiat Kiat', price: 300, image: DEFAULT_PLANT_IMAGE },
        { name: 'Lemon Meyer', price: 250, image: 'https://images.unsplash.com/photo-1585931158785-8e8b240c627f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Mangga Variety': [
        { name: 'Carabao Manggo', price: 350, image: DEFAULT_PLANT_IMAGE },
        { name: 'Queen Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Sweet Catimon', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Sweet Catimon Double Rootstock', price: 800, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Indian Manggo', price: 250, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'King Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Purple Manggo', price: 350, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Apple Manggo', price: 250, image: 'https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Dwarf Coconut': [
        { name: 'Golden', price: 400, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Tacunan Variety', price: 550, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Catigan Variety', price: 250, image: 'https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Cuttings/Dwarf': [
        { name: 'Red Guaple', price: 200, image: 'https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Green Guaple', price: 200, image: 'https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Marang', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Lychee', price: 350, image: 'https://images.unsplash.com/photo-1705335834319-92a152363ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Langka', price: 200, image: DEFAULT_PLANT_IMAGE },
        { name: 'Hybrid Mulberry', price: 200, image: 'https://images.unsplash.com/photo-1711641011417-3162af1e834c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Red Cardinal Grapes', price: 250, image: 'https://images.unsplash.com/photo-1660805376081-c6b01b7b78f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Sweet Guyabano', price: 300, image: 'https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Flowering Trees': [
        { name: 'Golden Trumpet', price: 700, image: 'https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Pink Trumpet', price: 800, image: 'https://images.unsplash.com/photo-1760135638379-0e749e10c1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Golden Shower', price: 900, image: 'https://images.unsplash.com/photo-1683613791927-660d0ed2d86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Fire Tree', price: 1200, image: 'https://images.unsplash.com/photo-1683356478048-ea3261e194b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Ilang Ilang', price: 700, image: 'https://images.unsplash.com/photo-1552017650-c117c3535f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Jacaranda', price: 1000, image: 'https://images.unsplash.com/photo-1695389591261-ee471f900c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Pine Tree', price: 1200, image: 'https://images.unsplash.com/photo-1643550265302-a91ec947eb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Palm Tree', price: 1500, image: 'https://images.unsplash.com/photo-1761001826491-91409e63205a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
    ],
    'Forest Trees': [
        { name: 'Gemelina', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Mahogany', price: 350, image: 'https://images.unsplash.com/photo-1544840281-274ae2755620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Narra', price: 350, image: 'https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Molave', price: 250, image: DEFAULT_PLANT_IMAGE },
        { name: 'Pole Bamboo', price: 550, image: 'https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' },
        { name: 'Thai Bamboo', price: 550, image: 'https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080' }
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

function formatPeso(value) {
    return '₱' + Number(value).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderCategoryProducts(categoryKey, categoryLabel) {
    const resultsSection = document.querySelector('#categoryProductsSection');
    const resultsTitle = document.querySelector('#categoryProductsTitle');
    const resultsGrid = document.querySelector('#categoryProductsGrid');
    const plants = reservationPlantsByCategory[categoryKey] || [];

    if (!resultsSection || !resultsTitle || !resultsGrid) {
        return;
    }

    resultsTitle.textContent = categoryLabel + ' Plants';

    if (!plants.length) {
        resultsGrid.innerHTML = '<p class="category-products-empty">No plants found for this category.</p>';
    } else {
        resultsGrid.innerHTML = plants.map(function(plant) {
            return '<article class="category-product-card">' +
                '<div class="category-product-image-wrap">' +
                    '<img class="category-product-image" src="' + plant.image + '" alt="' + plant.name + '" loading="lazy" onerror="this.src=\'' + DEFAULT_PLANT_IMAGE + '\'">' +
                '</div>' +
                '<h4 class="category-product-name">' + plant.name + '</h4>' +
                '<p class="category-product-price">' + formatPeso(plant.price) + '</p>' +
            '</article>';
        }).join('');
    }

    resultsSection.hidden = false;
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initializeCategoryShopByCategory() {
    const categoryCards = document.querySelectorAll('.category-slide[data-reservation-category]');

    categoryCards.forEach(function(card) {
        card.addEventListener('click', function(event) {
            event.preventDefault();

            const reservationCategory = card.dataset.reservationCategory || '';
            const categoryLabel = card.dataset.categoryLabel || reservationCategory;

            if (!reservationCategory) {
                return;
            }

            renderCategoryProducts(reservationCategory, categoryLabel);
        });
    });
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

