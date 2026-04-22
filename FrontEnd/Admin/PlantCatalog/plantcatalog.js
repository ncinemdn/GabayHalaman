// Plant data storage
let plants = [];

let editingPlantId = null;
let currentImagePreview = null;
let customCategories = new Set();

// DOM Elements
const sidebar = document.getElementById('sidebar');
const btnAddPlant = document.getElementById('btnAddPlant');
const addPlantModal = document.getElementById('addPlantModal');
const successModal = document.getElementById('successModal');
const confirmationModal = document.getElementById('confirmationModal');
const categoryManagementModal = document.getElementById('categoryManagementModal');
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
const confirmationMessage = document.getElementById('confirmationMessage');
const btnConfirmCancel = document.getElementById('btnConfirmCancel');
const btnConfirmDelete = document.getElementById('btnConfirmDelete');

// Category management elements
const newCategoryInput = document.getElementById('newCategoryInput');
const btnAddCategory = document.getElementById('btnAddCategory');
const btnCloseCategoryModal = document.getElementById('btnCloseCategoryModal');
const categoriesList = document.getElementById('categoriesList');

// Confirmation tracking
let pendingDeleteId = null;

// Logout function
function logout() {
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPlantInventory();
    initializeCategories();
    renderPlants();
    attachEventListeners();
});

function loadPlantInventory() {
    if (window.GHPlantData) {
        plants = window.GHPlantData.getPlantInventory();
    }

    customCategories = new Set(plants.map(plant => plant.category));
}

function syncPlantInventory() {
    if (window.GHPlantData) {
        window.GHPlantData.savePlantInventory(plants);
    }
}

// Event Listeners
function attachEventListeners() {
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

    // Confirmation modal
    btnConfirmCancel.addEventListener('click', closeConfirmationModal);
    btnConfirmDelete.addEventListener('click', confirmDelete);

    // Category management modal
    btnAddCategory.addEventListener('click', addNewCategory);
    btnCloseCategoryModal.addEventListener('click', closeCategoryManagementModal);

    // Navigation
    document.querySelectorAll('[data-page]').forEach(item => {
        item.addEventListener('click', function() {
            const page = this.getAttribute('data-page');
            if (page === 'dashboard') {
                window.location.href = '../Dashboard/dashboard.html';
            } else if (page === 'logout') {
                logout();
            } else if (page === 'catalog') {
                // Stay on current page
            }
        });
    });

    // Close modals on outside click
    addPlantModal.addEventListener('click', (e) => {
        if (e.target === addPlantModal) closeAddModal();
    });
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) closeSuccessModal();
    });
    confirmationModal.addEventListener('click', (e) => {
        if (e.target === confirmationModal) closeConfirmationModal();
    });
    categoryManagementModal.addEventListener('click', (e) => {
        if (e.target === categoryManagementModal) closeCategoryManagementModal();
    });

    // Enter key for category input
    newCategoryInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addNewCategory();
    });
}

// Initialize categories
function initializeCategories() {
    const categories = ['All', ...Array.from(customCategories).sort()];
    categoryFilter.innerHTML = categories.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    // Also update the plant category select in the modal
    updateCategorySelect();
}

// Get stock status
function getStockStatus(stock, available) {
    if (!available || stock === 0) return { label: 'Out of Stock', class: 'stock-out' };
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
        const stockStatus = getStockStatus(plant.stock, plant.available);
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
        const stockStatus = getStockStatus(plant.stock, plant.available);
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
        syncPlantInventory();
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
    pendingDeleteId = id;
    confirmationMessage.textContent = 'Are you sure you want to delete this plant?';
    confirmationModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Confirm delete
function confirmDelete() {
    if (pendingDeleteId) {
        plants = plants.filter(p => p.id !== pendingDeleteId);
        syncPlantInventory();
        pendingDeleteId = null;
        closeConfirmationModal();
        renderPlants();
        initializeCategories();
    }
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    document.body.style.overflow = '';
    pendingDeleteId = null;
}

// Update category select in modal
function updateCategorySelect() {
    const categories = Array.from(customCategories).sort();
    plantCategory.innerHTML = `<option value="">Select category</option>` + 
        categories.map(cat => 
            `<option value="${cat}">${cat}</option>`
        ).join('');
}

// Open category management modal
function openCategoryManagementModal() {
    renderCategoriesList();
    categoryManagementModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close category management modal
function closeCategoryManagementModal() {
    categoryManagementModal.classList.remove('active');
    document.body.style.overflow = '';
    newCategoryInput.value = '';
}

// Add new category
function addNewCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (!newCategory) return;
    
    if (customCategories.has(newCategory)) {
        confirmationMessage.textContent = 'This category already exists.';
        confirmationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        btnConfirmDelete.style.display = 'none';
        btnConfirmCancel.textContent = 'Close';
        btnConfirmCancel.addEventListener('click', function closeErrorModal() {
            closeConfirmationModal();
            btnConfirmDelete.style.display = '';
            btnConfirmCancel.textContent = 'Cancel';
            btnConfirmCancel.removeEventListener('click', closeErrorModal);
        }, { once: true });
        return;
    }
    
    customCategories.add(newCategory);
    newCategoryInput.value = '';
    renderCategoriesList();
    initializeCategories();
    renderPlants();
}

// Delete category
function deleteCategory(category) {
    customCategories.delete(category);
    renderCategoriesList();
    initializeCategories();
    renderPlants();
}

// Render categories list in management modal
function renderCategoriesList() {
    const categories = Array.from(customCategories).sort();
    categoriesList.innerHTML = categories.map(cat => `
        <div class="category-item">
            <span class="category-item-name">${cat}</span>
            <button class="category-item-delete" onclick="deleteCategory('${cat}')">Delete</button>
        </div>
    `).join('');
}

// Save plant
function savePlant() {
    const name = plantName.value.trim();
    const category = plantCategory.value;
    const priceText = plantPrice.value.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceText);
    const stock = parseInt(plantStock.value) || 0;

    if (!name || !category || !price || price <= 0 || stock < 0) {
        confirmationMessage.textContent = 'Please fill in all required fields with valid data.';
        confirmationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Make it just a notification, not a delete confirmation
        btnConfirmDelete.style.display = 'none';
        btnConfirmCancel.textContent = 'Close';
        btnConfirmCancel.addEventListener('click', function closeErrorModal() {
            closeConfirmationModal();
            btnConfirmDelete.style.display = '';
            btnConfirmCancel.textContent = 'Cancel';
            btnConfirmCancel.removeEventListener('click', closeErrorModal);
        }, { once: true });
        return;
    }

    const plantData = {
        name,
        category,
        price,
        stock,
        image: currentImagePreview || (window.GHPlantData ? window.GHPlantData.DEFAULT_PLANT_IMAGE : 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400'),
        available: stock > 0
    };

    if (editingPlantId) {
        // Update existing plant
        const index = plants.findIndex(p => p.id === editingPlantId);
        if (index !== -1) {
            plants[index] = {
                ...plants[index],
                ...plantData,
                available: stock > 0 ? plants[index].available : false
            };
        }
    } else {
        // Add new plant
        plantData.id = Date.now().toString();
        plants.push(plantData);
    }

    customCategories.add(category);
    syncPlantInventory();

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
