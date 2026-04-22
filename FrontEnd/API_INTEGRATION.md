# Frontend-Backend Integration Guide

Your frontend is now connected to your backend API running on `http://localhost:5007`.

## 🎯 Quick Start

### 1. Environment Configuration
- **`.env.local`** - Your local development API configuration
- **`.env.example`** - Template for environment variables

The API base URL is set to: `http://localhost:5007/api`

### 2. API Services

#### For TypeScript/React Files (src/ directory)
Import the API client in your React components:

```typescript
import { apiClient } from '@/services/api';

// Usage examples:
const allPlants = await apiClient.plants.getAll();
const plant = await apiClient.plants.getById(1);
await apiClient.plants.create({ name: 'New Plant', price: 100 });
await apiClient.plants.update({ id: 1, name: 'Updated Plant' });
await apiClient.plants.delete(1);
```

#### For Vanilla JavaScript Files
Include the API script in your HTML:

```html
<script src="../../shared/api.js"></script>
```

Then use the API functions:

```javascript
// Usage examples:
const allPlants = await plantsAPI.getAll();
const plant = await plantsAPI.getById(1);
await plantsAPI.create({ name: 'New Plant', price: 100 });
await plantsAPI.update({ id: 1, name: 'Updated Plant' });
await plantsAPI.delete(1);
```

## 📚 Available API Endpoints

All endpoints follow RESTful conventions. The service includes pre-configured methods for:

### Admin
- `adminAPI.getAll()` → GET `/admin`
- `adminAPI.getById(id)` → GET `/admin/{id}`
- `adminAPI.create(data)` → POST `/admin`
- `adminAPI.update(data)` → PUT `/admin`
- `adminAPI.delete(id)` → DELETE `/admin/{id}`

### Plants
- `plantsAPI.getAll()` → GET `/plant`
- `plantsAPI.getById(id)` → GET `/plant/{id}`
- `plantsAPI.create(data)` → POST `/plant`
- `plantsAPI.update(data)` → PUT `/plant`
- `plantsAPI.delete(id)` → DELETE `/plant/{id}`

### Categories
- `categoriesAPI.getAll()` → GET `/category`
- `categoriesAPI.getById(id)` → GET `/category/{id}`
- `categoriesAPI.create(data)` → POST `/category`
- `categoriesAPI.update(data)` → PUT `/category`
- `categoriesAPI.delete(id)` → DELETE `/category/{id}`

### Clients
- `clientsAPI.getAll()` → GET `/client`
- `clientsAPI.getById(id)` → GET `/client/{id}`
- `clientsAPI.create(data)` → POST `/client`
- `clientsAPI.update(data)` → PUT `/client`
- `clientsAPI.delete(id)` → DELETE `/client/{id}`

### Cart Items
- `cartItemsAPI.getAll()` → GET `/cartitem`
- `cartItemsAPI.getById(id)` → GET `/cartitem/{id}`
- `cartItemsAPI.create(data)` → POST `/cartitem`
- `cartItemsAPI.update(data)` → PUT `/cartitem`
- `cartItemsAPI.delete(id)` → DELETE `/cartitem/{id}`

### Deliveries
- `deliveriesAPI.getAll()` → GET `/delivery`
- `deliveriesAPI.getById(id)` → GET `/delivery/{id}`
- `deliveriesAPI.create(data)` → POST `/delivery`
- `deliveriesAPI.update(data)` → PUT `/delivery`
- `deliveriesAPI.delete(id)` → DELETE `/delivery/{id}`

### Requests
- `requestsAPI.getAll()` → GET `/request`
- `requestsAPI.getById(id)` → GET `/request/{id}`
- `requestsAPI.create(data)` → POST `/request`
- `requestsAPI.update(data)` → PUT `/request`
- `requestsAPI.delete(id)` → DELETE `/request/{id}`

## 🔧 Backend Requirements

Your backend needs to be running with:

1. **Base URL**: `http://localhost:5007`
2. **CORS Enabled**: ✅ Already configured in your `Program.cs`
3. **API Route Pattern**: `/api/[controller]`

### Verify Backend is Running

```bash
# From BackEnd/WebAPIwithDapper/API directory
dotnet run
```

Check Swagger UI: `http://localhost:5007/swagger`

## 🚀 Examples

### React Component Example
```typescript
import { useEffect, useState } from 'react';
import { apiClient } from '@/services/api';

export function PlantCatalog() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.plants.getAll()
      .then(setPlants)
      .catch(error => console.error('Failed to load plants:', error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {plants.map(plant => (
        <div key={plant.id}>{plant.name}</div>
      ))}
    </div>
  );
}
```

### Vanilla JavaScript Example
```javascript
// HTML
<script src="../../shared/api.js"></script>

// JavaScript
async function loadPlants() {
  try {
    const plants = await plantsAPI.getAll();
    console.log('Plants loaded:', plants);
    
    // Display plants...
  } catch (error) {
    console.error('Failed to load plants:', error);
  }
}

loadPlants();
```

## 📝 Adding New Endpoints

If your backend adds new controllers, add them to both service files:

### In `src/services/api.ts` (TypeScript):
```typescript
yourControllerAPI: {
  getAll: () => apiClient.request('/yourcontroller'),
  getById: (id: number) => apiClient.request(`/yourcontroller/${id}`),
  create: (data: unknown) => apiClient.request('/yourcontroller', 'POST', data),
  update: (data: unknown) => apiClient.request('/yourcontroller', 'PUT', data),
  delete: (id: number) => apiClient.request(`/yourcontroller/${id}`, 'DELETE'),
}
```

### In `shared/api.js` (JavaScript):
```javascript
const yourControllerAPI = {
  getAll: () => apiRequest('/yourcontroller'),
  getById: (id) => apiRequest(`/yourcontroller/${id}`),
  create: (data) => apiRequest('/yourcontroller', 'POST', data),
  update: (data) => apiRequest('/yourcontroller', 'PUT', data),
  delete: (id) => apiRequest(`/yourcontroller/${id}`, 'DELETE'),
};
```

## ⚠️ Notes

- **CORS**: Your backend allows all origins in development. For production, restrict this in `Program.cs`
- **Authentication**: The current auth system stores user data in localStorage. For production, implement secure JWT tokens
- **Error Handling**: Always wrap API calls in try-catch blocks
- **API Timeout**: Add timeout handling for long-running requests

## 🐛 Troubleshooting

### "Cannot GET /api/..."
- Ensure your backend is running on port 5007
- Check that the endpoint exists in the backend controller

### CORS Errors
- Backend CORS is enabled - this should work
- If issues persist, check `Program.cs` has `app.UseCors("AllowAll");` before `app.MapControllers();`

### 404 Errors
- Verify the controller name matches (check backend Controllers folder)
- Ensure routes follow pattern: `/api/[controller]/[action]`

## 📞 Next Steps

1. Test the authentication endpoints by visiting the Admin Sign In page
2. Update other frontend pages to use the API services
3. Replace hardcoded plant data with API calls from the backend
4. Implement proper error handling and loading states
