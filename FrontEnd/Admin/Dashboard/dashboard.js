// Page content templates
const pages = {
    dashboard: `
        <div class="page-header dashboard-topbar">
            <div class="header-title-group">
                <h1 class="dashboard-topbar-title">Dashboard Overview</h1>
                <p class="page-subtitle" id="dashboardGreeting">Welcome back! Here's your store summary.</p>
            </div>
            <div class="user-info">
                <div class="user-avatar">
                    <img src="../Profile/cc.jpg" alt="Admin Profile Picture">
                </div>
                <div class="user-details">
                    <div class="user-name" id="dashboardUserName"></div>
                    <div class="user-role" id="dashboardUserRole"></div>
                </div>
            </div>
        </div>

        <div class="page-content">
            <div class="stats-grid" id="dashboardStats">
                <!-- Dynamic stats will be inserted here -->
            </div>

            <div class="dashboard-panels">
                <div class="chart-container">
                    <h2 class="sales-performance-title">Plant Sales Performance</h2>
                    <div class="chart-wrapper">
                        <div class="chart-canvas-container">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 class="section-title">Important</h2>
                    <div class="section-card" id="importantSectionCard">
                        <p class="placeholder">Important notifications and alerts will appear here</p>
                    </div>
                </div>
            </div>

            <div id="clientsPopup" class="popup-overlay" style="display: none;">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>Client List</h3>
                        <button class="popup-close" onclick="closePopup('clientsPopup')">×</button>
                    </div>
                    <div class="popup-body" id="clientsList">
                        <!-- Client names will be populated here -->
                    </div>
                </div>
            </div>

            <div id="clientDetailsPopup" class="popup-overlay" style="display: none;">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3 id="clientDetailsTitle">Client Details</h3>
                        <button class="popup-close" onclick="closePopup('clientDetailsPopup')">×</button>
                    </div>
                    <div class="popup-body" id="clientDetailsContent">
                        <!-- Client details will be populated here -->
                    </div>
                </div>
            </div>
        </div>
    `,




    catalog: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Plant Catalog Management</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name"></div>
                    <div class="user-role"></div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="section-card">
                <h2 class="page-title">Manage Your Plant Catalog</h2>
                <p class="page-subtitle" style="margin-bottom: 40px;">Add, edit, or remove plants from your inventory.</p>
               
                <div class="btn-group">
                    <button class="btn btn-primary">+ Add New Plant</button>
                    <button class="btn btn-secondary">Import Plants</button>
                </div>




                <div style="border: 2px dashed #ccc; border-radius: 15px; height: 400px; display: flex; align-items: center; justify-content: center;">
                    <p class="placeholder">Plant catalog list will appear here</p>
                </div>
            </div>
        </div>
    `,




    purchase: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Purchase / Reservation</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name"></div>
                    <div class="user-role"></div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="section-card">
                <h2 class="page-title">Order Management</h2>
                <p class="page-subtitle" style="margin-bottom: 40px;">Manage customer purchases and reservations.</p>
               
                <div class="stats-row">
                    <div class="mini-stat green">
                        <p class="mini-stat-label">New Orders</p>
                        <p class="mini-stat-value"></p>
                    </div>
                    <div class="mini-stat yellow">
                        <p class="mini-stat-label">Processing</p>
                        <p class="mini-stat-value"></p>
                    </div>
                    <div class="mini-stat blue">
                        <p class="mini-stat-label">Completed</p>
                        <p class="mini-stat-value"></p>
                    </div>
                </div>




                <div style="border: 2px dashed #ccc; border-radius: 15px; height: 400px; display: flex; align-items: center; justify-content: center;">
                    <p class="placeholder">Order list will appear here</p>
                </div>
            </div>
        </div>
    `,




    delivery: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Delivery Scheduling</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name"></div>
                    <div class="user-role"></div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="section-card">
                <h2 class="page-title">Schedule Deliveries</h2>
                <p class="page-subtitle" style="margin-bottom: 40px;">Manage and track delivery schedules for plant orders.</p>
               
                <div style="margin-bottom: 40px;">
                    <h3 style="font-size: 24px; font-weight: bold; color: black; margin-bottom: 20px;">Today's Deliveries</h3>
                    <div class="stats-row-2">
                        <div class="mini-stat-2 green">
                            <p class="mini-stat-label">Scheduled</p>
                            <p class="mini-stat-value"></p>
                        </div>
                        <div class="mini-stat-2 orange">
                            <p class="mini-stat-label">Pending</p>
                            <p class="mini-stat-value"></p>
                        </div>
                    </div>
                </div>




                <div style="border: 2px dashed #ccc; border-radius: 15px; height: 400px; display: flex; align-items: center; justify-content: center;">
                    <p class="placeholder">Delivery calendar and schedule will appear here</p>
                </div>
            </div>
        </div>
    `,




    profile: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Profile Management</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name"></div>
                    <div class="user-role"></div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="section-card">
                <h2 class="page-title">Your Profile</h2>
                <p class="page-subtitle" style="margin-bottom: 40px;">Manage your account settings and preferences.</p>
               
                <div class="profile-section">
                    <div class="profile-avatar"></div>
                    <div class="profile-form">
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" value="" placeholder="Enter your full name">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" value="" placeholder="Enter your email">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Role</label>
                            <input type="text" class="form-input" value="" placeholder="Administrator" disabled>
                        </div>
                    </div>
                </div>




                <div class="btn-group">
                    <button class="btn btn-primary">Save Changes</button>
                    <button class="btn btn-secondary">Cancel</button>
                </div>
            </div>
        </div>
    `,




    help: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Help Center</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name"></div>
                    <div class="user-role"></div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="section-card">
                <h2 class="page-title">How Can We Help You?</h2>
                <p class="page-subtitle" style="margin-bottom: 40px;">Find answers to common questions and get support.</p>
               
                <div class="help-topics">
                    <div class="help-topic">
                        <h3 class="help-topic-title">Getting Started</h3>
                        <p class="help-topic-desc">Learn the basics of using the admin panel</p>
                    </div>
                    <div class="help-topic">
                        <h3 class="help-topic-title">Managing Plants</h3>
                        <p class="help-topic-desc">How to add, edit, and organize your plant catalog</p>
                    </div>
                    <div class="help-topic">
                        <h3 class="help-topic-title">Order Processing</h3>
                        <p class="help-topic-desc">Guide to handling customer orders and reservations</p>
                    </div>
                    <div class="help-topic">
                        <h3 class="help-topic-title">Technical Support</h3>
                        <p class="help-topic-desc">Contact our support team for technical assistance</p>
                    </div>
                </div>




                <div class="help-contact">
                    <h3>Need More Help?</h3>
                    <p>Contact our support team at support@gabayhalaman.com</p>
                    <button class="btn btn-primary">Contact Support</button>
                </div>
            </div>
        </div>
    `
};




// Initialize the app
let currentPage = 'dashboard';
let salesChart = null;
let currentDashboardData = null;
let isLogoutInProgress = false;




// Default dashboard data
const defaultDashboardData = {
    totalPlants: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalClients: 0,
    clientsData: [],
    monthlyGrowth: 0,
    salesData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: Array(12).fill(0)
    }
};




// Get dashboard data from API
function resolveClientName(request) {
    return request.client_name || request.full_name || request.name || request.customer_name || request.customerName || '';
}




function resolvePlantName(request) {
    return request.plant_name || request.plantName || request.plant || '';
}




function resolveOrderAmount(request) {
    const raw = request.amount || request.total_price || request.totalPrice || request.total || 0;
    const value = typeof raw === 'string' ? parseFloat(raw.replace(/[^0-9.-]+/g, '')) : raw;
    return Number.isFinite(value) ? value : 0;
}




function resolveOrderQuantity(request) {
    const raw = request.quantity || request.qty || request.amount_of_plants || request.plant_count || 1;
    const value = typeof raw === 'string' ? parseFloat(raw.replace(/[^0-9.-]+/g, '')) : raw;
    return Number.isFinite(value) && value > 0 ? Math.round(value) : 1;
}

function normalizeDashboardRequestStatus(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'delivered' || value === 'completed' || value === 'reserved') {
        return 'delivered';
    }

    if (value === 'out for delivery' || value === 'out_for_delivery' || value === 'shipping') {
        return 'out-for-delivery';
    }

    if (value === 'cancel' || value === 'cancelled' || value === 'canceled') {
        return 'cancel';
    }

    return 'pending';
}

function normalizeDashboardDeliveryStatus(status) {
    const value = String(status || '').toLowerCase();

    if (value === 'delivered') {
        return 'delivered';
    }

    if (value === 'out for delivery' || value === 'out_for_delivery' || value === 'shipping') {
        return 'out-for-delivery';
    }

    return 'pending';
}

function getDashboardOrderKey(record) {
    const orderId = String(record.orderId || record.request_id || record.requestId || '').trim();
    if (orderId) {
        return 'order:' + orderId;
    }

    const deliveryId = String(record.delivery_id || record.deliveryId || '').trim();
    if (deliveryId) {
        return 'delivery:' + deliveryId;
    }

    const fallbackId = String(record.id || record.request_id || record.delivery_id || '').trim();
    return fallbackId ? 'id:' + fallbackId : '';
}

function getLocalDashboardPurchaseOrders() {
    const purchases = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    if (!Array.isArray(purchases)) {
        return [];
    }

    return purchases.map(order => ({
        ...order,
        orderId: String(order.orderId || order.id || '').trim(),
        customerName: order.customerName || 'Customer',
        request_status: normalizeDashboardRequestStatus(order.orderStatus),
        request_type: 'purchase'
    }));
}

function getLocalDashboardReservationOrders() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    if (!Array.isArray(reservations)) {
        return [];
    }

    return reservations
        .filter(order => order && order.isPlacedOrder === true)
        .map(order => ({
            ...order,
            orderId: String(order.orderId || order.id || '').trim(),
            customerName: order.customerName || 'Customer',
            request_status: normalizeDashboardRequestStatus(order.orderStatus),
            request_type: 'reservation'
        }));
}

function mergeDashboardRequestsWithLocal(backendRequests, localRequests) {
    if (!Array.isArray(localRequests) || !localRequests.length) {
        return backendRequests;
    }

    const localMap = new Map();
    localRequests.forEach(order => {
        const key = String(order.orderId || order.request_id || order.id || '').trim();
        if (key) {
            localMap.set(key, order);
        }
    });

    const merged = backendRequests.map(order => {
        const key = String(order.orderId || order.request_id || order.id || '').trim();
        const localOrder = localMap.get(key);
        if (!localOrder) {
            return order;
        }

        localMap.delete(key);
        return {
            ...order,
            ...localOrder
        };
    });

    return [...Array.from(localMap.values()), ...merged];
}




async function getDashboardData() {
    try {
        const [plants, backendRequests, backendDeliveries] = await Promise.all([
            typeof plantsAPI !== 'undefined' ? plantsAPI.getAll() : Promise.resolve([]),
            typeof requestsAPI !== 'undefined' ? requestsAPI.getAll() : Promise.resolve([]),
            typeof deliveriesAPI !== 'undefined' ? deliveriesAPI.getAll() : Promise.resolve([])
        ]);

        const normalizedBackendRequests = (Array.isArray(backendRequests) ? backendRequests : []).map(request => ({
            ...request,
            orderId: String(request.request_id || request.orderId || '').trim(),
            customerName: request.client_name || request.customerName || request.customer_name || ''
        }));

        const localRequests = [
            ...getLocalDashboardPurchaseOrders(),
            ...getLocalDashboardReservationOrders()
        ];

        const validRequests = mergeDashboardRequestsWithLocal(normalizedBackendRequests, localRequests);
        const validDeliveries = Array.isArray(backendDeliveries) ? backendDeliveries : [];
        const clientNames = new Set();
        const monthlyCounts = Array(12).fill(0);
        const unifiedOrderMap = new Map();

        validRequests.forEach(request => {
            const key = getDashboardOrderKey(request);
            if (!key) {
                return;
            }

            unifiedOrderMap.set(key, {
                clientName: resolveClientName(request),
                requestStatus: normalizeDashboardRequestStatus(request.request_status || request.status || request.orderStatus),
                date: request.request_date || request.requestDate || request.created_at || request.createdAt || null
            });
        });

        validDeliveries.forEach(delivery => {
            const key = getDashboardOrderKey({ orderId: delivery.request_id, delivery_id: delivery.delivery_id, id: delivery.delivery_id });
            if (!key) {
                return;
            }

            const existing = unifiedOrderMap.get(key) || {};
            unifiedOrderMap.set(key, {
                ...existing,
                clientName: resolveClientName({
                    client_name: delivery.client_name,
                    customerName: existing.clientName
                }) || existing.clientName || '',
                deliveryStatus: normalizeDashboardDeliveryStatus(delivery.delivery_status || delivery.status),
                date: existing.date || delivery.scheduled_date || delivery.created_at || null
            });
        });




        unifiedOrderMap.forEach(order => {
            if (!order || !order.clientName) {
                return;
            }

            clientNames.add(String(order.clientName).trim());

            const orderDate = new Date(order.date || null);
            if (!Number.isNaN(orderDate.getTime())) {
                monthlyCounts[orderDate.getMonth()] += 1;
            }
        });




        const currentMonth = new Date().getMonth();
        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const monthlyGrowth = monthlyCounts[previousMonth]
            ? Math.round((monthlyCounts[currentMonth] - monthlyCounts[previousMonth]) / monthlyCounts[previousMonth] * 100)
            : monthlyCounts[currentMonth] > 0 ? 100 : 0;




        return {
            totalPlants: Array.isArray(plants) ? plants.length : 0,
            totalOrders: unifiedOrderMap.size,
            pendingOrders: Array.from(unifiedOrderMap.values()).filter(order => {
                const effectiveStatus = order.deliveryStatus || order.requestStatus || 'pending';
                return effectiveStatus === 'pending';
            }).length,
            totalClients: clientNames.size,
            clientsData: validRequests,
            monthlyGrowth,
            salesData: {
                labels: defaultDashboardData.salesData.labels,
                data: monthlyCounts
            }
        };
    } catch (error) {
        console.warn('Unable to load dashboard data:', error);
        return defaultDashboardData;
    }
}




// Generate stat card HTML
function createStatCard(title, value, info, icon, onClick = null) {
    const clickableClass = onClick ? 'stat-card clickable' : 'stat-card';
    const clickAction = onClick ? `onclick="${onClick}"` : '';
    const displayValue = value != null && typeof value.toLocaleString === 'function' ? value.toLocaleString() : '0';
    return `
        <div class="${clickableClass}" ${clickAction}>
            <div class="stat-content">
                <div class="stat-icon">
                    ${icon}
                </div>
                <div class="stat-details">
                    <p class="stat-label">${title}</p>
                    <p class="stat-value">${displayValue}</p>
                    <p class="stat-info">${info}</p>
                </div>
            </div>
        </div>
    `;
}




// Plant icon SVG
const plantIconSvg = '<svg width="56" height="59" fill="none" viewBox="0 0 56 59"><path d="M28 59C24.7333 59 21.6562 58.4622 18.7687 57.3867C15.8812 56.3112 13.2417 54.7901 10.85 52.8234L5.95 57.8938C5.30833 58.5698 4.49167 58.9078 3.5 58.9078C2.50833 58.9078 1.69167 58.5698 1.05 57.8938C0.408333 57.2177 0.0875 56.3573 0.0875 55.3125C0.0875 54.2677 0.408333 53.4073 1.05 52.7313L5.8625 47.6609C3.99583 45.1411 2.55208 42.3448 1.53125 39.2719C0.510417 36.199 0 32.9417 0 29.5C0 21.2646 2.7125 14.2891 8.1375 8.57344C13.5625 2.85781 20.1833 0 28 0H56V29.5C56 37.7354 53.2875 44.7109 47.8625 50.4266C42.4375 56.1422 35.8167 59 28 59ZM28 51.625C33.8333 51.625 38.7917 49.474 42.875 45.1719C46.9583 40.8698 49 35.6458 49 29.5V7.375H28C22.1667 7.375 17.2083 9.52604 13.125 13.8281C9.04167 18.1302 7 23.3542 7 29.5C7 31.8969 7.35 34.1862 8.05 36.368C8.75 38.5497 9.7125 40.5318 10.9375 42.3141L29.05 23.2313C29.6917 22.5552 30.5083 22.2172 31.5 22.2172C32.4917 22.2172 33.3083 22.5552 33.95 23.2313C34.65 23.9688 35 24.8445 35 25.8586C35 26.8727 34.65 27.7484 33.95 28.4859L15.8375 47.5688C17.5292 48.8594 19.4104 49.8581 21.4812 50.5648C23.5521 51.2716 25.725 51.625 28 51.625Z" fill="#2E7D32"/></svg>';




const orderIconSvg = '<svg width="56" height="59" fill="none" viewBox="0 0 56 59"><path d="M6.22222 59C4.51111 59 3.0463 58.4498 1.82778 57.3494C0.609259 56.249 0 54.9262 0 53.381V19.6667C0 18.1214 0.609259 16.7986 1.82778 15.6982C3.0463 14.5978 4.51111 14.0476 6.22222 14.0476H12.4444C12.4444 10.1611 13.9611 6.84821 16.9944 4.10893C20.0278 1.36964 23.6963 0 28 0C32.3037 0 35.9722 1.36964 39.0056 4.10893C42.0389 6.84821 43.5556 10.1611 43.5556 14.0476H49.7778C51.4889 14.0476 52.9537 14.5978 54.1722 15.6982C55.3907 16.7986 56 18.1214 56 19.6667V53.381C56 54.9262 55.3907 56.249 54.1722 57.3494C52.9537 58.4498 51.4889 59 49.7778 59H6.22222ZM6.22222 53.381H49.7778V19.6667H6.22222V53.381ZM39.0056 32.4149C42.0389 29.6756 43.5556 26.3627 43.5556 22.4762H37.3333C37.3333 24.8175 36.4259 26.8075 34.6111 28.4464C32.7963 30.0853 30.5926 30.9048 28 30.9048C25.4074 30.9048 23.2037 30.0853 21.3889 28.4464C19.5741 26.8075 18.6667 24.8175 18.6667 22.4762H12.4444C12.4444 26.3627 13.9611 29.6756 16.9944 32.4149C20.0278 35.1542 23.6963 36.5238 28 36.5238C32.3037 36.5238 35.9722 35.1542 39.0056 32.4149ZM18.6667 14.0476H37.3333C37.3333 11.7063 36.4259 9.71627 34.6111 8.07738C32.7963 6.43849 30.5926 5.61905 28 5.61905C25.4074 5.61905 23.2037 6.43849 21.3889 8.07738C19.5741 9.71627 18.6667 11.7063 18.6667 14.0476Z" fill="#2E7D32"/></svg>';




const pendingIconSvg = '<svg width="58" height="60" fill="none" viewBox="0 0 58 60"><path d="M25.7778 52.275V31.725L6.44444 21.3V41.85L25.7778 52.275ZM32.2222 52.275L51.5556 41.85V21.3L32.2222 31.725V52.275ZM25.7778 59.175L3.22222 47.1C2.20185 46.55 1.40972 45.825 0.845833 44.925C0.281944 44.025 0 43.025 0 41.925V18.075C0 16.975 0.281944 15.975 0.845833 15.075C1.40972 14.175 2.20185 13.45 3.22222 12.9L25.7778 0.825C26.7981 0.275 27.8722 0 29 0C30.1278 0 31.2019 0.275 32.2222 0.825L54.7778 12.9C55.7982 13.45 56.5903 14.175 57.1542 15.075C57.7181 15.975 58 16.975 58 18.075V41.925C58 43.025 57.7181 44.025 57.1542 44.925C56.5903 45.825 55.7982 46.55 54.7778 47.1L32.2222 59.175C31.2019 59.725 30.1278 60 29 60C27.8722 60 26.7981 59.725 25.7778 59.175ZM41.8889 19.575L48.0917 16.275L29 6L22.7167 9.375L41.8889 19.575ZM29 26.55L35.2833 23.175L16.1917 12.9L9.90833 16.275L29 26.55Z" fill="#2E7D32"/></svg>';




const clientsIconSvg = '<svg width="56" height="59" fill="none" viewBox="0 0 56 59"><path d="M28 59C24.7333 59 21.6562 58.4622 18.7687 57.3867C15.8812 56.3112 13.2417 54.7901 10.85 52.8234L5.95 57.8938C5.30833 58.5698 4.49167 58.9078 3.5 58.9078C2.50833 58.9078 1.69167 58.5698 1.05 57.8938C0.408333 57.2177 0.0875 56.3573 0.0875 55.3125C0.0875 54.2677 0.408333 53.4073 1.05 52.7313L5.8625 47.6609C3.99583 45.1411 2.55208 42.3448 1.53125 39.2719C0.510417 36.199 0 32.9417 0 29.5C0 21.2646 2.7125 14.2891 8.1375 8.57344C13.5625 2.85781 20.1833 0 28 0H56V29.5C56 37.7354 53.2875 44.7109 47.8625 50.4266C42.4375 56.1422 35.8167 59 28 59ZM28 51.625C33.8333 51.625 38.7917 49.474 42.875 45.1719C46.9583 40.8698 49 35.6458 49 29.5V7.375H28C22.1667 7.375 17.2083 9.52604 13.125 13.8281C9.04167 18.1302 7 23.3542 7 29.5C7 31.8969 7.35 34.1862 8.05 36.368C8.75 38.5497 9.7125 40.5318 10.9375 42.3141L29.05 23.2313C29.6917 22.5552 30.5083 22.2172 31.5 22.2172C32.4917 22.2172 33.3083 22.5552 33.95 23.2313C34.65 23.9688 35 24.8445 35 25.8586C35 26.8727 34.65 27.7484 33.95 28.4859L15.8375 47.5688C17.5292 48.8594 19.4104 49.8581 21.4812 50.5648C23.5521 51.2716 25.725 51.625 28 51.625Z" fill="#2E7D32"/></svg>';




// Populate dashboard with dynamic data
async function populateDashboard() {
    const data = await getDashboardData();
   
    // Update user info from backend if possible
    let userName = 'Admin';
    let userRole = 'Administrator';
    try {
        const currentAdmin = JSON.parse(localStorage.getItem('admin') || 'null');
        if (currentAdmin?.admin_id) {
            const adminData = await adminAPI.getById(currentAdmin.admin_id);
            userName = adminData?.full_name || adminData?.name || userName;
            userRole = adminData?.role || userRole;
        }
    } catch (error) {
        console.warn('Unable to load admin user data:', error);
    }




    document.getElementById('dashboardUserName').textContent = userName;
    document.getElementById('dashboardUserRole').textContent = userRole;
    document.getElementById('dashboardGreeting').textContent = `Welcome back, ${userName}! Here's your store summary.`;
   
    // Create stat cards
    const statsHtml = `
        ${createStatCard('Total Plants', data.totalPlants, 'Active Listings', plantIconSvg)}
        ${createStatCard('Total Orders', data.totalOrders, `+${data.monthlyGrowth}% this month`, orderIconSvg)}
        ${createStatCard('Pending Orders', data.pendingOrders, 'Needs Attention', pendingIconSvg)}
        ${createStatCard('Total Clients', data.totalClients, 'Unique Customers', clientsIconSvg, 'showClientsPopup()')}
    `;
   
    const statsContainer = document.getElementById('dashboardStats');
    if (statsContainer) {
        statsContainer.innerHTML = statsHtml;
    }
   
    // Cache the loaded dashboard data so popups can reuse it
    currentDashboardData = data;




    // Initialize chart
    initializeSalesChart(data.salesData);




    // Update the Important section with analytics
    updateImportantSection(data);
}




function showClientsPopup() {
    const data = currentDashboardData || defaultDashboardData;
    let clientNames = Array.from(new Set(data.clientsData?.map(resolveClientName).filter(name => !!name))).sort();




    const clientsList = document.getElementById('clientsList');
    if (!clientsList) return;




    clientsList.innerHTML = clientNames.length > 0 ? clientNames.map(name => `
        <div class="client-item" onclick="showClientDetailsPopup('${name.replace(/'/g, "\\'")}')">
            <p class="client-name">${name}</p>
        </div>
    `).join('') : '<p class="placeholder">No clients found.</p>';




    document.getElementById('clientsPopup').style.display = 'flex';
}




function showClientDetailsPopup(clientName) {
    const data = currentDashboardData || defaultDashboardData;
    let clientOrders = (data.clientsData || []).filter(request => resolveClientName(request) === clientName);




    const orderQuantities = clientOrders
        .map(resolveOrderQuantity)
        .filter(quantity => quantity > 0);
    const totalOrders = clientOrders.length;
    const minOrder = orderQuantities.length ? Math.min(...orderQuantities) : 0;
    const maxOrder = orderQuantities.length ? Math.max(...orderQuantities) : 0;




    const plantsRequested = Array.from(new Set(clientOrders.map(resolvePlantName).filter(name => !!name))).sort();
    const plantTags = plantsRequested.length > 0 ? plantsRequested.map(plant => `<span class="plant-tag">${plant}</span>`).join('') : '<p class="placeholder">No plant requests available.</p>';




    const detailsContent = document.getElementById('clientDetailsContent');
    if (!detailsContent) return;




    detailsContent.innerHTML = `
        <div class="client-details">
            <div class="detail-item">
                <span class="detail-label">Total Orders</span>
                <span class="detail-value">${totalOrders}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Minimum Quantity</span>
                <span class="detail-value">${minOrder}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">Maximum Quantity</span>
                <span class="detail-value">${maxOrder}</span>
            </div>
            <div class="plant-list">
                <h4>Plants Requested</h4>
                <div class="plant-tags">${plantTags}</div>
            </div>
        </div>
    `;




    document.getElementById('clientDetailsTitle').textContent = `${clientName} - Details`;
    document.getElementById('clientDetailsPopup').style.display = 'flex';
}




function closePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) popup.style.display = 'none';
}




function updateImportantSection(data) {
    const allRequests = Array.isArray(data.clientsData) ? data.clientsData : [];




    const plantCounts = allRequests.reduce((acc, request) => {
        const plant = resolvePlantName(request);
        if (!plant) return acc;
        acc[plant] = (acc[plant] || 0) + 1;
        return acc;
    }, {});




    const mostDemandedPlants = Object.entries(plantCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([plant, count]) => `${plant} (${count})`)
        .join(', ');




    const clientPlantCounts = allRequests.reduce((acc, request) => {
        const clientName = resolveClientName(request);
        if (!clientName) return acc;
        acc[clientName] = (acc[clientName] || 0) + resolveOrderQuantity(request);
        return acc;
    }, {});




    const topClients = Object.entries(clientPlantCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([client, count]) => `${client} (${count} plants)`)
        .join(', ');




    const importantSectionCard = document.getElementById('importantSectionCard');
    if (!importantSectionCard) return;




    importantSectionCard.innerHTML = `
        <div class="important-grid">
            <div class="important-block">
                <h3 class="important-heading">Most Demanded Plants</h3>
                <p class="important-text">${mostDemandedPlants || 'No plant demand data available.'}</p>
            </div>
            <div class="important-block">
                <h3 class="important-heading">Top Clients</h3>
                <p class="important-text">${topClients || 'No client order data available.'}</p>
            </div>
        </div>
    `;
}




// Initialize sales chart
function initializeSalesChart(salesData) {
    const chartCanvas = document.getElementById('salesChart');
    if (!chartCanvas) return;
   
    // Destroy existing chart if it exists
    if (salesChart) {
        salesChart.destroy();
    }
   
    const ctx = chartCanvas.getContext('2d');
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: salesData.labels,
            datasets: [{
                label: 'Total Plants Sold',
                data: salesData.data,
                borderColor: '#2E7D32',
                backgroundColor: 'rgba(46, 125, 50, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#2E7D32',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#2E7D32',
                        font: {
                            size: 14,
                            weight: 'bold'
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    ticks: {
                        color: '#666',
                        font: {
                            size: 12
                        }
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}




// Logout function
function logout() {
    if (isLogoutInProgress) {
        return;
    }

    const confirmModal = document.getElementById('logoutConfirmModal');
    if (confirmModal) {
        confirmModal.classList.remove('hidden');
    }
}

function closeLogoutConfirmation() {
    if (isLogoutInProgress) {
        return;
    }

    const confirmModal = document.getElementById('logoutConfirmModal');
    if (confirmModal) {
        confirmModal.classList.add('hidden');
    }
}

function startLogoutFlow() {
    if (isLogoutInProgress) {
        return;
    }

    isLogoutInProgress = true;
    closeLogoutConfirmation();

    const loadingLine = document.getElementById('logoutLoadingLine');
    if (loadingLine) {
        loadingLine.classList.add('active');
    }

    window.setTimeout(() => {
        localStorage.removeItem('admin');
        window.location.href = '../../Admin/Auth/signin.html';
    }, 700);
}




// Load page content
function loadPage(pageName) {
    currentPage = pageName;
    const mainContent = document.getElementById('mainContent');
    mainContent.innerHTML = pages[pageName] || pages.dashboard;
   
    // Populate dashboard if it's the dashboard page
    if (pageName === 'dashboard') {
        populateDashboard();
    }
   
    // Update active nav item
    document.querySelectorAll('.nav-item, .bottom-action').forEach(item => {
        item.classList.remove('active');
    });




    const matchedNavItem = document.querySelector(`.nav-item[data-page="${pageName}"], .bottom-action[data-page="${pageName}"]`);
    if (matchedNavItem) {
        matchedNavItem.classList.add('active');
    } else if (pageName === 'dashboard') {
        const dashboardLink = document.querySelector('.sidebar-nav .nav-item[href$="dashboard.html"]');
        if (dashboardLink) {
            dashboardLink.classList.add('active');
        }
    }




    // Update URL without reloading
    history.pushState({ page: pageName }, '', `#${pageName}`);
}




// Handle navigation clicks
document.addEventListener('DOMContentLoaded', function() {
    const logoutConfirmModal = document.getElementById('logoutConfirmModal');
    const logoutConfirmCancel = document.getElementById('logoutConfirmCancel');
    const logoutConfirmProceed = document.getElementById('logoutConfirmProceed');

    if (logoutConfirmCancel) {
        logoutConfirmCancel.addEventListener('click', closeLogoutConfirmation);
    }

    if (logoutConfirmProceed) {
        logoutConfirmProceed.addEventListener('click', startLogoutFlow);
    }

    if (logoutConfirmModal) {
        logoutConfirmModal.addEventListener('click', (event) => {
            if (event.target === logoutConfirmModal) {
                closeLogoutConfirmation();
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeLogoutConfirmation();
        }
    });

    // Add click handlers to all navigation items
    document.querySelectorAll('[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page === 'logout') {
                logout();
            } else if (page === 'catalog') {
                window.location.href = '../PlantCatalog/plantcatalog.html';
            } else {
                loadPage(page);
            }
        });
    });




    // Handle browser back/forward buttons
    window.addEventListener('popstate', function(e) {
        if (e.state && e.state.page) {
            loadPage(e.state.page);
        }
    });




    // Load initial page based on URL hash
    const hash = window.location.hash.substring(1);
    if (hash && pages[hash]) {
        loadPage(hash);
    } else {
        loadPage('dashboard');
    }
});



