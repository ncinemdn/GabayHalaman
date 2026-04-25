let selectedTab = 'new';
let trendingCenterIndex = 1;
let categoryIndex = 0;

const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1448991311032-c1a2cf2d65fb?auto=format&fit=crop&w=1080&q=80';
const DEFAULT_CATEGORY_IMAGE = DEFAULT_PLANT_IMAGE;

let allPlantsPool = [];
let categoryDisplayMap = {};
let categoryImageMap = {};
let categoriesLoaded = false;

const productsByTab = {
    new: [],
    bestseller: []
};

const PLANT_API = {
    async getPlantInventory() {
        try {
            const [plants, sizes, categories] = await Promise.all([
                plantsAPI.getAll(),
                plantSizesAPI.getAll(),
                categoriesAPI.getAll()
            ]);

            const categoryMap = {};
            if (Array.isArray(categories)) {
                categories.forEach(cat => {
                    const displayName = cat.category_name || cat.name || `Category ${cat.category_id}`;
                    categoryMap[cat.category_id] = displayName;
                });
            }

            const plantSizeMap = {};
            if (Array.isArray(sizes)) {
                sizes.forEach(size => {
                    if (size.plant_id && !plantSizeMap[size.plant_id]) {
                        plantSizeMap[size.plant_id] = size;
                    }
                });
            }

            return Array.isArray(plants) ? plants.map(p => ({
                id: p.plant_id,
                name: p.plant_name,
                category: categoryMap[p.category_id] || 'General',
                price: Number((plantSizeMap[p.plant_id]?.price) || 0),
                image: p.image_path || p.image || DEFAULT_PLANT_IMAGE,
                stock: Number((plantSizeMap[p.plant_id]?.stock_quantity) || 0)
            })) : [];
        } catch (error) {
            console.error('Failed to fetch landing page inventory:', error);
            return [];
        }
    },

    getPlantByName(name) {
        if (!name || !allPlantsPool.length) {
            return null;
        }

        const searchName = normalizePlantName(name);
        return allPlantsPool.find(function(plant) {
            return normalizePlantName(plant.name) === searchName;
        }) || null;
    }
};

async function loadLandingData() {
    try {
        const [plants, categories] = await Promise.all([
            PLANT_API.getPlantInventory(),
            categoriesAPI.getAll()
        ]);

        allPlantsPool = Array.isArray(plants) ? plants : [];

        if (Array.isArray(categories)) {
            categories.forEach(cat => {
                const displayName = cat.category_name || cat.name || `Category ${cat.category_id}`;
                categoryDisplayMap[displayName] = displayName;
                categoryImageMap[displayName] = cat.image || DEFAULT_CATEGORY_IMAGE;
            });
        }

        categoriesLoaded = true;
        syncTrendingWithInventory();
        renderCategoryTrack();
        initializeCategoryCarousel();
    } catch (error) {
        console.error('Failed to load landing page data:', error);
    }
}

function renderCategoryTrack() {
    const track = document.getElementById('categoryTrack');
    if (!track) {
        return;
    }

    const cardStyles = ['category-card-brown', 'category-card-green', 'category-card-sage'];
    const categoryCards = Object.keys(categoryDisplayMap).map((category, index) => {
        const cardClass = cardStyles[index % cardStyles.length];
        const image = categoryImageMap[category] || DEFAULT_CATEGORY_IMAGE;
        const categorySlug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));

        return `
            <a class="category-card ${cardClass} category-slide" href="../Shopage/Shoppage.html?category=${categorySlug}" data-category-label="${category}">
                <div class="category-image-standard">
                    <img alt="${category}" src="${image}" onerror="this.src='${DEFAULT_CATEGORY_IMAGE}'">
                </div>
                <div class="category-label">${category}</div>
            </a>
        `;
    }).join('');

    track.innerHTML = categoryCards || '<div class="category-empty">No categories are available yet.</div>';
}

function getRandomPlants(count) {
    const shuffled = [...allPlantsPool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

function syncTrendingWithInventory() {
    if (!allPlantsPool.length) {
        productsByTab.new = [];
        productsByTab.bestseller = [];
        return;
    }

    productsByTab.new = getRandomPlants(Math.min(6, allPlantsPool.length));
    productsByTab.bestseller = [...allPlantsPool]
        .sort((a, b) => Number(b.price || 0) - Number(a.price || 0))
        .slice(0, Math.min(6, allPlantsPool.length));
}

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

function buildProductDetailUrl(plant) {
    let plantId = String(plant.id || '').trim();

    if (!plantId && PLANT_API) {
        const found = findInventoryPlantByName(plant.name, plant.category);
        if (found) {
            plantId = String(found.id);
        }
    }

    const params = new URLSearchParams({
        name: plant.name,
        category: plant.category || 'Shop',
        image: plant.image,
        price: String(plant.price || 250)
    });

    if (plantId) {
        params.set('id', plantId);
    }

    return `../Shopage/product-detail.html?${params.toString()}`;
}

function renderTrendingProducts() {
    syncTrendingWithInventory();

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
                '<div class="product-actions">' + buildActionButton('cart') + '</div>' +
            '</div>' +
        '</article>';
    }).join('');

    const productCards = track.querySelectorAll('.product-card');
    productCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const index = Number(card.dataset.index);
            const selectedPlant = items[index];
            if (!selectedPlant) {
                return;
            }

            window.location.href = buildProductDetailUrl(selectedPlant);
        });
    });

    const actionButtons = track.querySelectorAll('.action-btn');
    actionButtons.forEach(function(btn) {
        btn.addEventListener('click', function(event) {
            event.stopPropagation();
            const parentCard = btn.closest('.product-card');
            if (!parentCard) {
                return;
            }

            const index = Number(parentCard.dataset.index);
            const selectedPlant = items[index];
            if (!selectedPlant) {
                return;
            }

            window.location.href = buildProductDetailUrl(selectedPlant);
        });
    });

    const shift = Math.max(trendingCenterIndex - Math.floor(visibleCards / 2), 0);
    const maxShift = Math.max(items.length - visibleCards, 0);
    const clampedShift = Math.min(shift, maxShift);
    const firstCard = track.querySelector('.product-card');
    const trackStyles = window.getComputedStyle(track);
    const gap = parseFloat(trackStyles.columnGap || trackStyles.gap || '0') || 0;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 0;
    const step = cardWidth + gap;
    track.style.transform = 'translateX(-' + (clampedShift * step) + 'px)';
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

    if (!resultsSection || !resultsTitle || !resultsGrid) {
        return;
    }

    const plants = allPlantsPool.filter(function(plant) {
        return normalizeCategoryName(plant.category) === normalizeCategoryName(categoryKey);
    });

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
    // Category cards now have direct hrefs to Shoppage.html?category=...
    // No JS override needed – let the <a> links navigate naturally.
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
        const postedDate = reviewData.createdAt ? new Date(reviewData.createdAt) : new Date();
        reviewDate.textContent = 'Posted on ' + postedDate.toLocaleDateString();

        reviewHeader.appendChild(reviewName);
        reviewHeader.appendChild(reviewStarsText);
        reviewItem.appendChild(reviewHeader);
        reviewItem.appendChild(reviewComment);
        reviewItem.appendChild(reviewDate);

        reviewsList.prepend(reviewItem);
        updateReviewsNoteVisibility();
    }

    function getDefaultReviewPlantId() {
        const firstPlant = Array.isArray(allPlantsPool) && allPlantsPool.length ? allPlantsPool[0] : null;
        const plantId = Number(firstPlant?.id || 0);
        return Number.isFinite(plantId) && plantId > 0 ? plantId : null;
    }

    async function resolveReviewClientId(name, email) {
        if (typeof clientsAPI === 'undefined') {
            return null;
        }

        const normalizedName = String(name || '').trim();
        const normalizedEmail = String(email || '').trim().toLowerCase();

        try {
            const clients = await clientsAPI.getAll();
            if (Array.isArray(clients)) {
                const existingClient = clients.find(function(client) {
                    const clientName = String(client.full_name || '').trim();
                    const clientEmail = String(client.email || '').trim().toLowerCase();

                    if (normalizedEmail && clientEmail === normalizedEmail) {
                        return true;
                    }

                    return normalizedName && clientName === normalizedName;
                });

                if (existingClient && Number(existingClient.client_id) > 0) {
                    return Number(existingClient.client_id);
                }
            }

            const fallbackEmail = normalizedEmail || ('review-' + Date.now() + '@gabayhalaman.local');
            await clientsAPI.create({
                full_name: normalizedName,
                email: fallbackEmail,
                contact_number: 0,
                created_at: new Date().toISOString()
            });

            const refreshedClients = await clientsAPI.getAll();
            if (Array.isArray(refreshedClients)) {
                const createdClient = refreshedClients.find(function(client) {
                    const clientName = String(client.full_name || '').trim();
                    const clientEmail = String(client.email || '').trim().toLowerCase();
                    return clientName === normalizedName && clientEmail === fallbackEmail;
                });

                if (createdClient && Number(createdClient.client_id) > 0) {
                    return Number(createdClient.client_id);
                }
            }
        } catch (error) {
            console.warn('Failed to resolve client for review:', error);
        }

        return null;
    }

    async function loadReviewsFromBackend() {
        if (typeof reviewsAPI === 'undefined') {
            updateReviewsNoteVisibility();
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

            reviewsList.innerHTML = '';

            if (Array.isArray(reviews)) {
                const sorted = [...reviews].sort(function(a, b) {
                    const aTime = new Date(a.created_at || 0).getTime();
                    const bTime = new Date(b.created_at || 0).getTime();
                    return bTime - aTime;
                });

                sorted.forEach(function(review) {
                    addReviewToList({
                        name: clientMap[Number(review.client_id)] || 'Customer',
                        comment: String(review.comment ?? '').trim() || 'No comment provided.',
                        rating: Number(review.rating || 5),
                        createdAt: review.created_at
                    });
                });
            }
        } catch (error) {
            console.warn('Unable to fetch reviews from database:', error);
        }

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

    reviewForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const nameInput = document.querySelector('#reviewName');
        const commentInput = document.querySelector('#reviewComment');
        const ratingValue = Number(reviewRatingInput.value || 0);
        const name = (nameInput.value || '').trim();
        const email = ((document.querySelector('#reviewEmail')?.value) || '').trim();
        const comment = (commentInput.value || '').trim();
        const resolvedRating = ratingValue > 0 ? ratingValue : 5;

        if (!name || !comment) {
            return;
        }

        const plantId = getDefaultReviewPlantId();
        if (!plantId) {
            alert('Unable to submit review right now. Please try again later.');
            return;
        }

        const clientId = await resolveReviewClientId(name, email);
        if (!clientId) {
            alert('Unable to submit review right now. Please try again later.');
            return;
        }

        if (typeof reviewsAPI === 'undefined') {
            alert('Review service is unavailable right now.');
            return;
        }

        const submitBtn = reviewForm.querySelector('.review-submit-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
        }

        try {
            await reviewsAPI.create({
                plant_id: Number(plantId),
                client_id: Number(clientId),
                rating: Number(resolvedRating),
                comment: String(comment),
                created_at: new Date().toISOString()
            });

            await loadReviewsFromBackend();
        } catch (error) {
            console.warn('Failed to save review:', error);
            alert('Unable to submit your review right now. Please try again later.');
            return;
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send a review';
            }
        }

        closeModal(reviewModal);
        openModal(reviewSuccessModal);
        reviewForm.reset();
        setStarRating(0);
    });

    loadReviewsFromBackend();
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

document.addEventListener('DOMContentLoaded', async function() {
    await loadLandingData();
    initializeTabs();
    initializeTrendingCarousel();
    initializeCategoryShopByCategory();
    initializeFAQs();
    initializeButtons();
    initializeReviewModals();
    initializeFooter();
    renderTrendingProducts();

    window.addEventListener('resize', renderTrendingProducts);
});

