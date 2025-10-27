/**
 * Permission System Demo Component
 * 
 * This component demonstrates the permission system in action.
 * Add this to your app to test the permission system.
 * 
 * Usage:
 * import PermissionDemo from '@/examples/PermissionDemo';
 * 
 * <PermissionDemo />
 */

import { Permission } from "@/permission/Permision";
import usePermission from "@/hooks/usePermission";
import { FeatureKey } from "@/constants/feature";
import { useAppSelector } from "@/app/hooks";

const PermissionDemo = () => {
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const permissions = useAppSelector((state) => state.auth.permissions);
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    // Test various permissions using the hook
    const { hasPermission: canViewBlog } = usePermission(FeatureKey.BLOG);
    const { hasPermission: canCreateBlog } = usePermission(FeatureKey.BLOG_CREATE);
    const { hasPermission: canEditBlog } = usePermission(FeatureKey.BLOG_EDIT);
    const { hasPermission: isAdmin } = usePermission(FeatureKey.ADMIN);
    const { hasPermission: canManageUsers } = usePermission(FeatureKey.ADMIN_USER_MANAGEMENT);
    const { hasPermission: canCreateHomestay } = usePermission(FeatureKey.HOMESTAY_CREATE);
    const { hasPermission: canApproveBooking } = usePermission(FeatureKey.BOOKING_APPROVE);

    if (!isAuthenticated) {
        return (
            <div style={styles.container}>
                <h2>❌ Not Authenticated</h2>
                <p>Please log in to test the permission system.</p>
                <p>Use credentials: <strong>2dawng / 1234</strong></p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1>🔐 Permission System Demo</h1>

            {/* User Info Section */}
            <section style={styles.section}>
                <h2>👤 Current User</h2>
                <div style={styles.infoBox}>
                    <p><strong>User ID:</strong> {currentUser.userId}</p>
                    <p><strong>Username:</strong> {currentUser.userName}</p>
                    <p><strong>Role ID:</strong> {currentUser.roleId}</p>
                    <p><strong>Is Admin:</strong> {currentUser.isAdmin ? '✅ Yes' : '❌ No'}</p>
                    <p><strong>Is Active:</strong> {currentUser.isActive ? '✅ Yes' : '❌ No'}</p>
                </div>
            </section>

            {/* Permissions Overview */}
            <section style={styles.section}>
                <h2>🔑 Permission Check (using usePermission hook)</h2>
                <div style={styles.grid}>
                    <div style={canViewBlog ? styles.hasPermission : styles.noPermission}>
                        {canViewBlog ? '✅' : '❌'} View Blog
                    </div>
                    <div style={canCreateBlog ? styles.hasPermission : styles.noPermission}>
                        {canCreateBlog ? '✅' : '❌'} Create Blog
                    </div>
                    <div style={canEditBlog ? styles.hasPermission : styles.noPermission}>
                        {canEditBlog ? '✅' : '❌'} Edit Blog
                    </div>
                    <div style={isAdmin ? styles.hasPermission : styles.noPermission}>
                        {isAdmin ? '✅' : '❌'} Admin Access
                    </div>
                    <div style={canManageUsers ? styles.hasPermission : styles.noPermission}>
                        {canManageUsers ? '✅' : '❌'} Manage Users
                    </div>
                    <div style={canCreateHomestay ? styles.hasPermission : styles.noPermission}>
                        {canCreateHomestay ? '✅' : '❌'} Create Homestay
                    </div>
                    <div style={canApproveBooking ? styles.hasPermission : styles.noPermission}>
                        {canApproveBooking ? '✅' : '❌'} Approve Booking
                    </div>
                </div>
            </section>

            {/* Permission Component Examples */}
            <section style={styles.section}>
                <h2>🎨 Permission Component Examples</h2>

                <h3>Example 1: Simple Permission</h3>
                <Permission featureKey={FeatureKey.BLOG_CREATE}>
                    <div style={styles.successBox}>
                        ✅ You can see this because you have BLOG_CREATE permission
                    </div>
                </Permission>

                <h3>Example 2: Permission with Fallback</h3>
                <Permission
                    featureKey={FeatureKey.ADMIN}
                    fallback={
                        <div style={styles.warningBox}>
                            ⚠️ You don't have ADMIN permission
                        </div>
                    }
                >
                    <div style={styles.successBox}>
                        ✅ You have ADMIN permission - Admin content visible!
                    </div>
                </Permission>

                <h3>Example 3: Multiple Permissions (OR Logic)</h3>
                <Permission featureKey={[FeatureKey.BLOG_EDIT, FeatureKey.ADMIN]}>
                    <div style={styles.successBox}>
                        ✅ You have either BLOG_EDIT or ADMIN permission
                    </div>
                </Permission>

                <h3>Example 4: Ownership Check</h3>
                <div style={styles.infoBox}>
                    <p>Current User ID: {currentUser.userId}</p>
                    <p>Mock Post Owner ID: 1</p>

                    <Permission
                        featureKey={FeatureKey.BLOG_EDIT}
                        ownerId={1}
                    >
                        <div style={styles.successBox}>
                            ✅ You can edit this post (you are the owner)
                        </div>
                    </Permission>

                    <Permission
                        featureKey={FeatureKey.BLOG_EDIT}
                        ownerId={999}
                        fallback={
                            <div style={styles.warningBox}>
                                ⚠️ You cannot edit this post (owner ID: 999, not yours)
                            </div>
                        }
                    >
                        <div style={styles.successBox}>
                            ✅ You can edit this post
                        </div>
                    </Permission>
                </div>
            </section>

            {/* Action Buttons */}
            <section style={styles.section}>
                <h2>🔘 Conditional Buttons</h2>
                <div style={styles.buttonGroup}>
                    <Permission featureKey={FeatureKey.BLOG_CREATE}>
                        <button style={styles.button}>Create Blog Post</button>
                    </Permission>

                    <Permission featureKey={FeatureKey.HOMESTAY_CREATE}>
                        <button style={styles.button}>Create Homestay</button>
                    </Permission>

                    <Permission featureKey={FeatureKey.ADMIN_USER_MANAGEMENT}>
                        <button style={styles.button}>Manage Users</button>
                    </Permission>

                    <Permission featureKey={FeatureKey.BOOKING_APPROVE}>
                        <button style={styles.button}>Approve Bookings</button>
                    </Permission>

                    <Permission
                        featureKey={FeatureKey.REPORT_EXPORT}
                        fallback={
                            <button style={styles.disabledButton} disabled>
                                Export Reports (No Permission)
                            </button>
                        }
                    >
                        <button style={styles.button}>Export Reports</button>
                    </Permission>
                </div>
            </section>

            {/* Raw Permissions Data */}
            <section style={styles.section}>
                <h2>📋 Raw Permissions Data</h2>
                <details>
                    <summary style={styles.summary}>Click to view all permissions</summary>
                    <pre style={styles.code}>
                        {JSON.stringify(permissions, null, 2)}
                    </pre>
                </details>
            </section>
        </div>
    );
};

// Inline styles for the demo
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    section: {
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
    },
    infoBox: {
        padding: '15px',
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    successBox: {
        padding: '15px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        color: '#155724',
        marginTop: '10px',
    },
    warningBox: {
        padding: '15px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        color: '#856404',
        marginTop: '10px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
        marginTop: '15px',
    },
    hasPermission: {
        padding: '10px',
        backgroundColor: '#d4edda',
        border: '1px solid #c3e6cb',
        borderRadius: '4px',
        textAlign: 'center' as const,
    },
    noPermission: {
        padding: '10px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        borderRadius: '4px',
        textAlign: 'center' as const,
    },
    buttonGroup: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: '10px',
        marginTop: '15px',
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    disabledButton: {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        fontSize: '14px',
        opacity: 0.65,
    },
    summary: {
        cursor: 'pointer',
        fontWeight: 'bold' as const,
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        borderRadius: '4px',
    },
    code: {
        backgroundColor: '#282c34',
        color: '#abb2bf',
        padding: '15px',
        borderRadius: '4px',
        overflow: 'auto',
        maxHeight: '400px',
        fontSize: '12px',
    },
};

export default PermissionDemo;
