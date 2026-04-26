// Plant data storage
let plants = [];
let categories = [];
let categoryMap = {};
let categoryNameToId = {};
const MAX_PLANT_IMAGES = 4;
const DEFAULT_PLANT_IMAGE = 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400';
const SAFE_DB_IMAGE_PATH_LENGTH = 220;
const IMAGE_UPLOAD_MAX_DIMENSION = 960;
const IMAGE_UPLOAD_QUALITY = 0.78;

let editingPlantId = null;
let currentImagePreviews = [];
let imageSelectionDirty = false;
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

function getPlantSelectedSize(plant) {
    if (plant.selectedSize && plant.sizes?.[plant.selectedSize]) {
        return plant.selectedSize;
    }
    const sizeKeys = Object.keys(plant.sizes || {});
    return sizeKeys.length ? sizeKeys[0] : 'Medium';
}

function getPlantSizeData(plant) {
    const selectedSize = getPlantSelectedSize(plant);
    const sizes = plant.sizes || {};
    return sizes[selectedSize] || { price: 0, stock: 0, available: false };
}

function normalizePlantData(plant) {
    const normalized = { ...plant };
    normalized.sizes = normalized.sizes || {};
    if (!Object.keys(normalized.sizes).length) {
        normalized.sizes = {
            Medium: { price: 0, stock: 0, available: false }
        };
    }
    normalized.selectedSize = getPlantSelectedSize(normalized);
    const anySizeInStock = Object.values(normalized.sizes).some(size => Number(size.stock) > 0 && Boolean(size.available));
    normalized.available = typeof normalized.available === 'boolean' ? normalized.available : anySizeInStock;
    return normalized;
}

function changePlantSize(id, size) {
    const plant = plants.find(p => p.id === id);
    if (!plant || !plant.sizes) return;
    if (!plant.sizes[size]) {
        plant.sizes[size] = { price: 0, stock: 0, available: false };
    }
    plant.selectedSize = size;
    renderPlants();
}

function getCategoryName(categoryId) {
    return categoryMap[categoryId] || 'General';
}

function renderSizeOptions(plant) {
    const selectedSize = getPlantSelectedSize(plant);
    return Object.keys(plant.sizes || {}).map(sizeName => `
        <option value="${sizeName}" ${selectedSize === sizeName ? 'selected' : ''}>${sizeName}</option>
    `).join('');
}

// Modal elements
const modalTitle = document.getElementById('modalTitle');
const imageInput = document.getElementById('imageInput');
const imagePreviewGrid = document.getElementById('imagePreviewGrid');
const uploadLabel = document.getElementById('uploadLabel');
const removeImageBtn = document.getElementById('removeImageBtn');
const plantName = document.getElementById('plantName');
const plantCategory = document.getElementById('plantCategory');
const plantPrice = document.getElementById('plantPrice');
const plantStock = document.getElementById('plantStock');
const plantDescription = document.getElementById('plantDescription');
const plantSize = document.getElementById('plantSize');
const btnCancel = document.getElementById('btnCancel');
const btnSave = document.getElementById('btnSave');
const btnOkay = document.getElementById('btnOkay');
const successMessageText = document.getElementById('successMessageText');
const actionLoadingLine = document.getElementById('actionLoadingLine');
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
let actionLoadingTimer = null;
let successToastTimer = null;

function parsePlantImages(imageValue) {
    if (Array.isArray(imageValue)) {
        return imageValue.map(item => String(item || '').trim()).filter(Boolean).slice(0, MAX_PLANT_IMAGES);
    }

    const raw = String(imageValue || '').trim();
    if (!raw) {
        return [];
    }

    if (raw.startsWith('[')) {
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item || '').trim()).filter(Boolean).slice(0, MAX_PLANT_IMAGES);
            }
        } catch (error) {
            // Ignore and continue fallback parsing.
        }
    }

    if (window.GHPlantData && typeof window.GHPlantData.parsePlantImages === 'function') {
        return window.GHPlantData.parsePlantImages(raw).slice(0, MAX_PLANT_IMAGES);
    }

    return [raw];
}

function serializePlantImages(images) {
    const safeImages = (Array.isArray(images) ? images : [])
        .map(item => String(item || '').trim())
        .filter(Boolean)
        .slice(0, MAX_PLANT_IMAGES);

    return JSON.stringify(safeImages);
}

function getPrimaryImage(images) {
    const safeImages = Array.isArray(images) ? images : [];
    return safeImages[0] || DEFAULT_PLANT_IMAGE;
}

function hasAttachedPlantImages(plant) {
    const images = Array.isArray(plant?.images) ? plant.images : [];
    return images.some((img) => Boolean(String(img || '').trim()));
}

function renderPlantImageMarkup(plant, imageClass, wrapperClass = '') {
    const hasImages = hasAttachedPlantImages(plant);
    const classes = ['plant-image-shell'];
    if (wrapperClass) {
        classes.push(wrapperClass);
    }

    if (!hasImages) {
        return `<div class="${classes.join(' ')}"><div class="no-plant-image">No image</div></div>`;
    }

    return `
        <div class="${classes.join(' ')}">
            <img
                src="${plant.image}"
                alt="${plant.name}"
                class="${imageClass}"
                onerror="this.style.display='none'; this.nextElementSibling.classList.remove('hidden');"
            >
            <div class="no-plant-image hidden">No image</div>
        </div>
    `;
}

function isSafeDbImagePath(value) {
    const imagePath = String(value || '').trim();
    if (!imagePath) {
        return false;
    }

    if (imagePath.startsWith('data:')) {
        return false;
    }

    return imagePath.length <= SAFE_DB_IMAGE_PATH_LENGTH;
}

function buildSafeDbImagePath(images, fallbackImage) {
    const safeImages = Array.isArray(images) ? images : [];
    const firstSafeImage = safeImages.find((img) => isSafeDbImagePath(img));
    if (firstSafeImage) {
        return firstSafeImage;
    }

    if (isSafeDbImagePath(fallbackImage)) {
        return String(fallbackImage || '').trim();
    }

    return DEFAULT_PLANT_IMAGE;
}

function buildDbImagePayload(images, fallbackImage = '') {
    const safeImages = (Array.isArray(images) ? images : [])
        .map((item) => String(item || '').trim())
        .filter(Boolean)
        .filter((item) => item !== DEFAULT_PLANT_IMAGE)
        .slice(0, MAX_PLANT_IMAGES);

    if (!safeImages.length) {
        const safeFallback = String(fallbackImage || '').trim();
        return safeFallback && safeFallback !== DEFAULT_PLANT_IMAGE ? safeFallback : '';
    }

    if (safeImages.length === 1) {
        return safeImages[0];
    }

    return serializePlantImages(safeImages);
}

function renderImagePreviews() {
    if (!imagePreviewGrid || !uploadLabel || !removeImageBtn) {
        return;
    }

    imagePreviewGrid.innerHTML = '';

    if (!currentImagePreviews.length) {
        imagePreviewGrid.classList.add('hidden');
        removeImageBtn.classList.add('hidden');
    } else {
        imagePreviewGrid.classList.remove('hidden');
        removeImageBtn.classList.remove('hidden');
    }

    currentImagePreviews.forEach((imageSrc, index) => {
        const tile = document.createElement('div');
        tile.className = 'image-preview-tile';

        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Plant preview ${index + 1}`;

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'remove-image-item-btn';
        removeBtn.setAttribute('data-index', String(index));
        removeBtn.setAttribute('aria-label', `Remove image ${index + 1}`);
        removeBtn.textContent = 'x';

        tile.appendChild(img);
        tile.appendChild(removeBtn);
        imagePreviewGrid.appendChild(tile);
    });

    uploadLabel.classList.toggle('hidden', currentImagePreviews.length >= MAX_PLANT_IMAGES);
}

function removeImageAt(index) {
    if (!Number.isInteger(index) || index < 0 || index >= currentImagePreviews.length) {
        return;
    }

    currentImagePreviews.splice(index, 1);
    imageSelectionDirty = true;
    imageInput.value = '';
    renderImagePreviews();
}

function removeAllImages() {
    currentImagePreviews = [];
    imageSelectionDirty = true;
    imageInput.value = '';
    renderImagePreviews();
}

function optimizeImageFile(file) {
    return new Promise((resolve) => {
        if (!(file instanceof File) || !String(file.type || '').startsWith('image/')) {
            resolve('');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const originalWidth = Number(img.naturalWidth || img.width || 0);
                const originalHeight = Number(img.naturalHeight || img.height || 0);

                if (!originalWidth || !originalHeight) {
                    resolve(String(reader.result || ''));
                    return;
                }

                const scale = Math.min(1, IMAGE_UPLOAD_MAX_DIMENSION / Math.max(originalWidth, originalHeight));
                const targetWidth = Math.max(1, Math.round(originalWidth * scale));
                const targetHeight = Math.max(1, Math.round(originalHeight * scale));

                const canvas = document.createElement('canvas');
                canvas.width = targetWidth;
                canvas.height = targetHeight;

                const context = canvas.getContext('2d');
                if (!context) {
                    resolve(String(reader.result || ''));
                    return;
                }

                context.drawImage(img, 0, 0, targetWidth, targetHeight);
                resolve(canvas.toDataURL('image/jpeg', IMAGE_UPLOAD_QUALITY));
            };

            img.onerror = () => resolve(String(reader.result || ''));
            img.src = String(reader.result || '');
        };

        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
    });
}

// Logout function
function logout() {
    // Clear admin session from localStorage
    localStorage.removeItem('admin');
    // Redirect to signin page
    window.location.href = '../../Admin/Auth/signin.html';
}

async function populateSignedInAdminHeader() {
    if (window.GHAdminHeader && typeof window.GHAdminHeader.apply === 'function') {
        await window.GHAdminHeader.apply({
            nameSelector: '.top-bar .user-name',
            roleSelector: '.top-bar .user-role',
            avatarSelector: '.top-bar .user-avatar img',
            fallbackPhoto: '../Profile/cc.jpg'
        });
        return;
    }

    let userName = 'Admin';
    let userRole = 'Administrator';

    try {
        const currentAdmin = JSON.parse(localStorage.getItem('admin') || 'null');
        if (currentAdmin) {
            userName = currentAdmin.full_name || currentAdmin.name || userName;
            userRole = currentAdmin.role || userRole;

            if (typeof adminAPI !== 'undefined' && Number.isFinite(Number(currentAdmin.admin_id))) {
                const adminData = await adminAPI.getById(currentAdmin.admin_id);
                userName = adminData?.full_name || adminData?.name || userName;
                userRole = adminData?.role || userRole;
            }
        }
    } catch (error) {
        console.warn('Unable to load admin user data:', error);
    }

    const userNameEl = document.querySelector('.user-name');
    const userRoleEl = document.querySelector('.user-role');

    if (userNameEl) userNameEl.textContent = userName;
    if (userRoleEl) userRoleEl.textContent = userRole;
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await populateSignedInAdminHeader();
    await loadPlantInventory();
    initializeCategories();
    renderPlants();
    attachEventListeners();
});

async function loadPlantInventory() {
    try {
        const [allPlants, allSizes, allCategories] = await Promise.all([
            plantsAPI.getAll(),
            plantSizesAPI.getAll(),
            categoriesAPI.getAll()
        ]);

        categories = Array.isArray(allCategories) ? allCategories : [];
        categoryMap = categories.reduce((map, cat) => {
            if (cat && cat.category_id != null) {
                map[cat.category_id] = cat.category_name || 'General';
            }
            return map;
        }, {});

        const sizesByPlant = {};
        (Array.isArray(allSizes) ? allSizes : []).forEach(s => {
            if (!sizesByPlant[s.plant_id]) {
                sizesByPlant[s.plant_id] = {};
            }
            sizesByPlant[s.plant_id][s.size_name] = {
                id: s.plant_size_id,
                price: Number(s.price) || 0,
                stock: Number(s.stock_quantity) || 0,
                available: String(s.is_available || '').toLowerCase() === 'true' || String(s.is_available || '').trim() === '1'
            };
        });

        categoryNameToId = categories.reduce((map, cat) => {
            if (cat && cat.category_name != null) {
                map[String(cat.category_name)] = cat.category_id;
            }
            return map;
        }, {});

        plants = (Array.isArray(allPlants) ? allPlants : []).map((plant) => {
            const resolvedImageList = (window.GHPlantData && typeof window.GHPlantData.resolvePlantImagesById === 'function')
                ? window.GHPlantData.resolvePlantImagesById(plant.plant_id, plant.image_path || plant.image || '')
                : parsePlantImages(plant.image_path || plant.image || '');

            const imageList = parsePlantImages(resolvedImageList);
            const normalizedImages = (imageList.length === 1 && imageList[0] === DEFAULT_PLANT_IMAGE)
                ? []
                : imageList;

            return {
                id: String(plant.plant_id),
                name: plant.plant_name || '',
                category: getCategoryName(plant.category_id),
                description: plant.description || '',
                image: getPrimaryImage(normalizedImages),
                images: normalizedImages,
                sizes: sizesByPlant[plant.plant_id] || {}
            };
        }).map(normalizePlantData);
    } catch (error) {
        console.error('Failed to load plant inventory:', error);
        plants = [];
        categories = [];
        categoryMap = {};
    }

    customCategories = new Set([
        ...plants.map(plant => plant.category),
        ...categories.map(cat => cat.category_name || 'General')
    ]);
}

function syncPlantInventory() {
    if (!window.GHPlantData || typeof window.GHPlantData.savePlantInventory !== 'function') {
        return;
    }

    try {
        window.GHPlantData.savePlantInventory(plants);
    } catch (error) {
        // Keep UI responsive even when localStorage is full from large base64 images.
        console.warn('Unable to sync plant inventory locally:', error);
    }
}

function syncBodyScrollLock() {
    const hasBlockingModal = Boolean(document.querySelector('.modal.active:not(#successModal)'));
    document.body.style.overflow = hasBlockingModal ? 'hidden' : '';
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
    removeImageBtn.addEventListener('click', removeAllImages);

    if (imagePreviewGrid) {
        imagePreviewGrid.addEventListener('click', (event) => {
            const target = event.target;
            if (!(target instanceof Element)) {
                return;
            }

            const removeBtn = target.closest('.remove-image-item-btn');
            if (!removeBtn) {
                return;
            }

            const index = Number(removeBtn.getAttribute('data-index'));
            removeImageAt(index);
        });
    }

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
    const categoryNames = Array.from(new Set([
        ...customCategories,
        ...categories.map(cat => cat.category_name || 'General')
    ]));

    const filterOptions = ['All', ...categoryNames.sort()];
    categoryFilter.innerHTML = filterOptions.map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');

    // Also update the plant category select in the modal
    updateCategorySelect();
}

// Get stock status
function getStockStatus(stock, available) {
    if (!available || stock <= 0) return { label: 'Out of Stock', class: 'stock-out' };
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
        const selectedSize = getPlantSelectedSize(plant);
        const sizeData = getPlantSizeData(plant);
        const effectiveAvailable = plant.available && Boolean(sizeData.available);
        const stockStatus = getStockStatus(sizeData.stock, effectiveAvailable);
        return `
            <div class="table-row">
                <div class="table-cell">
                    ${renderPlantImageMarkup(plant, 'plant-image')}
                </div>
                <div class="table-cell plant-name">${plant.name}</div>
                <div class="table-cell plant-category">${plant.category}</div>
                <div class="table-cell">
                    <select class="size-select" onchange="changePlantSize('${plant.id}', this.value)">
                        ${renderSizeOptions(plant)}
                    </select>
                </div>
                <div class="table-cell plant-price">₱${sizeData.price.toFixed(2)}</div>
                <div class="table-cell plant-stock">${sizeData.stock} units</div>
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
        const selectedSize = getPlantSelectedSize(plant);
        const sizeData = getPlantSizeData(plant);
        const effectiveAvailable = plant.available && Boolean(sizeData.available);
        const stockStatus = getStockStatus(sizeData.stock, effectiveAvailable);
        return `
            <div class="plant-card">
                <div class="card-header">
                    ${renderPlantImageMarkup(plant, 'card-image', 'card-image-shell')}
                    <div class="card-info">
                        <h3 class="card-name">${plant.name}</h3>
                        <p class="card-category">${plant.category}</p>
                        <p class="card-size">Size: ${selectedSize}</p>
                        <p class="card-price">₱${sizeData.price.toFixed(2)}</p>
                        <span class="stock-badge ${stockStatus.class}">${stockStatus.label}</span>
                    </div>
                </div>
                <div class="card-footer">
                    <div class="card-stock">${sizeData.stock} units</div>
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
    syncBodyScrollLock();
}

// Edit plant
function editPlant(id) {
    const plant = plants.find(p => p.id === id);
    if (!plant) return;

    editingPlantId = id;
    modalTitle.textContent = 'Edit Plant';
    btnSave.textContent = 'Update Plant';

    const selectedSize = getPlantSelectedSize(plant);
    const sizeData = getPlantSizeData(plant);

    plantName.value = plant.name;
    updateCategorySelect(plant.category);
    updateSizeOptions(Object.keys(plant.sizes), selectedSize);
    plantCategory.value = plant.category;
    plantSize.value = selectedSize;
    plantPrice.value = `₱ ${sizeData.price.toFixed(2)}`;
    plantStock.value = sizeData.stock;
    plantDescription.value = plant.description || '';
    
    currentImagePreviews = parsePlantImages(plant.images || plant.image || '');
    imageSelectionDirty = false;
    renderImagePreviews();

    addPlantModal.classList.add('active');
    syncBodyScrollLock();
}

// Delete plant
function deletePlant(id) {
    pendingDeleteId = id;
    confirmationMessage.textContent = 'Are you sure you want to delete this plant?';
    confirmationModal.classList.add('active');
    syncBodyScrollLock();
}

// Confirm delete
async function confirmDelete() {
    if (pendingDeleteId) {
        const deletedPlantId = pendingDeleteId;
        try {
            const deleted = await plantsAPI.delete(Number(deletedPlantId));
            if (!deleted) {
                showErrorMessage('Failed to delete plant from database.');
                return;
            }
        } catch (error) {
            console.error('Failed to delete plant:', error);
            showErrorMessage('Failed to delete plant. Please try again.');
            return;
        }
        
        closeConfirmationModal();

        if (window.GHPlantData && typeof window.GHPlantData.removePlantImagesForPlant === 'function') {
            window.GHPlantData.removePlantImagesForPlant(deletedPlantId);
        }
        
        // Reload from DB to ensure sync
        await loadPlantInventory();
        renderPlants();
        initializeCategories();

        showSuccessWithLoadingLine('Plant deleted successfully.');
    }
}

// Close confirmation modal
function closeConfirmationModal() {
    confirmationModal.classList.remove('active');
    syncBodyScrollLock();
    pendingDeleteId = null;
}

// Update category select in modal
function updateCategorySelect(selectedCategory = '') {
    const categoryNames = Array.from(new Set([
        ...categories.map(cat => cat.category_name || ''),
        ...customCategories
    ])).filter(Boolean).sort();

    plantCategory.innerHTML = `<option value="">Select category</option>` + 
        categoryNames.map(cat => 
            `<option value="${cat}" ${cat === selectedCategory ? 'selected' : ''}>${cat}</option>`
        ).join('');
}

function updateSizeOptions(sizeOptions = [], selectedSize = 'Medium') {
    const normalized = Array.isArray(sizeOptions) && sizeOptions.length ? sizeOptions : ['Medium', 'Extra Large'];
    plantSize.innerHTML = normalized.map(size => 
        `<option value="${size}" ${size === selectedSize ? 'selected' : ''}>${size}</option>`
    ).join('');
}

// Open category management modal
function openCategoryManagementModal() {
    renderCategoriesList();
    categoryManagementModal.classList.add('active');
    syncBodyScrollLock();
}

// Close category management modal
function closeCategoryManagementModal() {
    categoryManagementModal.classList.remove('active');
    syncBodyScrollLock();
    newCategoryInput.value = '';
}

// Add new category
async function addNewCategory() {
    const newCategory = newCategoryInput.value.trim();
    if (!newCategory) return;

    if (customCategories.has(newCategory)) {
        showErrorMessage('This category already exists.');
        return;
    }

    try {
        const created = await categoriesAPI.create({ category_name: newCategory });
        if (created) {
            await refreshCategories();
            customCategories.add(newCategory);
            newCategoryInput.value = '';
            renderCategoriesList();
            initializeCategories();
            renderPlants();
        } else {
            showErrorMessage('Could not add category. Please try again.');
        }
    } catch (error) {
        console.error('Failed to add category:', error);
        showErrorMessage('Failed to add category. Please try again.');
    }
}

// Delete category
async function deleteCategory(categoryId, categoryName) {
    if (!categoryId) {
        return;
    }

    try {
        const removed = await categoriesAPI.delete(categoryId);
        if (removed) {
            await refreshCategories();
            customCategories.delete(categoryName);
            renderCategoriesList();
            initializeCategories();
            renderPlants();
        } else {
            showErrorMessage('Could not delete category.');
        }
    } catch (error) {
        console.error('Failed to delete category:', error);
        showErrorMessage('Failed to delete category.');
    }
}

// Render categories list in management modal
function renderCategoriesList() {
    categoriesList.innerHTML = (categories || []).sort((a, b) => {
        return (a.category_name || '').localeCompare(b.category_name || '');
    }).map(cat => `
        <div class="category-item">
            <span class="category-item-name">${cat.category_name}</span>
            <button class="category-item-delete" onclick="deleteCategory(${cat.category_id}, '${String(cat.category_name).replace(/'/g, "\\'")}')">Delete</button>
        </div>
    `).join('');
}

// Save plant
async function savePlant() {
    const name = plantName.value.trim();
    const category = plantCategory.value;
    const selectedSize = plantSize.value || 'Medium';
    const priceText = plantPrice.value.replace(/[^0-9.]/g, '');
    const price = parseFloat(priceText);
    const stock = parseInt(plantStock.value) || 0;
    const description = plantDescription.value.trim();

    if (!name || !category || isNaN(price) || price <= 0 || stock < 0) {
        showErrorMessage('Please fill in all required fields with valid data.');
        return;
    }

    const newSizeData = {
        price,
        stock,
        available: stock > 0
    };

    const isEditing = Boolean(editingPlantId);
    const selectedImages = currentImagePreviews.length ? currentImagePreviews.slice(0, MAX_PLANT_IMAGES) : [];

    if (isEditing) {
        const index = plants.findIndex(p => p.id === editingPlantId);
        if (index !== -1) {
            const existing = plants[index];
            const existingImages = parsePlantImages(existing.images || existing.image || DEFAULT_PLANT_IMAGE);
            const finalImages = imageSelectionDirty ? selectedImages : existingImages;
            const updatedSizes = { ...existing.sizes };
            updatedSizes[selectedSize] = { ...updatedSizes[selectedSize], ...newSizeData };
            const hasAnyStock = Object.values(updatedSizes).some(size => Number(size.stock) > 0 && Boolean(size.available));
            const categoryId = categoryNameToId[category] ?? null;

            if (!categoryId) {
                showErrorMessage('Selected category is invalid.');
                return;
            }

            const nextImagePath = (imageSelectionDirty && !finalImages.length)
                ? ''
                : buildDbImagePayload(finalImages, imageSelectionDirty ? '' : (existing.image || ''));

            const plantPayload = {
                plant_id: Number(editingPlantId),
                plant_name: name,
                category_id: categoryId,
                description,
                image_path: nextImagePath
            };

            let plantUpdated = false;
            let updateErrorMessage = '';
            try {
                plantUpdated = await plantsAPI.update(plantPayload);
            } catch (error) {
                console.error('Failed to update plant:', error);
                updateErrorMessage = String(error?.message || '').trim();
            }

            if (!plantUpdated) {
                showErrorMessage(updateErrorMessage || 'Failed to save changes to database.');
                return;
            }

            try {
                if (window.GHPlantData) {
                    const containsInlineImages = finalImages.some((item) => String(item || '').trim().startsWith('data:image/'));
                    if ((imageSelectionDirty && !finalImages.length) || containsInlineImages) {
                        if (typeof window.GHPlantData.removePlantImagesForPlant === 'function') {
                            window.GHPlantData.removePlantImagesForPlant(editingPlantId);
                        }
                    } else if (typeof window.GHPlantData.savePlantImagesForPlant === 'function') {
                        window.GHPlantData.savePlantImagesForPlant(editingPlantId, finalImages);
                    }
                }
            } catch (error) {
                console.warn('Unable to persist plant image map locally:', error);
            }

            const sizeEntry = existing.sizes?.[selectedSize];
            const plantSizePayload = {
                plant_id: Number(editingPlantId),
                size_name: selectedSize,
                price: Math.round(price),
                stock_quantity: stock,
                is_available: stock > 0 ? '1' : '0',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            try {
                let sizeSaved = false;
                if (sizeEntry?.id) {
                    plantSizePayload.plant_size_id = Number(sizeEntry.id);
                    sizeSaved = await plantSizesAPI.update(plantSizePayload);
                } else {
                    sizeSaved = await plantSizesAPI.create(plantSizePayload);
                }
                if (!sizeSaved) {
                    console.warn('Plant size save did not persist to database.');
                }
            } catch (error) {
                console.error('Failed to save plant size:', error);
            }

            plants[index] = normalizePlantData({
                ...existing,
                name,
                category,
                description,
                image: getPrimaryImage(finalImages),
                images: finalImages,
                selectedSize,
                sizes: updatedSizes,
                available: hasAnyStock
            });
        }
    } else {
        // ADD NEW PLANT
        const categoryId = categoryNameToId[category] ?? null;
        if (!categoryId) {
            showErrorMessage('Selected category is invalid.');
            return;
        }

        const finalImages = selectedImages.length ? selectedImages : [DEFAULT_PLANT_IMAGE];

        const plantPayload = {
            plant_name: name,
            category_id: categoryId,
            description,
            image_path: buildDbImagePayload(finalImages)
        };

        let newPlantId = null;
        let createErrorMessage = '';
        try {
            const created = await plantsAPI.create(plantPayload);
            if (typeof created === 'number') {
                newPlantId = created;
            } else if (created && typeof created === 'object') {
                newPlantId = created.plant_id || created.id || null;
            }

            if (!newPlantId) {
                showErrorMessage('Failed to create plant in database.');
                return;
            }

            try {
                const containsInlineImages = finalImages.some((item) => String(item || '').trim().startsWith('data:image/'));
                if (window.GHPlantData && !containsInlineImages && typeof window.GHPlantData.savePlantImagesForPlant === 'function') {
                    window.GHPlantData.savePlantImagesForPlant(newPlantId, finalImages);
                } else if (window.GHPlantData && containsInlineImages && typeof window.GHPlantData.removePlantImagesForPlant === 'function') {
                    window.GHPlantData.removePlantImagesForPlant(newPlantId);
                }
            } catch (error) {
                console.warn('Unable to persist plant image map locally:', error);
            }
        } catch (error) {
            console.error('Failed to create plant:', error);
            createErrorMessage = String(error?.message || '').trim();
            showErrorMessage(createErrorMessage || 'Failed to create plant. Please try again.');
            return;
        }

        // Create plant size after plant is created
        if (newPlantId !== null) {
            const plantSizePayload = {
                plant_id: Number(newPlantId),
                size_name: selectedSize,
                price: Math.round(price),
                stock_quantity: stock,
                is_available: stock > 0 ? '1' : '0',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            try {
                await plantSizesAPI.create(plantSizePayload);
            } catch (error) {
                console.error('Failed to create plant size:', error);
            }
        }

        const sizes = {
            [selectedSize]: newSizeData
        };
        const plantData = normalizePlantData({
            id: String(newPlantId),
            name,
            category,
            description,
            image: getPrimaryImage(finalImages),
            images: finalImages,
            selectedSize,
            sizes,
            available: stock > 0
        });
        plants.push(plantData);
    }

    customCategories.add(category);

    closeAddModal();
    await loadPlantInventory();
    syncPlantInventory();
    initializeCategories();
    renderPlants();

    if (isEditing) {
        showSuccessWithLoadingLine('Plant updated successfully.');
    } else {
        showSuccessWithLoadingLine('Plant added successfully.');
    }
}

// Close add modal
function closeAddModal() {
    addPlantModal.classList.remove('active');
    syncBodyScrollLock();
    resetForm();
}

function refreshCategories() {
    return categoriesAPI.getAll().then(allCategories => {
        categories = Array.isArray(allCategories) ? allCategories : [];
        categoryMap = categories.reduce((map, cat) => {
            if (cat && cat.category_id != null) {
                map[cat.category_id] = cat.category_name || 'General';
            }
            return map;
        }, {});
        categoryNameToId = categories.reduce((map, cat) => {
            if (cat && cat.category_name != null) {
                map[String(cat.category_name)] = cat.category_id;
            }
            return map;
        }, {});
        customCategories = new Set([
            ...customCategories,
            ...categories.map(cat => cat.category_name || '')
        ]);
        return categories;
    }).catch(error => {
        console.error('Failed to refresh categories:', error);
        return categories;
    });
}

function showErrorMessage(message) {
    confirmationMessage.textContent = message;
    confirmationModal.classList.add('active');
    syncBodyScrollLock();
    btnConfirmDelete.style.display = 'none';
    btnConfirmCancel.textContent = 'Close';
    const closeErrorModal = () => {
        closeConfirmationModal();
        btnConfirmDelete.style.display = '';
        btnConfirmCancel.textContent = 'Cancel';
        btnConfirmCancel.removeEventListener('click', closeErrorModal);
    };
    btnConfirmCancel.addEventListener('click', closeErrorModal, { once: true });
}

// Close success modal
function closeSuccessModal() {
    if (actionLoadingTimer) {
        clearTimeout(actionLoadingTimer);
        actionLoadingTimer = null;
    }

    if (successToastTimer) {
        clearTimeout(successToastTimer);
        successToastTimer = null;
    }

    if (actionLoadingLine) {
        actionLoadingLine.classList.remove('active');
    }

    successModal.classList.remove('active');
}

function showSuccessWithLoadingLine(message) {
    if (successMessageText) {
        successMessageText.textContent = message;
    }

    closeSuccessModal();

    successModal.classList.add('active');

    if (actionLoadingLine) {
        // Restart the progress animation for each new success action.
        void actionLoadingLine.offsetWidth;
        actionLoadingLine.classList.add('active');
    }

    actionLoadingTimer = window.setTimeout(() => {
        if (actionLoadingLine) {
            actionLoadingLine.classList.remove('active');
        }
        actionLoadingTimer = null;
    }, 700);

    successToastTimer = window.setTimeout(() => {
        closeSuccessModal();
    }, 2200);
}

// Reset form
function resetForm() {
    plantName.value = '';
    plantCategory.value = '';
    plantSize.value = 'Medium';
    plantPrice.value = '';
    plantStock.value = '';
    plantDescription.value = '';
    imageInput.value = '';
    currentImagePreviews = [];
    imageSelectionDirty = false;
    renderImagePreviews();
}

// Handle image upload
function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
        return;
    }

    const remainingSlots = MAX_PLANT_IMAGES - currentImagePreviews.length;
    if (remainingSlots <= 0) {
        imageInput.value = '';
        showErrorMessage('You can upload up to 4 images only.');
        return;
    }

    const selectedFiles = files.slice(0, remainingSlots);
    const optimizedUploads = selectedFiles.map((file) => optimizeImageFile(file));

    Promise.all(optimizedUploads)
        .then((results) => {
            const validImages = results.filter(Boolean);
            currentImagePreviews = [...currentImagePreviews, ...validImages].slice(0, MAX_PLANT_IMAGES);
            if (validImages.length) {
                imageSelectionDirty = true;
            }
            renderImagePreviews();

            if (files.length > selectedFiles.length) {
                showErrorMessage('Only the first 4 images were added.');
            }
        })
        .catch((error) => {
            console.error('Failed to read selected image files:', error);
            showErrorMessage('Failed to read selected image files. Please try again.');
        })
        .finally(() => {
            imageInput.value = '';
        });
}

// Price formatting
plantPrice.addEventListener('focus', (e) => {
    // Remove formatting when user starts typing
    e.target.value = e.target.value.replace(/[^0-9.]/g, '');
});

plantPrice.addEventListener('blur', (e) => {
    // Add formatting when user finishes editing
    let value = e.target.value.replace(/[^0-9.]/g, '');
    if (value) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
            e.target.value = `₱ ${num.toFixed(2)}`;
        }
    }
});
