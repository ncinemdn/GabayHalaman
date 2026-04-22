// Page content templates
const pages = {
    dashboard: `
        <div class="page-header">
            <div class="search-bar">
                <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path d="M6.22222 59C4.51111 59 3.0463 58.4498 1.82778 57.3494C0.609259 56.249 0 54.9262 0 53.381V19.6667C0 18.1214 0.609259 16.7986 1.82778 15.6982C3.0463 14.5978 4.51111 14.0476 6.22222 14.0476H12.4444C12.4444 10.1611 13.9611 6.84821 16.9944 4.10893C20.0278 1.36964 23.6963 0 28 0C32.3037 0 35.9722 1.36964 39.0056 4.10893C42.0389 6.84821 43.5556 10.1611 43.5556 14.0476H49.7778C51.4889 14.0476 52.9537 14.5978 54.1722 15.6982C55.3907 16.7986 56 18.1214 56 19.6667V53.381C56 54.9262 55.3907 56.249 54.1722 57.3494C52.9537 58.4498 51.4889 59 49.7778 59H6.22222ZM6.22222 53.381H49.7778V19.6667H6.22222V53.381ZM39.0056 32.4149C42.0389 29.6756 43.5556 26.3627 43.5556 22.4762H37.3333C37.3333 24.8175 36.4259 26.8075 34.6111 28.4464C32.7963 30.0853 30.5926 30.9048 28 30.9048C25.4074 30.9048 23.2037 30.0853 21.3889 28.4464C19.5741 26.8075 18.6667 24.8175 18.6667 22.4762H12.4444C12.4444 26.3627 13.9611 29.6756 16.9944 32.4149C20.0278 35.1542 23.6963 36.5238 28 36.5238C32.3037 36.5238 35.9722 35.1542 39.0056 32.4149ZM18.6667 14.0476H37.3333C37.3333 11.7063 36.4259 9.71627 34.6111 8.07738C32.7963 6.43849 30.5926 5.61905 28 5.61905C25.4074 5.61905 23.2037 6.43849 21.3889 8.07738C19.5741 9.71627 18.6667 11.7063 18.6667 14.0476Z" fill="#8B8989"/>
                </svg>
                <input type="text" placeholder="Search plants, orders ...">
            </div>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name" id="dashboardUserName">Admin</div>
                    <div class="user-role">Admin</div>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div style="margin-bottom: 40px;">
                <h1 class="page-title">Dashboard Overview</h1>
                <p class="page-subtitle" id="dashboardGreeting">Welcome back! Here's your store summary.</p>
            </div>
            
            <div class="stats-grid" id="dashboardStats">
                <!-- Dynamic stats will be inserted here -->
            </div>

            <div class="chart-container">
                <h2 class="sales-performance-title">Plant Sales Performance</h2>
                <div class="chart-wrapper">
                    <div class="chart-canvas-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                </div>
            </div>

            <h2 class="section-title">Important</h2>
            <div class="section-card">
                <p class="placeholder">Important notifications and alerts will appear here</p>
            </div>
        </div>
    `,

    catalog: `
        <div class="page-header">
            <h1 style="font-size: 28px; font-weight: bold; color: black;">Plant Catalog Management</h1>
            <div class="user-info">
                <div class="user-avatar"></div>
                <div class="user-details">
                    <div class="user-name">Trisha Timog</div>
                    <div class="user-role">Admin</div>
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
                    <div class="user-name">Trisha Timog</div>
                    <div class="user-role">Admin</div>
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
                        <p class="mini-stat-value">24</p>
                    </div>
                    <div class="mini-stat yellow">
                        <p class="mini-stat-label">Processing</p>
                        <p class="mini-stat-value">12</p>
                    </div>
                    <div class="mini-stat blue">
                        <p class="mini-stat-label">Completed</p>
                        <p class="mini-stat-value">156</p>
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
                    <div class="user-name">Trisha Timog</div>
                    <div class="user-role">Admin</div>
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
                            <p class="mini-stat-value">8</p>
                        </div>
                        <div class="mini-stat-2 orange">
                            <p class="mini-stat-label">Pending</p>
                            <p class="mini-stat-value">3</p>
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
                    <div class="user-name">Trisha Timog</div>
                    <div class="user-role">Admin</div>
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
                            <input type="text" class="form-input" value="Trisha Timog">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-input" value="trisha.timog@gabayhalaman.com">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Role</label>
                            <input type="text" class="form-input" value="Admin" disabled>
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
                    <div class="user-name">Trisha Timog</div>
                    <div class="user-role">Admin</div>
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

// Default dashboard data
const defaultDashboardData = {
    totalPlants: 324,
    totalOrders: 1458,
    pendingOrders: 12,
    monthlyGrowth: 12.5,
    salesData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        data: [100, 120, 150, 140, 210, 220, 180, 150, 200, 260, 230, 210]
    }
};

// Get dashboard data from API or localStorage
async function getDashboardData() {
    try {
        // Try to fetch from backend
        const plants = await plantsAPI.getAll();
        const requests = await requestsAPI.getAll();
        
        return {
            totalPlants: plants ? plants.length : 0,
            totalOrders: requests ? requests.length : 0,
            pendingOrders: requests ? requests.filter(r => r.status === 'pending').length : 0,
            monthlyGrowth: 12.5,
            salesData: defaultDashboardData.salesData
        };
    } catch (error) {
        console.warn('Using default dashboard data:', error);
        return defaultDashboardData;
    }
}

// Generate stat card HTML
function createStatCard(title, value, info, icon) {
    return `
        <div class="stat-card">
            <div class="stat-content">
                <div class="stat-icon">
                    ${icon}
                </div>
                <div class="stat-details">
                    <p class="stat-label">${title}</p>
                    <p class="stat-value">${value.toLocaleString()}</p>
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

// Populate dashboard with dynamic data
async function populateDashboard() {
    const data = await getDashboardData();
    
    // Update user info
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const userName = admin.full_name || admin.name || 'Admin';
    document.getElementById('dashboardUserName').textContent = userName;
    document.getElementById('dashboardGreeting').textContent = `Welcome back, ${userName}! Here's your store summary.`;
    
    // Create stat cards
    const statsHtml = `
        ${createStatCard('Total Plants', data.totalPlants, 'Active Listings', plantIconSvg)}
        ${createStatCard('Total Orders', data.totalOrders, `+${data.monthlyGrowth}% this month`, orderIconSvg)}
        ${createStatCard('Pending Orders', data.pendingOrders, 'Needs Attention', pendingIconSvg)}
    `;
    
    const statsContainer = document.getElementById('dashboardStats');
    if (statsContainer) {
        statsContainer.innerHTML = statsHtml;
    }
    
    // Initialize chart
    initializeSalesChart(data.salesData);
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
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
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
