# How to Use This Project with AI Assistant

## Initial Setup Instructions

When you first open this project in a new workspace, tell the AI:

```
I have a new React + TypeScript + Vite project that was initialized with:
- Redux Toolkit for state management
- React Router v6 for routing
- Axios with JWT authentication
- Bootstrap 5 for styling

The core structure is set up with:
- Authentication system (JWT with refresh tokens)
- Protected routes
- Axios interceptors for auto token injection/refresh
- Redux store with auth slice
- Basic pages (Home, Login, Dashboard)
- Utility functions (sendRequest, showAlert, removeTokens)
- Custom hooks (useDebounce, useLocalStorage, useClickAway)

Please help me [YOUR SPECIFIC TASK]
```

## Common Tasks to Ask For

### 1. Setting Up the Project
```
Install the dependencies and start the development server
```

### 2. Adding a New Feature
```
Create a user management page with:
- A table showing users
- Add/Edit/Delete functionality
- API integration using the existing sendRequest utility
- Redux slice for user state
```

### 3. Creating API Services
```
Create an API service for managing products with CRUD operations:
- GET /api/products
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id

Use the existing sendRequest utility and follow the pattern in exampleApi.ts
```

### 4. Adding New Pages/Routes
```
Add a new "Settings" page with:
- User profile editing
- Password change form
- Protected route
- Add it to the navigation header
```

### 5. Creating Components
```
Create a reusable DataTable component with:
- Sorting
- Pagination
- Search functionality
- TypeScript props interface
```

### 6. Adding Redux Slices
```
Create a Redux slice for notifications with:
- Actions to add/remove notifications
- Selectors to get notifications
- Integration with the existing store
```

### 7. Styling/UI
```
Update the login page to match this design [description]
Use Bootstrap 5 classes and custom SCSS if needed
```

### 8. Backend Integration
```
My backend API runs at http://localhost:8000
Update the configuration and test the login flow
The API expects: POST /auth/login with { username, password }
And returns: { idToken, refreshToken }
```

## Pro Tips for Working with AI

### Be Specific
❌ **Bad:** "Add a form"
✅ **Good:** "Create a user registration form with fields: email, password, confirm password, and name. Add validation and integrate with POST /api/users endpoint"

### Reference Existing Patterns
✅ "Create a products API service following the same pattern as exampleApi.ts"
✅ "Add a new Redux slice similar to authSlice but for managing app settings"

### Provide Context
✅ "The backend API uses snake_case for field names but our frontend uses camelCase. Create a utility to transform the data"

### Ask for Complete Solutions
✅ "Create a complete todo feature including: API service, Redux slice, list page, add/edit modal, and routes"

## Quick Start Template

When you first open the project, you might say:

```
I just copied this React project. Here's what I need:

1. First, install dependencies and verify everything works
2. My backend API is at http://localhost:5000/api
3. The login endpoint is POST /auth/login and expects: { email, password }
4. After login, I need to build a dashboard that shows:
   - Total users count
   - Recent activities list
   - Quick action buttons

The API endpoints are:
- GET /api/dashboard/stats
- GET /api/activities?limit=10

Please help me set this up step by step.
```

## What This Project Already Has

You can reference these existing features when asking for help:

### Utilities
- ✅ `sendRequest()` - Wrapper for API calls with error handling
- ✅ `showAlert()` - Toast notifications (success, error, warning, info)
- ✅ `removeTokens()` - Clean up authentication tokens

### Redux
- ✅ `useAppDispatch()` - Type-safe dispatch hook
- ✅ `useAppSelector()` - Type-safe selector hook
- ✅ `authSlice` - Authentication state management

### Custom Hooks
- ✅ `useDebounce` - Debounce values (e.g., search input)
- ✅ `useLocalStorage` - Persist state to localStorage
- ✅ `useClickAway` - Detect clicks outside an element

### Components
- ✅ `Header` - Navigation header with logout
- ✅ `PrivateRoute` - Protected route wrapper
- ✅ `ErrorPage` - Error pages (404, 403, 401)

### Authentication
- ✅ JWT token management with auto-refresh
- ✅ Token injection via Axios interceptors
- ✅ Login page and flow
- ✅ Protected routes

### Configuration
- ✅ TypeScript with strict mode
- ✅ Path aliases (`@/*` points to `src/*`)
- ✅ Bootstrap 5 integrated
- ✅ ESLint + Prettier configured
- ✅ Environment variables support

## Example Requests

### Creating a New Feature
```
Create a complete blog post management feature:

1. API Service (src/api/blogApi.ts):
   - GET /api/posts - list all posts
   - GET /api/posts/:id - get single post
   - POST /api/posts - create post
   - PUT /api/posts/:id - update post
   - DELETE /api/posts/:id - delete post

2. Redux Slice (src/features/blog/blogSlice.ts):
   - Store posts list
   - Store current post
   - Loading states
   - Error handling

3. Pages:
   - BlogList page with table, search, and pagination
   - BlogForm page for create/edit
   - BlogDetail page to view single post

4. Routes:
   - /blog - list page (protected)
   - /blog/new - create page (protected)
   - /blog/:id - detail page (protected)
   - /blog/:id/edit - edit page (protected)

Use the existing patterns and utilities. The API returns data in this format:
{
  posts: [...],
  total: 100,
  page: 1,
  pageSize: 10
}
```

### Integrating with Existing Backend
```
I need to integrate with my existing backend:
- Base URL: http://api.myapp.com
- Auth endpoint: POST /v1/auth/signin
- Request body: { email: string, password: string }
- Response: { access_token: string, refresh_token: string, user: {...} }

Update the authentication flow to work with this API:
1. Update axios config
2. Update auth slice to handle the response format
3. Update login page
4. Test the flow
```

### Adding Complex Components
```
Create a reusable Modal component with:
- Props: isOpen, onClose, title, children, footer
- Close on backdrop click (optional)
- Close on ESC key
- Animated transitions
- TypeScript types
- Bootstrap styling
- Usage example in a separate file

Also create a useModal hook to manage modal state easily.
```

### Improving Existing Code
```
The current login page is very basic. Improve it with:
- Better styling and layout
- Form validation (required fields, email format)
- Show/hide password toggle
- Loading state during login
- Remember me checkbox (store username in localStorage)
- Forgot password link
- Better error messages
```

## File Structure Reference

```
src/
├── api/              # API service layer - Add new API services here
├── app/              # Redux store - Add new slices to store.ts
├── auth/             # Authentication logic
├── components/       # Reusable components
├── config/           # Configuration constants
├── features/         # Feature-specific code (create new folders here)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── routes/           # Route definitions - Update index.tsx for new routes
├── styles/           # Global styles
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main app component
├── axiosConfig.ts    # Axios configuration
└── main.tsx          # Entry point
```

## Common Patterns to Follow

### API Service Pattern
```typescript
// src/api/resourceApi.ts
import { sendRequest } from '@/utils/sendRequest';

export const resourceApi = {
  getAll: () => sendRequest('/resources', { method: 'GET' }),
  getById: (id: number) => sendRequest(`/resources/${id}`, { method: 'GET' }),
  create: (data: Resource) => sendRequest('/resources', { method: 'POST', payload: data }),
  update: (id: number, data: Resource) => sendRequest(`/resources/${id}`, { method: 'PUT', payload: data }),
  delete: (id: number) => sendRequest(`/resources/${id}`, { method: 'DELETE' }),
};
```

### Redux Slice Pattern
```typescript
// src/features/resource/resourceSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { resourceApi } from '@/api/resourceApi';

export const fetchResources = createAsyncThunk(
  'resource/fetchAll',
  async (_, thunkApi) => {
    return resourceApi.getAll();
  }
);

export const resourceSlice = createSlice({
  name: 'resource',
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});
```

### Component Pattern
```typescript
// src/components/MyComponent/MyComponent.tsx
interface MyComponentProps {
  title: string;
  onAction: () => void;
}

const MyComponent = ({ title, onAction }: MyComponentProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <button onClick={onAction}>Action</button>
    </div>
  );
};

export default MyComponent;
```

## Troubleshooting with AI

### TypeScript Errors
```
I'm getting TypeScript errors in [file]. The error says: [error message]
Please help me fix it.
```

### API Integration Issues
```
The API call to [endpoint] is failing with [error].
My backend expects [format] but I'm sending [format].
Help me debug this.
```

### State Management Issues
```
I need to share [data] between [Component A] and [Component B].
Should I use Redux or props? Help me implement the best solution.
```

### Routing Issues
```
I need to protect the /admin routes so only users with isAdmin=true can access them.
Update the PrivateRoute component to support role-based access.
```

## Best Practices

1. **Always specify patterns**: "Use the existing sendRequest utility" or "Follow the pattern in exampleApi.ts"

2. **Provide API details**: Include endpoint paths, request/response formats, and authentication requirements

3. **Request tests**: "Also create a test for this component using the existing test setup"

4. **Ask for documentation**: "Add JSDoc comments to explain the parameters and return values"

5. **Request error handling**: "Add proper error handling with showAlert notifications"

6. **Type safety**: "Create TypeScript interfaces for all data structures"

## Resources

- **STRUCTURE.md** - Detailed project structure documentation
- **QUICKSTART.md** - Quick start guide
- **README.md** - Project overview

---

**Remember**: The more specific and detailed your request, the better the AI can help you! 🚀
