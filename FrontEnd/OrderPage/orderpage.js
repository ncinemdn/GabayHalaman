let historyStack = [];
let futureStack = [];
const DELIVERY_STORAGE_KEY = 'gh_delivery_schedule_v1';
const ADMIN_NURSERY_ADDRESS = 'Sampaloc, Talisay, Batangas, Philippines';
let selectedOrderId = null;
let pendingDeleteOrderId = null;
let modalConfirmAction = null;
let currentOrderFilter = 'all';
let currentOrderPage = 1;
const ORDER_PAGE_SIZE = 4;

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

function getHistoryPageItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  const left = Math.max(2, currentPage - 1);
  const right = Math.min(totalPages - 1, currentPage + 1);

  if (left > 2) {
    items.push('ellipsis-left');
  }

  for (let page = left; page <= right; page += 1) {
    items.push(page);
  }

  if (right < totalPages - 1) {
    items.push('ellipsis-right');
  }

  items.push(totalPages);
  return items;
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

  const counts = {
    all: orders.length,
    pending: orders.filter(order => normalizeOrderStatus(order.orderStatus) === 'pending').length,
    delivered: orders.filter(order => normalizeOrderStatus(order.orderStatus) === 'delivered').length,
    cancel: orders.filter(order => normalizeOrderStatus(order.orderStatus) === 'cancel').length
  };

  const filteredOrders = currentOrderFilter === 'all'
    ? orders
    : orders.filter(order => normalizeOrderStatus(order.orderStatus) === currentOrderFilter);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDER_PAGE_SIZE));
  if (currentOrderPage > totalPages) {
    currentOrderPage = totalPages;
  }

  const startIndex = (currentOrderPage - 1) * ORDER_PAGE_SIZE;
  const pagedOrders = filteredOrders.slice(startIndex, startIndex + ORDER_PAGE_SIZE);

  const rowsMarkup = pagedOrders.map(order => {
    const firstItem = order.items[0] || { name: 'Plant', qty: 1, image: '' };
    const firstItemImage = firstItem.image || getPlantImage(firstItem.name);
    const totalPrice = Number(order.totalAmount || 0);
    const orderStatusClass = normalizeOrderStatus(order.orderStatus);
    const orderStatusLabel = formatOrderStatusLabel(order.orderStatus);
    const totalQty = order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0) || 1;
    const trackingLabel = formatTrackingLabel(getResolvedTrackingStatus(order));

    return `
      <article class="order-history-row" role="row">
        <div class="order-history-col item" role="cell">
          <div class="order-history-item-wrap">
            <img src="${firstItemImage}" alt="${firstItem.name}" class="order-history-item-image" onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
            <div>
              <p class="order-history-item-name">${firstItem.name}</p>
              <p class="order-history-item-meta">Qty: ${totalQty} • ${order.orderId || order.id || ''}</p>
            </div>
          </div>
        </div>
        <div class="order-history-col status" role="cell">
          <span class="history-status ${orderStatusClass}">${orderStatusLabel}</span>
          ${orderStatusClass === 'pending' ? `<span class="history-status-note">- ${trackingLabel}</span>` : ''}
        </div>
        <div class="order-history-col total" role="cell">\u20B1${totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</div>
        <div class="order-history-col details" role="cell">
          <button class="history-detail-btn" type="button" onclick="openOrderDetails('${order.id || order.orderId}')">Order Details</button>
          <button class="history-delete-icon-btn" type="button" aria-label="Delete order" title="Delete order" onclick="confirmDeleteOrder('${order.id || order.orderId}')">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M9 7V5h6v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="M7 7l1 12h8l1-12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </article>
    `;
  }).join('');

  const pageItems = getHistoryPageItems(totalPages, currentOrderPage);

  const paginationMarkup = `
    <div class="order-history-pagination-wrap">
      <nav class="order-history-pagination" aria-label="Order history pagination">
        <button class="history-page-btn nav" type="button" ${currentOrderPage === 1 ? 'disabled' : ''} onclick="setOrderHistoryPage(${currentOrderPage - 1})" aria-label="Previous page">&lt;</button>
        ${pageItems.map((item) => {
          if (typeof item !== 'number') {
            return '<span class="history-page-ellipsis" aria-hidden="true">...</span>';
          }

          return `<button class="history-page-btn ${item === currentOrderPage ? 'active' : ''}" type="button" onclick="setOrderHistoryPage(${item})" aria-label="Page ${item}" ${item === currentOrderPage ? 'aria-current="page"' : ''}>${item}</button>`;
        }).join('')}
        <button class="history-page-btn nav" type="button" ${currentOrderPage === totalPages ? 'disabled' : ''} onclick="setOrderHistoryPage(${currentOrderPage + 1})" aria-label="Next page">&gt;</button>
      </nav>
    </div>
  `;

  container.innerHTML = `
    <section class="order-history-panel" aria-live="polite">
      <div class="order-history-topbar">
        <div class="order-history-tabs" role="tablist" aria-label="Order status filters">
          <button class="history-tab ${currentOrderFilter === 'all' ? 'active' : ''}" type="button" role="tab" aria-selected="${currentOrderFilter === 'all'}" onclick="setOrderHistoryFilter('all')">All Order(${counts.all})</button>
          <button class="history-tab ${currentOrderFilter === 'pending' ? 'active' : ''}" type="button" role="tab" aria-selected="${currentOrderFilter === 'pending'}" onclick="setOrderHistoryFilter('pending')">Pending(${counts.pending})</button>
          <button class="history-tab ${currentOrderFilter === 'delivered' ? 'active' : ''}" type="button" role="tab" aria-selected="${currentOrderFilter === 'delivered'}" onclick="setOrderHistoryFilter('delivered')">Completed(${counts.delivered})</button>
          <button class="history-tab ${currentOrderFilter === 'cancel' ? 'active' : ''}" type="button" role="tab" aria-selected="${currentOrderFilter === 'cancel'}" onclick="setOrderHistoryFilter('cancel')">Cancelled(${counts.cancel})</button>
        </div>
      </div>

      <div class="order-history-head" role="row">
        <div class="order-history-col item" role="columnheader">Item</div>
        <div class="order-history-col status" role="columnheader">Status</div>
        <div class="order-history-col total" role="columnheader">Total</div>
        <div class="order-history-col details" role="columnheader">Details</div>
      </div>

      <div class="order-history-list" role="rowgroup">
        ${rowsMarkup || '<p class="order-history-empty">No orders found for this filter.</p>'}
      </div>

      ${paginationMarkup}
    </section>
  `;
}

function setOrderHistoryFilter(filter) {
  currentOrderFilter = String(filter || 'all');
  currentOrderPage = 1;
  loadCurrentOrder();
}

function setOrderHistoryPage(page) {
  const targetPage = Number(page);
  if (!Number.isFinite(targetPage) || targetPage < 1) {
    return;
  }

  currentOrderPage = targetPage;
  loadCurrentOrder();
}

function setDetailsTab(tabName) {
  const targetTab = String(tabName || 'summary');
  const tabs = document.querySelectorAll('.details-tab[data-tab]');
  const panels = document.querySelectorAll('.details-panel[data-panel]');

  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === targetTab;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
  });

  panels.forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.panel === targetTab);
  });
}

function initDetailsTabs() {
  const tabs = document.querySelectorAll('.details-tab[data-tab]');
  if (!tabs.length) {
    return;
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      setDetailsTab(tab.dataset.tab);
    });
  });
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
        const orderRefElement = document.getElementById('detailsOrderRef');
        if (orderRefElement) {
          orderRefElement.textContent = 'N/A';
        }
        document.getElementById('detailsFullName').textContent = 'No Data';
        return;
    }

    const orderRefElement = document.getElementById('detailsOrderRef');
    if (orderRefElement) {
      orderRefElement.textContent = latestOrder.orderId || latestOrder.id || 'N/A';
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

function showConfirmationModal(message, confirmLabel, dismissLabel, confirmAction) {
    const overlay = document.getElementById('cancel-confirmation');
    if (!overlay) return;

    const titleEl = document.getElementById('cancelModalTitle');
    const messageEl = document.getElementById('cancelModalMessage');
    const confirmBtn = document.getElementById('cancelConfirmBtn');
    const dismissBtn = document.getElementById('cancelDismissBtn');

    if (titleEl) {
        titleEl.textContent = confirmLabel === 'Yes, delete order' ? 'Delete Order' : 'Cancel Order';
    }
    if (messageEl) {
        messageEl.textContent = message;
    }
    if (confirmBtn) {
        confirmBtn.textContent = confirmLabel;
        confirmBtn.style.display = 'inline-block';
    }
    if (dismissBtn) {
        dismissBtn.textContent = dismissLabel;
    }

    modalConfirmAction = confirmAction;
    overlay.classList.add('active');
}

function hideCancelConfirmation() {
    const overlay = document.getElementById('cancel-confirmation');
    if (!overlay) return;
    modalConfirmAction = null;
    pendingDeleteOrderId = null;
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

    showConfirmationModal(
      'Are you sure you want to cancel this order?',
      'Yes, cancel order',
      'Keep order',
      cancelCurrentOrder
    );
}

function confirmDeleteOrder(orderId) {
    if (!orderId) return;
    pendingDeleteOrderId = orderId;
    showConfirmationModal(
      'Are you sure you want to delete this order? This action cannot be undone.',
      'Yes, delete order',
      'Keep order',
      deleteCurrentOrder
    );
}

function orderMatchesId(order, orderId) {
    const targetId = String(orderId || '');
    return String(order?.id || '') === targetId || String(order?.orderId || '') === targetId;
}

async function deleteCurrentOrder() {
    if (!pendingDeleteOrderId) {
        hideCancelConfirmation();
        return;
    }

    const purchaseOrders = JSON.parse(localStorage.getItem('purchaseOrders') || '[]');
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');

    const filteredPurchases = Array.isArray(purchaseOrders)
      ? purchaseOrders.filter(order => !orderMatchesId(order, pendingDeleteOrderId))
      : [];
    const filteredReservations = Array.isArray(reservations)
      ? reservations.filter(order => !orderMatchesId(order, pendingDeleteOrderId))
      : [];

    localStorage.setItem('purchaseOrders', JSON.stringify(filteredPurchases));
    localStorage.setItem('reservations', JSON.stringify(filteredReservations));
    pendingDeleteOrderId = null;
    modalConfirmAction = null;

    loadCurrentOrder();
    navigateTo('order-list');
    hideCancelConfirmation();
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
      setDetailsTab('summary');
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
  const states = ['Placed Order', 'Order Confirmed', 'Shipped', 'Delivered'];
  const normalized = getResolvedTrackingStatus(order);

  const currentIndex = {
    confirmed: 1,
    prepared: 2,
    out_for_delivery: 2,
    delivered: 3
  }[normalized] ?? 0;

  const baseDate = new Date(order?.updatedAt || order?.createdAt || Date.now());
  const timeline = states.map((label, idx) => {
    const stepDate = new Date(baseDate);
    stepDate.setDate(baseDate.getDate() + idx);
    return {
      label,
      date: stepDate
    };
  });

  const deliveredDate = timeline[timeline.length - 1].date;
  const totalItems = Array.isArray(order?.items)
    ? order.items.reduce((sum, item) => sum + Number(item.qty || 0), 0) || 1
    : 1;

  return {
    orderId: order ? (order.orderId || 'N/A') : 'N/A',
    currentStatus: states[currentIndex],
    statusIndex: currentIndex,
    timeline,
    originAddress: ADMIN_NURSERY_ADDRESS,
    deliveryAddress: order?.deliveryDetails?.address || '',
    summaryTitle: normalized === 'delivered' ? `${totalItems} Item Delivered` : `${totalItems} Item In Transit`,
    summarySubtitle: normalized === 'delivered'
      ? `Package Delivered on ${formatTimelineDate(deliveredDate)}`
      : `Expected Delivery: ${formatTimelineDate(deliveredDate)}`,
    eta: normalized === 'delivered' ? 'Delivered' : '1-2 days',
    location: normalized === 'delivered' ? 'Delivered to customer' : 'Processing at nursery',
    routeMap: 'https://via.placeholder.com/1339x450.png?text=Delivery+Map+Preview',
    mapLink: 'https://www.google.com/maps/search/?api=1&query=14.5450,121.1350'
  };
}

function formatTimelineDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return 'N/A';
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function renderTrackSteps(data) {
  const trackSteps = document.getElementById('track-steps');
  if (!trackSteps) {
    return;
  }

  trackSteps.innerHTML = '';

  const summary = document.createElement('div');
  summary.className = 'track-summary';
  summary.innerHTML = `
    <div class="track-summary-text">
      <p class="track-summary-title">${data.summaryTitle}</p>
      <p class="track-summary-subtitle">${data.summarySubtitle}</p>
    </div>
    <span class="track-summary-chevron" aria-hidden="true">⌄</span>
  `;
  trackSteps.appendChild(summary);

  const timeline = document.createElement('div');
  timeline.className = 'track-timeline';

  data.timeline.forEach((entry, idx) => {
    const item = document.createElement('div');
    item.className = 'track-timeline-item';

    const marker = document.createElement('div');
    marker.className = 'track-timeline-marker';
    if (idx <= data.statusIndex) {
      marker.classList.add('done');
    }
    marker.textContent = idx <= data.statusIndex ? '✓' : '';

    const content = document.createElement('div');
    content.className = 'track-timeline-content';
    content.innerHTML = `
      <p class="track-timeline-title">${entry.label}</p>
      <p class="track-timeline-date">${formatTimelineDate(entry.date)}</p>
    `;

    item.appendChild(marker);
    item.appendChild(content);
    timeline.appendChild(item);
  });

  trackSteps.appendChild(timeline);
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildGoogleDirectionsLink(originAddress, destinationAddress) {
  const origin = encodeURIComponent(originAddress || '');
  const destination = encodeURIComponent(destinationAddress || '');
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
}

function formatDistance(distanceMeters) {
  const km = Number(distanceMeters || 0) / 1000;
  if (km < 1) {
    return `${Math.max(1, Math.round(km * 1000))} m`;
  }
  return `${km.toFixed(km >= 10 ? 0 : 1)} km`;
}

function formatDuration(durationSeconds) {
  const totalMinutes = Math.max(1, Math.round(Number(durationSeconds || 0) / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (!hours) {
    return `${totalMinutes} min`;
  }

  if (!minutes) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
}

async function geocodeAddress(address) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`);
  if (!response.ok) {
    throw new Error('Unable to geocode address');
  }

  const matches = await response.json();
  if (!Array.isArray(matches) || !matches.length) {
    throw new Error('No geocode result');
  }

  return {
    lat: Number(matches[0].lat),
    lon: Number(matches[0].lon)
  };
}

async function getRouteEstimate(originCoords, destinationCoords) {
  const url = `https://router.project-osrm.org/route/v1/driving/${originCoords.lon},${originCoords.lat};${destinationCoords.lon},${destinationCoords.lat}?overview=false`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Unable to load route');
  }

  const payload = await response.json();
  const route = payload?.routes?.[0];
  if (!route) {
    throw new Error('Route unavailable');
  }

  return {
    distanceMeters: route.distance,
    durationSeconds: route.duration
  };
}

function renderRouteEstimateLoading() {
  const container = document.getElementById('track-route-estimate');
  if (!container) {
    return;
  }

  container.innerHTML = '<p class="track-route-loading">Calculating route, distance, and travel time...</p>';
}

function renderRouteEstimateContent(data) {
  const container = document.getElementById('track-route-estimate');
  if (!container) {
    return;
  }

  container.innerHTML = `
    <p class="track-route-title">Route Estimate</p>
    <div class="track-route-stats">
      <div class="track-route-stat">
        <span class="track-route-stat-label">Estimated Distance</span>
        <span class="track-route-stat-value">${escapeHtml(data.distanceText)}</span>
      </div>
      <div class="track-route-stat">
        <span class="track-route-stat-label">Estimated Travel Time</span>
        <span class="track-route-stat-value">${escapeHtml(data.durationText)}</span>
      </div>
    </div>
    <p class="track-route-line"><strong>From:</strong> ${escapeHtml(data.originAddress)}</p>
    <p class="track-route-line"><strong>To:</strong> ${escapeHtml(data.destinationAddress)}</p>
    <div class="track-route-actions">
      <a class="track-route-link" href="${escapeHtml(data.directionsUrl)}" target="_blank" rel="noopener noreferrer">View Path on Map</a>
    </div>
    <p class="track-route-note">Time may vary based on traffic and road conditions.</p>
  `;
}

function renderRouteEstimateFallback(originAddress, destinationAddress) {
  const directionsUrl = buildGoogleDirectionsLink(originAddress, destinationAddress);
  renderRouteEstimateContent({
    distanceText: 'Unavailable right now',
    durationText: 'Unavailable right now',
    originAddress,
    destinationAddress,
    directionsUrl
  });
}

async function renderTrackRouteEstimate(trackPayload) {
  const destinationAddress = String(trackPayload?.deliveryAddress || '').trim();
  const originAddress = String(trackPayload?.originAddress || ADMIN_NURSERY_ADDRESS).trim();

  if (!destinationAddress) {
    renderRouteEstimateContent({
      distanceText: 'Not available',
      durationText: 'Not available',
      originAddress,
      destinationAddress: 'No delivery address on this order',
      directionsUrl: buildGoogleDirectionsLink(originAddress, originAddress)
    });
    return;
  }

  renderRouteEstimateLoading();

  try {
    const [originCoords, destinationCoords] = await Promise.all([
      geocodeAddress(originAddress),
      geocodeAddress(destinationAddress)
    ]);

    const route = await getRouteEstimate(originCoords, destinationCoords);
    renderRouteEstimateContent({
      distanceText: formatDistance(route.distanceMeters),
      durationText: formatDuration(route.durationSeconds),
      originAddress,
      destinationAddress,
      directionsUrl: buildGoogleDirectionsLink(originAddress, destinationAddress)
    });
  } catch (error) {
    console.warn('Route estimate failed:', error);
    renderRouteEstimateFallback(originAddress, destinationAddress);
  }
}

async function loadTrackOrder(orderId) {
  const purchases = getPurchaseOrders();
  const order = purchases.find(item => String(item.id || '') === String(orderId || '')) || getSelectedOrLatestOrder(purchases);
  const trackSteps = document.getElementById('track-steps');

  if (!order) {
    if (trackSteps) {
      trackSteps.innerHTML = '<p class="order-history-empty">No tracking available</p>';
    }
    renderRouteEstimateContent({
      distanceText: 'Not available',
      durationText: 'Not available',
      originAddress: ADMIN_NURSERY_ADDRESS,
      destinationAddress: 'No tracking available',
      directionsUrl: buildGoogleDirectionsLink(ADMIN_NURSERY_ADDRESS, ADMIN_NURSERY_ADDRESS)
    });
    return;
  }

  const payload = getTrackingPayload(order);
  renderTrackSteps(payload);
  await renderTrackRouteEstimate(payload);
}

// Initialize - show order list by default
document.addEventListener('DOMContentLoaded', () => {
  initDetailsTabs();
  loadCurrentOrder();
  navigateTo('order-list');

  const confirmBtn = document.getElementById('cancelConfirmBtn');
  const dismissBtn = document.getElementById('cancelDismissBtn');
  const overlay = document.getElementById('cancel-confirmation');

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (typeof modalConfirmAction === 'function') {
        modalConfirmAction();
      }
    });
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', hideCancelConfirmation);
  }

  if (overlay) {
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideCancelConfirmation();
      }
    });
  }
});