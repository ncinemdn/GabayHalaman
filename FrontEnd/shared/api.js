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

const adminAPI = {
  getAll: () => apiRequest('/admin'),
  getById: (id) => apiRequest(`/admin/${id}`),
  create: (data) => apiRequest('/admin', 'POST', data),
  update: (data) => apiRequest('/admin', 'PUT', data),
  delete: (id) => apiRequest(`/admin/${id}`, 'DELETE'),
  changePassword: (id, data) => apiRequest(`/admin/change-password/${id}`, 'PUT', data),

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
  create: (data) => apiRequest('/plant', 'POST', data),
  update: (data) => apiRequest('/plant', 'PUT', data),
  delete: (id) => apiRequest(`/plant/${id}`, 'DELETE'),
};

// Category endpoints
const categoriesAPI = {
  getAll: () => apiRequest('/category'),
  getById: (id) => apiRequest(`/category/${id}`),
  create: (data) => apiRequest('/category', 'POST', data),
  update: (data) => apiRequest('/category', 'PUT', data),
  delete: (id) => apiRequest(`/category/${id}`, 'DELETE'),
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
  delete: (id) => apiRequest(`/request/${id}`, 'DELETE'),
  updateStatus: (id, data) => apiRequest(`/request/status/${id}`, 'PUT', data),
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
