// API Configuration for vanilla JavaScript files
const API_BASE_URL = 'http://localhost:5007/api';

// Generic fetch wrapper
async function apiRequest(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorBody = await response.json();
        if (errorBody.message) {
          errorMessage = errorBody.message;
        }
      } catch (e) {
        // Response wasn't JSON, use default error
      }
      throw new Error(errorMessage);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null;
    }

    // Try to parse as JSON, but handle plain text/boolean responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // For plain text or other content types, return the text or boolean
      const text = await response.text();
      // Try to parse as boolean or number
      if (text === 'true') return true;
      if (text === 'false') return false;
      if (!isNaN(text) && text !== '') return Number(text);
      return text;
    }
  } catch (error) {
    console.error(`Error calling ${url}:`, error);
    throw error;
  }
}

function toAuditLabel(value, fallback = '') {
  const normalized = String(value || '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!normalized) {
    return fallback;
  }

  return normalized
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function loadCurrentAdminSession() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    return JSON.parse(window.localStorage.getItem('admin') || 'null');
  } catch (error) {
    return null;
  }
}

function isAdminPageContext() {
  if (typeof window === 'undefined' || !window.location) {
    return false;
  }

  const path = String(window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
  return path.includes('/admin/');
}

function getCurrentAdminModule() {
  const path = typeof window !== 'undefined' && window.location
    ? String(window.location.pathname || '').replace(/\\/g, '/').toLowerCase()
    : '';

  if (path.includes('/admin/plantcatalog/')) {
    return 'Plant Catalog';
  }

  if (path.includes('/admin/reservation/')) {
    return 'Reservation';
  }

  if (path.includes('/admin/delivery/')) {
    return 'Delivery';
  }

  if (path.includes('/admin/profile/')) {
    return 'Profile';
  }

  if (path.includes('/admin/dashboard/')) {
    return 'Dashboard';
  }

  if (path.includes('/admin/auth/')) {
    return 'Authentication';
  }

  return 'Admin';
}

async function createAdminActivityLog(entry) {
  if (!isAdminPageContext() || !entry || !entry.action_performed) {
    return;
  }

  const currentAdmin = loadCurrentAdminSession();
  const adminId = currentAdmin?.admin_id || currentAdmin?.id;

  if (!adminId) {
    return;
  }

  const payload = {
    admin_id: String(adminId),
    action_performed: entry.action_performed,
    module_used: entry.module_used || getCurrentAdminModule(),
    status: entry.status || 'Success',
    created_at: new Date().toISOString()
  };

  try {
    await apiRequest('/adminlog', 'POST', payload);

    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof Event === 'function') {
      window.dispatchEvent(new Event('gh:admin-log-created'));
    }
  } catch (error) {
    console.warn('Failed to create admin activity log:', error);
  }
}

async function withAdminActivity(requestFn, buildLogEntry) {
  const result = await requestFn();

  if (result === false) {
    return result;
  }

  const logEntry = typeof buildLogEntry === 'function'
    ? buildLogEntry(result)
    : buildLogEntry;

  if (logEntry) {
    await createAdminActivityLog(logEntry);
  }

  return result;
}

function buildRequestStatusLogEntry(requestId, data) {
  const requestStatus = toAuditLabel(data?.request_status, 'Pending');
  const paymentStatus = toAuditLabel(data?.payment_status);
  const moduleName = getCurrentAdminModule();

  if (moduleName === 'Delivery') {
    return {
      action_performed: `Updated delivery request #${requestId} to ${requestStatus}`,
      module_used: moduleName
    };
  }

  const paymentSuffix = paymentStatus ? ` and payment to ${paymentStatus}` : '';

  return {
    action_performed: `Updated request #${requestId} to ${requestStatus}${paymentSuffix}`,
    module_used: moduleName
  };
}

const adminAPI = {
  getAll: () => apiRequest('/admin'),
  getById: (id) => apiRequest(`/admin/${id}`),
  create: (data) => apiRequest('/admin', 'POST', data),
  update: (data) => withAdminActivity(
    () => apiRequest('/admin', 'PUT', data),
    () => ({
      action_performed: 'Updated admin profile details',
      module_used: 'Profile'
    })
  ),
  delete: (id) => apiRequest(`/admin/${id}`, 'DELETE'),
  changePassword: (id, data) => withAdminActivity(
    () => apiRequest(`/admin/change-password/${id}`, 'PUT', data),
    () => ({
      action_performed: 'Changed account password',
      module_used: 'Profile'
    })
  ),

  // 🔥 ADD THESE (IMPORTANT)
  signup: (data) => apiRequest('/admin/signup', 'POST', data),
  verify: (data) => apiRequest('/admin/verify', 'POST', data),
  login: (data) => apiRequest('/admin/login', 'POST', data),

  sendResetCode: (data) => apiRequest('/admin/forgot-password/send-code', 'POST', data),
  verifyResetCode: (data) => apiRequest('/admin/forgot-password/verify-code', 'POST', data),
  resetPassword: (data) => apiRequest('/admin/forgot-password/reset-password', 'POST', data),
};

// Plant endpoints
const plantsAPI = {
  getAll: () => apiRequest('/plant'),
  getById: (id) => apiRequest(`/plant/${id}`),
  create: (data) => withAdminActivity(
    () => apiRequest('/plant', 'POST', data),
    () => ({
      action_performed: `Created plant "${String(data?.plant_name || 'Unnamed plant').trim()}"`,
      module_used: 'Plant Catalog'
    })
  ),
  update: (data) => withAdminActivity(
    () => apiRequest('/plant', 'PUT', data),
    () => ({
      action_performed: `Updated plant "${String(data?.plant_name || data?.plant_id || 'Unknown plant').trim()}"`,
      module_used: 'Plant Catalog'
    })
  ),
  delete: (id) => withAdminActivity(
    () => apiRequest(`/plant/${id}`, 'DELETE'),
    () => ({
      action_performed: `Deleted plant #${id}`,
      module_used: 'Plant Catalog'
    })
  ),
};

// Category endpoints
const categoriesAPI = {
  getAll: () => apiRequest('/category'),
  getById: (id) => apiRequest(`/category/${id}`),
  create: (data) => withAdminActivity(
    () => apiRequest('/category', 'POST', data),
    () => ({
      action_performed: `Created category "${String(data?.category_name || 'Unnamed category').trim()}"`,
      module_used: 'Plant Catalog'
    })
  ),
  update: (data) => apiRequest('/category', 'PUT', data),
  delete: (id) => withAdminActivity(
    () => apiRequest(`/category/${id}`, 'DELETE'),
    () => ({
      action_performed: `Deleted category #${id}`,
      module_used: 'Plant Catalog'
    })
  ),
};

// Client endpoints
const clientsAPI = {
  getAll: () => apiRequest('/client'),
  getById: (id) => apiRequest(`/client/${id}`),
  create: (data) => apiRequest('/client', 'POST', data),
  update: (data) => apiRequest('/client', 'PUT', data),
  delete: (id) => apiRequest(`/client/${id}`, 'DELETE'),
};

// Cart endpoints
const cartItemsAPI = {
  getAll: () => apiRequest('/cartitem'),
  getById: (id) => apiRequest(`/cartitem/${id}`),
  create: (data) => apiRequest('/cartitem', 'POST', data),
  update: (data) => apiRequest('/cartitem', 'PUT', data),
  delete: (id) => apiRequest(`/cartitem/${id}`, 'DELETE'),
};

// Delivery endpoints
const deliveriesAPI = {
  getAll: () => apiRequest('/delivery'),
  getById: (id) => apiRequest(`/delivery/${id}`),
  create: (data) => apiRequest('/delivery', 'POST', data),
  update: (data) => apiRequest('/delivery', 'PUT', data),
  delete: (id) => apiRequest(`/delivery/${id}`, 'DELETE'),
};

// Request endpoints
const requestsAPI = {
  getAll: () => apiRequest('/request'),
  getById: (id) => apiRequest(`/request/${id}`),
  create: (data) => apiRequest('/request', 'POST', data),
  update: (data) => apiRequest('/request', 'PUT', data),
  delete: (id) => withAdminActivity(
    () => apiRequest(`/request/${id}`, 'DELETE'),
    () => ({
      action_performed: `Deleted request #${id}`,
      module_used: getCurrentAdminModule()
    })
  ),
  updateStatus: (id, data) => withAdminActivity(
    () => apiRequest(`/request/status/${id}`, 'PUT', data),
    () => buildRequestStatusLogEntry(id, data)
  ),
  getDeliveryWindow: (clientId) => apiRequest(`/request/delivery-window/${clientId}`),
};

// PlantSize endpoints
const plantSizesAPI = {
  getAll: () => apiRequest('/plantsize'),
  getById: (id) => apiRequest(`/plantsize/${id}`),
  create: (data) => apiRequest('/plantsize', 'POST', data),
  update: (data) => apiRequest('/plantsize', 'PUT', data),
  delete: (id) => apiRequest(`/plantsize/${id}`, 'DELETE'),
};

function normalizePlantSizeLabel(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function clonePlantSizeRecord(record) {
  const stockQuantity = Math.max(0, Number(record?.stock_quantity ?? record?.stock ?? 0));

  return {
    plant_size_id: Number(record?.plant_size_id ?? record?.id ?? 0),
    plant_id: Number(record?.plant_id ?? record?.plantId ?? 0),
    size_name: String(record?.size_name ?? record?.name ?? '').trim(),
    price: Math.round(Number(record?.price ?? 0) || 0),
    stock_quantity: stockQuantity,
    is_available: stockQuantity > 0 ? '1' : '0',
    created_at: record?.created_at || record?.createdAt || new Date().toISOString(),
    updated_at: record?.updated_at || record?.updatedAt || new Date().toISOString()
  };
}

function dispatchPlantStockUpdated() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof Event === 'function') {
    window.dispatchEvent(new Event('gh:plant-stock-updated'));
  }
}

function resolvePlantSizeForOrderItem(item, plantSizes) {
  const explicitPlantSizeId = Number(item?.plantSizeId ?? item?.plant_size_id ?? 0);
  if (Number.isFinite(explicitPlantSizeId) && explicitPlantSizeId > 0) {
    const matchedById = plantSizes.find((plantSize) => Number(plantSize?.plant_size_id) === explicitPlantSizeId);
    if (matchedById) {
      return clonePlantSizeRecord(matchedById);
    }
  }

  const plantId = Number(item?.plantId ?? item?.plant_id ?? item?.id ?? 0);
  const normalizedSizeName = normalizePlantSizeLabel(item?.size ?? item?.size_name ?? '');
  const matchedByPlantAndSize = plantSizes.find((plantSize) => {
    const samePlant = Number(plantSize?.plant_id) === plantId;
    if (!samePlant) {
      return false;
    }

    if (!normalizedSizeName) {
      return true;
    }

    return normalizePlantSizeLabel(plantSize?.size_name) === normalizedSizeName;
  });

  return matchedByPlantAndSize ? clonePlantSizeRecord(matchedByPlantAndSize) : null;
}

async function reservePurchaseStock(orderItems) {
  if (!Array.isArray(orderItems) || !orderItems.length) {
    return { applied: [] };
  }

  const plantSizes = await plantSizesAPI.getAll();
  if (!Array.isArray(plantSizes)) {
    throw new Error('Unable to load plant inventory.');
  }

  const reservations = new Map();

  orderItems.forEach((item) => {
    const requestedQty = Math.max(0, Number(item?.qty ?? item?.quantity ?? 0));
    if (!requestedQty) {
      return;
    }

    const matchedPlantSize = resolvePlantSizeForOrderItem(item, plantSizes);
    if (!matchedPlantSize) {
      const itemLabel = String(item?.name || 'Selected plant').trim();
      throw new Error(`Unable to match stock for ${itemLabel}.`);
    }

    const reservationKey = Number(matchedPlantSize.plant_size_id);
    const existing = reservations.get(reservationKey);

    if (existing) {
      existing.requestedQty += requestedQty;
      return;
    }

    reservations.set(reservationKey, {
      before: matchedPlantSize,
      requestedQty,
      itemLabel: String(item?.name || 'Selected plant').trim() || 'Selected plant'
    });
  });

  reservations.forEach((reservation) => {
    if (reservation.requestedQty > reservation.before.stock_quantity) {
      const sizeLabel = reservation.before.size_name ? ` (${reservation.before.size_name})` : '';
      throw new Error(`${reservation.itemLabel}${sizeLabel} only has ${reservation.before.stock_quantity} item(s) left.`);
    }
  });

  const applied = [];

  try {
    for (const reservation of reservations.values()) {
      const nextStock = Math.max(0, reservation.before.stock_quantity - reservation.requestedQty);
      const updatePayload = {
        ...reservation.before,
        stock_quantity: nextStock,
        is_available: nextStock > 0 ? '1' : '0',
        updated_at: new Date().toISOString()
      };

      const updated = await plantSizesAPI.update(updatePayload);
      if (updated === false) {
        throw new Error(`Failed to update stock for ${reservation.itemLabel}.`);
      }

      applied.push({
        before: reservation.before,
        after: updatePayload,
        itemLabel: reservation.itemLabel
      });
    }

    if (applied.length) {
      dispatchPlantStockUpdated();
    }

    return { applied };
  } catch (error) {
    if (applied.length) {
      await rollbackReservedPurchaseStock({ applied });
    }

    throw error;
  }
}

async function rollbackReservedPurchaseStock(reservation) {
  const applied = Array.isArray(reservation?.applied) ? reservation.applied.slice().reverse() : [];

  for (const entry of applied) {
    const rollbackPayload = {
      ...entry.before,
      updated_at: new Date().toISOString()
    };

    await plantSizesAPI.update(rollbackPayload);
  }

  if (applied.length) {
    dispatchPlantStockUpdated();
  }
}

const GHStockSync = {
  reservePurchaseStock,
  rollbackReservedPurchaseStock
};

if (typeof window !== 'undefined') {
  window.GHStockSync = GHStockSync;
}

// RequestPlant endpoints
const requestPlantsAPI = {
  getAll: () => apiRequest('/requestplant'),
  getById: (id) => apiRequest(`/requestplant/${id}`),
  create: (data) => apiRequest('/requestplant', 'POST', data),
  update: (data) => apiRequest('/requestplant', 'PUT', data),
  delete: (id) => apiRequest(`/requestplant/${id}`, 'DELETE'),
};

// Review endpoints
const reviewsAPI = {
  getAll: () => apiRequest('/review'),
  getById: (id) => apiRequest(`/review/${id}`),
  create: (data) => apiRequest('/review', 'POST', data),
  update: (data) => apiRequest('/review', 'PUT', data),
  delete: (id) => apiRequest(`/review/${id}`, 'DELETE'),
};

// AdminLog endpoints
const adminLogsAPI = {
  getAll: () => apiRequest('/adminlog'),
  getById: (id) => apiRequest(`/adminlog/${id}`),
  create: (data) => apiRequest('/adminlog', 'POST', data),
  update: (data) => apiRequest('/adminlog', 'PUT', data),
  delete: (id) => apiRequest(`/adminlog/${id}`, 'DELETE'),
};
