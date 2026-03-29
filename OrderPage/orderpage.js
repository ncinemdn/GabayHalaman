let historyStack = [];
let futureStack = [];

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

    if (pageId === 'track-order') {
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


// Fake tracking backend
async function fetchOrderTracking(orderId) {
  await new Promise(resolve => setTimeout(resolve, 500));

  const states = ['Order Confirmed', 'Prepared by Seller', 'Out for Delivery', 'Delivered'];
  const currentIndex = 2;

  return {
    orderId,
    currentStatus: states[currentIndex],
    statusIndex: currentIndex,
    statusLabels: states,
    eta: '1h 15m',
    location: 'Taytay, Rizal',
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

async function loadTrackOrder(orderId) {
  try {
    const payload = await fetchOrderTracking(orderId);
    renderTrackSteps(payload);
    renderTrackInfo(payload);
  } catch (error) {
    document.getElementById('status-text').textContent = 'Failed to load tracking';
  }
}

// Initialize - show order list by default
document.addEventListener('DOMContentLoaded', () => {
  navigateTo('order-list');
});
