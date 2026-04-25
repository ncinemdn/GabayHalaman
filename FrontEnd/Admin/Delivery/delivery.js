let deliveries = [];
let activeSearchQuery = '';
let activeStatusFilter = 'all';
const DELIVERY_STORAGE_KEY = 'gh_delivery_schedule_v1';

const trackingStatusConfig = {
    'placed_order': 'Placed Order',
    'confirmed': 'Confirmed',
    'shipped': 'Shipped',
    'delivered': 'Delivered'
};

function normalizeTrackingStatus(status) {
    const value = String(status || '').toLowerCase();

    if (!value || value === 'placed order' || value === 'placed_order' || value === 'placed-order' || value === 'pending') {
        return 'placed_order';
    }

    if (value === 'prepared' || value === 'prepared by seller' || value === 'seller prepared') {
        return 'confirmed';
    }

    if (value === 'confirmed') {
        return 'confirmed';
    }

    if (value === 'out for delivery' || value === 'out_for_delivery' || value === 'shipping' || value === 'shipped') {
        return 'shipped';
    }

    if (value === 'delivered') {
        return 'delivered';
    }

    return 'placed_order';
}

function mapTrackingToDeliveryStatus(trackingStatus) {
    const value = normalizeTrackingStatus(trackingStatus);
    if (value === 'shipped') {
        return 'out-for-delivery';
    }

    if (value === 'delivered') {
        return 'delivered';
    }

    return 'pending';
}

function getTrackingFilterStatus(delivery) {
    const value = normalizeTrackingStatus(delivery && delivery.trackingStatus);

    return value.replace(/_/g, '-');
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

function normalizeOrderStatus(status) {
    const value = String(status || '').toLowerCase();
    if (value === 'delivered' || value === 'completed' || value === 'reserved') {
        return 'delivered';
    }
    if (value === 'out for delivery' || value === 'out_for_delivery' || value === 'shipping' || value === 'shipped') {
        return 'shipped';
    }
    if (value === 'confirmed') {
        return 'confirmed';
    }
    if (value === 'placed order' || value === 'placed_order' || value === 'pending') {
        return 'placed_order';
    }
    return 'placed_order';
}

function getDeliveryTypeLabel(requestType) {
    const value = String(requestType || '').toLowerCase();
    if (value === 'reservation') {
        return 'Reserve';
    }
    if (value === 'purchase') {
        return 'Buy';
    }
    return 'Delivery';
}

function formatDateForDisplay(value) {
    if (!value) {
        return '';
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return String(value);
    }

    return parsed.toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    });
}

function getLocalPurchaseOrders() {
    const purchases = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    if (!Array.isArray(purchases)) {
        return [];
    }

    return purchases.map(order => ({
        ...order,
        id: String(order.id || order.orderId || ''),
        orderId: String(order.orderId || ''),
        customerName: order.customerName || 'Customer',
        orderStatus: normalizeOrderStatus(order.orderStatus),
        requestType: 'purchase'
    }));
}

function getLocalReservationOrders() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    if (!Array.isArray(reservations)) {
        return [];
    }

    return reservations
        .filter(order => order && order.isPlacedOrder === true)
        .map(order => ({
            ...order,
            id: String(order.id || order.orderId || ''),
            orderId: String(order.orderId || ''),
            customerName: order.customerName || 'Customer',
            orderStatus: normalizeOrderStatus(order.orderStatus),
            requestType: 'reservation'
        }));
}

function mergeOrdersWithLocalOrders(backendOrders, localOrders) {
    if (!Array.isArray(localOrders) || !localOrders.length) {
        return backendOrders;
    }

    const localOrderMap = new Map();
    localOrders.forEach(order => {
        const key = String(order.orderId || order.id || '');
        if (key) {
            localOrderMap.set(key, order);
        }
    });

    const merged = backendOrders.map(order => {
        const key = String(order.orderId || order.id || '');
        const localOrder = localOrderMap.get(key);
        if (!localOrder) {
            return order;
        }

        localOrderMap.delete(key);

        return {
            ...order,
            ...localOrder
        };
    });

    const remainingLocalOrders = Array.from(localOrderMap.values());
    return [...remainingLocalOrders, ...merged];
}

async function loadRequestOrders() {
    const localPurchaseOrders = getLocalPurchaseOrders();
    const localReservationOrders = getLocalReservationOrders();

    if (typeof requestsAPI === 'undefined') {
        return [...localPurchaseOrders, ...localReservationOrders];
    }

    try {
        const allRequests = await requestsAPI.getAll();
        if (!Array.isArray(allRequests)) {
            return [...localPurchaseOrders, ...localReservationOrders];
        }

        const backendPurchaseOrders = allRequests
            .filter(order => String(order.request_type || '').toLowerCase() === 'purchase')
            .map(order => ({
                ...order,
                id: String(order.request_id || ''),
                orderId: order.request_id ? String(order.request_id) : '',
                customerName: order.client_name || 'Customer',
                orderStatus: normalizeOrderStatus(order.request_status),
                requestType: 'purchase'
            }));

        const backendReservationOrders = allRequests
            .filter(order => String(order.request_type || '').toLowerCase() === 'reservation')
            .map(order => ({
                ...order,
                id: String(order.request_id || ''),
                orderId: order.request_id ? String(order.request_id) : '',
                customerName: order.client_name || 'Customer',
                orderStatus: normalizeOrderStatus(order.request_status),
                requestType: 'reservation'
            }));

        const purchaseOrders = mergeOrdersWithLocalOrders(backendPurchaseOrders, localPurchaseOrders);
        const reservationOrders = mergeOrdersWithLocalOrders(backendReservationOrders, localReservationOrders);
        return [...purchaseOrders, ...reservationOrders];
    } catch (error) {
        console.error('Failed to load request orders for delivery view:', error);
        return [...localPurchaseOrders, ...localReservationOrders];
    }
}

function buildSyntheticDeliveryFromOrder(order, index) {
    const orderId = String(order.orderId || order.id || '').trim();
    const normalizedStatus = normalizeOrderStatus(order.orderStatus || order.request_status);
    const trackingStatus = normalizeTrackingStatus(normalizedStatus);
    const deliveryAddress =
        order.delivery_address ||
        (order.deliveryDetails && order.deliveryDetails.address) ||
        'Address not provided';
    const scheduledDate =
        (order.deliveryDetails && order.deliveryDetails.deliveryDate) ||
        order.scheduled_date ||
        order.request_date ||
        order.createdAt ||
        '';

    return {
        id: String(order.id || order.orderId || 'local') + '-synthetic-' + index,
        deliveryId: '',
        orderId,
        customerName: order.customerName || order.client_name || order.full_name || 'Customer',
        deliveryAddress,
        scheduledDate: formatDateForDisplay(scheduledDate),
        status: mapTrackingToDeliveryStatus(trackingStatus),
        trackingStatus,
        requestType: String(order.requestType || order.request_type || '').toLowerCase(),
        typeLabel: getDeliveryTypeLabel(order.requestType || order.request_type)
    };
}

async function loadDeliveries() {
    try {
        const allDeliveries = await deliveriesAPI.getAll();
        const backendDeliveries = (Array.isArray(allDeliveries) ? allDeliveries : []).map(d => ({
            id: String(d.delivery_id || ''),
            deliveryId: '#DEL-' + d.delivery_id,
            orderId: d.request_id ? String(d.request_id) : '',
            customerName: d.client_name || d.full_name || 'Customer',
            deliveryAddress: d.delivery_address || 'Address not provided',
            scheduledDate: formatDateForDisplay(d.scheduled_date),
            status: mapTrackingToDeliveryStatus(d.delivery_status || d.status),
            trackingStatus: normalizeTrackingStatus(d.delivery_status || d.status),
            requestType: String(d.request_type || '').toLowerCase(),
            typeLabel: getDeliveryTypeLabel(d.request_type)
        }));

        const requestOrders = await loadRequestOrders();
        const backendOrderIds = new Set(backendDeliveries.map(item => String(item.orderId || '').trim()).filter(Boolean));
        const syntheticDeliveries = requestOrders
            .map((order, index) => buildSyntheticDeliveryFromOrder(order, index))
            .filter(item => item.orderId && !backendOrderIds.has(String(item.orderId)));

        deliveries = [...backendDeliveries, ...syntheticDeliveries];
    } catch (error) {
        console.error('Failed to load deliveries:', error);
        const requestOrders = await loadRequestOrders();
        deliveries = requestOrders.map((order, index) => buildSyntheticDeliveryFromOrder(order, index));
    }
}

function getFilteredDeliveries() {
    return deliveries.filter((delivery) => {
        const matchesSearch = !activeSearchQuery || (
            delivery.deliveryId.toLowerCase().includes(activeSearchQuery) ||
            delivery.orderId.toLowerCase().includes(activeSearchQuery) ||
            String(delivery.typeLabel || '').toLowerCase().includes(activeSearchQuery) ||
            delivery.customerName.toLowerCase().includes(activeSearchQuery) ||
            delivery.deliveryAddress.toLowerCase().includes(activeSearchQuery) ||
            String(delivery.scheduledDate || '').toLowerCase().includes(activeSearchQuery) ||
            String((statusConfig[delivery.status] && statusConfig[delivery.status].label) || '').toLowerCase().includes(activeSearchQuery) ||
            String(trackingStatusConfig[delivery.trackingStatus] || '').toLowerCase().includes(activeSearchQuery)
        );

        const matchesStatus = activeStatusFilter === 'all' || getTrackingFilterStatus(delivery) === activeStatusFilter;
        return matchesSearch && matchesStatus;
    });
}

function applyFiltersAndRender() {
    renderDeliveries(getFilteredDeliveries());
}

async function populateSignedInAdminHeader() {
    let userName = 'Admin';
    let userRole = 'Administrator';

    try {
        const currentAdmin = JSON.parse(localStorage.getItem('admin') || 'null');
        if (currentAdmin) {
            userName = currentAdmin.full_name || currentAdmin.name || userName;
            userRole = currentAdmin.role || userRole;

            if (typeof adminAPI !== 'undefined' && Number.isFinite(Number(currentAdmin.admin_id))) {
                const adminData = await adminAPI.getById(currentAdmin.admin_id);
                userName = adminData?.full_name || adminData?.name || userName;
                userRole = adminData?.role || userRole;
            }
        }
    } catch (error) {
        console.warn('Unable to load admin user data:', error);
    }

    const userNameEl = document.querySelector('.profile-name');
    const userRoleEl = document.querySelector('.profile-role');

    if (userNameEl) userNameEl.textContent = userName;
    if (userRoleEl) userRoleEl.textContent = userRole;
}

// Initialize the page
async function init() {
    await populateSignedInAdminHeader();
    await loadDeliveries();
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
    const value = String(id || '');
    if (!value.includes('-')) {
        return `<div>${value}</div>`;
    }

    const parts = value.split('-');
    return `<div>${parts[0]}-</div><div>${parts.slice(1).join('-')}</div>`;
}

function createTrackingStatusDropdown(delivery) {
    const statuses = ['placed_order', 'confirmed', 'shipped', 'delivered'];
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
            <div class="table-cell">
                ${formatId(delivery.orderId)}
                <div style="font-size: 11px; font-weight: 600; color: #6a6a6a; margin-top: 4px;">${delivery.typeLabel || 'Delivery'}</div>
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
    const delivery = deliveries.find(d => String(d.id) === String(id));
    
    if (delivery && confirm(`Are you sure you want to delete delivery ${delivery.deliveryId}?`)) {
        const index = deliveries.findIndex(d => String(d.id) === String(id));
        if (index !== -1) {
            deliveries.splice(index, 1);
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

function getDeliveryScheduleSnapshot() {
    const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
}

function upsertDeliveryScheduleEntry(delivery) {
    if (!delivery || !delivery.orderId) {
        return;
    }

    const schedule = getDeliveryScheduleSnapshot();
    const orderId = String(delivery.orderId);
    const nextEntry = {
        orderId,
        trackingStatus: delivery.trackingStatus,
        status: delivery.status,
        updatedAt: new Date().toISOString()
    };

    const index = schedule.findIndex(item => String(item.orderId || '') === orderId);
    if (index >= 0) {
        schedule[index] = {
            ...schedule[index],
            ...nextEntry
        };
    } else {
        schedule.push(nextEntry);
    }

    localStorage.setItem(DELIVERY_STORAGE_KEY, JSON.stringify(schedule));
}

function syncOrderTrackingStatus(orderId, trackingStatus) {
    if (!orderId) {
        return;
    }

    const normalizedStatus = normalizeTrackingStatus(trackingStatus);
    const updateTracking = (items) => {
        if (!Array.isArray(items)) {
            return items;
        }

        return items.map(item => {
            const itemOrderId = String(item.orderId || item.id || '');
            if (itemOrderId !== String(orderId)) {
                return item;
            }

            return {
                ...item,
                trackingStatus: normalizedStatus
            };
        });
    };

    const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    localStorage.setItem('purchaseOrders', JSON.stringify(updateTracking(purchaseOrders) || []));

    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    localStorage.setItem('reservations', JSON.stringify(updateTracking(reservations) || []));
}

async function persistDeliveryStatusUpdate(delivery) {
    if (!delivery) {
        return;
    }

    upsertDeliveryScheduleEntry(delivery);
    syncOrderTrackingStatus(delivery.orderId, delivery.trackingStatus);

    const requestId = Number(delivery.orderId || delivery.id);
    if (!Number.isFinite(requestId) || typeof requestsAPI === 'undefined') {
        return;
    }

    const backendStatusMap = {
        placed_order: 'pending',
        confirmed: 'confirmed',
        shipped: 'out for delivery',
        delivered: 'delivered'
    };

    try {
        await requestsAPI.updateStatus(requestId, {
            request_status: backendStatusMap[delivery.trackingStatus] || 'pending',
            last_updated: new Date().toISOString()
        });
    } catch (error) {
        console.warn('Unable to persist delivery tracking status to backend:', error);
    }
}

async function handleTrackingStatusChange(event) {
    const deliveryId = event.currentTarget.getAttribute('data-id');
    const newTrackingStatus = event.currentTarget.value;

    const delivery = deliveries.find(d => d.id === deliveryId);
    if (delivery) {
        delivery.trackingStatus = normalizeTrackingStatus(newTrackingStatus);
        delivery.status = mapTrackingToDeliveryStatus(delivery.trackingStatus);
        await persistDeliveryStatusUpdate(delivery);
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
