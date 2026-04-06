let historyStack = [];
let futureStack = [];

// Plant image mapping
const plantImages = {
    "Rambutan RR Tuklapin": "https://images.unsplash.com/photo-1609123079242-086695c6ff09?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Mangosteen": "https://images.unsplash.com/photo-1706698352015-a907c7f8a445?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Durian Puyat": "https://images.unsplash.com/photo-1630510526315-aba311212355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Sweet Tamarind": "https://images.unsplash.com/photo-1597081779002-314055fe24ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Bangkok Santol": "https://images.unsplash.com/photo-1737992468893-9c109da39f9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Sweet Balimbing": "https://images.unsplash.com/photo-1760509614441-e9ca05cba0df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Avocado Lagkitan": "https://images.unsplash.com/photo-1726177551991-270f9e79b65e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Cacao": "https://images.unsplash.com/photo-1625558904461-6cf9d0a18a18?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Japanese Orange": "https://images.unsplash.com/photo-1769968065899-832195e26d5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Davao Pomelo": "https://images.unsplash.com/photo-1655082291675-b919ca1c3419?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Calamansi": "https://images.unsplash.com/photo-1710425923077-1a7120a69eaa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Lemon Meyer": "https://images.unsplash.com/photo-1585931158785-8e8b240c627f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Queen Manggo": "https://images.unsplash.com/photo-1689001819501-416754401ab1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Golden": "https://images.unsplash.com/photo-1720798377880-2a1b656848ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Red Guaple": "https://images.unsplash.com/photo-1689996647099-a7a0b67fd2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Lychee": "https://images.unsplash.com/photo-1705335834319-92a152363ea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Hybrid Mulberry": "https://images.unsplash.com/photo-1711641011417-3162af1e834c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Red Cardinal Grapes": "https://images.unsplash.com/photo-1660805376081-c6b01b7b78f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Sweet Guyabano": "https://images.unsplash.com/photo-1651565919334-bf81165cd0a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Pomegranate": "https://images.unsplash.com/photo-1761135174741-5507a710bb49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Longan": "https://images.unsplash.com/photo-1752368198532-4e5d4c892b91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
};

const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

function getPlantImage(plantName) {
    return plantImages[plantName] || DEFAULT_PLANT_IMAGE;
}

function loadCurrentOrder() {
    const purchases = getPurchaseOrders();
    const latestOrder = purchases[0];

    const container = document.getElementById('currentOrderContainer');
    if (!container) return;

    if (!latestOrder || !latestOrder.items || latestOrder.items.length === 0) {
        container.innerHTML = '<p style="padding:24px;color:#888;">No orders placed yet.</p>';
        return;
    }

    let itemsHTML = '';
    let totalQty = 0;

    latestOrder.items.forEach(item => {
        totalQty += item.qty;
        itemsHTML += `<p>${item.name} (${item.qty} pcs)</p>`;
    });

    const firstItem = latestOrder.items[0];
    const firstItemImage = firstItem.image || getPlantImage(firstItem.name);
    const totalPrice = latestOrder.totalAmount || 0;
    const orderId = latestOrder.orderId || '';

    const currentOrderHTML = `
        <div class="order-card">
            <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 20px; position: relative;">
                <div class="product-image">
                    <img alt="" src="${firstItemImage}" onerror="this.src='${DEFAULT_PLANT_IMAGE}'" />
                </div>
                <div style="flex: 1;">
                    <p class="order-category">Order ${orderId}</p>
                    <div class="order-items">
                        ${itemsHTML}
                    </div>
                    <p style="margin-top:6px;font-size:13px;color:#555;">Total: \u20B1${totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}</p>
                </div>
                <p class="order-status pending">Confirmed</p>
            </div>
            
            <div class="delivery-banner">
                <p class="delivery-text">Order Confirmed Today</p>
                <div class="delivery-chevron">
                    <svg fill="none" preserveAspectRatio="none" viewBox="0 0 24 24" style="transform: rotate(-90deg);">
                        <path d="M12 15.4L6 9.4L7.4 8L12 12.6L16.6 8L18 9.4L12 15.4Z" fill="#359C4D" />
                    </svg>
                </div>
            </div>

            <div class="button-container">
                <button class="order-btn disabled">Order Received</button>
                <button class="order-btn primary" onclick="navigateTo('order-details')">Order Details</button>
            </div>
        </div>
    `;

    container.innerHTML = currentOrderHTML;
}

function trackCurrentOrder() {
    navigateTo('track-order');
}

function loadOrderDetails() {
    const purchases = getPurchaseOrders();
    const latestOrder = purchases[0];

    if (!latestOrder || !latestOrder.items || latestOrder.items.length === 0) {
        document.getElementById('detailsFullName').textContent = 'No Data';
        return;
    }

    const deliveryDetails = latestOrder.deliveryDetails || {};

    // Set image from first item
    const firstItem = latestOrder.items[0];
    const firstItemImage = firstItem.image || getPlantImage(firstItem.name);
    document.getElementById('detailsImage').src = firstItemImage;
    document.getElementById('detailsImage').onerror = function() { this.src = DEFAULT_PLANT_IMAGE; };

    // Set full name
    document.getElementById('detailsFullName').textContent = deliveryDetails.fullName || latestOrder.customerName || 'N/A';

    // Set phone
    document.getElementById('detailsPhone').textContent = deliveryDetails.phone || 'N/A';

    // Set address
    document.getElementById('detailsAddress').textContent = deliveryDetails.address || 'N/A';

    // Set items
    let itemsHTML = '';
    let totalQty = 0;
    let totalPrice = 0;
    latestOrder.items.forEach(item => {
        totalQty += item.qty;
        totalPrice += item.price * item.qty;
        itemsHTML += `<p>${item.name} (${item.qty} pcs) — \u20B1${(item.price * item.qty).toLocaleString('en-PH', {minimumFractionDigits: 2})}</p>`;
    });
    document.getElementById('detailsItems').innerHTML = itemsHTML;
    document.getElementById('detailsTotalQty').textContent = totalQty;
    document.getElementById('detailsTotalPrice').textContent = '\u20B1' + totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2});
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
      loadTrackOrder('123456');
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

function getPurchaseOrders() {
  return JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
}

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

function getTrackingPayload(order) {
  const states = ['Order Confirmed', 'Prepared by Seller', 'Out for Delivery', 'Delivered'];
  const normalized = normalizeTrackingStatus(order ? order.trackingStatus : 'confirmed');

  const currentIndex = {
    confirmed: 0,
    prepared: 1,
    out_for_delivery: 2,
    delivered: 3
  }[normalized] ?? 0;

  return {
    orderId: order ? (order.orderId || 'N/A') : 'N/A',
    currentStatus: states[currentIndex],
    statusIndex: currentIndex,
    statusLabels: states,
    eta: normalized === 'delivered' ? 'Delivered' : '1-2 days',
    location: normalized === 'delivered' ? 'Delivered to customer' : 'Processing at nursery',
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
  document.getElementById('order-id').textContent = '#' + data.orderId;
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
  const purchases = getPurchaseOrders();
  const order = purchases.find(item => item.id === orderId) || purchases[0] || null;

  if (!order) {
    document.getElementById('status-text').textContent = 'No tracking available';
    return;
  }

  const payload = getTrackingPayload(order);
  renderTrackSteps(payload);
  renderTrackInfo(payload);
}

// Initialize - show order list by default
document.addEventListener('DOMContentLoaded', () => {
  loadCurrentOrder();
  navigateTo('order-list');
});