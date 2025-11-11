import { useAppSelector } from "@/app/hooks";
import React from "react";

/**
 * usePermission Hook
 *
 * Custom hook for checking permissions programmatically in components.
 * Useful when you need to conditionally execute logic based on permissions,
 * rather than just rendering UI.
 *
 * @param featureKey - The feature key to check permission for (from FeatureKey enum)
 * @param ownerId - Optional owner ID for ownership verification
 * @returns Object with hasPermission and checkOwner boolean values
 *
 * @example
 * // Basic usage
 * const { hasPermission } = usePermission(FeatureKey.BLOG_EDIT);
 *
 * if (!hasPermission) {
 *   return <div>No permission</div>;
 * }
 *
 * @example
 * // With ownership check
 * const { hasPermission, checkOwner } = usePermission(FeatureKey.BLOG_EDIT, post.authorId);
 *
 * const canEdit = hasPermission && checkOwner;
 *
 * return (
 *   <button disabled={!canEdit} onClick={handleEdit}>
 *     Edit
 *   </button>
 * );
 *
 * @example
 * // Complex logic
 * const { hasPermission: canExport } = usePermission(FeatureKey.REPORT_EXPORT);
 *
 * const handleExport = () => {
 *   if (!canExport) {
 *     alert('No permission to export');
 *     return;
 *   }
 *   // Export logic...
 * };
 */
const usePermission = (featureKey: string, ownerId?: number) => {
  const permissions = useAppSelector((store) => store.auth.permissions);
  const currentUser = useAppSelector((store) => store.auth.currentUser);

  /**
   * Check if user has the feature permission
   */
  const hasPermission = React.useMemo(() => {
    if (!featureKey) return false;
    if (!permissions || permissions[featureKey] === undefined) return false;
    return permissions[featureKey].can_access;
  }, [permissions, featureKey]);

  /**
   * Check if user passes ownership verification
   * Returns true if:
   * - Permission doesn't require owner check
   * - No ownerId provided and permission doesn't require owner check
   * - Current user is the owner
   */
  const checkOwner = React.useMemo(() => {
    if (!featureKey) return false;
    if (!permissions || permissions[featureKey] === undefined) return false;

    // If permission doesn't require owner check, allow access
    if (!permissions[featureKey].must_check_owner) return true;

    // If owner ID not provided and owner check is required, deny access
    if (ownerId === undefined || ownerId === null) return false;

    // Check if current user is the owner
    return currentUser.userId === ownerId;
  }, [permissions, featureKey, ownerId, currentUser]);

  return { hasPermission, checkOwner };
};

export default usePermission;
