# Quick Start Guide

## Initial Setup

### 1. Navigate to the project directory

```bash
cd sth
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
# The .env file is already created with default values
# Update it if your backend API runs on a different URL
cat .env
```

### 4. Start development server

```bash
npm run dev
```

The application will open at `http://localhost:3200`

## Project Structure

```
new/
├── src/
│   ├── api/              # API service layer
│   ├── app/              # Redux store
│   ├── auth/             # Authentication
│   ├── components/       # Reusable components
│   ├── config/           # Configuration
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   ├── routes/           # Routing
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript types
│   ├── utils/            # Utilities
│   ├── App.tsx           # Main app
│   ├── axiosConfig.ts    # Axios setup
│   └── main.tsx          # Entry point
├── .env                  # Environment variables
├── package.json          # Dependencies
├── vite.config.ts        # Vite config
└── tsconfig.json         # TypeScript config
```

## Core Features

### ✅ Authentication

- JWT-based with refresh tokens
- Auto token refresh on 401
- Protected routes
- Login page at `/login`

### ✅ Routing

- React Router v6
- Public and private routes
- Error pages (404, 403, 401)
- Nested routing support

### ✅ State Management

- Redux Toolkit
- Type-safe hooks (`useAppDispatch`, `useAppSelector`)
- Auth slice included

### ✅ HTTP Client

- Axios with interceptors
- Auto token injection
- Error handling
- Request tracking

### ✅ Configuration

- TypeScript path aliases (`@/*`)
- Environment variables
- ESLint + Prettier
- Bootstrap 5

### ✅ Custom Hooks

- `useDebounce` - Debounce values
- `useLocalStorage` - Persist state
- `useClickAway` - Detect outside clicks

### ✅ Utilities

- `sendRequest` - API wrapper
- `showAlert` - Toast notifications
- `removeTokens` - Auth cleanup

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format with Prettier
npm run type-check   # Check TypeScript types
```

## Pages Included

- `/` - Home page (public/protected)
- `/login` - Login page
- `/dashboard` - Dashboard layout with header
- `/404` - Not found page
- `/403` - Permission denied page
- `/401` - Unauthorized page

## Quick Examples

### Making an API Request

```typescript
import { sendRequest } from "@/utils/sendRequest";

const data = await sendRequest("/api/users", { method: "GET" });
```

### Using Redux

```typescript
import { useAppSelector, useAppDispatch } from "@/app/hooks";

const user = useAppSelector((state) => state.auth.currentUser);
const dispatch = useAppDispatch();
```

### Showing Notifications

```typescript
import { showAlert } from "@/utils/showAlert";

showAlert("Success!", "success");
showAlert("Error", "danger");
```

### Protected Route

```typescript
// Routes are already set up with PrivateRoute wrapper
// Just add your page to the PrivateRoutes array in routes/index.tsx
```

## Environment Variables

Required in `.env`:

```env
VITE_APP_BASE_URL=http://localhost:8000/api
```

## Next Steps

1. ✅ **Project is ready to use!**
2. Update API base URL in `.env` if needed
3. Customize login page styling
4. Add more pages and routes
5. Create API services in `src/api/`
6. Add Redux slices for your features
7. Build your components

## Documentation

- Full structure guide: `STRUCTURE.md`
- Main README: `README.md`

## Troubleshooting

### TypeScript Errors

TypeScript compilation errors will resolve after running `npm install` and starting the dev server.

### Port Already in Use

Change port in `vite.config.ts` (currently set to 3200).

### Token Issues

Clear localStorage: `localStorage.clear()` in browser console.

## Tech Stack

- ⚛️ React 18
- 📘 TypeScript
- ⚡ Vite
- 🎨 Bootstrap 5
- 🔄 Redux Toolkit
- 🛣️ React Router v6
- 📡 Axios
- 🎯 JWT Authentication

---

**The project is fully initialized and ready to use!** 🚀
