// Plant data storage
let plants = [
    {
        id: '1',
        name: 'Native Coconut',
        category: 'Coconut Variety',
        price: 500,
        stock: 55,
        image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400',
        available: true
    },
    {
        id: '2',
        name: 'Carabao Mango',
        category: 'Mango Variety',
        price: 500,
        stock: 50,
        image: 'https://images.unsplash.com/photo-1605027990121-cbae9d3f6e01?w=400',
        available: true
    },
    {
        id: '3',
        name: 'Suha Davao',
        category: 'Citrus',
        price: 500,
        stock: 0,
        image: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?w=400',
        available: false
    },
    {
        id: '4',
        name: 'Thai Bamboo',
        category: 'Forest Trees',
        price: 500,
        stock: 10,
        image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
        available: true
    },
    {
        id: '5',
        name: 'African Talisay',
        category: 'Forest Trees',
        price: 500,
        stock: 20,
        image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400',
        available: true
    }
];

let editingPlantId = null;
let currentImagePreview = null;

// DOM Elements
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const btnAddPlant = document.getElementById('btnAddPlant');
const addPlantModal = document.getElementById('addPlantModal');
const successModal = document.getElementById('successModal');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const tableBody = document.getElementById('tableBody');
const cardsContainer = document.getElementById('cardsContainer');

// Modal elements
const modalTitle = document.getElementById('modalTitle');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const uploadLabel = document.getElementById('uploadLabel');
const removeImageBtn = document.getElementById('removeImageBtn');
const plantName = document.getElementById('plantName');
const plantCategory = document.getElementById('plantCategory');
const plantPrice = document.getElementById('plantPrice');
const plantStock = document.getElementById('plantStock');
const plantDescription = document.getElementById('plantDescription');
const btnCancel = document.getElementById('btnCancel');
const btnSave = document.getElementById('btnSave');
const btnOkay = document.getElementById('btnOkay');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
    renderPlants();
    attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
    // Mobile menu
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    sidebarOverlay.addEventListener('click', closeMobileMenu);

    // Add plant button
    btnAddPlant.addEventListener('click', openAddModal);

    // Modal buttons
    btnCancel.addEventListener('click', closeAddModal);
    btnSave.addEventListener('click', savePlant);
    btnOkay.addEventListener('click', closeSuccessModal);

    // Image upload
    imageInput.addEventListener('change', handleImageUpload);
    removeImageBtn.addEventListener('click', removeImage);

    // Search and filter
    searchInput.addEventListener('input', filterPlants);
    categoryFilter.addEventListener('change', filterPlants);

    // Close modals on outside click
    addPlantModal.addEventListener('click', (e) => {
        if (e.target === addPlantModal) closeAddModal();
    });
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeSuccessModal();
    });
}

// Mobile menu functions
function toggleMobileMenu() {
    const menuIcon = mobileMenuToggle.querySelector('.menu-icon');
    const closeIcon = mobileMenuToggle.querySelector('.close-icon');
    
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
    menuIcon.classList.toggle('hidden');
    closeIcon.classList.toggle('hidden');
}

function closeMobileMenu() {
    const menuIcon = mobileMenuToggle.querySelector('.menu-icon');
    const closeIcon = mobileMenuToggle.querySelector('.close-icon');
    
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    menuIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
}

// Initialize categories
function initializeCategories() {
    const categories = ['All', ...new Set(plants.map(p => p.category))];
    categoryFilter.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
}

// Get stock status
function getStockStatus(stock) {
    if (stock === 0) return { label: 'Out of Stock', class: 'stock-out' };
    if (stock <= 15) return { label: 'Low Stock', class: 'stock-low' };
    return { label: 'In Stock', class: 'stock-in' };
}

// Render plants
function renderPlants() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;

    const filteredPlants = plants.filter(plant => {
        const matchesSearch = plant.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'All' || plant.category === category;
        return matchesSearch && matchesCategory;
    });

    renderDesktopTable(filteredPlants);
    renderMobileCards(filteredPlants);
}

// Render desktop table
function renderDesktopTable(filteredPlants) {
    tableBody.innerHTML = filteredPlants.map(plant => {
        const stockStatus = getStockStatus(plant.stock);
        return `
            <div class="table-row">
                <div class="table-cell">
                    <img src="${plant.image}" alt="${plant.name}" class="plant-image">
                </div>
                <div class="table-cell plant-name">${plant.name}</div>
                <div class="table-cell plant-category">${plant.category}</div>
                <div class="table-cell plant-price">₱${plant.price}</div>
                <div class="table-cell plant-stock">${plant.stock} units</div>
                <div class="table-cell">
                    <span class="stock-badge ${stockStatus.class}">${stockStatus.label}</span>
                </div>
                <div class="table-cell">
                    <div class="toggle-switch ${plant.available ? 'on' : 'off'}" onclick="toggleAvailability('${plant.id}')">
                        <div class="toggle-knob"></div>
                    </div>
                </div>
                <div class="table-cell">
                    <div class="action-buttons">
                        <button class="action-btn" onclick="editPlant('${plant.id}')" title="Edit">
                            <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button class="action-btn" onclick="deletePlant('${plant.id}')" title="Delete">
                            <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render mobile cards
function renderMobileCards(filteredPlants) {
    cardsContainer.innerHTML = filteredPlants.map(plant => {
        const stockStatus = getStockStatus(plant.stock);
        return `
            <div class="plant-card">
                <div class="card-header">
                    <img src="${plant.image}" alt="${plant.name}" class="card-image">
                    <div class="card-info">
                        <h3 class="card-name">${plant.name}</h3>
                        <p class="card-category">${plant.category}</p>
                        <p class="card-price">₱${plant.price}</p>
                        <span class="stock-badge ${stockStatus.class}">${stockStatus.label}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="card-stock">${plant.stock} units</div>
                    <div class="card-actions">
                        <div class="toggle-switch ${plant.available ? 'on' : 'off'}" onclick="toggleAvailability('${plant.id}')">
                            <div class="toggle-knob"></div>
                        </div>
                        <button class="action-btn" onclick="editPlant('${plant.id}')" title="Edit">
                            <svg class="edit-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </button>
                        <button class="action-btn" onclick="deletePlant('${plant.id}')" title="Delete">
                            <svg class="delete-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Filter plants
function filterPlants() {
    renderPlants();
}

// Toggle availability
function toggleAvailability(id) {
    const plant = plants.find(p => p.id === id);
    if (plant) {
        plant.available = !plant.available;
        renderPlants();
    }
}

// Open add modal
function openAddModal() {
    editingPlantId = null;
    modalTitle.textContent = 'Add New Plant';
    btnSave.textContent = 'Save New Plant';
    resetForm();
    addPlantModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Edit plant
function editPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    editingPlantId = id;
    modalTitle.textContent = 'Edit Plant';
    btnSave.textContent = 'Update Plant';

    plantName.value = plant.name;
    plantCategory.value = plant.category;
    plantPrice.value = `$ ${plant.price.toFixed(2)}`;
    plantStock.value = plant.stock;
    
    if (plant.image) {
        currentImagePreview = plant.image;
        previewImg.src = plant.image;
        imagePreview.classList.remove('hidden');
        uploadLabel.classList.add('hidden');
    }

    addPlantModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Delete plant
function deletePlant(id) {
    if (confirm('Are you sure you want to delete this plant?')) {
        plants = plants.filter(p => p.id !== id);
        renderPlants();
        initializeCategories();
    }
}

// Save plant
function savePlant() {
    const name = plantName.value.trim();
    const category = plantCategory.value;
    const priceText = plantPrice.value.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceText);
    const stock = parseInt(plantStock.value) || 0;

    if (!name || !category || !price || price <= 0 || stock < 0) {
        alert('Please fill in all required fields');
        return;
    }

    const plantData = {
        name,
        category,
        price,
        stock,
        image: currentImagePreview || 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400',
        available: stock > 0
    };

    if (editingPlantId) {
        // Update existing plant
        const index = plants.findIndex(p => p.id === editingPlantId);
        if (index !== -1) {
            plants[index] = { ...plants[index], ...plantData };
        }
    } else {
        // Add new plant
        plantData.id = Date.now().toString();
        plants.push(plantData);
    }

    closeAddModal();
    renderPlants();
    initializeCategories();
    
    if (!editingPlantId) {
        successModal.classList.add('active');
    }
}

// Close add modal
function closeAddModal() {
    addPlantModal.classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
}

// Close success modal
function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Reset form
function resetForm() {
    plantName.value = '';
    plantCategory.value = '';
    plantPrice.value = '';
    plantStock.value = '';
    plantDescription.value = '';
    imageInput.value = '';
    currentImagePreview = null;
    imagePreview.classList.add('hidden');
    uploadLabel.classList.remove('hidden');
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            currentImagePreview = reader.result;
            previewImg.src = reader.result;
            imagePreview.classList.remove('hidden');
            uploadLabel.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

// Remove image
function removeImage() {
    currentImagePreview = null;
    imageInput.value = '';
    imagePreview.classList.add('hidden');
    uploadLabel.classList.remove('hidden');
}

// Price formatting
plantPrice.addEventListener('input', (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (value) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            e.target.value = `$ ${num.toFixed(2)}`;
        }
    }
});

plantPrice.addEventListener('focus', (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
});

plantPrice.addEventListener('blur', (e) => {
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (value) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            e.target.value = `$ ${num.toFixed(2)}`;
        }
    }
});
