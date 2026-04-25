const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

function initializeStickyHeaderBlur() {
    const header = document.querySelector('.header');
    if (!header) {
        return;
    }

    function syncHeaderState() {
        header.classList.toggle('is-scrolled', window.scrollY > 10);
    }

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });
}

function toSafeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function normalizeSizeName(value) {
    return String(value || '')
        .toLowerCase()
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

async function loadBackendCatalog() {
    const [plants, categories, sizes] = await Promise.all([
        plantsAPI.getAll(),
        categoriesAPI.getAll(),
        plantSizesAPI.getAll()
    ]);

    const categoryMap = {};
    if (Array.isArray(categories)) {
        categories.forEach(cat => {
            categoryMap[cat.category_id] = cat.category_name || `Category ${cat.category_id}`;
        });
    }

    const sizeMap = {};
    if (Array.isArray(sizes)) {
        sizes.forEach(size => {
            if (!size.plant_id) return;
            if (!sizeMap[size.plant_id]) {
                sizeMap[size.plant_id] = [];
            }
            sizeMap[size.plant_id].push({
                sizeName: String(size.size_name || '').trim(),
                normalizedSize: normalizeSizeName(size.size_name),
                price: Number(size.price) || 0,
                stock: Number(size.stock_quantity) || 0
            });
        });
    }

    const plantsList = Array.isArray(plants)
        ? plants.map(p => ({
            ...p,
            plant_id: p.plant_id,
            plant_name: p.plant_name,
            category: categoryMap[p.category_id] || 'General',
            image: p.image_path || p.image || DEFAULT_PLANT_IMAGE,
            sizes: sizeMap[p.plant_id] || []
        }))
        : [];

    return plantsList;
}

function getPriceForReservation(item, backendPlant) {
    const reservationSize = normalizeSizeName(item.plantSize || item.size);
    const matchingSize = (backendPlant?.sizes || []).find(size => size.normalizedSize === reservationSize);

    if (matchingSize && matchingSize.price > 0) {
        return matchingSize.price;
    }

    return Math.max(0, toSafeNumber(item.price, 0));
}

function buildEmptyState() {
    return `
        <div class="empty-state">
            <div class="empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M3 3h2l2.4 10.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.5L22 6H7"/>
                    <circle cx="10" cy="20" r="1.4"/>
                    <circle cx="18" cy="20" r="1.4"/>
                </svg>
            </div>
            <h2>No reservations yet</h2>
            <p>Your reserved plants will appear here once you reserve from the reservation page.</p>
            <div class="empty-actions">
                <a class="btn-reserve" href="reservation.html">Reserve Plants</a>
                <a class="btn-shop" href="../Shopage/Shoppage.html">Go to Shop</a>
            </div>
        </div>
    `;
}

function renderReservations(container, reservations) {
    const grouped = {};
    reservations.forEach(item => {
        if (!grouped[item.deliveryDate]) {
            grouped[item.deliveryDate] = [];
        }
        grouped[item.deliveryDate].push(item);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));
    let html = '';

    sortedDates.forEach(date => {
        const plants = grouped[date];
        html += `
            <div class="date-group">
                <h2 class="date-header">Expected Delivery: ${formatDate(date)}</h2>
                <div class="plants-grid ${plants.length === 1 ? 'single-item' : ''}">
        `;

        plants.forEach(plant => {
            html += `
                <article class="plant-card">
                    <div class="plant-image-container">
                        <img class="plant-image" src="${plant.image}" alt="${plant.name}" onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                    </div>
                    <div class="plant-info">
                        <h3 class="plant-name">${plant.name}</h3>
                        <p class="plant-details"><strong>Quantity:</strong> <span>${plant.quantity}</span></p>
                        <p class="plant-details"><strong>Size:</strong> <span>${plant.plantSize || 'N/A'}</span></p>
                        <p class="plant-price">₱${plant.price.toFixed(2)}</p>
                        <p class="plant-details"><strong>Expected Delivery:</strong> <span>${formatDate(plant.deliveryDate)}</span></p>
                    </div>
                </article>
            `;
        });

        html += `
                </div>
                <div class="date-actions">
                    <button class="reservation-buy-now" onclick="goToDeliveryDetails('${date}')">Buy Now</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

async function loadReservations() {
    const container = document.getElementById('reservationsContainer');

    try {
        const backendPlants = await loadBackendCatalog();

        const rawReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
            .filter(item => !item.isPlacedOrder)
            .filter(item => item.deliveryDate);

        if (!rawReservations.length) {
            container.classList.add('is-empty');
            container.innerHTML = buildEmptyState();
            return;
        }

        const reservations = rawReservations.map(item => {
            const reservationPlantId = toSafeNumber(item.id ?? item.plantId, 0);
            const backendPlant = backendPlants.find(p => Number(p.plant_id) === reservationPlantId);

            return {
                ...item,
                id: reservationPlantId,
                name: item.name || backendPlant?.plant_name || 'Unknown Plant',
                quantity: Math.max(1, toSafeNumber(item.quantity, 1)),
                plantSize: item.plantSize || item.size || 'N/A',
                price: getPriceForReservation(item, backendPlant),
                image: backendPlant?.image || item.image || DEFAULT_PLANT_IMAGE,
                deliveryDate: item.deliveryDate
            };
        });

        container.classList.remove('is-empty');
        renderReservations(container, reservations);
    } catch (error) {
        console.error('ERROR LOADING RESERVATIONS:', error);
        container.classList.add('is-empty');
        container.innerHTML = `<h2>Error loading reservations</h2>`;
    }
}

function goToDeliveryDetails(date) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const selected = reservations.filter(item => item.deliveryDate === date);

    localStorage.setItem('selectedReservations', JSON.stringify(selected));
    localStorage.setItem('checkoutSource', 'reservation');
    window.location.href = '../CartPage/details.html';
}

window.addEventListener('DOMContentLoaded', function() {
    initializeStickyHeaderBlur();
    loadReservations();
});