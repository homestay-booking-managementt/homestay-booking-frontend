import type {
  AdminBookingSummary,
  AdminComplaintSummary,
  AdminFaqItem,
  AdminFaqPayload,
  AdminHomestayRequest,
  AdminRevenueReport,
  AdminUser,
  BookingDetail,
  HomestayRequestReviewPayload,
  UpdateUserStatusPayload,
} from "@/types/admin";
import type { Homestay } from "@/types/homestay";
import { sendRequest } from "@/utils/sendRequest";

export const fetchUsers = async (role?: string): Promise<AdminUser[]> => {
  console.log("🔵 [fetchUsers] Calling API with URL: /api/admin/users");
  const response = (await sendRequest("/api/admin/users", {
    method: "GET",
    payload: role ? { role } : undefined,
  })) as any;

  console.log("🔵 [fetchUsers] Raw response:", response);
  console.log("🔵 [fetchUsers] response.data:", response?.data);
  console.log("🔵 [fetchUsers] Is response.data array?", Array.isArray(response?.data));

  // Backend trả về format: { success, message, data, total }
  const result = Array.isArray(response?.data) ? response.data : [];
  console.log("🔵 [fetchUsers] Returning:", result, "Length:", result.length);
  return result;
};

export const updateUserStatus = (userId: number, payload: UpdateUserStatusPayload) =>
  sendRequest(`/api/admin/users/${userId}/status`, {
    method: "PUT",
    payload,
  });

export const fetchUserStatusHistory = async (userId: number) => {
  const response = (await sendRequest(`/api/admin/users/${userId}/status-history`, {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data }
  return Array.isArray(response?.data) ? response.data : [];
};

export const fetchPendingHomestayRequests = async (): Promise<AdminHomestayRequest[]> => {
  const response = (await sendRequest("/api/admin/homestay-requests/pending", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

export const reviewHomestayRequest = (requestId: number, payload: HomestayRequestReviewPayload) =>
  sendRequest(`/api/admin/homestay-requests/${requestId}/review`, {
    method: "PUT",
    payload,
  });

export const fetchAdminBookings = async (): Promise<AdminBookingSummary[]> => {
  const response = (await sendRequest("/api/admin/bookings", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

/**
 * Lấy chi tiết đặt phòng
 * GET /api/admin/bookings/:id
 */
export const fetchBookingDetail = async (bookingId: number): Promise<BookingDetail> => {
  const response = (await sendRequest(`/api/admin/bookings/${bookingId}`, {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data }
  if (!response?.data) {
    throw new Error("Không tìm thấy thông tin đặt phòng");
  }
  return response.data;
};

export const fetchAdminComplaints = async (): Promise<AdminComplaintSummary[]> => {
  const response = (await sendRequest("/api/admin/complaints", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

export const fetchRevenueReport = async (): Promise<AdminRevenueReport> => {
  const response = (await sendRequest("/api/admin/reports/revenue", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data }
  return response?.data || { items: [], generatedAt: new Date().toISOString() };
};

export const fetchAdminFaqs = async (): Promise<AdminFaqItem[]> => {
  const response = (await sendRequest("/api/admin/faqs", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

export const createAdminFaq = (payload: AdminFaqPayload) =>
  sendRequest("/api/admin/faqs", {
    method: "POST",
    payload,
  });

export const updateAdminFaq = (faqId: number, payload: AdminFaqPayload) =>
  sendRequest(`/api/admin/faqs/${faqId}`, {
    method: "PUT",
    payload,
  });

export const deleteAdminFaq = (faqId: number) =>
  sendRequest(`/api/admin/faqs/${faqId}`, {
    method: "DELETE",
  });

/**
 * Lấy toàn bộ danh sách homestay (bao gồm cả homestay bị ẩn, khóa)
 * GET /api/admin/homestays
 */
export const fetchAllHomestaysForAdmin = async (): Promise<Homestay[]> => {
  const response = (await sendRequest("/api/admin/homestays", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

/**
 * Lấy danh sách homestay có yêu cầu cập nhật đang chờ duyệt
 * GET /api/admin/homestays-pending-update
 */
export const fetchHomestaysPendingUpdate = async (): Promise<Homestay[]> => {
  const response = (await sendRequest("/api/admin/homestays-pending-update", {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data, total }
  return Array.isArray(response?.data) ? response.data : [];
};

/**
 * Cập nhật trạng thái homestay
 * PUT /api/admin/homestays/:id/status
 * @param homestayId - ID của homestay
 * @param status - Trạng thái mới (0: Inactive, 1: Active, 2: Pending, 3: Banned)
 * @param reason - Lý do thay đổi trạng thái
 */
export const updateHomestayStatus = (homestayId: number, status: number, reason?: string) =>
  sendRequest(`/api/admin/homestays/${homestayId}/status`, {
    method: "PUT",
    payload: { status, reason },
  });

/**
 * Lấy chi tiết homestay
 * GET /api/admin/homestays/:id
 */
export const fetchHomestayDetail = async (homestayId: number): Promise<Homestay> => {
  const response = (await sendRequest(`/api/admin/homestays/${homestayId}`, {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data }
  if (!response?.data) {
    throw new Error("Không tìm thấy thông tin homestay");
  }
  return response.data;
};

/**
 * Lấy lịch sử thay đổi trạng thái homestay
 * GET /api/admin/homestays/:id/status-history
 */
export const fetchHomestayStatusHistory = async (homestayId: number) => {
  const response = (await sendRequest(`/api/admin/homestays/${homestayId}/status-history`, {
    method: "GET",
  })) as any;

  // Backend trả về format: { success, message, data }
  return Array.isArray(response?.data) ? response.data : [];
};

/**
 * Duyệt yêu cầu cập nhật homestay
 * POST /api/admin/homestay-pending/:id/approve
 */
export const approvePendingUpdate = (pendingId: number, adminId: number) =>
  sendRequest(`/api/admin/homestay-pending/${pendingId}/approve`, {
    method: "POST",
    payload: { adminId },
  });

/**
 * Từ chối yêu cầu cập nhật homestay
 * POST /api/admin/homestay-pending/:id/reject
 */
export const rejectPendingUpdate = (pendingId: number, adminId: number, reason: string) =>
  sendRequest(`/api/admin/homestay-pending/${pendingId}/reject`, {
    method: "POST",
    payload: { adminId, reason },
  });

/**
 * Lấy danh sách homestay theo owner ID
 * GET /api/admin/homestays/owner/:ownerId
 */
export const fetchHomestaysByOwnerId = async (ownerId: number) => {
  try {
    const response = (await sendRequest(`/api/admin/homestays/owner/${ownerId}`, {
      method: "GET",
    })) as any;

    if (response?.success) {
      return {
        homestays: Array.isArray(response.data) ? response.data : [],
        total: response.total || 0,
        ownerInfo: response.ownerInfo || null,
      };
    }
    throw new Error(response?.message || "Không thể tải danh sách homestay");
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Lỗi khi tải danh sách homestay");
  }
};

/**
 * Lấy danh sách booking theo customer ID kèm thông tin customer
 * GET /api/admin/bookings/customer/:customerId
 */
export const fetchBookingsByCustomerId = async (customerId: number) => {
  try {
    const response = (await sendRequest(`/api/admin/bookings/customer/${customerId}`, {
      method: "GET",
    })) as any;

    // Backend trả về format: { bookings: [...], customerInfo: {...} }
    return {
      bookings: Array.isArray(response?.bookings) ? response.bookings : [],
      customerInfo: response?.customerInfo || null,
    };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Lỗi khi tải danh sách booking của khách hàng");
  }
};
