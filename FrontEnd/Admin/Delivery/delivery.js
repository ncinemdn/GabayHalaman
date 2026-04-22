const DELIVERY_STORAGE_KEY = 'gh_delivery_schedule_v1';

let deliveries = [];
let activeSearchQuery = '';
let activeStatusFilter = 'all';

const trackingStatusConfig = {
    'confirmed': 'Confirmed',
    'prepared': 'Prepared by Seller',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered'
};

function normalizeTrackingStatus(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'prepared' || value === 'prepared by seller' || value === 'seller prepared') {
        return 'prepared';
    }

    if (value === 'out for delivery' || value === 'out_for_delivery' || value === 'shipping') {
        return 'out_for_delivery';
    }

    if (value === 'delivered') {
        return 'delivered';
    }

    return 'confirmed';
}

function mapTrackingToDeliveryStatus(trackingStatus) {
    const value = normalizeTrackingStatus(trackingStatus);
    if (value === 'out_for_delivery') {
        return 'out-for-delivery';
    }

    if (value === 'delivered') {
        return 'delivered';
    }

    return 'pending';
}

// Status configurations
const statusConfig = {
    'out-for-delivery': {
        label: 'Out for Delivery',
        borderColor: '#78a240',
    },
    'pending': {
        label: 'Pending',
        borderColor: '#e7f464',
    },
    'delivered': {
        label: 'Delivered',
        borderColor: '#2555e8',
    }
};

function buildDeliveryAddress(details) {
    if (!details || typeof details !== 'object') {
        return 'Address not provided';
    }

    const address = String(details.address || '').trim();
    if (address) {
        return address;
    }

    return 'Address not provided';
}

function getNextDeliveryId(existingDeliveries) {
    const maxNumber = existingDeliveries.reduce((maxValue, delivery) => {
        const parsed = Number(String(delivery.deliveryId || '').replace(/[^0-9]/g, ''));
        if (!Number.isFinite(parsed)) {
            return maxValue;
        }
        return Math.max(maxValue, parsed);
    }, 2000);

    return '#DEL-' + String(maxNumber + 1);
}

function saveDeliveries() {
    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(deliveries));
}

function removeOrderFromUserStores(orderId) {
    const targetOrderId = String(orderId || '').trim();
    if (!targetOrderId) {
        return;
    }

    const purchases = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    const nextPurchases = Array.isArray(purchases)
        ? purchases.filter(order => String(order && order.orderId || '').trim() !== targetOrderId)
        : [];
    localStorage.setItem('purchaseOrders', JSON.stringify(nextPurchases));

    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const nextReservations = Array.isArray(reservations)
        ? reservations.filter(order => String(order && order.orderId || '').trim() !== targetOrderId)
        : [];
    localStorage.setItem('reservations', JSON.stringify(nextReservations));
}

function getPurchaseOrders() {
    const stored = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    return Array.isArray(stored) ? stored : [];
}

function getReservationOrders() {
    const stored = JSON.parse(localStorage.getItem('reservations') || '[]');
    if (!Array.isArray(stored)) {
        return [];
    }

    return stored.filter((order) => {
        if (!order || typeof order !== 'object') {
            return false;
        }

        if (order.isPlacedOrder === true) {
            return true;
        }

        return String(order.orderId || '').indexOf('#RES-') === 0;
    });
}

function getDeliverableOrders() {
    return getPurchaseOrders().concat(getReservationOrders());
}

function syncPurchaseOrdersToDeliveries() {
    const purchaseOrders = getDeliverableOrders();

    purchaseOrders.forEach((order) => {
        const orderId = String(order.orderId || '').trim();
        if (!orderId) {
            return;
        }

        const alreadyExists = deliveries.some((delivery) => String(delivery.orderId || '') === orderId);
        if (alreadyExists) {
            return;
        }

        const trackingStatus = normalizeTrackingStatus(order.trackingStatus || 'confirmed');
        const createdDate = order.createdAt ? new Date(order.createdAt) : new Date();
        const scheduledDate = createdDate.toISOString().slice(0, 10);

        deliveries.push({
            id: String(Date.now()) + '-' + Math.floor(Math.random() * 100000),
            deliveryId: getNextDeliveryId(deliveries),
            orderId: orderId,
            customerName: String(order.customerName || order.deliveryDetails?.fullName || 'Guest Customer'),
            deliveryAddress: buildDeliveryAddress(order.deliveryDetails),
            scheduledDate: scheduledDate,
            status: mapTrackingToDeliveryStatus(trackingStatus),
            trackingStatus: trackingStatus
        });
    });
}

function loadDeliveries() {
    const stored = JSON.parse(localStorage.getItem(DELIVERY_STORAGE_KEY) || '[]');
    deliveries = Array.isArray(stored) ? stored : [];

    const purchaseOrders = getDeliverableOrders();
    const validOrderIds = new Set(
        purchaseOrders
            .map((order) => String(order.orderId || '').trim())
            .filter(Boolean)
    );

    // Keep only rows that are still connected to buyer-side purchase orders.
    deliveries = deliveries.filter((delivery) => validOrderIds.has(String(delivery.orderId || '').trim()));

    deliveries = deliveries.map((delivery) => {
        const normalizedTracking = normalizeTrackingStatus(delivery.trackingStatus);
        return {
            ...delivery,
            trackingStatus: normalizedTracking,
            status: mapTrackingToDeliveryStatus(normalizedTracking)
        };
    });

    syncPurchaseOrdersToDeliveries();
    saveDeliveries();
}

function getFilteredDeliveries() {
    return deliveries.filter((delivery) => {
        const matchesSearch = !activeSearchQuery || (
            delivery.deliveryId.toLowerCase().includes(activeSearchQuery) ||
            delivery.orderId.toLowerCase().includes(activeSearchQuery) ||
            delivery.customerName.toLowerCase().includes(activeSearchQuery) ||
            delivery.deliveryAddress.toLowerCase().includes(activeSearchQuery) ||
            delivery.scheduledDate.includes(activeSearchQuery) ||
            String((statusConfig[delivery.status] && statusConfig[delivery.status].label) || '').toLowerCase().includes(activeSearchQuery) ||
            String(trackingStatusConfig[delivery.trackingStatus] || '').toLowerCase().includes(activeSearchQuery)
        );

        const matchesStatus = activeStatusFilter === 'all' || delivery.status === activeStatusFilter;
        return matchesSearch && matchesStatus;
    });
}

function applyFiltersAndRender() {
    renderDeliveries(getFilteredDeliveries());
}

// Initialize the page
function init() {
    loadDeliveries();
    updateStats();
    renderDeliveries();
    setupEventListeners();
}

// Update statistics
function updateStats() {
    const pendingCount = deliveries.filter(d => d.status === 'pending').length;
    const outForDeliveryCount = deliveries.filter(d => d.status === 'out-for-delivery').length;
    const deliveredCount = deliveries.filter(d => d.status === 'delivered').length;

    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('outForDeliveryCount').textContent = outForDeliveryCount;
    document.getElementById('deliveredCount').textContent = deliveredCount;
}

// Format ID for display
function formatId(id) {
    const parts = id.split('-');
    return `<div>${parts[0]}-</div><div>${parts[1]}</div>`;
}

function createTrackingStatusDropdown(delivery) {
    const statuses = ['confirmed', 'prepared', 'out_for_delivery', 'delivered'];
    const options = statuses.map(status => `
        <option value="${status}" ${delivery.trackingStatus === status ? 'selected' : ''}>
            ${trackingStatusConfig[status]}
        </option>
    `).join('');

    return `
        <select class="status-select tracking-status-select" data-id="${delivery.id}" aria-label="Tracking status for ${delivery.deliveryId}">
            ${options}
        </select>
    `;
}

// Render deliveries table
function renderDeliveries(filteredDeliveries = deliveries) {
    const tableBody = document.getElementById('deliveriesTable');
    
    if (filteredDeliveries.length === 0) {
        tableBody.innerHTML = '<div style="padding: 2rem; text-align: center; color: #666;">No deliveries found</div>';
        return;
    }

    tableBody.innerHTML = filteredDeliveries.map(delivery => `
        <div class="table-row" data-id="${delivery.id}">
            <div class="table-cell center">
                ${formatId(delivery.deliveryId)}
            </div>
            <div class="table-cell">
                ${formatId(delivery.orderId)}
            </div>
            <div class="table-cell bold">
                ${delivery.customerName}
            </div>
            <div class="table-cell address-cell">
                ${delivery.deliveryAddress}
            </div>
            <div class="table-cell">
                ${delivery.scheduledDate}
            </div>
            <div class="table-cell">
                <div class="delivery-status-stack">
                    ${createTrackingStatusDropdown(delivery)}
                </div>
            </div>
            <div class="table-cell action-cell">
                <button class="delete-btn" data-id="${delivery.id}" title="Delete delivery">
                    <svg class="trash-icon" viewBox="0 0 16 19" fill="currentColor">
                        <path d="M3.45775 18.6345C2.75908 18.6345 2.17475 18.3996 1.70475 17.9298C1.23492 17.4598 1 16.8754 1 16.1768V3.2345H0V1.0845H5.2V0H11.35V1.0845H16.55V3.2345H15.55V16.1768C15.55 16.8606 15.3113 17.4412 14.834 17.9185C14.3567 18.3958 13.7761 18.6345 13.0923 18.6345H3.45775ZM13.4 3.2345H3.15V16.1768C3.15 16.2666 3.17883 16.3403 3.2365 16.398C3.29417 16.4557 3.36792 16.4845 3.45775 16.4845H13.0923C13.1693 16.4845 13.2398 16.4524 13.3038 16.3883C13.3679 16.3243 13.4 16.2538 13.4 16.1768V3.2345ZM5.129 14.4595H7.27875V5.2595H5.129V14.4595ZM9.27125 14.4595H11.421V5.2595H9.27125V14.4595Z"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');

    // Setup delete buttons
    setupDeleteButtons();
    // Setup status dropdown changes
    setupStatusDropdowns();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    setupStatusFilterDropdown();
}

function setupStatusFilterDropdown() {
    const filterDropdown = document.getElementById('filterDropdown');
    const dropdownContainer = document.getElementById('statusFilterDropdown');
    const filterMenu = document.getElementById('statusFilterMenu');
    const filterLabel = document.getElementById('filterDropdownLabel');
    const options = filterMenu ? Array.from(filterMenu.querySelectorAll('.filter-option')) : [];

    if (!filterDropdown || !dropdownContainer || !filterMenu || !filterLabel) {
        return;
    }

    const closeDropdown = () => {
        dropdownContainer.classList.remove('is-open');
        filterDropdown.setAttribute('aria-expanded', 'false');
    };

    filterDropdown.addEventListener('click', (event) => {
        event.stopPropagation();
        const willOpen = !dropdownContainer.classList.contains('is-open');
        closeDropdown();
        if (willOpen) {
            dropdownContainer.classList.add('is-open');
            filterDropdown.setAttribute('aria-expanded', 'true');
        }
    });

    options.forEach((option) => {
        option.addEventListener('click', () => {
            activeStatusFilter = option.getAttribute('data-status') || 'all';
            options.forEach((item) => item.classList.remove('active'));
            option.classList.add('active');
            filterLabel.textContent = option.textContent || 'All Deliveries';
            closeDropdown();
            applyFiltersAndRender();
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#statusFilterDropdown')) {
            closeDropdown();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdown();
        }
    });
}

// Handle search
function handleSearch(event) {
    activeSearchQuery = String(event.target.value || '').toLowerCase().trim();
    applyFiltersAndRender();
}

// Setup delete buttons
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', handleDelete);
    });
}

// Handle delete
function handleDelete(event) {
    const id = event.currentTarget.getAttribute('data-id');
    const delivery = deliveries.find(d => d.id === id);
    
    if (confirm(`Are you sure you want to delete delivery ${delivery.deliveryId}?`)) {
        // Find and remove delivery
        const index = deliveries.findIndex(d => d.id === id);
        if (index !== -1) {
            removeOrderFromUserStores(delivery.orderId);
            deliveries.splice(index, 1);
            saveDeliveries();
            updateStats();
            renderDeliveries();
        }
    }
}

// Setup status dropdowns
function setupStatusDropdowns() {
    const trackingStatusDropdowns = document.querySelectorAll('.tracking-status-select');
    trackingStatusDropdowns.forEach(dropdown => {
        dropdown.addEventListener('change', handleTrackingStatusChange);
    });
}

function handleTrackingStatusChange(event) {
    const deliveryId = event.currentTarget.getAttribute('data-id');
    const newTrackingStatus = event.currentTarget.value;

    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
        delivery.trackingStatus = normalizeTrackingStatus(newTrackingStatus);
        delivery.status = mapTrackingToDeliveryStatus(delivery.trackingStatus);
        saveDeliveries();
        updateStats();
        renderDeliveries();
    }
}

// Logout function
function logout() {
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Logout button handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
