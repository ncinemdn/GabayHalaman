// Order Data
const purchaseOrders = [
    {
        id: '1',
        orderId: '#ORD-1001',
        customerName: 'Jake Clarence',
        plantOrdered: 'Coconut Variety',
        quantity: 1,
        totalAmount: '$121.197',
        paymentStatus: 'paid',
        orderStatus: 'reserved',
    },
    {
        id: '2',
        orderId: '#ORD-1002',
        customerName: 'Trisha Timog',
        plantOrdered: 'Mango Tree',
        quantity: 1,
        totalAmount: '$55.99',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
    },
];

const reservationOrders = [
    {
        id: '3',
        orderId: '#ORD-1001',
        customerName: 'Ken Narvaez',
        plantOrdered: 'Coconut Variety',
        quantity: 1,
        totalAmount: '$121.197',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
    },
    {
        id: '4',
        orderId: '#ORD-1001',
        customerName: 'Charizze Landicho',
        plantOrdered: 'Mango Variety',
        quantity: 3,
        totalAmount: '$55.99',
        paymentStatus: 'unpaid',
        orderStatus: 'pending',
    },
];

let expandedTable = null;

// Initialize the page
function init() {
    updateStats();
    renderMiniTables();
    setupEventListeners();
}

// Update statistics
function updateStats() {
    const allOrders = [...purchaseOrders, ...reservationOrders];
    const totalOrders = allOrders.length;
    const pendingCount = allOrders.filter(o => o.orderStatus === 'pending').length;
    const completedCount = allOrders.filter(o => o.orderStatus === 'completed' || o.orderStatus === 'reserved').length;

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
                        <td>${order.plantOrdered}</td>
                        <td><span class="status-badge ${order.paymentStatus}">${capitalizeFirst(order.paymentStatus)}</span></td>
                        <td><span class="status-badge ${order.orderStatus}">${capitalizeFirst(order.orderStatus)}</span></td>
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
    const title = type === 'purchase' ? 'Purchase' : 'Reservations';
    
    // Hide normal view
    document.getElementById('normalView').style.display = 'none';
    
    // Show expanded view
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
                    <div class="expanded-cell">
                        <div>${order.orderId.split('-')[0]}-</div>
                        <div>${order.orderId.split('-')[1]}</div>
                    </div>
                    <div class="expanded-cell bold">${order.customerName}</div>
                    <div class="expanded-cell">${order.plantOrdered}</div>
                    <div class="expanded-cell bold">${order.quantity}</div>
                    <div class="expanded-cell bold">${order.totalAmount}</div>
                    <div class="expanded-cell">
                        <span class="status-badge ${order.paymentStatus}">${capitalizeFirst(order.paymentStatus)}</span>
                    </div>
                    <div class="expanded-cell">
                        <span class="status-badge ${order.orderStatus}">${capitalizeFirst(order.orderStatus)}</span>
                    </div>
                    <div class="expanded-cell">
                        <button class="delete-btn" onclick="deleteOrder('${type}', '${order.id}')">
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
    
    const orders = type === 'purchase' ? purchaseOrders : reservationOrders;
    const index = orders.findIndex(o => o.id === orderId);
    
    if (index !== -1) {
        orders.splice(index, 1);
        
        if (expandedTable) {
            expandTable(type);
        } else {
            renderMiniTables();
        }
        
        updateStats();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Filter buttons (placeholder)
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
        order.customerName.toLowerCase().includes(query) ||
        order.plantOrdered.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query)
    );

    const filteredReservation = reservationOrders.filter(order =>
        order.customerName.toLowerCase().includes(query) ||
        order.plantOrdered.toLowerCase().includes(query) ||
        order.orderId.toLowerCase().includes(query)
    );

    renderMiniTable('purchaseTable', filteredPurchase);
    renderMiniTable('reservationTable', filteredReservation);
}

// Utility: Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
