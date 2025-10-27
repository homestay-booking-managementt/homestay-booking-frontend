/**
 * Feature Keys Enum
 * 
 * These keys must match exactly with the backend feature keys.
 * Used for role-based access control (RBAC) throughout the application.
 */
export enum FeatureKey {
    // ========== Blog Permissions ==========
    BLOG = "blog.view",
    BLOG_CREATE = "blog.create",
    BLOG_EDIT = "blog.edit",
    BLOG_DELETE = "blog.delete",
    BLOG_PUBLISH = "blog.publish",

    // Blog Comments
    BLOG_COMMENT = "blog.comment.view",
    BLOG_COMMENT_CREATE = "blog.comment.create",
    BLOG_COMMENT_EDIT = "blog.comment.edit",
    BLOG_COMMENT_DELETE = "blog.comment.delete",

    // ========== User Permissions ==========
    USER_VIEW = "user.view",
    USER_CREATE = "user.create",
    USER_EDIT = "user.edit",
    USER_DELETE = "user.delete",
    USER_PROFILE_EDIT = "user.profile.edit",

    // ========== Admin Permissions ==========
    ADMIN = "admin.view",
    ADMIN_DASHBOARD = "admin.dashboard.view",

    // User Management
    ADMIN_USER_MANAGEMENT = "admin.user_management.view",
    ADMIN_USER_CREATE = "admin.user_management.create",
    ADMIN_USER_EDIT = "admin.user_management.edit",
    ADMIN_USER_DELETE = "admin.user_management.delete",
    ADMIN_USER_ACTIVATE = "admin.user_management.activate",
    ADMIN_USER_DEACTIVATE = "admin.user_management.deactivate",

    // Role Management
    ADMIN_ROLE_MANAGEMENT = "admin.role_management.view",
    ADMIN_ROLE_CREATE = "admin.role_management.create",
    ADMIN_ROLE_EDIT = "admin.role_management.edit",
    ADMIN_ROLE_DELETE = "admin.role_management.delete",

    // Permission Management
    ADMIN_PERMISSION_MANAGEMENT = "admin.permission_management.view",
    ADMIN_PERMISSION_ASSIGN = "admin.permission_management.assign",

    // ========== Content Permissions ==========
    CONTENT_VIEW = "content.view",
    CONTENT_CREATE = "content.create",
    CONTENT_EDIT = "content.edit",
    CONTENT_DELETE = "content.delete",
    CONTENT_PUBLISH = "content.publish",

    // ========== Settings Permissions ==========
    SETTINGS_VIEW = "settings.view",
    SETTINGS_EDIT = "settings.edit",
    SETTINGS_SYSTEM = "settings.system.edit",

    // ========== Report Permissions ==========
    REPORT_VIEW = "report.view",
    REPORT_EXPORT = "report.export",
    REPORT_ANALYTICS = "report.analytics.view",

    // ========== Homestay Booking Specific Permissions ==========
    // Homestay Management
    HOMESTAY_VIEW = "homestay.view",
    HOMESTAY_CREATE = "homestay.create",
    HOMESTAY_EDIT = "homestay.edit",
    HOMESTAY_DELETE = "homestay.delete",
    HOMESTAY_PUBLISH = "homestay.publish",

    // Booking Management
    BOOKING_VIEW = "booking.view",
    BOOKING_CREATE = "booking.create",
    BOOKING_EDIT = "booking.edit",
    BOOKING_CANCEL = "booking.cancel",
    BOOKING_APPROVE = "booking.approve",
    BOOKING_REJECT = "booking.reject",

    // Payment Management
    PAYMENT_VIEW = "payment.view",
    PAYMENT_PROCESS = "payment.process",
    PAYMENT_REFUND = "payment.refund",

    // Review Management
    REVIEW_VIEW = "review.view",
    REVIEW_CREATE = "review.create",
    REVIEW_EDIT = "review.edit",
    REVIEW_DELETE = "review.delete",
    REVIEW_MODERATE = "review.moderate",

    // Host Permissions
    HOST_DASHBOARD = "host.dashboard.view",
    HOST_EARNINGS = "host.earnings.view",
    HOST_CALENDAR = "host.calendar.view",

    // Guest Permissions
    GUEST_DASHBOARD = "guest.dashboard.view",
    GUEST_BOOKINGS = "guest.bookings.view",
    GUEST_FAVORITES = "guest.favorites.view",

    // ========== Feature Flags ==========
    BETA_FEATURES = "beta.features",
    EXPERIMENTAL_FEATURES = "experimental.features",
}
