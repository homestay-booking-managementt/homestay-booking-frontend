# Permission System - Quick Start Guide

## 🚀 What's Been Implemented

The complete permission system has been set up in your project with the following components:

### ✅ Core Files Created

1. **`src/constants/feature.ts`** - All permission keys enum
2. **`src/permission/Permision.tsx`** - Permission component for UI protection
3. **`src/hooks/usePermission.ts`** - Hook for programmatic permission checks
4. **`src/routes/PermissionWrapper.tsx`** - Route protection wrapper
5. **`src/auth/authSlice.ts`** - Updated with permissions support
6. **`src/utils/mockAuth.ts`** - Updated with mock permissions data

### 📚 Example Files Created

1. **`src/examples/PermissionExamples.tsx`** - 10 usage examples
2. **`src/examples/RouteExamples.tsx`** - Route protection examples

## 🎯 Quick Usage

### 1. Protect UI Elements

```tsx
import { Permission } from '@/permission/Permision';
import { FeatureKey } from '@/constants/feature';

<Permission featureKey={FeatureKey.BLOG_EDIT}>
  <button>Edit</button>
</Permission>
```

### 2. Protect Routes

```tsx
import { PermissionWrapper } from '@/routes/PermissionWrapper';
import { FeatureKey } from '@/constants/feature';

const routes = [
  {
    path: '/admin',
    element: PermissionWrapper(FeatureKey.ADMIN, <AdminPage />),
  }
];
```

### 3. Use in Logic

```tsx
import usePermission from '@/hooks/usePermission';
import { FeatureKey } from '@/constants/feature';

const { hasPermission, checkOwner } = usePermission(FeatureKey.BLOG_EDIT, ownerId);

if (hasPermission && checkOwner) {
  // Do something
}
```

## 🔑 Mock Authentication

The system is pre-configured with mock authentication:

- **Username**: `2dawng`
- **Password**: `1234`
- **Role**: Admin (full permissions)

### Mock Permissions

The mock auth returns two permission sets:

1. **Admin** - Full access to all features
2. **Regular User** - Limited access (can view, create own, edit/delete own)

## 📖 Available Permission Keys

Check `src/constants/feature.ts` for all available keys. Some examples:

```typescript
FeatureKey.BLOG_VIEW
FeatureKey.BLOG_CREATE
FeatureKey.BLOG_EDIT
FeatureKey.ADMIN
FeatureKey.HOMESTAY_CREATE
FeatureKey.BOOKING_APPROVE
// ... and many more
```

## 🎨 Common Patterns

### With Ownership Check

```tsx
<Permission 
  featureKey={FeatureKey.BLOG_EDIT}
  ownerId={post.authorId}
>
  <button>Edit</button>
</Permission>
```

### Multiple Permissions (OR Logic)

```tsx
<Permission featureKey={[FeatureKey.BLOG_EDIT, FeatureKey.ADMIN]}>
  <button>Edit</button>
</Permission>
```

### With Fallback

```tsx
<Permission 
  featureKey={FeatureKey.ADMIN}
  fallback={<div>Access Denied</div>}
>
  <AdminPanel />
</Permission>
```

## 🔄 Integration with Real Backend

When ready to connect to your real backend API:

1. Update `src/auth/authSlice.ts` - uncomment real API calls
2. Ensure your backend returns this structure:

```json
{
  "user": {
    "id": 123,
    "user_name": "john",
    "role_id": 2,
    "is_admin": false,
    "is_active": true
  },
  "role_permissions": {
    "blog.view": {
      "can_access": true,
      "must_check_owner": false
    },
    "blog.edit": {
      "can_access": true,
      "must_check_owner": true
    }
  }
}
```

## 📝 Next Steps

1. **Test the System**: Login with `2dawng/1234` and see permissions in action
2. **Check Examples**: Review `src/examples/PermissionExamples.tsx`
3. **Update Routes**: Apply `PermissionWrapper` to your routes
4. **Protect UI**: Add `<Permission>` components where needed
5. **Add More Keys**: Update `FeatureKey` enum as your app grows

## 🐛 Troubleshooting

### Permissions not working?

1. Check if logged in: Permissions only work for authenticated users
2. Check Redux state: Open Redux DevTools and verify `state.auth.permissions`
3. Check feature key: Must match exactly with backend (case-sensitive)
4. Console log: Add `console.log(permissions)` in your component

### Always denied access?

1. Verify `can_access: true` in permissions object
2. Check ownership if using `ownerId` prop
3. Ensure current user ID matches owner ID

## 📚 Documentation

For detailed documentation, see:
- **`PERMISSION_SYSTEM.md`** - Complete guide with all details
- **`src/examples/PermissionExamples.tsx`** - 10 practical examples
- **`src/examples/RouteExamples.tsx`** - Route protection examples

## 🎉 You're Ready!

The permission system is fully implemented and ready to use. Start protecting your routes and UI elements with role-based access control!
