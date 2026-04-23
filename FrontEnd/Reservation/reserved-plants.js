const plantAPI = {
    async getAll() {
        const res = await fetch('http://localhost:5007/api/Plant');
        return await res.json();
    }
};

const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Optional fallback images (can remove later when backend has image_path)
const plantImages = {
    "Rambutan RR Tuklapin": "https://images.unsplash.com/photo-1609123079242-086695c6ff09?w=400",
    "Mangosteen": "https://images.unsplash.com/photo-1706698352015-a907c7f8a445?w=400",
    "Durian Puyat": "https://images.unsplash.com/photo-1630510526315-aba311212355?w=400"
};

function getPlantImage(name, backendImage) {
    return backendImage || plantImages[name] || DEFAULT_PLANT_IMAGE;
}

function toSafeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

async function normalizeReservationItem(rawItem) {
    const item = rawItem || {};

    // 🔥 Fetch real plant data from backend
    let backendPlant = null;
    try {
        const plants = await plantAPI.getAll();
        backendPlant = plants.find(p => p.plant_id === item.plantId);
    } catch (err) {
        console.error("API ERROR:", err);
    }

    const name = item.name || backendPlant?.plant_name || 'Unknown Plant';
    const quantity = Math.max(1, toSafeNumber(item.quantity, 1));
    const price = Math.max(0, toSafeNumber(item.price, backendPlant?.price || 0));
    const plantSize = item.plantSize || 'N/A';

    const image = getPlantImage(
        name,
        backendPlant?.image_path // 👈 future ready
    );

    return {
        ...item,
        name,
        quantity,
        price,
        plantSize,
        image,
        deliveryDate: item.deliveryDate || ''
    };
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function loadReservations() {
    const rawReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
        .filter(item => !item.isPlacedOrder)
        .filter(item => item.deliveryDate);

    const reservations = [];
    for (const item of rawReservations) {
        const normalized = await normalizeReservationItem(item);
        reservations.push(normalized);
    }

    const container = document.getElementById('reservationsContainer');

    if (reservations.length === 0) {
        container.innerHTML = `<h2>No reservations yet</h2>`;
        return;
    }

    // Group by date
    const grouped = {};
    reservations.forEach(r => {
        if (!grouped[r.deliveryDate]) grouped[r.deliveryDate] = [];
        grouped[r.deliveryDate].push(r);
    });

    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

    let html = '';

    sortedDates.forEach(date => {
        html += `<div class="date-group">
                    <h2>${formatDate(date)}</h2>
                    <div class="plants-grid">`;

        grouped[date].forEach(plant => {
            html += `
                <div class="plant-card">
                    <img src="${plant.image}" 
                         onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                    <h3>${plant.name}</h3>
                    <p>₱${plant.price.toFixed(2)}</p>
                    <p>Qty: ${plant.quantity}</p>
                    <p>Size: ${plant.plantSize}</p>
                </div>
            `;
        });

        html += `
                </div>
                <button onclick="goToDeliveryDetails('${date}')">Buy Now</button>
            </div>`;
    });

    container.innerHTML = html;
}

function goToDeliveryDetails(date) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const selected = reservations.filter(r => r.deliveryDate === date);

    localStorage.setItem('selectedReservations', JSON.stringify(selected));
    window.location.href = '../CartPage/details.html';
}

window.addEventListener('DOMContentLoaded', loadReservations);