import { useAppSelector } from "@/app/hooks";

type PermissionProps = {
  /**
   * Feature key(s) to check permission for.
   * Can be a single string or array of strings (OR logic).
   * Must match keys from FeatureKey enum.
   */
  featureKey?: string | string[];

  /**
   * Optional fallback UI to render when permission is denied.
   * If not provided, nothing will be rendered.
   */
  fallback?: React.ReactNode;

  /**
   * Content to render if permission is granted.
   */
  children: React.ReactNode;

  /**
   * Optional owner ID for ownership verification.
   * Used when permission requires checking if current user is the owner.
   */
  ownerId?: number;
};

/**
 * Permission Component
 *
 * Conditionally renders children based on user permissions.
 *
 * @example
 * // Simple usage
 * <Permission featureKey={FeatureKey.BLOG_EDIT}>
 *   <button>Edit</button>
 * </Permission>
 *
 * @example
 * // With fallback
 * <Permission
 *   featureKey={FeatureKey.ADMIN}
 *   fallback={<div>Access Denied</div>}
 * >
 *   <AdminPanel />
 * </Permission>
 *
 * @example
 * // With ownership check
 * <Permission
 *   featureKey={FeatureKey.BLOG_EDIT}
 *   ownerId={post.authorId}
 * >
 *   <button>Edit</button>
 * </Permission>
 *
 * @example
 * // Multiple permissions (OR logic)
 * <Permission featureKey={[FeatureKey.BLOG_EDIT, FeatureKey.ADMIN]}>
 *   <button>Edit</button>
 * </Permission>
 */
export const Permission: React.FC<PermissionProps> = ({
  featureKey,
  fallback,
  children,
  ownerId,
}) => {
  const permissions = useAppSelector((state) => state.auth.permissions);
  const currentUser = useAppSelector((store) => store.auth.currentUser);

  /**
   * Check if user has permission for a given feature key
   */
  const hasPermission = (key?: string): boolean => {
    if (!key) return false;
    if (!permissions || permissions[key] === undefined) return false;
    return permissions[key].can_access;
  };

  /**
   * Check if user passes ownership verification
   */
  const checkOwner = (key?: string, ownerId?: number): boolean => {
    if (!key) return false;
    if (!permissions || permissions[key] === undefined) return false;

    // If permission doesn't require owner check, allow access
    if (!permissions[key].must_check_owner) return true;

    // If owner ID not provided, deny access (when must_check_owner is true)
    if (ownerId === undefined || ownerId === null) return false;

    // Check if current user is the owner
    return currentUser.userId === ownerId;
  };

  // Handle array of feature keys (OR logic)
  if (Array.isArray(featureKey)) {
    const hasAnyPermission = featureKey.some(
      (key) => hasPermission(key) && checkOwner(key, ownerId)
    );
    return hasAnyPermission ? <>{children}</> : <>{fallback || null}</>;
  }

  // Handle single feature key
  const canAccess = hasPermission(featureKey) && checkOwner(featureKey, ownerId);
  return canAccess ? <>{children}</> : <>{fallback || null}</>;
};
