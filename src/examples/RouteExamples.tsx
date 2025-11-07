/**
 * Example Routes Configuration with Permission Protection
 *
 * This file demonstrates how to protect routes using the PermissionWrapper.
 * Copy and modify these examples for your actual route configuration.
 */

import { PermissionWrapper } from "@/routes/PermissionWrapper";
import { FeatureKey } from "@/constants/feature";

// Import your page components (examples)
// import HomePage from '@/pages/HomePage';
// import DashboardHome from '@/pages/DashboardHome';
// import AdminPage from '@/pages/AdminPage';
// import BlogList from '@/pages/Blog/BlogList';
// import BlogCreate from '@/pages/Blog/BlogCreate';
// etc...

/**
 * Example route configuration with permission protection
 */
export const exampleRoutes = [
  // ========== Public Routes (No Permission Required) ==========
  {
    path: "/",
    element: <div>Home Page</div>, // Replace with <HomePage />
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
  },
  {
    path: "/register",
    element: <div>Register Page</div>,
  },

  // ========== Protected Dashboard Routes ==========
  {
    path: "/dashboard",
    element: <div>Dashboard</div>, // Protected by auth, but no specific permission
    children: [
      {
        index: true,
        element: <div>Dashboard Home</div>,
      },
      {
        path: "profile",
        element: <div>Profile Page</div>,
      },
    ],
  },

  // ========== Blog Routes ==========
  {
    path: "/blog",
    children: [
      {
        index: true,
        // Anyone can view blog list
        element: PermissionWrapper(FeatureKey.BLOG, <div>Blog List</div>),
      },
      {
        path: "create",
        // Only users with blog.create permission
        element: PermissionWrapper(FeatureKey.BLOG_CREATE, <div>Create Blog Post</div>),
      },
      {
        path: ":id/edit",
        // Only users with blog.edit permission
        // Note: Ownership check happens in the component itself
        element: PermissionWrapper(FeatureKey.BLOG_EDIT, <div>Edit Blog Post</div>),
      },
    ],
  },

  // ========== Admin Routes ==========
  {
    path: "/admin",
    // Protect entire admin section
    element: PermissionWrapper(FeatureKey.ADMIN, <div>Admin Layout</div>),
    children: [
      {
        index: true,
        element: PermissionWrapper(FeatureKey.ADMIN_DASHBOARD, <div>Admin Dashboard</div>),
      },
      {
        path: "users",
        element: PermissionWrapper(FeatureKey.ADMIN_USER_MANAGEMENT, <div>User Management</div>),
      },
      {
        path: "roles",
        element: PermissionWrapper(FeatureKey.ADMIN_ROLE_MANAGEMENT, <div>Role Management</div>),
      },
      {
        path: "permissions",
        element: PermissionWrapper(
          FeatureKey.ADMIN_PERMISSION_MANAGEMENT,
          <div>Permission Management</div>
        ),
      },
    ],
  },

  // ========== Homestay Routes ==========
  {
    path: "/homestays",
    children: [
      {
        index: true,
        // Anyone can view homestay listings
        element: PermissionWrapper(FeatureKey.HOMESTAY_VIEW, <div>Homestay List</div>),
      },
      {
        path: "create",
        // Only hosts can create listings
        element: PermissionWrapper(FeatureKey.HOMESTAY_CREATE, <div>Create Homestay</div>),
      },
      {
        path: ":id/edit",
        // Only hosts can edit their own listings
        element: PermissionWrapper(FeatureKey.HOMESTAY_EDIT, <div>Edit Homestay</div>),
      },
    ],
  },

  // ========== Booking Routes ==========
  {
    path: "/bookings",
    children: [
      {
        index: true,
        element: PermissionWrapper(FeatureKey.BOOKING_VIEW, <div>My Bookings</div>),
      },
      {
        path: "create",
        element: PermissionWrapper(FeatureKey.BOOKING_CREATE, <div>Create Booking</div>),
      },
    ],
  },

  // ========== Host Dashboard Routes ==========
  {
    path: "/host",
    element: PermissionWrapper(FeatureKey.HOST_DASHBOARD, <div>Host Layout</div>),
    children: [
      {
        index: true,
        element: <div>Host Dashboard</div>,
      },
      {
        path: "earnings",
        element: PermissionWrapper(FeatureKey.HOST_EARNINGS, <div>Earnings</div>),
      },
      {
        path: "calendar",
        element: PermissionWrapper(FeatureKey.HOST_CALENDAR, <div>Calendar</div>),
      },
    ],
  },

  // ========== Guest Dashboard Routes ==========
  {
    path: "/guest",
    element: PermissionWrapper(FeatureKey.GUEST_DASHBOARD, <div>Guest Layout</div>),
    children: [
      {
        index: true,
        element: <div>Guest Dashboard</div>,
      },
      {
        path: "bookings",
        element: PermissionWrapper(FeatureKey.GUEST_BOOKINGS, <div>My Bookings</div>),
      },
      {
        path: "favorites",
        element: PermissionWrapper(FeatureKey.GUEST_FAVORITES, <div>Favorites</div>),
      },
    ],
  },

  // ========== Report Routes ==========
  {
    path: "/reports",
    element: PermissionWrapper(FeatureKey.REPORT_VIEW, <div>Reports Layout</div>),
    children: [
      {
        index: true,
        element: <div>Reports List</div>,
      },
      {
        path: "analytics",
        element: PermissionWrapper(FeatureKey.REPORT_ANALYTICS, <div>Analytics</div>),
      },
    ],
  },

  // ========== Settings Routes ==========
  {
    path: "/settings",
    children: [
      {
        index: true,
        element: PermissionWrapper(FeatureKey.SETTINGS_VIEW, <div>Settings</div>),
      },
      {
        path: "system",
        // Only admins can access system settings
        element: PermissionWrapper(FeatureKey.SETTINGS_SYSTEM, <div>System Settings</div>),
      },
    ],
  },

  // ========== Error Routes ==========
  {
    path: "/unauthorized",
    element: <div>Unauthorized - You don't have permission to access this page</div>,
  },
  {
    path: "*",
    element: <div>404 - Page Not Found</div>,
  },
];

/**
 * Alternative: Route protection with custom fallback
 */
import { Permission } from "@/permission/Permision";
import { Navigate } from "react-router-dom";

export const routeWithCustomFallback = {
  path: "/admin/sensitive",
  element: (
    <Permission featureKey={FeatureKey.ADMIN} fallback={<Navigate to="/unauthorized" replace />}>
      <div>Sensitive Admin Page</div>
    </Permission>
  ),
};

/**
 * Alternative: Nested permission checks
 */
export const nestedPermissionRoute = {
  path: "/content",
  // First check: Can view content
  element: PermissionWrapper(
    FeatureKey.CONTENT_VIEW,
    <div>
      <h1>Content Management</h1>

      {/* Second check: Can create content */}
      <Permission featureKey={FeatureKey.CONTENT_CREATE}>
        <button>Create New Content</button>
      </Permission>

      {/* Third check: Can publish content */}
      <Permission featureKey={FeatureKey.CONTENT_PUBLISH}>
        <button>Publish</button>
      </Permission>
    </div>
  ),
};

/**
 * How to use in your actual routes/index.tsx:
 *
 * import { createBrowserRouter } from 'react-router-dom';
 * import { PermissionWrapper } from '@/routes/PermissionWrapper';
 * import { FeatureKey } from '@/constants/feature';
 *
 * export const router = createBrowserRouter([
 *   // ... your routes with PermissionWrapper
 * ]);
 */
