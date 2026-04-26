const PURCHASE_ORDERS_KEY = 'purchaseOrders';
const RESERVATIONS_KEY = 'reservations';
let purchaseOrders = [];
let reservationOrders = [];
let expandedTable = null;
let activeSearchQuery = '';
let activeStatusFilter = 'all';
let activeTypeFilter = 'all';
let pendingAction = null;
let actionLoadingTimer = null;
let actionToastTimer = null;

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

    if (value === 'deleted') {
        return 'deleted';
    }

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
    if (order.plantOrdered && order.plantOrdered !== 'N/A') {
        return order.plantOrdered;
    }

    if (order.plant_name) {
        return order.plant_name;
    }

    if (order.plantName) {
        return order.plantName;
    }

    if (!Array.isArray(order.items) || !order.items.length) {
        if (order.request_type) {
            return order.request_type.toLowerCase() === 'reservation' ? 'Reserved Plants' : 'Purchase Order';
        }

        return 'N/A';
    }

    const firstItem = order.items[0];
    const itemName = firstItem?.name || firstItem?.plant_name || firstItem?.plantName || '';
    if (!itemName) {
        return 'N/A';
    }

    if (order.items.length === 1) {
        return itemName;
    }

    return itemName + ' +' + (order.items.length - 1) + ' more';
}

function getQuantity(order) {
    const explicitQuantity = Number(order.quantity);
    if (Number.isFinite(explicitQuantity) && explicitQuantity > 0) {
        return explicitQuantity;
    }

    if (Array.isArray(order.items) && order.items.length) {
        return order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    }

    if (Number.isFinite(Number(order.total_amount))) {
        return 1;
    }

    return 0;
}

function getTotalAmount(order) {
    const amount = order.totalAmount ?? order.total_amount ?? (Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0), 0) : 0);
    return formatPeso(amount);
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function getValidIdAttachment(order) {
    const deliveryDetails = order && typeof order === 'object' ? (order.deliveryDetails || {}) : {};
    return String(
        order?.validIdAttachment ||
        order?.valid_id_attachment ||
        deliveryDetails.validIdAttachment ||
        deliveryDetails.valid_id_attachment ||
        ''
    ).trim();
}

function getValidIdFileName(order) {
    const deliveryDetails = order && typeof order === 'object' ? (order.deliveryDetails || {}) : {};
    return String(
        order?.validIdFileName ||
        order?.valid_id_file_name ||
        deliveryDetails.validIdFileName ||
        deliveryDetails.valid_id_file_name ||
        'Valid ID'
    ).trim();
}

function hasSupportedValidIdAttachment(attachment) {
    return (
        attachment.indexOf('data:application/pdf;base64,') === 0 ||
        attachment.indexOf('data:image/jpeg;base64,') === 0 ||
        attachment.indexOf('data:image/png;base64,') === 0
    );
}

function getValidIdContentType(order) {
    const deliveryDetails = order && typeof order === 'object' ? (order.deliveryDetails || {}) : {};
    return String(
        order?.validIdContentType ||
        order?.valid_id_content_type ||
        deliveryDetails.validIdContentType ||
        deliveryDetails.valid_id_content_type ||
        ''
    ).trim().toLowerCase();
}

function getOrderByType(type, orderId) {
    const orderCollection = type === 'purchase' ? purchaseOrders : reservationOrders;
    return orderCollection.find(order => String(order.id) === String(orderId)) || null;
}

function getValidIdLinkMarkup(type, order) {
    const attachment = getValidIdAttachment(order);
    if (!attachment || !hasSupportedValidIdAttachment(attachment)) {
        return '<span class="valid-id-empty">N/A</span>';
    }

    return `
        <button
            class="valid-id-link"
            type="button"
            title="${escapeHtml(getValidIdFileName(order))}"
            onclick="openValidIdPreviewByType('${escapeHtml(type)}', '${escapeHtml(String(order?.id || ''))}')"
        >
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M2 12C4.8 7.8 8.13333 5.7 12 5.7C15.8667 5.7 19.2 7.8 22 12C19.2 16.2 15.8667 18.3 12 18.3C8.13333 18.3 4.8 16.2 2 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
            </svg>
            <span>View ID</span>
        </button>
    `;
}

function buildValidIdPreviewMarkup(order) {
    const attachment = getValidIdAttachment(order);
    const contentType = getValidIdContentType(order);

    if (!attachment || !hasSupportedValidIdAttachment(attachment)) {
        return `
            <div class="valid-id-preview-stage valid-id-preview-empty">
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 9V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <circle cx="12" cy="17" r="1" fill="currentColor"/>
                    <path d="M10.3 3.86L2.62 17.14C1.85 18.47 2.81 20.14 4.35 20.14H19.68C21.22 20.14 22.19 18.47 21.42 17.14L13.74 3.86C12.97 2.53 11.05 2.53 10.3 3.86Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
                <p class="valid-id-preview-empty-title">No valid ID uploaded</p>
                <p class="valid-id-preview-empty-text">This request does not have a supported valid ID image or PDF yet.</p>
            </div>
        `;
    }

    if (contentType.indexOf('application/pdf') === 0 || attachment.indexOf('data:application/pdf;base64,') === 0) {
        return `
            <div class="valid-id-preview-stage">
                <iframe class="valid-id-preview-frame" src="${escapeHtml(attachment)}" title="${escapeHtml(getValidIdFileName(order))}"></iframe>
            </div>
        `;
    }

    return `
        <div class="valid-id-preview-stage valid-id-preview-image-wrap">
            <img class="valid-id-preview-image" src="${escapeHtml(attachment)}" alt="${escapeHtml(getValidIdFileName(order))}">
        </div>
    `;
}

function closeValidIdPreview() {
    const modal = document.getElementById('validIdPreviewModal');
    const body = document.getElementById('validIdPreviewBody');
    const fileName = document.getElementById('validIdPreviewFileName');

    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (body) {
        body.innerHTML = '';
    }

    if (fileName) {
        fileName.textContent = 'No file selected';
    }

    document.body.classList.remove('valid-id-preview-open');
}

function openValidIdPreviewByType(type, orderId) {
    const order = getOrderByType(type, orderId);
    if (!order) {
        return;
    }

    const modal = document.getElementById('validIdPreviewModal');
    const body = document.getElementById('validIdPreviewBody');
    const fileName = document.getElementById('validIdPreviewFileName');
    const title = document.getElementById('validIdPreviewTitle');

    if (!modal || !body || !fileName || !title) {
        return;
    }

    title.textContent = `${order.customerName || 'Customer'} Valid ID`;
    fileName.textContent = getValidIdFileName(order) || 'Valid ID';
    body.innerHTML = buildValidIdPreviewMarkup(order);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('valid-id-preview-open');
}

window.openValidIdPreviewByType = openValidIdPreviewByType;

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

function getRequestIdentityApi() {
    return window.GHRequestIdentity || null;
}

function getBackendRequestId(order) {
    const requestIdentityApi = getRequestIdentityApi();
    if (!requestIdentityApi || typeof requestIdentityApi.getRequestId !== 'function') {
        return '';
    }

    return String(requestIdentityApi.getRequestId(order) || '');
}

function isSameRequestRecord(localOrder, backendOrder) {
    const requestIdentityApi = getRequestIdentityApi();
    if (!requestIdentityApi || typeof requestIdentityApi.isSameRequest !== 'function') {
        return false;
    }

    return requestIdentityApi.isSameRequest(localOrder, backendOrder);
}

function persistResolvedBackendIds(storageKey, mergedOrders) {
    const rawOrders = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(rawOrders) || !rawOrders.length || !Array.isArray(mergedOrders) || !mergedOrders.length) {
        return;
    }

    let hasChanges = false;
    const updatedOrders = rawOrders.map(rawOrder => {
        if (getBackendRequestId(rawOrder)) {
            return rawOrder;
        }

        const rawId = String(rawOrder.id || '');
        const rawOrderId = String(rawOrder.orderId || '');
        const matchedOrder = mergedOrders.find(order => {
            if (!order || !order.backendRequestId) {
                return false;
            }

            if (rawOrderId && String(order.orderId || '') === rawOrderId) {
                return true;
            }

            return rawId && String(order.localId || '') === rawId;
        });

        if (!matchedOrder) {
            return rawOrder;
        }

        hasChanges = true;

        const resolvedClientId = Number(rawOrder.clientId || rawOrder.client_id || matchedOrder.clientId || matchedOrder.client_id || 0);
        return {
            ...rawOrder,
            backendRequestId: String(matchedOrder.backendRequestId || ''),
            clientId: resolvedClientId > 0 ? resolvedClientId : rawOrder.clientId
        };
    });

    if (hasChanges) {
        localStorage.setItem(storageKey, JSON.stringify(updatedOrders));
    }
}

async function getLocalPurchaseOrders() {
    const purchases = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    if (!Array.isArray(purchases)) {
        return [];
    }

    return purchases.map(order => {
        const localId = String(order.id || order.orderId || '');
        const backendRequestId = getBackendRequestId(order);

        return {
            ...order,
            localId,
            id: String(backendRequestId || localId),
            backendRequestId,
            orderId: String(order.orderId || ''),
            customerName: order.customerName || 'Customer',
            paymentStatus: normalizePaymentStatus(order.paymentStatus),
            orderStatus: normalizeStatus(order.orderStatus),
            totalAmount: order.totalAmount || 0,
            items: order.items || [],
            requestType: 'purchase',
            clientId: Number(order.clientId || order.client_id || 0) || 0
        };
    });
}

async function getLocalReservationOrders() {
    const reservations = JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]');
    if (!Array.isArray(reservations)) {
        return [];
    }

    return reservations.filter(order => order && order.isPlacedOrder === true).map(order => {
        const localId = String(order.id || order.orderId || '');
        const backendRequestId = getBackendRequestId(order);

        return {
            ...order,
            localId,
            id: String(backendRequestId || localId),
            backendRequestId,
            adminReservationId: String(order.adminReservationId || order.orderId || ''),
            orderId: String(order.orderId || ''),
            customerName: order.customerName || 'Customer',
            plantOrdered: order.plantOrdered || order.plant_name || undefined,
            quantity: order.quantity || 0,
            totalAmount: order.totalAmount || 0,
            paymentStatus: normalizePaymentStatus(order.paymentStatus),
            orderStatus: normalizeStatus(order.orderStatus),
            items: order.items || [],
            requestType: 'reservation',
            clientId: Number(order.clientId || order.client_id || 0) || 0
        };
    });
}

function mergeOrdersWithLocalOrders(backendOrders, localOrders) {
    if (!Array.isArray(localOrders) || !localOrders.length) {
        return backendOrders;
    }

    const remainingLocalOrders = [...localOrders];

    const merged = backendOrders.map(order => {
        const backendRequestId = getBackendRequestId(order);
        const localOrderIndex = remainingLocalOrders.findIndex(localOrder => {
            const localRequestId = getBackendRequestId(localOrder);
            if (backendRequestId && localRequestId) {
                return backendRequestId === localRequestId;
            }

            return isSameRequestRecord(localOrder, order);
        });

        if (localOrderIndex === -1) {
            return order;
        }

        const [localOrder] = remainingLocalOrders.splice(localOrderIndex, 1);

        return {
            ...order,
            ...localOrder,
            id: String(backendRequestId || order.id || localOrder.id || ''),
            backendRequestId: String(backendRequestId || localOrder.backendRequestId || ''),
            localId: localOrder.localId || String(localOrder.id || ''),
            orderId: localOrder.orderId || order.orderId || '',
            adminReservationId: localOrder.adminReservationId || order.adminReservationId || String(backendRequestId || order.id || ''),
            customerName: localOrder.customerName || order.customerName || order.client_name || 'Customer',
            validIdAttachment: localOrder.validIdAttachment || order.validIdAttachment || order.valid_id_attachment || '',
            validIdFileName: localOrder.validIdFileName || order.validIdFileName || order.valid_id_file_name || '',
            validIdContentType: localOrder.validIdContentType || order.validIdContentType || order.valid_id_content_type || '',
            paymentStatus: normalizePaymentStatus(localOrder.paymentStatus || order.paymentStatus || order.payment_status),
            orderStatus: normalizeStatus(localOrder.orderStatus || order.orderStatus || order.request_status),
            totalAmount: localOrder.totalAmount ?? order.totalAmount ?? order.total_amount ?? 0,
            quantity: (() => {
                const mergedQuantity = Number(localOrder.quantity ?? order.quantity);
                return Number.isFinite(mergedQuantity) && mergedQuantity > 0 ? mergedQuantity : undefined;
            })(),
            items: Array.isArray(localOrder.items) && localOrder.items.length ? localOrder.items : order.items,
            plantOrdered: localOrder.plantOrdered || order.plantOrdered || order.plant_name || (Array.isArray(order.items) && order.items.length ? order.items[0].name : 'N/A')
        };
    });

    return [...remainingLocalOrders, ...merged];
}

function getLocalPurchaseOrdersRaw() {
    return JSON.parse(localStorage.getItem(PURCHASE_ORDERS_KEY) || '[]') || [];
}

function getLocalReservationOrdersRaw() {
    return JSON.parse(localStorage.getItem(RESERVATIONS_KEY) || '[]') || [];
}

function saveLocalPurchaseOrders(orders) {
    localStorage.setItem(PURCHASE_ORDERS_KEY, JSON.stringify(orders));
}

function saveLocalReservationOrders(orders) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(orders));
}

function isBackendPersistedOrder(order) {
    return !!getBackendRequestId(order);
}

function removeOrderFromLocalCache(type, order) {
    if (!order) {
        return;
    }

    if (type === 'purchase') {
        const orders = getLocalPurchaseOrdersRaw();
        const updated = orders.filter(item =>
            String(item.id) !== String(order.id) &&
            String(item.orderId) !== String(order.orderId)
        );
        saveLocalPurchaseOrders(updated);
        return;
    }

    const reservations = getLocalReservationOrdersRaw();
    const updated = reservations.filter(item =>
        String(item.id) !== String(order.id) &&
        String(item.orderId) !== String(order.orderId)
    );
    saveLocalReservationOrders(updated);
}

async function deleteBackendOrder(order) {
    if (typeof requestsAPI === 'undefined') {
        return true;
    }

    if (!isBackendPersistedOrder(order)) {
        return true;
    }

    const backendRequestId = getBackendRequestId(order);
    if (!backendRequestId) {
        return true;
    }

    try {
        await requestsAPI.delete(Number(backendRequestId));
        return true;
    } catch (error) {
        console.error('Failed to delete order from backend:', error);
        return false;
    }
}

async function updateBackendOrderStatus(order) {
    if (typeof requestsAPI === 'undefined') {
        return;
    }

    if (!isBackendPersistedOrder(order)) {
        return;
    }

    const backendRequestId = getBackendRequestId(order);
    if (!backendRequestId) {
        return;
    }

    try {
        await requestsAPI.updateStatus(Number(backendRequestId), {
            request_status: order.orderStatus,
            payment_status: order.paymentStatus,
            last_updated: new Date().toISOString()
        });
    } catch (error) {
        console.warn('Failed to update order status on backend:', error);
    }
}

async function syncLocalPurchaseOrder(order) {
    const orders = getLocalPurchaseOrdersRaw();
    const updated = orders.map(item => {
        if (String(item.id) === String(order.id) || String(item.orderId) === String(order.orderId)) {
            return {
                ...item,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus
            };
        }
        return item;
    });

    saveLocalPurchaseOrders(updated);
}

async function syncLocalReservationOrder(order) {
    const orders = getLocalReservationOrdersRaw();
    const updated = orders.map(item => {
        if (String(item.id) === String(order.id) || String(item.orderId) === String(order.orderId)) {
            return {
                ...item,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus
            };
        }
        return item;
    });

    saveLocalReservationOrders(updated);
}

async function loadPurchaseOrders() {
    const localOrders = await getLocalPurchaseOrders();

    try {
        const allRequests = await requestsAPI.getAll();
        if (!Array.isArray(allRequests)) {
            throw new Error('Invalid response from request API');
        }

        const backendOrders = allRequests.filter(order => (order.request_type || '').toLowerCase() === 'purchase').map(order => ({
            ...order,
            id: String(order.request_id || ''),
            backendRequestId: String(order.request_id || ''),
            localId: '',
            orderId: order.request_id ? String(order.request_id) : '',
            customerName: order.client_name || 'Customer',
            validIdAttachment: order.valid_id_attachment || '',
            validIdFileName: order.valid_id_file_name || '',
            validIdContentType: order.valid_id_content_type || '',
            paymentStatus: normalizePaymentStatus(order.payment_status),
            orderStatus: normalizeStatus(order.request_status),
            totalAmount: order.total_amount || 0,
            items: order.items || [],
            requestType: 'purchase',
            clientId: Number(order.client_id || 0) || 0
        }));

        purchaseOrders = mergeOrdersWithLocalOrders(backendOrders, localOrders);
        persistResolvedBackendIds(PURCHASE_ORDERS_KEY, purchaseOrders);
    } catch (error) {
        console.error('Failed to load purchase orders:', error);
        purchaseOrders = localOrders;
    }
}

async function loadReservationOrders() {
    const localOrders = await getLocalReservationOrders();

    try {
        const allRequests = await requestsAPI.getAll();
        if (!Array.isArray(allRequests)) {
            throw new Error('Invalid response from request API');
        }

        const backendOrders = allRequests.filter(order => (order.request_type || '').toLowerCase() === 'reservation').map(order => ({
            ...order,
            id: String(order.request_id || ''),
            backendRequestId: String(order.request_id || ''),
            localId: '',
            adminReservationId: String(order.request_id || ''),
            orderId: order.request_id ? String(order.request_id) : '',
            customerName: order.client_name || 'Customer',
            validIdAttachment: order.valid_id_attachment || '',
            validIdFileName: order.valid_id_file_name || '',
            validIdContentType: order.valid_id_content_type || '',
            plantOrdered: order.plant_name || undefined,
            quantity: order.quantity || 0,
            totalAmount: order.total_amount || 0,
            paymentStatus: normalizePaymentStatus(order.payment_status),
            orderStatus: normalizeStatus(order.request_status),
            items: order.items || [],
            requestType: 'reservation',
            clientId: Number(order.client_id || 0) || 0
        }));

        reservationOrders = mergeOrdersWithLocalOrders(backendOrders, localOrders);
        persistResolvedBackendIds(RESERVATIONS_KEY, reservationOrders);
    } catch (error) {
        console.error('Failed to load reservation orders:', error);
        reservationOrders = localOrders;
    }
}

// Orders are loaded from the backend and not persisted to localStorage.

async function populateSignedInAdminHeader() {
    if (window.GHAdminHeader && typeof window.GHAdminHeader.apply === 'function') {
        await window.GHAdminHeader.apply({
            nameSelector: '.profile-name',
            roleSelector: '.profile-role',
            avatarSelector: '.profile-avatar img',
            fallbackPhoto: '../Profile/cc.jpg'
        });
        return;
    }

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
            String(getValidIdFileName(order) || '').toLowerCase().includes(query) ||
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
    const type = containerId === 'purchaseTable' ? 'purchase' : 'reservation';
    const validIdHeader = '<th>Valid ID</th>';

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
                    ${validIdHeader}
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${orders.map(order => {
                    const orderId = String(order.id);
                    return `
                    <tr>
                        <td><strong>${order.customerName}</strong></td>
                        <td>${getPlantOrdered(order)}</td>
                        <td>${getValidIdLinkMarkup(type, order)}</td>
                        <td><span class="status-badge ${normalizePaymentStatus(order.paymentStatus)}">${formatPaymentStatusLabel(order.paymentStatus)}</span></td>
                        <td><span class="status-badge ${normalizeStatus(order.orderStatus)}">${capitalizeFirst(normalizeStatus(order.orderStatus))}</span></td>
                        <td class="action-cell">
                            <button class="delete-btn row-delete-btn" onclick="requestDeleteOrder('${type}', '${orderId}')" title="Delete order" aria-label="Delete order">
                                <svg viewBox="0 0 16 19" fill="currentColor" width="16" height="16" aria-hidden="true">
                                    <path d="M3.45775 18.6345C2.75908 18.6345 2.17475 18.3996 1.70475 17.9298C1.23492 17.4598 1 16.8754 1 16.1768V3.2345H0V1.0845H5.2V0H11.35V1.0845H16.55V3.2345H15.55V16.1768C15.55 16.8606 15.3113 17.4412 14.834 17.9185C14.3567 18.3958 13.7761 18.6345 13.0923 18.6345H3.45775ZM13.4 3.2345H3.15V16.1768C3.15 16.2666 3.17883 16.3403 3.2365 16.398C3.29417 16.4557 3.36792 16.4845 3.45775 16.4845H13.0923C13.1693 16.4845 13.2398 16.4524 13.3038 16.3883C13.3679 16.3243 13.4 16.2538 13.4 16.1768V3.2345ZM5.129 14.4595H7.27875V5.2595H5.129V14.4595ZM9.27125 14.4595H11.421V5.2595H9.27125V14.4595Z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = table;
}

// Expand table to full view
function expandTable(type) {
    expandedTable = type;
    const orders = type === 'purchase' ? getFilteredPurchaseOrders() : getFilteredReservationOrders();
    const expandedGridClass = 'expanded-header-grid expanded-header-grid-reservation';
    const expandedRowClass = 'expanded-row expanded-row-reservation';

    document.getElementById('normalView').style.display = 'none';

    const expandedView = document.getElementById('expandedView');
    expandedView.style.display = 'block';

    expandedView.innerHTML = `
        <div class="expanded-header">
            <div class="${expandedGridClass}">
                <div class="expanded-header-cell">ORDER ID</div>
                <div class="expanded-header-cell">CUSTOMER<br>NAME</div>
                <div class="expanded-header-cell">PLANT<br>ORDERED</div>
                <div class="expanded-header-cell">VALID<br>ID</div>
                <div class="expanded-header-cell">QUANTITY</div>
                <div class="expanded-header-cell">TOTAL<br>AMOUNT</div>
                <div class="expanded-header-cell">PAYMENT<br>STATUS</div>
                <div class="expanded-header-cell">STATUS</div>
                <div class="expanded-header-cell">ACTION</div>
            </div>
        </div>
        <div class="expanded-body">
            ${orders.map(order => `
                <div class="${expandedRowClass}">
                    <div class="expanded-cell">${order.orderId || 'N/A'}</div>
                    <div class="expanded-cell bold">${order.customerName || 'N/A'}</div>
                    <div class="expanded-cell">${getPlantOrdered(order)}</div>
                    <div class="expanded-cell">${getValidIdLinkMarkup(type, order)}</div>
                    <div class="expanded-cell bold">${getQuantity(order)}</div>
                    <div class="expanded-cell bold">${getTotalAmount(order)}</div>
                    <div class="expanded-cell">
                        <select class="status-select" onchange="requestPaymentStatusChangeByType('${type}', '${order.id}', this.value, this)">
                            <option value="unpaid" ${normalizePaymentStatus(order.paymentStatus) === 'unpaid' ? 'selected' : ''}>Unpaid</option>
                            <option value="partially_paid" ${normalizePaymentStatus(order.paymentStatus) === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
                            <option value="paid" ${normalizePaymentStatus(order.paymentStatus) === 'paid' ? 'selected' : ''}>Paid</option>
                        </select>
                    </div>
                    <div class="expanded-cell">
                        <select class="status-select" onchange="requestOrderStatusChangeByType('${type}', '${order.id}', this.value, this)">
                            <option value="pending" ${normalizeStatus(order.orderStatus) === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="cancel" ${normalizeStatus(order.orderStatus) === 'cancel' ? 'selected' : ''}>Cancel</option>
                            <option value="delivered" ${normalizeStatus(order.orderStatus) === 'delivered' ? 'selected' : ''}>Delivered</option>
                            <option value="deleted" ${normalizeStatus(order.orderStatus) === 'deleted' ? 'selected' : ''}>Deleted</option>
                        </select>
                    </div>
                    <div class="expanded-cell action-cell">
                        <button class="delete-btn row-delete-btn" onclick="requestDeleteOrder('${type}', '${order.id}')" title="Delete order" aria-label="Delete order">
                            <svg viewBox="0 0 16 19" fill="currentColor" width="16" height="16" aria-hidden="true">
                                <path d="M3.45775 18.6345C2.75908 18.6345 2.17475 18.3996 1.70475 17.9298C1.23492 17.4598 1 16.8754 1 16.1768V3.2345H0V1.0845H5.2V0H11.35V1.0845H16.55V3.2345H15.55V16.1768C15.55 16.8606 15.3113 17.4412 14.834 17.9185C14.3567 18.3958 13.7761 18.6345 13.0923 18.6345H3.45775ZM13.4 3.2345H3.15V16.1768C3.15 16.2666 3.17883 16.3403 3.2365 16.398C3.29417 16.4557 3.36792 16.4845 3.45775 16.4845H13.0923C13.1693 16.4845 13.2398 16.4524 13.3038 16.3883C13.3679 16.3243 13.4 16.2538 13.4 16.1768V3.2345ZM5.129 14.4595H7.27875V5.2595H5.129V14.4595ZM9.27125 14.4595H11.421V5.2595H9.27125V14.4595Z"/>
                            </svg>
                        </button>
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

async function setOrderStatus(orderId, status) {
    const order = purchaseOrders.find(item => item.id === orderId);
    if (!order) {
        return false;
    }

    order.orderStatus = normalizeStatus(status);
    await syncLocalPurchaseOrder(order);
    await updateBackendOrderStatus(order);
    updateStats();
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }

    return true;
}

async function setPaymentStatus(orderId, status) {
    const order = purchaseOrders.find(item => item.id === orderId);
    if (!order) {
        return false;
    }

    order.paymentStatus = normalizePaymentStatus(status);
    await syncLocalPurchaseOrder(order);
    await updateBackendOrderStatus(order);
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }

    return true;
}

async function setOrderStatusByType(type, orderId, status) {
    if (type === 'purchase') {
        return setOrderStatus(orderId, status);
    }

    const order = reservationOrders.find(item => item.id === orderId);
    if (!order) {
        return false;
    }

    order.orderStatus = normalizeStatus(status);
    await syncLocalReservationOrder(order);
    await updateBackendOrderStatus(order);
    updateStats();
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }

    return true;
}

async function setPaymentStatusByType(type, orderId, status) {
    if (type === 'purchase') {
        return setPaymentStatus(orderId, status);
    }

    const order = reservationOrders.find(item => item.id === orderId);
    if (!order) {
        return false;
    }

    order.paymentStatus = normalizePaymentStatus(status);
    await syncLocalReservationOrder(order);
    await updateBackendOrderStatus(order);
    if (expandedTable) {
        expandTable(expandedTable);
    } else {
        renderMiniTables();
    }

    return true;
}

// Minimize expanded table
function minimizeTable() {
    expandedTable = null;
    document.getElementById('normalView').style.display = 'grid';
    document.getElementById('expandedView').style.display = 'none';
}

// Delete order
async function deleteOrder(type, orderId) {
    let deletedOrderRecord = null;

    if (type === 'purchase') {
        deletedOrderRecord = purchaseOrders.find(o => String(o.id) === orderId) || null;
    } else {
        deletedOrderRecord = reservationOrders.find(o => String(o.id) === orderId) || null;
    }

    if (!deletedOrderRecord) {
        return false;
    }

    const backendDeleted = await deleteBackendOrder(deletedOrderRecord);
    if (!backendDeleted) {
        return false;
    }

    removeOrderFromLocalCache(type, deletedOrderRecord);

    if (type === 'purchase') {
        purchaseOrders = purchaseOrders.filter(o => String(o.id) !== orderId);
    } else {
        reservationOrders = reservationOrders.filter(o => String(o.id) !== orderId);
    }

    if (expandedTable) {
        expandTable(type);
    } else {
        renderMiniTables();
    }

    updateStats();

    return true;
}

// Setup event listeners
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    const btnActionCancel = document.getElementById('btnActionCancel');
    const btnActionConfirm = document.getElementById('btnActionConfirm');
    const actionConfirmationModal = document.getElementById('actionConfirmationModal');
    const validIdPreviewModal = document.getElementById('validIdPreviewModal');
    const validIdPreviewClose = document.getElementById('validIdPreviewClose');

    if (btnActionCancel) {
        btnActionCancel.addEventListener('click', () => closeActionConfirmation(true));
    }

    if (btnActionConfirm) {
        btnActionConfirm.addEventListener('click', confirmPendingAction);
    }

    if (actionConfirmationModal) {
        actionConfirmationModal.addEventListener('click', (event) => {
            if (event.target === actionConfirmationModal) {
                closeActionConfirmation(true);
            }
        });
    }

    if (validIdPreviewClose) {
        validIdPreviewClose.addEventListener('click', closeValidIdPreview);
    }

    if (validIdPreviewModal) {
        validIdPreviewModal.addEventListener('click', (event) => {
            if (event.target === validIdPreviewModal) {
                closeValidIdPreview();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeActionConfirmation(true);
            closeValidIdPreview();
        }
    });

    setupFilterDropdowns();
}

function setupFilterDropdowns() {
    const statusBtn = document.getElementById('statusBtn');
    const statusDropdown = document.getElementById('statusFilterDropdown');
    const statusBtnLabel = document.getElementById('statusBtnLabel');

    const closeDropdowns = () => {
        statusDropdown.classList.remove('is-open');
        statusBtn.setAttribute('aria-expanded', 'false');
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

function getOrderListByType(type) {
    return type === 'purchase' ? purchaseOrders : reservationOrders;
}

function getOrderByType(type, orderId) {
    const orders = getOrderListByType(type);
    return orders.find(order => String(order.id) === String(orderId));
}

function hideActionToast() {
    const actionToast = document.getElementById('actionToast');
    if (!actionToast) {
        return;
    }
    actionToast.classList.remove('active', 'error');
}

function showActionToast(message, isError = false) {
    const actionToast = document.getElementById('actionToast');
    const actionToastMessage = document.getElementById('actionToastMessage');
    if (!actionToast || !actionToastMessage) {
        return;
    }

    if (actionToastTimer) {
        clearTimeout(actionToastTimer);
        actionToastTimer = null;
    }

    actionToastMessage.textContent = message;
    actionToast.classList.toggle('error', Boolean(isError));
    actionToast.classList.add('active');

    actionToastTimer = window.setTimeout(() => {
        hideActionToast();
        actionToastTimer = null;
    }, 2200);
}

function playActionLoadingLine() {
    const actionLoadingLine = document.getElementById('actionLoadingLine');
    if (!actionLoadingLine) {
        return;
    }

    if (actionLoadingTimer) {
        clearTimeout(actionLoadingTimer);
        actionLoadingTimer = null;
    }

    actionLoadingLine.classList.remove('active');
    void actionLoadingLine.offsetWidth;
    actionLoadingLine.classList.add('active');

    actionLoadingTimer = window.setTimeout(() => {
        actionLoadingLine.classList.remove('active');
        actionLoadingTimer = null;
    }, 700);
}

function showActionSuccess(message) {
    playActionLoadingLine();
    window.setTimeout(() => {
        showActionToast(message, false);
    }, 700);
}

function showActionError(message) {
    showActionToast(message, true);
}

function closeActionConfirmation(runCancel = false) {
    const actionConfirmationModal = document.getElementById('actionConfirmationModal');
    if (actionConfirmationModal) {
        actionConfirmationModal.classList.remove('active');
    }
    document.body.style.overflow = '';

    if (runCancel && pendingAction && typeof pendingAction.onCancel === 'function') {
        pendingAction.onCancel();
    }

    pendingAction = null;
}

function openActionConfirmation(message, onConfirm, onCancel, options = {}) {
    const actionConfirmationModal = document.getElementById('actionConfirmationModal');
    const actionConfirmationMessage = document.getElementById('actionConfirmationMessage');
    const btnActionConfirm = document.getElementById('btnActionConfirm');
    if (!actionConfirmationModal || !actionConfirmationMessage || !btnActionConfirm) {
        return;
    }

    const confirmLabel = options.confirmLabel || 'Confirm';
    const isDestructive = Boolean(options.destructive);

    actionConfirmationMessage.textContent = message;
    btnActionConfirm.textContent = confirmLabel;
    btnActionConfirm.classList.toggle('danger', isDestructive);

    pendingAction = {
        onConfirm,
        onCancel
    };

    actionConfirmationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

async function confirmPendingAction() {
    if (!pendingAction || typeof pendingAction.onConfirm !== 'function') {
        closeActionConfirmation(false);
        return;
    }

    const actionToRun = pendingAction.onConfirm;
    closeActionConfirmation(false);

    try {
        await actionToRun();
    } catch (error) {
        console.error('Action failed:', error);
        showActionError('Unable to complete action. Please try again.');
    }
}

function revertSelectValue(selectElement, fallbackValue) {
    if (!selectElement) {
        return;
    }
    selectElement.value = fallbackValue;
}

function requestOrderStatusChangeByType(type, orderId, newStatus, selectElement) {
    const order = getOrderByType(type, orderId);
    if (!order) {
        showActionError('Order was not found.');
        return;
    }

    const previousStatus = normalizeStatus(order.orderStatus);
    const nextStatus = normalizeStatus(newStatus);
    if (previousStatus === nextStatus) {
        return;
    }

    openActionConfirmation(
        'Are you sure you want to update the order status?',
        async () => {
            const updated = await setOrderStatusByType(type, orderId, nextStatus);
            if (!updated) {
                revertSelectValue(selectElement, previousStatus);
                showActionError('Unable to update order status.');
                return;
            }
            showActionSuccess('Order status updated successfully.');
        },
        () => {
            revertSelectValue(selectElement, previousStatus);
        },
        { confirmLabel: 'Update' }
    );
}

function requestPaymentStatusChangeByType(type, orderId, newStatus, selectElement) {
    const order = getOrderByType(type, orderId);
    if (!order) {
        showActionError('Order was not found.');
        return;
    }

    const previousStatus = normalizePaymentStatus(order.paymentStatus);
    const nextStatus = normalizePaymentStatus(newStatus);
    if (previousStatus === nextStatus) {
        return;
    }

    openActionConfirmation(
        'Are you sure you want to update the payment status?',
        async () => {
            const updated = await setPaymentStatusByType(type, orderId, nextStatus);
            if (!updated) {
                revertSelectValue(selectElement, previousStatus);
                showActionError('Unable to update payment status.');
                return;
            }
            showActionSuccess('Payment status updated successfully.');
        },
        () => {
            revertSelectValue(selectElement, previousStatus);
        },
        { confirmLabel: 'Update' }
    );
}

function requestDeleteOrder(type, orderId) {
    openActionConfirmation(
        'Are you sure you want to delete this order?',
        async () => {
            const deleted = await deleteOrder(type, orderId);
            if (!deleted) {
                showActionError('Unable to delete order from server. Please try again.');
                return;
            }
            showActionSuccess('Order deleted successfully.');
        },
        null,
        { confirmLabel: 'Delete', destructive: true }
    );
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
