let purchaseOrders = [];
let reservationOrders = [];
let expandedTable = null;
let activeSearchQuery = '';
let activeStatusFilter = 'all';
let activeTypeFilter = 'all';

function normalizePaymentStatus(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'paid') {
        return 'paid';
    }

    if (value === 'partially paid' || value === 'partial' || value === 'partially_paid') {
        return 'partially_paid';
    }

    return 'unpaid';
}

function formatPaymentStatusLabel(status) {
    const value = normalizePaymentStatus(status);

    if (value === 'paid') {
        return 'Paid';
    }

    if (value === 'partially_paid') {
        return 'Partially Paid';
    }

    return 'Unpaid';
}

function normalizeStatus(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'delivered' || value === 'completed' || value === 'reserved') {
        return 'delivered';
    }

    if (value === 'cancel' || value === 'cancelled' || value === 'canceled') {
        return 'cancel';
    }

    return 'pending';
}

function formatPeso(value) {
    return '₱' + Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getPlantOrdered(order) {
    if (order.plantOrdered) {
        return order.plantOrdered;
    }

    if (!Array.isArray(order.items) || !order.items.length) {
        return 'N/A';
    }

    if (order.items.length === 1) {
        return order.items[0].name;
    }

    return order.items[0].name + ' +' + (order.items.length - 1) + ' more';
}

function getQuantity(order) {
    if (Number.isFinite(Number(order.quantity))) {
        return Number(order.quantity);
    }

    if (!Array.isArray(order.items)) {
        return 0;
    }

    return order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
}

function getTotalAmount(order) {
    if (typeof order.totalAmount === 'string') {
        return order.totalAmount;
    }

    return formatPeso(order.totalAmount);
}

function isLegacyDemoPurchase(order) {
    if (!order || typeof order !== 'object') {
        return false;
    }

    const id = String(order.id || '');
    if (id.indexOf('sample-') === 0) {
        return true;
    }

    return false;
}

async function loadPurchaseOrders() {
    try {
        const allRequests = await requestsAPI.getAll();
        purchaseOrders = allRequests.filter(order => (order.request_type || '').toLowerCase() === 'purchase').map(order => ({
            ...order,
            id: String(order.request_id || ''),
            orderId: order.request_id ? String(order.request_id) : '',
            customerName: order.client_name || 'Customer',
            paymentStatus: normalizePaymentStatus(order.payment_status),
            orderStatus: normalizeStatus(order.request_status)
        }));
    } catch (error) {
        console.error('Failed to load purchase orders:', error);
        purchaseOrders = [];
    }
}

async function loadReservationOrders() {
    try {
        const allRequests = await requestsAPI.getAll();
        reservationOrders = allRequests.filter(order => (order.request_type || '').toLowerCase() === 'reservation').map((order, index) => ({
            ...order,
            id: String(order.request_id || ''),
            adminReservationId: String(order.request_id || ''),
            orderId: order.request_id ? String(order.request_id) : '',
            customerName: order.client_name || 'Customer',
            plantOrdered: order.plant_name || 'N/A',
            quantity: order.quantity || 0,
            totalAmount: order.total_amount || 0,
            paymentStatus: normalizePaymentStatus(order.payment_status),
            orderStatus: normalizeStatus(order.request_status)
        }));
    } catch (error) {
        console.error('Failed to load reservation orders:', error);
        reservationOrders = [];
    }
}

// Orders are loaded from the backend and not persisted to localStorage.

// Initialize the page
async function init() {
    await loadPurchaseOrders();
    await loadReservationOrders();
    updateStats();
    renderMiniTables();
    setupEventListeners();
}

// Update statistics
function updateStats() {
    const allOrders = [...purchaseOrders, ...reservationOrders];
    const totalOrders = allOrders.length;
    const pendingCount = allOrders.filter(o => normalizeStatus(o.orderStatus) === 'pending').length;
    const completedCount = allOrders.filter(o => normalizeStatus(o.orderStatus) === 'delivered').length;

    document.getElementById('totalOrdersCount').textContent = totalOrders;
    document.getElementById('pendingCount').textContent = pendingCount;
    document.getElementById('completedCount').textContent = completedCount;
}

function getFilteredOrders(orders) {
    const query = activeSearchQuery;

    return orders.filter(order => {
        const matchesSearch = !query || (
            String(order.customerName || '').toLowerCase().includes(query) ||
            getPlantOrdered(order).toLowerCase().includes(query) ||
            String(order.orderId || '').toLowerCase().includes(query)
        );

        const matchesStatus = activeStatusFilter === 'all' || normalizeStatus(order.orderStatus) === activeStatusFilter;

        return matchesSearch && matchesStatus;
    });
}

function getFilteredPurchaseOrders() {
    if (activeTypeFilter === 'reservation') {
        return [];
    }

    return getFilteredOrders(purchaseOrders);
}

function getFilteredReservationOrders() {
    if (activeTypeFilter === 'purchase') {
        return [];
    }

    return getFilteredOrders(reservationOrders);
}

function applyFiltersAndRender() {
    if (expandedTable) {
        expandTable(expandedTable);
        return;
    }

    renderMiniTables();
}

// Render mini tables (side by side)
function renderMiniTables() {
    renderMiniTable('purchaseTable', getFilteredPurchaseOrders());
    renderMiniTable('reservationTable', getFilteredReservationOrders());
}

// Render individual mini table
function renderMiniTable(containerId, orders) {
    const container = document.getElementById(containerId);

    if (orders.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; text-align: center; color: #666;">No orders</p>';
        return;
    }

    const table = `
        <table class="mini-table">
            <thead>
                <tr>
                    <th>Customer</th>
                    <th>Plant</th>
                    <th>Payment</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => `
                    <tr>
                        <td><strong>${order.customerName}</strong></td>
                        <td>${getPlantOrdered(order)}</td>
                        <td><span class="status-badge ${normalizePaymentStatus(order.paymentStatus)}">${formatPaymentStatusLabel(order.paymentStatus)}</span></td>
                        <td><span class="status-badge ${normalizeStatus(order.orderStatus)}">${capitalizeFirst(normalizeStatus(order.orderStatus))}</span></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}

// Expand table to full view
function expandTable(type) {
    expandedTable = type;
    const orders = type === 'purchase' ? getFilteredPurchaseOrders() : getFilteredReservationOrders();

    document.getElementById('normalView').style.display = 'none';

    const expandedView = document.getElementById('expandedView');
    expandedView.style.display = 'block';

    expandedView.innerHTML = `
        <div class="expanded-header">
            <div class="expanded-header-grid">
                <div class="expanded-header-cell">ORDER ID</div>
                <div class="expanded-header-cell">CUSTOMER<br>NAME</div>
                <div class="expanded-header-cell">PLANT<br>ORDERED</div>
                <div class="expanded-header-cell">QUANTITY</div>
                <div class="expanded-header-cell">TOTAL<br>AMOUNT</div>
                <div class="expanded-header-cell">PAYMENT<br>STATUS</div>
                <div class="expanded-header-cell">STATUS</div>
            </div>
        </div>
        <div class="expanded-body">
            ${orders.map(order => `
                <div class="expanded-row">
                    <div class="expanded-cell">${order.orderId || 'N/A'}</div>
                    <div class="expanded-cell bold">${order.customerName || 'N/A'}</div>
                    <div class="expanded-cell">${getPlantOrdered(order)}</div>
                    <div class="expanded-cell bold">${getQuantity(order)}</div>
                    <div class="expanded-cell bold">${getTotalAmount(order)}</div>
                    <div class="expanded-cell">
                        <select class="status-select" onchange="setPaymentStatusByType('${type}', '${order.id}', this.value)">
                            <option value="unpaid" ${normalizePaymentStatus(order.paymentStatus) === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="partially_paid" ${normalizePaymentStatus(order.paymentStatus) === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
                            <option value="paid" ${normalizePaymentStatus(order.paymentStatus) === 'paid' ? 'selected' : ''}>Paid</option>
                        </select>
                    </div>
                    <div class="expanded-cell">
                        <select class="status-select" onchange="setOrderStatusByType('${type}', '${order.id}', this.value)">
                            <option value="pending" ${normalizeStatus(order.orderStatus) === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="cancel" ${normalizeStatus(order.orderStatus) === 'cancel' ? 'selected' : ''}>Cancel</option>
                            <option value="delivered" ${normalizeStatus(order.orderStatus) === 'delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="expanded-footer">
            <button class="minimize-btn" onclick="minimizeTable()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
                </svg>
            </button>
        </div>
    `;
}

function setOrderStatus(orderId, status) {
    const order = purchaseOrders.find(item => item.id === orderId);
    if (!order) {
        return;
    }

    order.orderStatus = normalizeStatus(status);
    updateStats();
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }
}

function setPaymentStatus(orderId, status) {
    const order = purchaseOrders.find(item => item.id === orderId);
    if (!order) {
        return;
    }

    order.paymentStatus = normalizePaymentStatus(status);
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }
}

function setOrderStatusByType(type, orderId, status) {
    if (type === 'purchase') {
        setOrderStatus(orderId, status);
        return;
    }

    const order = reservationOrders.find(item => item.id === orderId);
    if (!order) {
        return;
    }

    order.orderStatus = normalizeStatus(status);
    updateStats();
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }
}

function setPaymentStatusByType(type, orderId, status) {
    if (type === 'purchase') {
        setPaymentStatus(orderId, status);
        return;
    }

    const order = reservationOrders.find(item => item.id === orderId);
    if (!order) {
        return;
    }

    order.paymentStatus = normalizePaymentStatus(status);
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }
}

// Minimize expanded table
function minimizeTable() {
    expandedTable = null;
    document.getElementById('normalView').style.display = 'grid';
    document.getElementById('expandedView').style.display = 'none';
}

// Delete order
function deleteOrder(type, orderId) {
    if (!confirm('Are you sure you want to delete this order?')) {
        return;
    }

    let deletedOrderRecord = null;

    if (type === 'purchase') {
        deletedOrderRecord = purchaseOrders.find(o => o.id === orderId) || null;
        purchaseOrders = purchaseOrders.filter(o => o.id !== orderId);
    } else {
        deletedOrderRecord = reservationOrders.find(o => o.id === orderId) || null;
        reservationOrders = reservationOrders.filter(o => o.id !== orderId);
    }

    if (expandedTable) {
        expandTable(type);
    } else {
        renderMiniTables();
    }

    updateStats();
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    setupFilterDropdowns();
}

function setupFilterDropdowns() {
    const statusBtn = document.getElementById('statusBtn');
    const typesBtn = document.getElementById('typesBtn');
    const statusDropdown = document.getElementById('statusFilterDropdown');
    const typesDropdown = document.getElementById('typesFilterDropdown');
    const statusBtnLabel = document.getElementById('statusBtnLabel');
    const typesBtnLabel = document.getElementById('typesBtnLabel');

    const closeDropdowns = () => {
        statusDropdown.classList.remove('is-open');
        typesDropdown.classList.remove('is-open');
        statusBtn.setAttribute('aria-expanded', 'false');
        typesBtn.setAttribute('aria-expanded', 'false');
    };

    const openDropdown = (dropdown, button) => {
        closeDropdowns();
        dropdown.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
    };

    statusBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = statusDropdown.classList.contains('is-open');
        if (isOpen) {
            closeDropdowns();
            return;
        }
        openDropdown(statusDropdown, statusBtn);
    });

    typesBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = typesDropdown.classList.contains('is-open');
        if (isOpen) {
            closeDropdowns();
            return;
        }
        openDropdown(typesDropdown, typesBtn);
    });

    const statusOptions = document.querySelectorAll('.filter-option[data-filter="status"]');
    statusOptions.forEach(option => {
        option.addEventListener('click', () => {
            activeStatusFilter = option.getAttribute('data-value') || 'all';
            statusOptions.forEach(item => item.classList.remove('active'));
            option.classList.add('active');
            statusBtnLabel.textContent = 'Status: ' + capitalizeFirst(activeStatusFilter === 'all' ? 'all' : activeStatusFilter);
            closeDropdowns();
            applyFiltersAndRender();
        });
    });

    const typeOptions = document.querySelectorAll('.filter-option[data-filter="type"]');
    typeOptions.forEach(option => {
        option.addEventListener('click', () => {
            activeTypeFilter = option.getAttribute('data-value') || 'all';
            typeOptions.forEach(item => item.classList.remove('active'));
            option.classList.add('active');
            typesBtnLabel.textContent = 'Types: ' + capitalizeFirst(activeTypeFilter === 'all' ? 'all' : activeTypeFilter);
            closeDropdowns();
            applyFiltersAndRender();
        });
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.filter-dropdown')) {
            closeDropdowns();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDropdowns();
        }
    });
}

// Handle search
function handleSearch(event) {
    activeSearchQuery = String(event.target.value || '').toLowerCase().trim();
    applyFiltersAndRender();
}

// Utility: Capitalize first letter
function capitalizeFirst(str) {
    const value = String(str || '');
    if (!value.length) {
        return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
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
