# Frontend-Backend Connection Setup Summary

## ✅ What Was Set Up

### 1. **Environment Configuration**
- Created `.env.local` with `VITE_API_BASE_URL=http://localhost:5007/api`
- Created `.env.example` as a template for other developers

### 2. **API Service Files Created**

#### TypeScript Service (`src/services/api.ts`)
- Centralized API client for React components
- Type-safe API calls with generic request wrapper
- Pre-configured endpoints for all controllers:
  - `apiClient.admin.*`
  - `apiClient.plants.*`
  - `apiClient.categories.*`
  - `apiClient.clients.*`
  - `apiClient.cartItems.*`
  - `apiClient.deliveries.*`
  - `apiClient.requests.*`

#### JavaScript Service (`shared/api.js`)
- API functions for vanilla JavaScript files
- Same endpoint coverage as TypeScript version
- Drop-in usage for existing HTML pages

### 3. **Authentication Updated**
- Updated Admin Auth system (`Admin/Auth/auth.js`) to use API service
- Added Sign Up functionality with API integration
- Updated `signin.html` and `signup.html` to import API service
- Admin users can now register and login via backend

## 🚀 Quick Start

### Step 1: Start Your Backend
```bash
cd BackEnd/WebAPIwithDapper/API
dotnet run
```
Backend will run on: `http://localhost:5007`

### Step 2: Start Your Frontend
```bash
cd FrontEnd
npm install  # if not already done
npm run dev
```

### Step 3: Test Authentication
1. Go to Admin Sign In page (Admin/Auth/signin.html)
2. Create a new admin account via Sign Up
3. Sign in with your credentials
4. You should be redirected to the Dashboard

## 📖 Usage in Your Code

### For React/TypeScript Files:
```typescript
import { apiClient } from '@/services/api';

// Get all plants
const plants = await apiClient.plants.getAll();

// Get plant by ID
const plant = await apiClient.plants.getById(1);

// Create new plant
await apiClient.plants.create({
  name: 'Rose Plant',
  price: 150,
  category_id: 1
});
```

### For Vanilla JavaScript Files:
```html
<script src="../../shared/api.js"></script>

<script>
  // Get all plants
  const plants = await plantsAPI.getAll();

  // Create new plant
  await plantsAPI.create({
    name: 'Rose Plant',
    price: 150,
    category_id: 1
  });
</script>
```

## 🎯 Next: Update Your Pages

Replace hardcoded data with API calls in:

1. **Plant Catalog** (`Shopage/Shoppage.js`)
   ```javascript
   const plants = await plantsAPI.getAll();
   // Instead of hardcoded plant array
   ```

2. **Landing Page** (`LandingPage/landingpage.js`)
   ```javascript
   const featuredPlants = await plantsAPI.getAll();
   // Instead of hardcoded arrays
   ```

3. **Cart Page** (`CartPage/`)
   - Use `cartItemsAPI` to manage cart items

4. **Reservation** (`Reservation/`)
   - Use `requestsAPI` for reservations

5. **Order Page** (`OrderPage/`)
   - Use `plantsAPI` and `cartItemsAPI`

6. **Admin Pages** (`Admin/`)
   - Dashboard: Use various APIs for stats
   - Plant Catalog: Use `plantsAPI`
   - Delivery: Use `deliveriesAPI`
   - Reservation: Use `requestsAPI`

## 🔐 Backend Configuration

Your backend already has:
✅ CORS enabled for development
✅ Swagger UI at `http://localhost:5007/swagger`
✅ All controllers configured with standard CRUD routes

### Backend Controllers Available:
- `AdminController` → `/api/admin`
- `PlantController` → `/api/plant`
- `CategoryController` → `/api/category`
- `ClientController` → `/api/client`
- `CartItemController` → `/api/cartitem`
- `DeliveryController` → `/api/delivery`
- `RequestController` → `/api/request`
- `PlantSizeController` → `/api/plantsize`
- `AdminLogController` → `/api/adminlog`
- `RequestPlantController` → `/api/requestplant`
- `ReviewController` → `/api/review`

## ⚠️ Important Notes

1. **Password Security**: The current sign-up stores passwords as plain text. For production:
   - Hash passwords on the backend before storing
   - Use JWT tokens instead of localStorage

2. **CORS**: Currently allows all origins. For production, restrict to your domain in `Program.cs`

3. **Error Handling**: All API calls should be in try-catch blocks

4. **API Base URL**: Configured in `.env.local`. Change port if needed.

## 📚 Detailed Documentation

See `API_INTEGRATION.md` for:
- Full API endpoint reference
- Code examples
- Troubleshooting guide
- How to add new endpoints

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Cannot connect to API | Check backend is running on port 5007 |
| CORS errors | Already enabled in backend, refresh page |
| 404 Not Found | Verify controller name matches in backend |
| Sign up/login fails | Check admin data in backend database |

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Check backend console for validation errors
3. Verify backend is running: `http://localhost:5007/swagger`
4. Check network tab in DevTools to see actual API calls

---

**Your frontend is now fully connected to your backend!** 🎉
