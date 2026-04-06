const SAMPLE_PURCHASE_ORDERS = [
    {
        id: 'sample-1',
        orderId: '#ORD-1001',
        customerName: 'Jake Clarence',
        items: [{ name: 'Coconut Variety', qty: 1, price: 121.197 }],
        totalAmount: 121.197,
        paymentStatus: 'paid',
        orderStatus: 'pending'
    },
    {
        id: 'sample-2',
        orderId: '#ORD-1002',
        customerName: 'Trisha Timog',
        items: [{ name: 'Mango Tree', qty: 1, price: 55.99 }],
        totalAmount: 55.99,
        paymentStatus: 'unpaid',
        orderStatus: 'pending'
    }
];

const reservationOrders = [
    {
        id: '3',
        orderId: '#ORD-2001',
        customerName: 'Ken Narvaez',
        plantOrdered: 'Coconut Variety',
        quantity: 1,
        totalAmount: '$121.197',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
    },
    {
        id: '4',
        orderId: '#ORD-2002',
        customerName: 'Charizze Landicho',
        plantOrdered: 'Mango Variety',
        quantity: 3,
        totalAmount: '$55.99',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
    },
];

let purchaseOrders = [];
let expandedTable = null;

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

function loadPurchaseOrders() {
    const stored = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    if (!stored.length) {
        purchaseOrders = SAMPLE_PURCHASE_ORDERS.map(order => ({ ...order }));
        return;
    }

    purchaseOrders = stored.map(order => ({
        ...order,
        orderStatus: normalizeStatus(order.orderStatus)
    }));
}

function persistPurchaseOrders() {
    localStorage.setItem('purchaseOrders', JSON.stringify(purchaseOrders));
}

// Initialize the page
function init() {
    loadPurchaseOrders();
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

// Render mini tables (side by side)
function renderMiniTables() {
    renderMiniTable('purchaseTable', purchaseOrders);
    renderMiniTable('reservationTable', reservationOrders);
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
                        <td><span class="status-badge ${order.paymentStatus}">${capitalizeFirst(order.paymentStatus)}</span></td>
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
    const orders = type === 'purchase' ? purchaseOrders : reservationOrders;

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
                <div class="expanded-header-cell">Actions</div>
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
                        <span class="status-badge ${order.paymentStatus}">${capitalizeFirst(order.paymentStatus || 'unpaid')}</span>
                    </div>
                    <div class="expanded-cell">
                        <span class="status-badge ${normalizeStatus(order.orderStatus)}">${capitalizeFirst(normalizeStatus(order.orderStatus))}</span>
                    </div>
                    <div class="expanded-cell">
                        ${type === 'purchase' ? `
                            <button class="status-btn" onclick="setOrderStatus('${order.id}', 'pending')">Pending</button>
                            <button class="status-btn" onclick="setOrderStatus('${order.id}', 'delivered')">Delivered</button>
                            <button class="status-btn" onclick="setOrderStatus('${order.id}', 'cancel')">Cancel</button>
                        ` : ''}
                        <button class="delete-btn" onclick="deleteOrder('${type}', '${order.id}')" title="Delete order">
                            <svg width="16" height="19" viewBox="0 0 16 19" fill="currentColor">
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

function setOrderStatus(orderId, status) {
    const order = purchaseOrders.find(item => item.id === orderId);
    if (!order) {
        return;
    }

    order.orderStatus = normalizeStatus(status);
    persistPurchaseOrders();
    updateStats();
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

    if (type === 'purchase') {
        purchaseOrders = purchaseOrders.filter(o => o.id !== orderId);
        persistPurchaseOrders();
    } else {
        const index = reservationOrders.findIndex(o => o.id === orderId);
        if (index !== -1) {
            reservationOrders.splice(index, 1);
        }
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

    const statusBtn = document.getElementById('statusBtn');
    const typesBtn = document.getElementById('typesBtn');

    statusBtn.addEventListener('click', () => {
        alert('Status filter functionality can be implemented here');
    });

    typesBtn.addEventListener('click', () => {
        alert('Types filter functionality can be implemented here');
    });
}

// Handle search
function handleSearch(event) {
    const query = event.target.value.toLowerCase();

    if (!query) {
        renderMiniTables();
        return;
    }

    const filteredPurchase = purchaseOrders.filter(order =>
        String(order.customerName || '').toLowerCase().includes(query) ||
        getPlantOrdered(order).toLowerCase().includes(query) ||
        String(order.orderId || '').toLowerCase().includes(query)
    );

    const filteredReservation = reservationOrders.filter(order =>
        String(order.customerName || '').toLowerCase().includes(query) ||
        String(order.plantOrdered || '').toLowerCase().includes(query) ||
        String(order.orderId || '').toLowerCase().includes(query)
    );

    renderMiniTable('purchaseTable', filteredPurchase);
    renderMiniTable('reservationTable', filteredReservation);
}

// Utility: Capitalize first letter
function capitalizeFirst(str) {
    const value = String(str || '');
    if (!value.length) {
        return value;
    }
    return value.charAt(0).toUpperCase() + value.slice(1);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
