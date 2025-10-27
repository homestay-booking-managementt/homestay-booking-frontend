# Project Structure Documentation

## Overview
This is a React + TypeScript + Vite application with all core features set up, including:
- Authentication (JWT-based)
- Routing (React Router v6)
- State Management (Redux Toolkit)
- HTTP Client (Axios with interceptors)
- Styling (Bootstrap 5)

## Directory Structure

```
new/
├── src/
│   ├── api/                    # API service layer
│   │   └── exampleApi.ts       # Example API service
│   ├── app/                    # Redux store configuration
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   └── store.ts            # Store setup and configuration
│   ├── auth/                   # Authentication
│   │   ├── authSlice.ts        # Auth Redux slice
│   │   ├── Login.tsx           # Login page component
│   │   └── PrivateRoute.tsx    # Protected route wrapper
│   ├── components/             # Reusable components
│   │   └── Header/             # Header component
│   ├── config/                 # App configuration
│   │   └── index.ts            # Config constants
│   ├── hooks/                  # Custom React hooks
│   │   ├── useClickAway.ts     # Detect clicks outside
│   │   ├── useDebounce.ts      # Debounce values
│   │   └── useLocalStorage.ts  # Persist to localStorage
│   ├── pages/                  # Page components
│   │   ├── DashboardHome/      # Dashboard home page
│   │   ├── DashboardPage/      # Dashboard layout
│   │   ├── error/              # Error pages
│   │   └── HomePage.tsx        # Landing page
│   ├── routes/                 # Route definitions
│   │   └── index.tsx           # Main router
│   ├── styles/                 # Global styles
│   │   └── index.scss          # Main stylesheet
│   ├── types/                  # TypeScript types
│   │   └── request.ts          # Request-related types
│   ├── utils/                  # Utility functions
│   │   ├── removeTokens.ts     # Token cleanup
│   │   ├── sendRequest.ts      # Axios wrapper
│   │   └── showAlert.ts        # Notification helper
│   ├── App.tsx                 # Main App component
│   ├── axiosConfig.ts          # Axios configuration & interceptors
│   ├── main.tsx                # App entry point
│   └── vite-env.d.ts           # Vite type definitions
├── .env                        # Environment variables
├── .env.example                # Environment template
├── .eslintrc.cjs               # ESLint configuration
├── .gitignore                  # Git ignore rules
├── .prettierrc                 # Prettier configuration
├── index.html                  # HTML template
├── package.json                # Dependencies & scripts
├── README.md                   # Project documentation
├── tsconfig.json               # TypeScript config
├── tsconfig.node.json          # TypeScript config for node
└── vite.config.ts              # Vite configuration
```

## Key Features

### 1. Authentication System
- **Location**: `src/auth/`
- JWT-based authentication with refresh token
- Token auto-refresh on 401 responses
- Protected routes
- Login page with form validation

**Usage**:
```typescript
import { useAppDispatch } from '@/app/hooks';
import { loginRequest } from '@/auth/authSlice';

const dispatch = useAppDispatch();
await dispatch(loginRequest({ username, password }));
```

### 2. Routing
- **Location**: `src/routes/`
- Public routes (login, error pages)
- Private routes (dashboard, etc.)
- Nested routes support
- 404 and error handling

**Adding a new route**:
```typescript
// In src/routes/index.tsx
const PrivateRoutes = [{
    element: <PrivateRoute />,
    children: [
        {
            path: "/new-page",
            element: <NewPage />,
        },
    ],
}];
```

### 3. API Services
- **Location**: `src/api/`
- Centralized API services
- Type-safe requests
- Error handling

**Creating an API service**:
```typescript
// src/api/userApi.ts
import { sendRequest } from '@/utils/sendRequest';

export const userApi = {
  getUsers: () => sendRequest('/users', { method: 'GET' }),
  createUser: (data: User) => sendRequest('/users', { method: 'POST', payload: data }),
};
```

### 4. State Management
- **Location**: `src/app/`
- Redux Toolkit
- Type-safe hooks
- Slice-based architecture

**Creating a slice**:
```typescript
// src/features/example/exampleSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export const exampleSlice = createSlice({
  name: 'example',
  initialState: { data: [] },
  reducers: {
    setData: (state, action) => {
      state.data = action.payload;
    },
  },
});
```

### 5. HTTP Client (Axios)
- **Location**: `src/axiosConfig.ts`, `src/utils/sendRequest.ts`
- Auto token injection
- Refresh token mechanism
- Request/response interceptors
- Error handling with notifications

**Making requests**:
```typescript
import { sendRequest } from '@/utils/sendRequest';

// GET request
const data = await sendRequest('/api/items', { method: 'GET' });

// POST request
const result = await sendRequest('/api/items', {
  method: 'POST',
  payload: { name: 'Item' }
});
```

### 6. Custom Hooks
- **Location**: `src/hooks/`
- `useDebounce` - Debounce values
- `useLocalStorage` - Persist state
- `useClickAway` - Detect outside clicks

**Example**:
```typescript
import { useDebounce } from '@/hooks/useDebounce';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);
```

### 7. Notifications
- **Location**: `src/utils/showAlert.ts`
- Toast notifications
- Multiple types (success, error, warning, info)
- Customizable duration

**Usage**:
```typescript
import { showAlert } from '@/utils/showAlert';

showAlert('Success!', 'success');
showAlert('Error occurred', 'danger', { dismiss: { duration: 5000 } });
```

## Configuration

### Environment Variables
Create a `.env` file in the root:
```env
VITE_APP_BASE_URL=http://localhost:8000/api
```

### Path Aliases
TypeScript path alias `@/` points to `src/`:
```typescript
import { sendRequest } from '@/utils/sendRequest';
import Header from '@/components/Header';
```

## Development Workflow

1. **Install dependencies**:
   ```bash
   cd new
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

4. **Type checking**:
   ```bash
   npm run type-check
   ```

5. **Linting**:
   ```bash
   npm run lint
   npm run lint:fix
   ```

## Best Practices

### 1. Component Structure
- One component per file
- Use TypeScript interfaces for props
- Export as default for pages, named for utilities

### 2. State Management
- Use Redux for global state
- Use local state for component-specific data
- Create slices for related functionality

### 3. API Calls
- Centralize API calls in `src/api/`
- Use `sendRequest` utility
- Handle errors at the service layer

### 4. Styling
- Use Bootstrap classes
- Create custom SCSS modules for complex components
- Follow BEM naming convention for custom classes

### 5. Type Safety
- Define interfaces for all data structures
- Use TypeScript strict mode
- Avoid `any` type when possible

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Import in routes file

### Adding Authentication to a Route
Wrap route with `PrivateRoute`:
```typescript
{
  element: <PrivateRoute />,
  children: [
    { path: "/protected", element: <ProtectedPage /> }
  ]
}
```

### Creating a Redux Slice
1. Create slice in appropriate feature folder
2. Add to store in `src/app/store.ts`
3. Use with typed hooks from `src/app/hooks.ts`

## Troubleshooting

### Port Already in Use
Change port in `vite.config.ts`:
```typescript
server: {
  port: 3200, // Change to desired port
}
```

### Module Resolution Issues
Check `tsconfig.json` path aliases match your structure.

### Token Issues
Clear localStorage and login again:
```javascript
localStorage.clear();
```

## Next Steps

1. Customize the authentication flow
2. Add more API services
3. Create additional pages and components
4. Set up testing (Vitest already configured)
5. Add more Redux slices as needed
6. Customize styling and theme
