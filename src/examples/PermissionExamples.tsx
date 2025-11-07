/**
 * Permission System Usage Examples
 *
 * This file demonstrates various ways to use the permission system
 * in your application. Copy and modify these examples as needed.
 */

import { Permission } from "@/permission/Permision";
import usePermission from "@/hooks/usePermission";
import { FeatureKey } from "@/constants/feature";

// ========== Example 1: Simple Permission Check ==========
export const SimpleExample = () => {
  return (
    <div>
      <h1>Blog Post</h1>
      <p>This is the blog content...</p>

      {/* Only show edit button if user has permission */}
      <Permission featureKey={FeatureKey.BLOG_EDIT}>
        <button>Edit</button>
      </Permission>
    </div>
  );
};

// ========== Example 2: Permission with Fallback ==========
export const FallbackExample = () => {
  return (
    <Permission
      featureKey={FeatureKey.ADMIN_DASHBOARD}
      fallback={
        <div className="alert alert-danger">
          You don't have permission to access the admin dashboard. Please contact your
          administrator.
        </div>
      }
    >
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        {/* Admin content */}
      </div>
    </Permission>
  );
};

// ========== Example 3: Permission with Ownership Check ==========
export const OwnershipExample = ({
  post,
}: {
  post: { id: number; title: string; authorId: number };
}) => {
  return (
    <div className="blog-post">
      <h2>{post.title}</h2>

      {/* Only show edit button if user has permission AND is the owner */}
      <Permission featureKey={FeatureKey.BLOG_EDIT} ownerId={post.authorId}>
        <button>Edit Post</button>
      </Permission>

      {/* Only show delete button if user has permission AND is the owner */}
      <Permission featureKey={FeatureKey.BLOG_DELETE} ownerId={post.authorId}>
        <button>Delete Post</button>
      </Permission>
    </div>
  );
};

// ========== Example 4: Multiple Permissions (OR Logic) ==========
export const MultiplePermissionsExample = ({
  post,
}: {
  post: { id: number; authorId: number };
}) => {
  return (
    <div>
      {/* Show if user has EITHER blog edit permission OR admin permission */}
      <Permission featureKey={[FeatureKey.BLOG_EDIT, FeatureKey.ADMIN]} ownerId={post.authorId}>
        <button>Moderate Post</button>
      </Permission>

      {/* Admins can delete any post, regular users can only delete their own */}
      <Permission featureKey={[FeatureKey.BLOG_DELETE, FeatureKey.ADMIN]} ownerId={post.authorId}>
        <button>Delete Post</button>
      </Permission>
    </div>
  );
};

// ========== Example 5: Using usePermission Hook ==========
export const HookExample = ({ item }: { item: { id: number; ownerId: number } }) => {
  const { hasPermission: canEdit, checkOwner: isOwner } = usePermission(
    FeatureKey.BLOG_EDIT,
    item.ownerId
  );
  const { hasPermission: canDelete } = usePermission(FeatureKey.BLOG_DELETE);
  const { hasPermission: canExport } = usePermission(FeatureKey.REPORT_EXPORT);

  const handleEdit = () => {
    if (!canEdit || !isOwner) {
      alert("You don't have permission to edit this item");
      return;
    }
    // Edit logic...
    console.log("Editing item", item.id);
  };

  const handleExport = () => {
    if (!canExport) {
      alert("You don't have permission to export");
      return;
    }
    // Export logic...
    console.log("Exporting data");
  };

  return (
    <div>
      <button
        onClick={handleEdit}
        disabled={!canEdit || !isOwner}
        className={canEdit && isOwner ? "" : "disabled"}
      >
        Edit
      </button>

      <button onClick={handleExport} disabled={!canExport}>
        Export
      </button>

      {canDelete && <button className="btn-danger">Delete</button>}
    </div>
  );
};

// ========== Example 6: Conditional Rendering Based on Role ==========
export const RoleBasedExample = () => {
  const { hasPermission: isAdmin } = usePermission(FeatureKey.ADMIN);
  const { hasPermission: canViewReports } = usePermission(FeatureKey.REPORT_VIEW);
  const { hasPermission: canManageUsers } = usePermission(FeatureKey.ADMIN_USER_MANAGEMENT);

  return (
    <div className="sidebar">
      <ul className="nav">
        <li>
          <a href="/">Dashboard</a>
        </li>

        {canViewReports && (
          <li>
            <a href="/reports">Reports</a>
          </li>
        )}

        {isAdmin && (
          <>
            <li>
              <a href="/admin">Admin Panel</a>
            </li>
            <li>
              <a href="/settings">System Settings</a>
            </li>
          </>
        )}

        {canManageUsers && (
          <li>
            <a href="/users">User Management</a>
          </li>
        )}
      </ul>
    </div>
  );
};

// ========== Example 7: Table with Row-Level Permissions ==========
export const TableExample = ({
  items,
}: {
  items: Array<{ id: number; name: string; ownerId: number }>;
}) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>
              <Permission featureKey={FeatureKey.CONTENT_EDIT} ownerId={item.ownerId}>
                <button className="btn btn-sm btn-primary">Edit</button>
              </Permission>

              <Permission featureKey={FeatureKey.CONTENT_DELETE} ownerId={item.ownerId}>
                <button className="btn btn-sm btn-danger">Delete</button>
              </Permission>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// ========== Example 8: Form with Conditional Fields ==========
export const FormExample = () => {
  const { hasPermission: canPublish } = usePermission(FeatureKey.BLOG_PUBLISH);
  const { hasPermission: isAdmin } = usePermission(FeatureKey.ADMIN);

  return (
    <form>
      <div className="form-group">
        <label>Title</label>
        <input type="text" className="form-control" />
      </div>

      <div className="form-group">
        <label>Content</label>
        <textarea className="form-control" />
      </div>

      {/* Only show publish option if user has permission */}
      {canPublish && (
        <div className="form-group">
          <label>
            <input type="checkbox" /> Publish immediately
          </label>
        </div>
      )}

      {/* Only show featured option for admins */}
      {isAdmin && (
        <div className="form-group">
          <label>
            <input type="checkbox" /> Featured post
          </label>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Save
      </button>
    </form>
  );
};

// ========== Example 9: Homestay Management ==========
export const HomestayExample = ({
  homestay,
}: {
  homestay: { id: number; name: string; hostId: number };
}) => {
  const { hasPermission: canEdit, checkOwner } = usePermission(
    FeatureKey.HOMESTAY_EDIT,
    homestay.hostId
  );
  const { hasPermission: canPublish } = usePermission(FeatureKey.HOMESTAY_PUBLISH);
  const { hasPermission: isAdmin } = usePermission(FeatureKey.ADMIN);

  return (
    <div className="homestay-card">
      <h3>{homestay.name}</h3>

      <div className="actions">
        {/* Host can edit their own homestay */}
        <Permission featureKey={FeatureKey.HOMESTAY_EDIT} ownerId={homestay.hostId}>
          <button>Edit Listing</button>
        </Permission>

        {/* Host can delete their own homestay */}
        <Permission featureKey={FeatureKey.HOMESTAY_DELETE} ownerId={homestay.hostId}>
          <button>Delete Listing</button>
        </Permission>

        {/* Only admin can publish/unpublish */}
        <Permission featureKey={FeatureKey.HOMESTAY_PUBLISH}>
          <button>Publish</button>
        </Permission>

        {/* Admin can do everything */}
        <Permission featureKey={FeatureKey.ADMIN}>
          <button>Admin Actions</button>
        </Permission>
      </div>
    </div>
  );
};

// ========== Example 10: Booking Management ==========
export const BookingExample = ({
  booking,
}: {
  booking: {
    id: number;
    guestId: number;
    hostId: number;
    status: string;
  };
}) => {
  const { hasPermission: canApprove } = usePermission(FeatureKey.BOOKING_APPROVE);
  const { hasPermission: canCancel } = usePermission(FeatureKey.BOOKING_CANCEL);

  return (
    <div className="booking-card">
      <h4>Booking #{booking.id}</h4>
      <p>Status: {booking.status}</p>

      <div className="actions">
        {/* Guest can cancel their own booking */}
        <Permission featureKey={FeatureKey.BOOKING_CANCEL} ownerId={booking.guestId}>
          <button className="btn-danger">Cancel Booking</button>
        </Permission>

        {/* Host can approve/reject bookings for their homestay */}
        <Permission featureKey={FeatureKey.BOOKING_APPROVE}>
          <button className="btn-success">Approve</button>
        </Permission>

        <Permission featureKey={FeatureKey.BOOKING_REJECT}>
          <button className="btn-warning">Reject</button>
        </Permission>
      </div>
    </div>
  );
};
