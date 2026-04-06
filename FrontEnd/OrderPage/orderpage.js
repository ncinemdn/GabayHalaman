let historyStack = [];
let futureStack = [];
let selectedOrderId = null;

const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

function getPurchases() {
    return JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
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

function statusLabel(status) {
    if (status === 'delivered') {
        return 'Delivered';
    }

    if (status === 'cancel') {
        return 'Cancel';
    }

    return 'Pending';
}

function getOrderById(orderId) {
    const purchases = getPurchases();
    return purchases.find(order => order.id === orderId) || null;
}

function getOrderImage(order) {
    if (!order || !Array.isArray(order.items) || !order.items.length) {
        return DEFAULT_PLANT_IMAGE;
    }

    return order.items[0].image || DEFAULT_PLANT_IMAGE;
}

function renderItems(order) {
    if (!order || !Array.isArray(order.items)) {
        return '';
    }

    return order.items.map(item => `<p>${item.name} (${item.qty} pcs)</p>`).join('');
}

function formatPeso(value) {
    return '₱' + Number(value || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getDeliveryBannerText(status) {
    if (status === 'delivered') {
        return 'Order Delivered';
    }

    if (status === 'cancel') {
        return 'Order Cancelled';
    }

    return 'Order Pending Approval';
}

function loadCurrentOrder() {
    const purchases = getPurchases();
    const container = document.getElementById('currentOrderContainer');

    if (!container) {
        return;
    }

    if (!purchases.length) {
        container.innerHTML = `
            <div class="order-card">
                <p class="order-items">No purchases yet. Place an order from cart to see it here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = purchases.map(order => {
        const normalized = normalizeStatus(order.orderStatus);
        const totalQty = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0) : 0;
        const categoryText = order.items && order.items.length ? order.items[0].name : 'Plant Order';

        return `
            <div class="order-card">
                <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px; position: relative;">
                    <div class="product-image">
                        <img alt="" src="${getOrderImage(order)}" />
                    </div>
                    <div style="flex: 1;">
                        <p class="order-category">Order: ${order.orderId || ''}</p>
                        <p class="order-items">${categoryText}</p>
                        <div class="order-items">${renderItems(order)}</div>
                        <p class="order-items">Total Quantity: ${totalQty}</p>
                        <p class="order-items">Total Price: ${formatPeso(order.totalAmount)}</p>
                    </div>
                    <p class="order-status ${normalized}">${statusLabel(normalized)}</p>
                </div>

                <div class="delivery-banner">
                    <p class="delivery-text">${getDeliveryBannerText(normalized)}</p>
                    <div class="delivery-chevron">
                        <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" style="transform: rotate(-90deg);">
                            <path d="M12 15.4L6 9.4L7.4 8L12 12.6L16.6 8L18 9.4L12 15.4Z" fill="#359C4D" />
                        </svg>
                    </div>
                </div>

                <div class="button-container">
                    <button class="order-btn disabled">${statusLabel(normalized)}</button>
                    <button class="order-btn primary" onclick="openOrderDetails('${order.id}')">Order Details</button>
                </div>
            </div>
        `;
    }).join('');
}

function openOrderDetails(orderId) {
    selectedOrderId = orderId;
    navigateTo('order-details');
}

function loadOrderDetails() {
    const order = getOrderById(selectedOrderId) || getPurchases()[0] || null;

    if (!order) {
        document.getElementById('detailsFullName').textContent = 'No Data';
        document.getElementById('detailsItems').innerHTML = '<p>No order details available.</p>';
        document.getElementById('detailsTotalQty').textContent = '0';
        document.getElementById('detailsTotalPrice').textContent = '₱0.00';
        return;
    }

    selectedOrderId = order.id;

    const delivery = order.deliveryDetails || {};

    document.getElementById('detailsImage').src = getOrderImage(order);
    document.getElementById('detailsFullName').textContent = delivery.fullName || order.customerName || 'N/A';
    document.getElementById('detailsPhone').textContent = delivery.phone || 'N/A';
    document.getElementById('detailsAddress').textContent = delivery.address || 'N/A';
    document.getElementById('detailsItems').innerHTML = renderItems(order) || '<p>No item details.</p>';

    const totalQty = Array.isArray(order.items) ? order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0) : 0;

    document.getElementById('detailsTotalQty').textContent = String(totalQty);
    document.getElementById('detailsTotalPrice').textContent = formatPeso(order.totalAmount);
}

function updateHistoryButtons() {
    const backBtn = document.getElementById('back-btn');
    const forwardBtn = document.getElementById('forward-btn');
    if (backBtn) backBtn.disabled = historyStack.length === 0;
    if (forwardBtn) forwardBtn.disabled = futureStack.length === 0;
}

function navigateTo(pageId, fromHistory = false) {
    const currentPage = document.querySelector('.page.active');
    const currentId = currentPage ? currentPage.id.replace('-page', '') : null;

    if (!fromHistory && currentId && currentId !== pageId) {
        historyStack.push(currentId);
        futureStack = [];
    }

    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));

    const target = document.getElementById(pageId + '-page');
    if (target) {
        target.classList.add('active');
        window.scrollTo(0, 0);

        if (pageId === 'order-details') {
            loadOrderDetails();
        } else if (pageId === 'track-order') {
            loadTrackOrder(selectedOrderId);
        }
    }

    updateHistoryButtons();
}

function goBack() {
    if (historyStack.length === 0) return;
    const currentPage = document.querySelector('.page.active');
    const currentId = currentPage ? currentPage.id.replace('-page', '') : null;

    const previousPage = historyStack.pop();
    if (currentId) futureStack.push(currentId);

    navigateTo(previousPage, true);
}

function goForward() {
    if (futureStack.length === 0) return;
    const currentPage = document.querySelector('.page.active');
    const currentId = currentPage ? currentPage.id.replace('-page', '') : null;

    const nextPage = futureStack.pop();
    if (currentId) historyStack.push(currentId);

    navigateTo(nextPage, true);
}

function fetchOrderTracking(order) {
    const normalized = normalizeStatus(order ? order.orderStatus : 'pending');

    let statusIndex = 0;
    if (normalized === 'pending') {
        statusIndex = 1;
    } else if (normalized === 'delivered') {
        statusIndex = 3;
    } else if (normalized === 'cancel') {
        statusIndex = 0;
    }

    return {
        orderId: order ? (order.orderId || 'N/A') : 'N/A',
        currentStatus: statusLabel(normalized),
        statusIndex,
        statusLabels: ['Order Confirmed', 'Prepared by Seller', 'Out for Delivery', 'Delivered'],
        eta: normalized === 'delivered' ? 'Delivered' : (normalized === 'cancel' ? 'Cancelled' : '1-2 days'),
        location: normalized === 'cancel' ? 'Order cancelled by admin' : 'Processing at nursery',
        routeMap: 'https://via.placeholder.com/1339x450.png?text=Delivery+Map+Preview',
        mapLink: 'https://www.google.com/maps/search/?api=1&query=14.5450,121.1350'
    };
}

function renderTrackSteps(data) {
    const trackSteps = document.getElementById('track-steps');
    trackSteps.innerHTML = '';

    const trackLine = document.createElement('div');
    trackLine.className = 'track-progress-line';
    trackSteps.appendChild(trackLine);

    const activeLine = document.createElement('div');
    activeLine.className = 'track-progress-active';
    const percent = ((data.statusIndex) / (data.statusLabels.length - 1)) * 100;
    activeLine.style.width = `calc(8% + ${percent} * 0.84%)`;
    trackSteps.appendChild(activeLine);

    const icons = {
        'Order Confirmed': '✅',
        'Prepared by Seller': '✅',
        'Out for Delivery': '🚚',
        'Delivered': '📦'
    };

    data.statusLabels.forEach((label, idx) => {
        const step = document.createElement('div');
        step.className = 'track-step';

        const circle = document.createElement('div');
        circle.className = 'step-circle';
        if (idx < data.statusIndex) {
            circle.classList.add('active');
            circle.textContent = '✓';
        } else if (idx === data.statusIndex) {
            circle.classList.add('active');
            circle.textContent = icons[label] || '●';
        } else {
            circle.textContent = icons[label] || '○';
        }

        const title = document.createElement('div');
        title.className = 'step-label';
        title.innerText = label;

        const stepContent = document.createElement('div');
        stepContent.className = 'track-step-content';
        stepContent.appendChild(circle);
        stepContent.appendChild(title);

        step.appendChild(stepContent);
        trackSteps.appendChild(step);
    });
}

function renderTrackInfo(data) {
    document.getElementById('order-id').textContent = data.orderId;
    document.getElementById('status-text').textContent = data.currentStatus;
    document.getElementById('eta-text').textContent = data.eta;
    document.getElementById('location-text').textContent = data.location;

    const mapImage = document.getElementById('map-image');
    mapImage.onerror = () => {
        mapImage.src = 'https://via.placeholder.com/1339x450.png?text=Map+currently+unavailable';
    };
    mapImage.src = data.routeMap;
    const mapLink = document.getElementById('map-link');
    mapLink.href = data.mapLink;
}

function loadTrackOrder(orderId) {
    const order = getOrderById(orderId) || getPurchases()[0] || null;
    const payload = fetchOrderTracking(order);
    renderTrackSteps(payload);
    renderTrackInfo(payload);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const purchases = getPurchases();
    if (purchases.length) {
        selectedOrderId = purchases[0].id;
    }
    loadCurrentOrder();
    navigateTo('order-list');
});
