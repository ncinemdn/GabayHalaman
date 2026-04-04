// Delivery Data
const deliveries = [
    {
        id: '1',
        deliveryId: '#DEL-2001',
        orderId: '#ORD-1001',
        customerName: 'Jake Clarence',
        deliveryAddress: '234 San Vicente\nSto. Tomas Batangas',
        scheduledDate: '2026-02-18',
        status: 'out-for-delivery',
    },
    {
        id: '2',
        deliveryId: '#DEL-2002',
        orderId: '#ORD-1002',
        customerName: 'Charizze Landicho',
        deliveryAddress: '67 Maharlika St.\nQuezon City',
        scheduledDate: '2026-02-28',
        status: 'pending',
    },
    {
        id: '3',
        deliveryId: '#DEL-2003',
        orderId: '#ORD-1003',
        customerName: 'Sean Fuertes',
        deliveryAddress: '112 Santos St.\nNueva Ecija',
        scheduledDate: '2026-02-28',
        status: 'pending',
    },
    {
        id: '4',
        deliveryId: '#DEL-2004',
        orderId: '#ORD-1004',
        customerName: 'Dhaye Perez',
        deliveryAddress: '335 Uranus St.\nPampanga',
        scheduledDate: '2026-02-28',
        status: 'delivered',
    },
];

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

// Initialize the page
function init() {
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

// Create status badge
function createStatusBadge(status) {
    const config = statusConfig[status];
    return `
        <button class="status-badge ${status}" data-status="${status}">
            <span class="status-badge-text">${config.label}</span>
            <svg class="status-badge-icon" viewBox="0 0 12 8" fill="none">
                <path d="M6 8L0 1.51351L1.4 0L6 4.97297L10.6 0L12 1.51351L6 8Z" fill="black"/>
            </svg>
        </button>
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
                ${createStatusBadge(delivery.status)}
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
    // Setup status badge clicks
    setupStatusBadges();
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);

    // Filter dropdown (placeholder functionality)
    const filterDropdown = document.getElementById('filterDropdown');
    filterDropdown.addEventListener('click', () => {
        alert('Filter dropdown functionality can be implemented here');
    });
}

// Handle search
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    
    if (!query) {
        renderDeliveries();
        return;
    }

    const filtered = deliveries.filter(delivery => 
        delivery.deliveryId.toLowerCase().includes(query) ||
        delivery.orderId.toLowerCase().includes(query) ||
        delivery.customerName.toLowerCase().includes(query) ||
        delivery.deliveryAddress.toLowerCase().includes(query) ||
        delivery.scheduledDate.includes(query) ||
        statusConfig[delivery.status].label.toLowerCase().includes(query)
    );

    renderDeliveries(filtered);
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
            deliveries.splice(index, 1);
            updateStats();
            renderDeliveries();
        }
    }
}

// Setup status badge clicks
function setupStatusBadges() {
    const statusBadges = document.querySelectorAll('.status-badge');
    statusBadges.forEach(badge => {
        badge.addEventListener('click', handleStatusChange);
    });
}

// Handle status change
function handleStatusChange(event) {
    const currentStatus = event.currentTarget.getAttribute('data-status');
    const row = event.currentTarget.closest('.table-row');
    const deliveryId = row.getAttribute('data-id');
    
    // Show a simple status change menu
    const statuses = ['out-for-delivery', 'pending', 'delivered'];
    const otherStatuses = statuses.filter(s => s !== currentStatus);
    
    const message = `Change status to:\n1. ${statusConfig[otherStatuses[0]].label}\n2. ${statusConfig[otherStatuses[1]].label}`;
    const choice = prompt(message + '\n\nEnter 1 or 2:');
    
    if (choice === '1' || choice === '2') {
        const newStatus = otherStatuses[parseInt(choice) - 1];
        const delivery = deliveries.find(d => d.id === deliveryId);
        if (delivery) {
            delivery.status = newStatus;
            updateStats();
            renderDeliveries();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
