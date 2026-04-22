const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5007/api';

export const apiClient = {
  // Generic fetch wrapper
  async request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const options: RequestInit = {
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
        return null as T;
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Error calling ${url}:`, error);
      throw error;
    }
  },

  // Admin endpoints
  admin: {
    getAll: () => apiClient.request('/admin'),
    getById: (id: number) => apiClient.request(`/admin/${id}`),
    create: (data: unknown) => apiClient.request('/admin', 'POST', data),
    update: (data: unknown) => apiClient.request('/admin', 'PUT', data),
    delete: (id: number) => apiClient.request(`/admin/${id}`, 'DELETE'),
  },

  // Plant endpoints
  plants: {
    getAll: () => apiClient.request('/plant'),
    getById: (id: number) => apiClient.request(`/plant/${id}`),
    create: (data: unknown) => apiClient.request('/plant', 'POST', data),
    update: (data: unknown) => apiClient.request('/plant', 'PUT', data),
    delete: (id: number) => apiClient.request(`/plant/${id}`, 'DELETE'),
  },

  // Category endpoints
  categories: {
    getAll: () => apiClient.request('/category'),
    getById: (id: number) => apiClient.request(`/category/${id}`),
    create: (data: unknown) => apiClient.request('/category', 'POST', data),
    update: (data: unknown) => apiClient.request('/category', 'PUT', data),
    delete: (id: number) => apiClient.request(`/category/${id}`, 'DELETE'),
  },

  // Client endpoints
  clients: {
    getAll: () => apiClient.request('/client'),
    getById: (id: number) => apiClient.request(`/client/${id}`),
    create: (data: unknown) => apiClient.request('/client', 'POST', data),
    update: (data: unknown) => apiClient.request('/client', 'PUT', data),
    delete: (id: number) => apiClient.request(`/client/${id}`, 'DELETE'),
  },

  // Cart endpoints
  cartItems: {
    getAll: () => apiClient.request('/cartitem'),
    getById: (id: number) => apiClient.request(`/cartitem/${id}`),
    create: (data: unknown) => apiClient.request('/cartitem', 'POST', data),
    update: (data: unknown) => apiClient.request('/cartitem', 'PUT', data),
    delete: (id: number) => apiClient.request(`/cartitem/${id}`, 'DELETE'),
  },

  // Delivery endpoints
  deliveries: {
    getAll: () => apiClient.request('/delivery'),
    getById: (id: number) => apiClient.request(`/delivery/${id}`),
    create: (data: unknown) => apiClient.request('/delivery', 'POST', data),
    update: (data: unknown) => apiClient.request('/delivery', 'PUT', data),
    delete: (id: number) => apiClient.request(`/delivery/${id}`, 'DELETE'),
  },

  // Request endpoints
  requests: {
    getAll: () => apiClient.request('/request'),
    getById: (id: number) => apiClient.request(`/request/${id}`),
    create: (data: unknown) => apiClient.request('/request', 'POST', data),
    update: (data: unknown) => apiClient.request('/request', 'PUT', data),
    delete: (id: number) => apiClient.request(`/request/${id}`, 'DELETE'),
  },
};

export default apiClient;
