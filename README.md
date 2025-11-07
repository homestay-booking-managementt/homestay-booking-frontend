# New Project

A React + TypeScript + Vite application with Redux Toolkit, React Router, and Axios.

## Features

- ⚛️ React 18 with TypeScript
- ⚡ Vite for fast development
- 🎨 Bootstrap 5 for styling
- 🔄 Redux Toolkit for state management
- 🛣️ React Router v6 for routing
- 🔐 JWT-based authentication
- 📡 Axios for HTTP requests with interceptors
- 🎯 TypeScript path aliases (@/\*)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your API endpoint
```

### Development

```bash
# Start development server (opens on http://localhost:3200)
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── app/              # Redux store configuration
├── auth/             # Authentication components and logic
├── components/       # Reusable components
├── config/           # Configuration files
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── routes/           # Route definitions
├── types/            # TypeScript type definitions
├── utils/            # Utility functions
├── App.tsx           # Main App component
├── main.tsx          # Application entry point
└── axiosConfig.ts    # Axios interceptor configuration
```

## Key Concepts

### Authentication

- JWT-based authentication with refresh token mechanism
- Token stored in localStorage
- Automatic token refresh on 401 responses
- Private routes protected with authentication check

### API Requests

- Centralized axios configuration with interceptors
- Automatic authorization header injection
- Error handling with user notifications
- Request tracking for loading states

### State Management

- Redux Toolkit for global state
- Type-safe hooks (useAppDispatch, useAppSelector)
- Slice-based architecture

### Routing

- React Router v6
- Public and private route separation
- Protected routes with authentication check
- Error pages (404, 403, 401)

## Environment Variables

- `VITE_APP_BASE_URL` - Backend API base URL

## License

Private
