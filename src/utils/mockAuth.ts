// Mock authentication for development/testing
// Username: 2dawng, Password: 1234

const MOCK_USER = {
  username: "2dawng",
  password: "1234",
  userId: 1,
  userName: "2dawng",
  roleId: 1,
  isAdmin: true,
  isActive: true,
};

// Mock permissions for admin user (full access)
const MOCK_ADMIN_PERMISSIONS = {
  // Blog permissions
  "blog.view": { can_access: true, must_check_owner: false },
  "blog.create": { can_access: true, must_check_owner: false },
  "blog.edit": { can_access: true, must_check_owner: true },
  "blog.delete": { can_access: true, must_check_owner: true },
  "blog.publish": { can_access: true, must_check_owner: false },

  // Blog comments
  "blog.comment.view": { can_access: true, must_check_owner: false },
  "blog.comment.create": { can_access: true, must_check_owner: false },
  "blog.comment.edit": { can_access: true, must_check_owner: true },
  "blog.comment.delete": { can_access: true, must_check_owner: true },

  // User permissions
  "user.view": { can_access: true, must_check_owner: false },
  "user.create": { can_access: true, must_check_owner: false },
  "user.edit": { can_access: true, must_check_owner: false },
  "user.delete": { can_access: true, must_check_owner: false },
  "user.profile.edit": { can_access: true, must_check_owner: true },

  // Admin permissions - full access
  "admin.view": { can_access: true, must_check_owner: false },
  "admin.dashboard.view": { can_access: true, must_check_owner: false },
  "admin.user_management.view": { can_access: true, must_check_owner: false },
  "admin.user_management.create": { can_access: true, must_check_owner: false },
  "admin.user_management.edit": { can_access: true, must_check_owner: false },
  "admin.user_management.delete": { can_access: true, must_check_owner: false },
  "admin.user_management.activate": { can_access: true, must_check_owner: false },
  "admin.user_management.deactivate": { can_access: true, must_check_owner: false },
  "admin.role_management.view": { can_access: true, must_check_owner: false },
  "admin.role_management.create": { can_access: true, must_check_owner: false },
  "admin.role_management.edit": { can_access: true, must_check_owner: false },
  "admin.role_management.delete": { can_access: true, must_check_owner: false },
  "admin.permission_management.view": { can_access: true, must_check_owner: false },
  "admin.permission_management.assign": { can_access: true, must_check_owner: false },

  // Content permissions
  "content.view": { can_access: true, must_check_owner: false },
  "content.create": { can_access: true, must_check_owner: false },
  "content.edit": { can_access: true, must_check_owner: true },
  "content.delete": { can_access: true, must_check_owner: true },
  "content.publish": { can_access: true, must_check_owner: false },

  // Settings permissions
  "settings.view": { can_access: true, must_check_owner: false },
  "settings.edit": { can_access: true, must_check_owner: false },
  "settings.system.edit": { can_access: true, must_check_owner: false },

  // Report permissions
  "report.view": { can_access: true, must_check_owner: false },
  "report.export": { can_access: true, must_check_owner: false },
  "report.analytics.view": { can_access: true, must_check_owner: false },

  // Homestay permissions
  "homestay.view": { can_access: true, must_check_owner: false },
  "homestay.create": { can_access: true, must_check_owner: false },
  "homestay.edit": { can_access: true, must_check_owner: true },
  "homestay.delete": { can_access: true, must_check_owner: true },
  "homestay.publish": { can_access: true, must_check_owner: false },

  // Booking permissions
  "booking.view": { can_access: true, must_check_owner: false },
  "booking.create": { can_access: true, must_check_owner: false },
  "booking.edit": { can_access: true, must_check_owner: true },
  "booking.cancel": { can_access: true, must_check_owner: true },
  "booking.approve": { can_access: true, must_check_owner: false },
  "booking.reject": { can_access: true, must_check_owner: false },

  // Payment permissions
  "payment.view": { can_access: true, must_check_owner: false },
  "payment.process": { can_access: true, must_check_owner: false },
  "payment.refund": { can_access: true, must_check_owner: false },

  // Review permissions
  "review.view": { can_access: true, must_check_owner: false },
  "review.create": { can_access: true, must_check_owner: false },
  "review.edit": { can_access: true, must_check_owner: true },
  "review.delete": { can_access: true, must_check_owner: true },
  "review.moderate": { can_access: true, must_check_owner: false },

  // Host permissions
  "host.dashboard.view": { can_access: true, must_check_owner: false },
  "host.earnings.view": { can_access: true, must_check_owner: false },
  "host.calendar.view": { can_access: true, must_check_owner: false },

  // Guest permissions
  "guest.dashboard.view": { can_access: true, must_check_owner: false },
  "guest.bookings.view": { can_access: true, must_check_owner: false },
  "guest.favorites.view": { can_access: true, must_check_owner: false },

  // Feature flags
  "beta.features": { can_access: true, must_check_owner: false },
  "experimental.features": { can_access: true, must_check_owner: false },
};

// Mock permissions for regular user (limited access)
const MOCK_USER_PERMISSIONS = {
  // Blog - can view, create, edit own
  "blog.view": { can_access: true, must_check_owner: false },
  "blog.create": { can_access: true, must_check_owner: false },
  "blog.edit": { can_access: true, must_check_owner: true },
  "blog.delete": { can_access: true, must_check_owner: true },
  "blog.publish": { can_access: false, must_check_owner: false },

  // Blog comments
  "blog.comment.view": { can_access: true, must_check_owner: false },
  "blog.comment.create": { can_access: true, must_check_owner: false },
  "blog.comment.edit": { can_access: true, must_check_owner: true },
  "blog.comment.delete": { can_access: true, must_check_owner: true },

  // User - can only edit own profile
  "user.view": { can_access: true, must_check_owner: false },
  "user.create": { can_access: false, must_check_owner: false },
  "user.edit": { can_access: false, must_check_owner: false },
  "user.delete": { can_access: false, must_check_owner: false },
  "user.profile.edit": { can_access: true, must_check_owner: true },

  // No admin access
  "admin.view": { can_access: false, must_check_owner: false },
  "admin.dashboard.view": { can_access: false, must_check_owner: false },

  // Content - can view and edit own
  "content.view": { can_access: true, must_check_owner: false },
  "content.create": { can_access: true, must_check_owner: false },
  "content.edit": { can_access: true, must_check_owner: true },
  "content.delete": { can_access: true, must_check_owner: true },
  "content.publish": { can_access: false, must_check_owner: false },

  // Settings - can only view
  "settings.view": { can_access: true, must_check_owner: false },
  "settings.edit": { can_access: false, must_check_owner: false },

  // Reports - can view only
  "report.view": { can_access: true, must_check_owner: false },
  "report.export": { can_access: false, must_check_owner: false },

  // Homestay - can manage own listings
  "homestay.view": { can_access: true, must_check_owner: false },
  "homestay.create": { can_access: true, must_check_owner: false },
  "homestay.edit": { can_access: true, must_check_owner: true },
  "homestay.delete": { can_access: true, must_check_owner: true },
  "homestay.publish": { can_access: false, must_check_owner: false },

  // Booking - can manage own bookings
  "booking.view": { can_access: true, must_check_owner: false },
  "booking.create": { can_access: true, must_check_owner: false },
  "booking.edit": { can_access: true, must_check_owner: true },
  "booking.cancel": { can_access: true, must_check_owner: true },
  "booking.approve": { can_access: false, must_check_owner: false },
  "booking.reject": { can_access: false, must_check_owner: false },

  // Payment - limited access
  "payment.view": { can_access: true, must_check_owner: true },
  "payment.process": { can_access: false, must_check_owner: false },
  "payment.refund": { can_access: false, must_check_owner: false },

  // Review - can manage own reviews
  "review.view": { can_access: true, must_check_owner: false },
  "review.create": { can_access: true, must_check_owner: false },
  "review.edit": { can_access: true, must_check_owner: true },
  "review.delete": { can_access: true, must_check_owner: true },
  "review.moderate": { can_access: false, must_check_owner: false },

  // Guest permissions
  "guest.dashboard.view": { can_access: true, must_check_owner: false },
  "guest.bookings.view": { can_access: true, must_check_owner: false },
  "guest.favorites.view": { can_access: true, must_check_owner: false },

  // No host permissions
  "host.dashboard.view": { can_access: false, must_check_owner: false },
  "host.earnings.view": { can_access: false, must_check_owner: false },
  "host.calendar.view": { can_access: false, must_check_owner: false },

  // No beta features
  "beta.features": { can_access: false, must_check_owner: false },
  "experimental.features": { can_access: false, must_check_owner: false },
};

// Generate a simple mock JWT token (for development only!)
const generateMockToken = (expiresIn = 3600) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      user_id: MOCK_USER.userId,
      user_name: MOCK_USER.userName,
      role_id: MOCK_USER.roleId,
      is_admin: MOCK_USER.isAdmin,
      is_active: MOCK_USER.isActive,
      exp: Math.floor(Date.now() / 1000) + expiresIn, // Expires in 1 hour
    })
  );
  const signature = btoa("mock-signature");

  return `${header}.${payload}.${signature}`;
};

export const mockLogin = (
  username: string,
  password: string
): Promise<{
  idToken: string;
  refreshToken: string;
  user: any;
  role_permissions: any;
}> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (username === MOCK_USER.username && password === MOCK_USER.password) {
        // Success - return tokens and user info with permissions
        resolve({
          idToken: generateMockToken(3600), // 1 hour
          refreshToken: generateMockToken(86400), // 24 hours
          user: {
            id: MOCK_USER.userId,
            user_name: MOCK_USER.userName,
            role_id: MOCK_USER.roleId,
            is_admin: MOCK_USER.isAdmin,
            is_active: MOCK_USER.isActive,
          },
          role_permissions: MOCK_USER.isAdmin ? MOCK_ADMIN_PERMISSIONS : MOCK_USER_PERMISSIONS,
        });
      } else {
        // Failed - wrong credentials
        reject({
          response: {
            status: 401,
            data: {
              detail: "Invalid username or password",
            },
          },
        });
      }
    }, 800); // 800ms delay to simulate real API
  });
};

export const mockRefreshToken = (): Promise<{ idToken: string; refreshToken: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        idToken: generateMockToken(3600),
        refreshToken: generateMockToken(86400),
      });
    }, 300);
  });
};
