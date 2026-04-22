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
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    // Handle empty responses (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error calling ${url}:`, error);
    throw error;
  }
}

// Admin endpoints
const adminAPI = {
  getAll: () => apiRequest('/admin'),
  getById: (id) => apiRequest(`/admin/${id}`),
  create: (data) => apiRequest('/admin', 'POST', data),
  update: (data) => apiRequest('/admin', 'PUT', data),
  delete: (id) => apiRequest(`/admin/${id}`, 'DELETE'),
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
};
