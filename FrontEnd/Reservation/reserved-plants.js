const DEFAULT_PLANT_IMAGE = "https://images.unsplash.com/photo-1689057009374-ce11bce5d976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGZydWl0JTIwdHJlZXxlbnwxfHx8fDE3NzI5NTQxNDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";


// Plant images mapping (same as reservation page)
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
    "Golden Trumpet": "https://images.unsplash.com/photo-1689790733141-9b4ef8ed1bc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Pink Trumpet": "https://images.unsplash.com/photo-1760135638379-0e749e10c1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Golden Shower": "https://images.unsplash.com/photo-1683613791927-660d0ed2d86f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Fire Tree": "https://images.unsplash.com/photo-1683356478048-ea3261e194b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Ilang Ilang": "https://images.unsplash.com/photo-1552017650-c117c3535f68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Jacaranda": "https://images.unsplash.com/photo-1695389591261-ee471f900c62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Pine Tree": "https://images.unsplash.com/photo-1643550265302-a91ec947eb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Palm Tree": "https://images.unsplash.com/photo-1761001826491-91409e63205a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Dates Palm": "https://images.unsplash.com/photo-1679219904448-30361b35773a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Palawan Cherry Blossom 3ft": "https://images.unsplash.com/photo-1712725256207-e15286c6ede3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Mahogany": "https://images.unsplash.com/photo-1544840281-274ae2755620?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Narra": "https://images.unsplash.com/photo-1746311673824-69a17ad5672e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Pole Bamboo": "https://images.unsplash.com/photo-1696677049444-f695a0935b49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "Arabica Coffee": "https://images.unsplash.com/photo-1689960686579-16b860f7c502?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
};


function getPlantImage(plantName) {
    return plantImages[plantName] || DEFAULT_PLANT_IMAGE;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}


function loadReservations() {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const container = document.getElementById('reservationsContainer');


    if (reservations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>No reservations yet</h2>
                <p>You haven't made any plant reservations. Start browsing our collection!</p>
                <a href="reservation.html" class="btn-reserve">Reserve Plants</a>
            </div>
        `;
        return;
    }


    // Group reservations by delivery date
    const groupedByDate = {};
    reservations.forEach(reservation => {
        if (!groupedByDate[reservation.deliveryDate]) {
            groupedByDate[reservation.deliveryDate] = [];
        }
        groupedByDate[reservation.deliveryDate].push(reservation);
    });


    // Sort dates
    const sortedDates = Object.keys(groupedByDate).sort((a, b) => new Date(a) - new Date(b));


    let html = '';


    sortedDates.forEach(date => {
        const plants = groupedByDate[date];
        const singleItemClass = plants.length === 1 ? ' single-item' : '';
       
        html += `
            <div class="date-group">
                <h2 class="date-header">${formatDate(date)}</h2>
                <div class="plants-grid${singleItemClass}">
        `;


        plants.forEach(plant => {
            const image = getPlantImage(plant.name);
           
            html += `
                <div class="plant-card">
                    <div class="plant-image-container">
                        <img src="${image}" alt="${plant.name}" class="plant-image"
                             onerror="this.src='${DEFAULT_PLANT_IMAGE}'">
                    </div>
                    <div class="plant-info">
                        <div class="plant-name">${plant.name}</div>
                        <div class="plant-details">
                            <strong>Delivery Date:</strong> <span>${formatDate(plant.deliveryDate)}</span>
                        </div>
                        <div class="plant-price">₱${plant.price.toFixed(2)}</div>
                        <div class="plant-details">
                            <strong>Quantity:</strong> <span>${plant.quantity}</span>
                        </div>
                        <div class="plant-details">
                            <strong>Size:</strong> <span>${plant.plantSize}</span>
                        </div>
                    </div>
                </div>
            `;
        });


        html += `
                </div>
                <div class="date-actions">
                    <button type="button" class="reservation-buy-now" onclick="goToDeliveryDetails('${date}')">Buy Now</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


function goToDeliveryDetails(deliveryDate) {
    const reservations = JSON.parse(localStorage.getItem('reservations') || '[]');
    const selectedReservations = reservations.filter(reservation => reservation.deliveryDate === deliveryDate);

    if (selectedReservations.length > 0) {
        localStorage.setItem('selectedReservation', JSON.stringify(selectedReservations[0]));
        localStorage.setItem('selectedReservations', JSON.stringify(selectedReservations));
    }

    window.location.href = '../CartPage/details.html';
}


// Load reservations when page loads
window.addEventListener('DOMContentLoaded', loadReservations);