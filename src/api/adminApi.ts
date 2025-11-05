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
import { sendRequest } from "@/utils/sendRequest";

export const fetchUsers = (role?: string) =>
  sendRequest("/admin/users", {
    method: "GET",
    payload: role ? { role } : undefined,
  }) as Promise<AdminUser[]>;

export const updateUserStatus = (userId: number, payload: UpdateUserStatusPayload) =>
  sendRequest(`/admin/users/${userId}/status`, {
    method: "PUT",
    payload,
  });

export const fetchPendingHomestayRequests = () =>
  sendRequest("/admin/homestay-requests/pending", {
    method: "GET",
  }) as Promise<AdminHomestayRequest[]>;

export const reviewHomestayRequest = (requestId: number, payload: HomestayRequestReviewPayload) =>
  sendRequest(`/admin/homestay-requests/${requestId}/review`, {
    method: "PUT",
    payload,
  });

export const fetchAdminBookings = () =>
  sendRequest("/admin/bookings", {
    method: "GET",
  }) as Promise<AdminBookingSummary[]>;

export const fetchAdminComplaints = () =>
  sendRequest("/admin/complaints", {
    method: "GET",
  }) as Promise<AdminComplaintSummary[]>;

export const fetchRevenueReport = () =>
  sendRequest("/admin/reports/revenue", {
    method: "GET",
  }) as Promise<AdminRevenueReport>;

export const fetchAdminFaqs = () =>
  sendRequest("/admin/faqs", {
    method: "GET",
  }) as Promise<AdminFaqItem[]>;

export const createAdminFaq = (payload: AdminFaqPayload) =>
  sendRequest("/admin/faqs", {
    method: "POST",
    payload,
  });

export const updateAdminFaq = (faqId: number, payload: AdminFaqPayload) =>
  sendRequest(`/admin/faqs/${faqId}`, {
    method: "PUT",
    payload,
  });

export const deleteAdminFaq = (faqId: number) =>
  sendRequest(`/admin/faqs/${faqId}`, {
    method: "DELETE",
  });
