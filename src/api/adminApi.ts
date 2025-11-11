import type {
  AdminBookingSummary,
  AdminComplaintSummary,
  AdminFaqItem,
  AdminFaqPayload,
  AdminHomestayRequest,
  AdminRevenueReport,
  AdminUser,
  HomestayRequestReviewPayload,
  UpdateUserStatusPayload,
} from "@/types/admin";
import type { Homestay } from "@/types/homestay";
import { sendRequest } from "@/utils/sendRequest";

export const fetchUsers = async (role?: string): Promise<AdminUser[]> => {
  console.log("🔵 [fetchUsers] Calling API with URL: /api/admin/users");
  const response = await sendRequest("/api/admin/users", {
    method: "GET",
    payload: role ? { role } : undefined,
  }) as any;
  
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
  const response = await sendRequest(`/api/admin/users/${userId}/status-history`, {
    method: "GET",
  }) as any;
  
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
