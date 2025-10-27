/**
 * Permission System - Barrel Export
 * 
 * This file provides convenient exports for the entire permission system.
 * Import everything you need from this single file.
 * 
 * @example
 * import { Permission, usePermission, PermissionWrapper, FeatureKey } from '@/permission';
 */

// Main Permission Component
export { Permission } from './Permision';

// Re-export for convenience
export { default as usePermission } from '@/hooks/usePermission';
export { PermissionWrapper } from '@/routes/PermissionWrapper';
export { FeatureKey } from '@/constants/feature';

// Type exports for TypeScript users
export type { IPermission } from '@/auth/authSlice';
