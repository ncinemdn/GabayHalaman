let historyStack = [];
let futureStack = [];
const DELIVERY_STORAGE_KEY = 'gh_delivery_schedule_v1';
let selectedOrderId = null;

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

function getSelectedOrLatestOrder(orders) {
  if (!Array.isArray(orders) || !orders.length) {
    return null;
  }

  if (selectedOrderId) {
    const selected = orders.find(order => String(order.id || '') === String(selectedOrderId));
    if (selected) {
      return selected;
    }
  }

  selectedOrderId = orders[0].id;
  return orders[0];
}

function openOrderDetails(orderId) {
  selectedOrderId = orderId;
  navigateTo('order-details');
}

function openTrackOrder(orderId) {
  selectedOrderId = orderId;
  navigateTo('track-order');
}

function loadCurrentOrder() {
    const purchases = getPurchaseOrders();

    const container = document.getElementById('currentOrderContainer');
    if (!container) return;

  const orders = purchases.filter(order => Array.isArray(order.items) && order.items.length > 0);

  if (!orders.length) {
    container.innerHTML = `
      <section class="orders-empty-state" aria-live="polite">
        <div class="orders-empty-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M6 3.5H15L19 7.5V20L16.5 18.7L14 20L11.5 18.7L9 20L6.5 18.7L4 20V5.5C4 4.4 4.9 3.5 6 3.5Z" stroke="currentColor" stroke-width="1.8"/>
            <path d="M15 3.5V7.5H19" stroke="currentColor" stroke-width="1.8"/>
            <path d="M8 10.5H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <path d="M8 14H15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </div>
        <h2>No orders yet</h2>
        <p>Your purchases will appear here after checkout.</p>
        <div class="orders-empty-actions">
          <a href="../Shopage/Shoppage.html" class="orders-empty-btn primary">Start Shopping</a>
          <a href="../Reservation/reservation.html" class="orders-empty-btn secondary">Reserve Plants</a>
        </div>
      </section>
    `;
        return;
    }

  container.innerHTML = orders.map(order => {
    const itemsHTML = order.items.map(item => `<p>${item.name} (${item.qty} pcs)</p>`).join('');
    const firstItem = order.items[0];
    const firstItemImage = firstItem.image || getPlantImage(firstItem.name);
    const totalPrice = Number(order.totalAmount || 0);
    const orderId = order.orderId || '';
    const trackingStatus = getResolvedTrackingStatus(order);
    const trackingLabel = formatTrackingLabel(trackingStatus);
    const orderStatusClass = normalizeOrderStatus(order.orderStatus);
    const orderStatusLabel = formatOrderStatusLabel(order.orderStatus);
    const isReservedOrder = Boolean(order.isReserved);
    const reserveLabel = isReservedOrder ? 'Reserved' : 'Not Reserved';
    const reserveClass = isReservedOrder ? 'reserved' : 'not-reserved';

    return `
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
                    <p class="order-total-row">
                      <span class="order-total-label">Total</span>
                      <span class="order-total-value">\u20B1${totalPrice.toLocaleString('en-PH', {minimumFractionDigits: 2})}</span>
                    </p>
                    <p class="order-reserve-row">
                      <span class="order-reserve-label">Reservation</span>
                      <span class="order-reserve-badge ${reserveClass}">${reserveLabel}</span>
                    </p>
                </div>
                <p class="order-status ${orderStatusClass}">${orderStatusLabel}</p>
            </div>
            
            <div class="button-container">
                <button class="order-btn disabled">Order Received</button>
        <button class="order-btn primary" onclick="openOrderDetails('${order.id}')">Order Details</button>
            </div>
        </div>
  `;
  }).join('');
}

function trackCurrentOrder() {
  const purchases = getPurchaseOrders();
  const selected = getSelectedOrLatestOrder(purchases);
  if (!selected) {
    return;
  }

  selectedOrderId = selected.id;
  navigateTo('track-order');
}

function loadOrderDetails() {
    const purchases = getPurchaseOrders();
  const latestOrder = getSelectedOrLatestOrder(purchases);

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

    const paymentStatusElement = document.getElementById('detailsPaymentStatus');
    if (paymentStatusElement) {
      const paymentStatus = normalizePaymentStatus(latestOrder.paymentStatus);
      paymentStatusElement.textContent = formatPaymentStatusLabel(paymentStatus);
      paymentStatusElement.className = 'payment-status-tag ' + paymentStatus;
    }

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

    // Load delivery window
    loadDeliveryWindow(latestOrder);
}

function syncPurchaseOrderStatus(order, status) {
    const orders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    const updatedOrders = orders.map(item => {
        const itemId = String(item.id || item.orderId || '');
        const orderId = String(order.id || order.orderId || '');
        if (itemId === orderId) {
            return {
                ...item,
                orderStatus: status
            };
        }
        return item;
    });
    localStorage.setItem('purchaseOrders', JSON.stringify(updatedOrders));
}

async function updateBackendOrderStatus(order) {
    if (typeof requestsAPI === 'undefined') {
        return;
    }

    const requestId = Number(order.id);
    if (!Number.isFinite(requestId)) {
        return;
    }

    try {
        await requestsAPI.updateStatus(requestId, {
            request_status: order.orderStatus,
            payment_status: order.paymentStatus || 'paid',
            last_updated: new Date().toISOString()
        });
    } catch (error) {
        console.warn('Unable to update order status on backend:', error);
    }
}

function showCancelConfirmation() {
    const overlay = document.getElementById('cancel-confirmation');
    if (!overlay) return;

    const messageEl = document.getElementById('cancelModalMessage');
    if (messageEl) {
        messageEl.textContent = 'Are you sure you want to cancel this order?';
    }

    const confirmBtn = document.getElementById('cancelConfirmBtn');
    const dismissBtn = document.getElementById('cancelDismissBtn');
    if (confirmBtn) {
        confirmBtn.style.display = 'inline-block';
    }
    if (dismissBtn) {
        dismissBtn.textContent = 'Keep order';
    }

    overlay.classList.add('active');
}

function hideCancelConfirmation() {
    const overlay = document.getElementById('cancel-confirmation');
    if (!overlay) return;
    overlay.classList.remove('active');
}

function confirmCancelOrder() {
    const purchases = getPurchaseOrders();
    const order = getSelectedOrLatestOrder(purchases);
    if (!order) {
        return;
    }

    const normalized = normalizeOrderStatus(order.orderStatus);
    if (normalized === 'cancel') {
        showCancelNotification('This order is already cancelled.');
        return;
    }

    showCancelConfirmation();
}

async function cancelCurrentOrder() {
    const purchases = getPurchaseOrders();
    const order = getSelectedOrLatestOrder(purchases);
    if (!order) {
        hideCancelConfirmation();
        return;
    }

    order.orderStatus = 'cancel';
    syncPurchaseOrderStatus(order, 'cancel');
    await updateBackendOrderStatus(order);
    loadCurrentOrder();
    loadOrderDetails();
    hideCancelConfirmation();
}

function showCancelNotification(message) {
    const overlay = document.getElementById('cancel-confirmation');
    if (!overlay) {
        return;
    }

    const messageEl = document.getElementById('cancelModalMessage');
    if (messageEl) {
        messageEl.textContent = message;
    }

    overlay.classList.add('active');
    const confirmBtn = document.getElementById('cancelConfirmBtn');
    const dismissBtn = document.getElementById('cancelDismissBtn');

    if (confirmBtn) {
        confirmBtn.style.display = 'none';
    }
    if (dismissBtn) {
        dismissBtn.textContent = 'Close';
    }
}

async function loadDeliveryWindow(order) {
    const earliestDeliveryElement = document.getElementById('detailsEarliestDelivery');
    const latestDeliveryElement = document.getElementById('detailsLatestDelivery');

    if (!earliestDeliveryElement || !latestDeliveryElement) return;

    try {
        // Get client ID from order (assuming it's stored in the order data)
        const clientId = order?.deliveryDetails?.clientId || order.clientId || order.customerId;

        if (!clientId) {
            earliestDeliveryElement.textContent = 'N/A';
            latestDeliveryElement.textContent = 'N/A';
            return;
        }

        const deliveryWindow = await requestsAPI.getDeliveryWindow(clientId);

        if (deliveryWindow && deliveryWindow.EarliestDelivery && deliveryWindow.LatestDelivery) {
            // Format dates
            const earliestDate = new Date(deliveryWindow.EarliestDelivery);
            const latestDate = new Date(deliveryWindow.LatestDelivery);

            earliestDeliveryElement.textContent = earliestDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            latestDeliveryElement.textContent = latestDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } else {
            earliestDeliveryElement.textContent = 'Not scheduled';
            latestDeliveryElement.textContent = 'Not scheduled';
        }
    } catch (error) {
        console.error('Error loading delivery window:', error);
        earliestDeliveryElement.textContent = 'Error loading';
        latestDeliveryElement.textContent = 'Error loading';
    }
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

function getPurchaseOrders() {
  const purchases = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
  const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

  const reservationOrders = Array.isArray(reservations)
    ? reservations
        .filter(order => order && (order.isPlacedOrder === true || String(order.orderId || '').indexOf('#RES-') === 0))
        .map(order => {
          const items = Array.isArray(order.items)
            ? order.items
            : [{
                name: order.name || order.plantOrdered || 'Plant',
                qty: Number(order.quantity || 1),
                price: Number(order.price || 0),
                image: getPlantImage(order.name || order.plantOrdered || '')
              }];

          return {
            ...order,
            items,
            totalAmount: Number(order.totalAmount || 0),
            createdAt: order.createdAt || new Date(0).toISOString()
          };
        })
    : [];

  const allOrders = ([])
    .concat(Array.isArray(purchases) ? purchases : [])
    .concat(reservationOrders);

  return allOrders.map(order => {
    const isReserved = Boolean(
      order && (
        order.isReserved === true ||
        order.isPlacedOrder === true ||
        String(order.orderId || '').indexOf('#RES-') === 0
      )
    );

    return {
      ...order,
      isReserved
    };
  }).sort((a, b) => {
    const first = new Date(a && a.createdAt ? a.createdAt : 0).getTime();
    const second = new Date(b && b.createdAt ? b.createdAt : 0).getTime();
    return second - first;
  });
}

function getDeliverySchedule() {
  const raw = localStorage.getItem(DELIVERY_STORAGE_KEY);
  const parsed = raw ? JSON.parse(raw) : [];
  return Array.isArray(parsed) ? parsed : [];
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

function normalizeOrderStatus(status) {
  const value = String(status || '').toLowerCase();

  if (value === 'delivered' || value === 'completed' || value === 'reserved') {
    return 'delivered';
  }

  if (value === 'cancel' || value === 'cancelled' || value === 'canceled') {
    return 'cancel';
  }

  return 'pending';
}

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

function formatOrderStatusLabel(status) {
  const value = normalizeOrderStatus(status);

  if (value === 'delivered') {
    return 'Delivered';
  }

  if (value === 'cancel') {
    return 'Cancel';
  }

  return 'Pending';
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

function getResolvedTrackingStatus(order) {
  if (!order) {
    return 'confirmed';
  }

  const schedule = getDeliverySchedule();
  const matchedDelivery = schedule.find(item => String(item.orderId || '') === String(order.orderId || ''));

  if (matchedDelivery) {
    return normalizeTrackingStatus(matchedDelivery.trackingStatus);
  }

  return normalizeTrackingStatus(order.trackingStatus);
}

function formatTrackingLabel(status) {
  if (status === 'prepared') {
    return 'Prepared by Seller';
  }

  if (status === 'out_for_delivery') {
    return 'Out for Delivery';
  }

  if (status === 'delivered') {
    return 'Delivered';
  }

  return 'Confirmed';
}

function getTrackingPayload(order) {
  const states = ['Order Confirmed', 'Prepared by Seller', 'Out for Delivery', 'Delivered'];
  const normalized = getResolvedTrackingStatus(order);

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
  const order = purchases.find(item => String(item.id || '') === String(orderId || '')) || getSelectedOrLatestOrder(purchases);

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

  const confirmBtn = document.getElementById('cancelConfirmBtn');
  const dismissBtn = document.getElementById('cancelDismissBtn');
  const overlay = document.getElementById('cancel-confirmation');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', cancelCurrentOrder);
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      hideCancelConfirmation();
      if (dismissBtn) {
        dismissBtn.textContent = 'Keep order';
      }
      const messageEl = document.getElementById('cancelModalMessage');
      if (messageEl) {
        messageEl.textContent = 'Are you sure you want to cancel this order?';
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideCancelConfirmation();
      }
    });
  }
});