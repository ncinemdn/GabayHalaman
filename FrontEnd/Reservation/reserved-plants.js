// ================= API =================
const plantAPI = {
    async getAll() {
        try {
            const plants = await fetch('http://localhost:5007/api/plant').then(r => r.json());
            const categories = await fetch('http://localhost:5007/api/category').then(r => r.json());
            
            // Create category map
            const categoryMap = {};
            if (Array.isArray(categories)) {
                categories.forEach(cat => {
                    categoryMap[cat.category_id] = cat.category_name || `Category ${cat.category_id}`;
                });
            }
            
            // Return plants with resolved category names
            return plants.map(p => ({
                ...p,
                plant_name: p.plant_name,
                plant_id: p.plant_id,
                category: categoryMap[p.category_id] || 'General'
            }));
        } catch (error) {
            console.error('Failed to fetch plants:', error);
            return [];
        }
    }
};

// ================= DEFAULT IMAGE =================
const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080";

// Optional fallback (you can delete later)
const plantImages = {
    "Rambutan RR Tuklapin": "https://images.unsplash.com/photo-1609123079242-086695c6ff09?w=400",
    "Mangosteen": "https://images.unsplash.com/photo-1706698352015-a907c7f8a445?w=400",
    "Durian Puyat": "https://images.unsplash.com/photo-1630510526315-aba311212355?w=400"
};

// ================= HELPERS =================
function getPlantImage(name, backendImage) {
    return backendImage || plantImages[name] || DEFAULT_PLANT_IMAGE;
}

function toSafeNumber(value, fallback) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// ================= MAIN LOGIC =================
async function loadReservations() {
    const container = document.getElementById('reservationsContainer');

    try {
        // 🔥 FETCH ALL PLANTS ONCE (IMPORTANT OPTIMIZATION)
        const plants = await plantAPI.getAll();

        // 🔥 GET LOCAL RESERVATIONS
        const rawReservations = JSON.parse(localStorage.getItem('reservations') || '[]')
            .filter(item => !item.isPlacedOrder)
            .filter(item => item.deliveryDate);

        if (rawReservations.length === 0) {
            container.innerHTML = `<h2>No reservations yet</h2>`;
            return;
        }

        // 🔥 NORMALIZE USING BACKEND DATA
        const reservations = rawReservations.map(item => {
            const backendPlant = plants.find(p => p.plant_id === item.plantId);

            const name = item.name || backendPlant?.plant_name || 'Unknown Plant';
            const quantity = Math.max(1, toSafeNumber(item.quantity, 1));
            const price = Math.max(0, toSafeNumber(item.price, backendPlant?.price || 0));
            const plantSize = item.plantSize || 'N/A';

            const image = getPlantImage(
                name,
                backendPlant?.image_path // ready if you add later
            );

            return {
                ...item,
                name,
                quantity,
                price,
                plantSize,
                image,
                deliveryDate: item.deliveryDate
            };
        });

        // 🔥 GROUP BY DATE
        const grouped = {};
        reservations.forEach(r => {
            if (!grouped[r.deliveryDate]) grouped[r.deliveryDate] = [];
            grouped[r.deliveryDate].push(r);
        });

        const sortedDates = Object.keys(grouped).sort((a, b) => new Date(a) - new Date(b));

        // ================= UI =================
        let html = '';

        sortedDates.forEach(date => {
            html += `
                <div class="date-group">
                    <h2>${formatDate(date)}</h2>
                    <div class="plants-grid">
            `;

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
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (err) {
        console.error("ERROR LOADING RESERVATIONS:", err);
        container.innerHTML = `<h2>Error loading reservations</h2>`;
    }
}

// ================= NAVIGATION =================
function goToDeliveryDetails(date) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const selected = reservations.filter(r => r.deliveryDate === date);

    localStorage.setItem('selectedReservations', JSON.stringify(selected));
    window.location.href = '../CartPage/details.html';
}

// ================= INIT =================
window.addEventListener('DOMContentLoaded', loadReservations);