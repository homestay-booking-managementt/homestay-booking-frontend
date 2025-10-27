import type { FeatureKey } from "@/constants/feature";
import { Permission } from "@/permission/Permision";

/**
 * PermissionWrapper
 * 
 * Wrapper function for protecting entire routes with permission checks.
 * Use this when defining routes to ensure only authorized users can access them.
 * 
 * @param featureKey - The feature key required to access the route
 * @param element - The JSX element/component to render if permission is granted
 * @returns JSX element wrapped in Permission component
 * 
 * @example
 * // In your routes configuration
 * import { PermissionWrapper } from '@/routes/PermissionWrapper';
 * import { FeatureKey } from '@/constants/feature';
 * import AdminPage from '@/pages/AdminPage';
 * 
 * const routes = [
 *   {
 *     path: '/admin',
 *     element: PermissionWrapper(FeatureKey.ADMIN, <AdminPage />),
 *   },
 *   {
 *     path: '/blog/create',
 *     element: PermissionWrapper(FeatureKey.BLOG_CREATE, <BlogCreate />),
 *   },
 * ];
 * 
 * @example
 * // With custom fallback
 * const routes = [
 *   {
 *     path: '/admin',
 *     element: (
 *       <Permission 
 *         featureKey={FeatureKey.ADMIN}
 *         fallback={<Navigate to="/unauthorized" />}
 *       >
 *         <AdminPage />
 *       </Permission>
 *     ),
 *   },
 * ];
 */
export const PermissionWrapper = (
    featureKey: FeatureKey,
    element: JSX.Element
): JSX.Element => {
    return (
        <Permission featureKey={featureKey}>
            {element}
        </Permission>
    );
};
