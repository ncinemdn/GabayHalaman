const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";
const DELETE_TOAST_DURATION = 3200;

const deleteConfirmOverlay = document.getElementById('reservedDeleteConfirmOverlay');
const deleteConfirmMessage = document.getElementById('reservedDeleteConfirmMessage');
const deleteConfirmCancel = document.getElementById('reservedDeleteConfirmCancel');
const deleteConfirmAccept = document.getElementById('reservedDeleteConfirmAccept');
const deleteToastRegion = document.getElementById('reservedDeleteToastRegion');

let currentReservations = [];
let pendingDeleteSourceIndex = null;
let deleteToastHideTimeout = null;
let deleteToastRemoveTimeout = null;

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

function formatCurrency(amount) {
    const safeAmount = Number(amount || 0);
    const pesoSymbol = String.fromCharCode(8369);
    return `${pesoSymbol}${safeAmount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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
        ? plants.map(p => {
            const parsedImages = (window.GHPlantData && typeof window.GHPlantData.resolvePlantImagesById === 'function')
                ? window.GHPlantData.resolvePlantImagesById(p.plant_id, p.image_path || p.image || DEFAULT_PLANT_IMAGE)
                : [p.image_path || p.image || DEFAULT_PLANT_IMAGE];

            return {
                ...p,
                plant_id: p.plant_id,
                plant_name: p.plant_name,
                category: categoryMap[p.category_id] || 'General',
                image: parsedImages[0] || DEFAULT_PLANT_IMAGE,
                sizes: sizeMap[p.plant_id] || []
            };
        })
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
        <section class="cart-empty-shell">
            <div class="cart-empty-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 4H5L7 15H17L20 7H8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="10" cy="19" r="1.5" fill="currentColor"/>
                    <circle cx="17" cy="19" r="1.5" fill="currentColor"/>
                </svg>
            </div>
            <h2 class="cart-empty-title">No reservations yet</h2>
            <p class="cart-empty-desc">Reserve plants first, then come back here to review them by delivery date.</p>
            <div class="cart-empty-actions">
                <a class="cart-empty-btn primary" href="reservation.html">Reserve Plants</a>
                <a class="cart-empty-btn secondary" href="../Shopage/Shoppage.html">Browse Shop</a>
            </div>
        </section>
    `;
}

function renderCurrentReservations() {
    const container = document.getElementById('reservationsContainer');
    if (!container) {
        return;
    }

    if (!currentReservations.length) {
        container.classList.add('is-empty');
        container.innerHTML = buildEmptyState();
        return;
    }

    container.classList.remove('is-empty');
    renderReservations(container, currentReservations);
}

function showDeleteToast(itemName) {
    if (!deleteToastRegion) {
        return;
    }

    window.clearTimeout(deleteToastHideTimeout);
    window.clearTimeout(deleteToastRemoveTimeout);

    deleteToastRegion.innerHTML = '';

    const toast = document.createElement('section');
    toast.className = 'reserved-delete-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `
        <div class="reserved-delete-toast-badge" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 12.5L10.1 15.6L17.25 8.45" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <div class="reserved-delete-toast-copy">
            <p class="reserved-delete-toast-title">Reservation removed</p>
            <p class="reserved-delete-toast-text"></p>
        </div>
        <div class="reserved-delete-toast-progress"></div>
    `;

    const textElement = toast.querySelector('.reserved-delete-toast-text');
    if (textElement) {
        textElement.textContent = `${itemName} was removed from your reserved plants.`;
    }

    deleteToastRegion.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('is-visible');
        const progressBar = toast.querySelector('.reserved-delete-toast-progress');
        if (progressBar) {
            progressBar.style.animation = `reservedToastCountdown ${DELETE_TOAST_DURATION}ms linear forwards`;
        }
    });

    deleteToastHideTimeout = window.setTimeout(() => {
        toast.classList.remove('is-visible');
        deleteToastRemoveTimeout = window.setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 220);
    }, DELETE_TOAST_DURATION);
}

function openDeleteConfirmation(sourceIndex) {
    const reservation = currentReservations.find(item => item.sourceIndex === sourceIndex);
    if (!reservation || !deleteConfirmOverlay || !deleteConfirmMessage) {
        return;
    }

    pendingDeleteSourceIndex = sourceIndex;
    deleteConfirmMessage.textContent = `${reservation.name} reserved for ${formatDate(reservation.deliveryDate)} will be removed from this list.`;
    deleteConfirmOverlay.classList.add('is-open');
    deleteConfirmOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-modal-open');

    if (deleteConfirmCancel) {
        deleteConfirmCancel.focus();
    }
}

function closeDeleteConfirmation() {
    pendingDeleteSourceIndex = null;

    if (!deleteConfirmOverlay) {
        return;
    }

    deleteConfirmOverlay.classList.remove('is-open');
    deleteConfirmOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-modal-open');
}

function removeReservedPlant(sourceIndex) {
    const reservation = currentReservations.find(item => item.sourceIndex === sourceIndex);
    if (!reservation) {
        return;
    }

    const storedReservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const safeReservations = Array.isArray(storedReservations) ? storedReservations : [];
    const nextReservations = safeReservations.filter((_, index) => index !== sourceIndex);

    localStorage.setItem('reservations', JSON.stringify(nextReservations));

    currentReservations = currentReservations
        .filter(item => item.sourceIndex !== sourceIndex)
        .map(item => ({
            ...item,
            sourceIndex: item.sourceIndex > sourceIndex ? item.sourceIndex - 1 : item.sourceIndex
        }));

    renderCurrentReservations();
    showDeleteToast(reservation.name || 'The reserved plant');
}

function confirmDeleteItem() {
    const sourceIndexToDelete = pendingDeleteSourceIndex;

    if (deleteConfirmOverlay) {
        deleteConfirmOverlay.classList.remove('is-open');
        deleteConfirmOverlay.setAttribute('aria-hidden', 'true');
    }

    document.body.classList.remove('has-modal-open');
    pendingDeleteSourceIndex = null;

    if (sourceIndexToDelete !== null) {
        removeReservedPlant(sourceIndexToDelete);
    }
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
                <div class="date-group-header">
                    <p class="date-label">Expected Delivery</p>
                    <h2 class="date-header">${formatDate(date)}</h2>
                </div>
                <div class="plants-grid">
        `;

        plants.forEach(plant => {
            html += `
                <article class="plant-card">
                    <div class="plant-card-main">
                        <div class="plant-image-container">
                            <img class="plant-image" src="${plant.image}" alt="${plant.name}" onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                        </div>
                        <div class="plant-info">
                            <h3 class="plant-name">${plant.name}</h3>
                            <p class="plant-meta">Size: <span>${plant.plantSize || 'N/A'}</span></p>
                            <p class="plant-meta">Quantity: <span>${plant.quantity}</span></p>
                            <p class="plant-meta">Expected Delivery: <span>${formatDate(plant.deliveryDate)}</span></p>
                            <p class="plant-price">${formatCurrency(plant.price)}</p>
                        </div>
                    </div>
                    <div class="plant-card-actions">
                        <button type="button" class="reservation-delete-btn" onclick="openDeleteConfirmation(${plant.sourceIndex})" aria-label="Delete reserved plant">
                            <svg viewBox="0 0 16 19" fill="currentColor" aria-hidden="true">
                                <path d="M3.45775 18.6345C2.75908 18.6345 2.17475 18.3996 1.70475 17.9298C1.23492 17.4598 1 16.8754 1 16.1768V3.2345H0V1.0845H5.2V0H11.35V1.0845H16.55V3.2345H15.55V16.1768C15.55 16.8606 15.3113 17.4412 14.834 17.9185C14.3567 18.3958 13.7761 18.6345 13.0923 18.6345H3.45775ZM13.4 3.2345H3.15V16.1768C3.15 16.2666 3.17883 16.3403 3.2365 16.398C3.29417 16.4557 3.36792 16.4845 3.45775 16.4845H13.0923C13.1693 16.4845 13.2398 16.4524 13.3038 16.3883C13.3679 16.3243 13.4 16.2538 13.4 16.1768V3.2345ZM5.129 14.4595H7.27875V5.2595H5.129V14.4595ZM9.27125 14.4595H11.421V5.2595H9.27125V14.4595Z"/>
                            </svg>
                        </button>
                    </div>
                </article>
            `;
        });

        html += `
                </div>
                <div class="date-actions">
                    <button class="reservation-buy-now" onclick="goToDeliveryDetails('${date}')">Buy Reserved Plants</button>
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
            .map((item, sourceIndex) => ({ ...item, sourceIndex }))
            .filter(item => !item.isPlacedOrder)
            .filter(item => item.deliveryDate);

        if (!rawReservations.length) {
            currentReservations = [];
            renderCurrentReservations();
            return;
        }

        currentReservations = rawReservations.map(item => {
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

        renderCurrentReservations();
    } catch (error) {
        console.error('ERROR LOADING RESERVATIONS:', error);
        currentReservations = [];
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

if (deleteConfirmCancel) {
    deleteConfirmCancel.addEventListener('click', closeDeleteConfirmation);
}

if (deleteConfirmAccept) {
    deleteConfirmAccept.addEventListener('click', confirmDeleteItem);
}

if (deleteConfirmOverlay) {
    deleteConfirmOverlay.addEventListener('click', function(event) {
        if (event.target === deleteConfirmOverlay) {
            closeDeleteConfirmation();
        }
    });
}

document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && deleteConfirmOverlay && deleteConfirmOverlay.classList.contains('is-open')) {
        closeDeleteConfirmation();
    }
});

window.addEventListener('DOMContentLoaded', function() {
    initializeStickyHeaderBlur();
    loadReservations();
});