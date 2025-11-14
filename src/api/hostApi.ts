import type {
  HostBookingConfirmPayload,
  HostBookingRequest,
  HostStatistics,
  PaymentTransfer,
  RevenueStatistics,
  TopHomestay,
} from "../types/host";
import { sendRequest } from "../utils/sendRequest";

// UC14: Confirm/reject booking requests
export const fetchHostBookingRequests = () =>
  sendRequest("/host/bookings/requests", {
    method: "GET",
  }) as Promise<HostBookingRequest[]>;

export const confirmBookingRequest = (bookingId: number, payload: HostBookingConfirmPayload) =>
  sendRequest(`/host/bookings/${bookingId}/confirm`, {
    method: "POST",
    payload,
  });

export const rejectBookingRequest = (bookingId: number, payload: HostBookingConfirmPayload) =>
  sendRequest(`/host/bookings/${bookingId}/reject`, {
    method: "POST",
    payload,
  });

// UC17: Revenue statistics
export const fetchRevenueStatistics = (period: "week" | "month" | "year") =>
  sendRequest(`/host/revenue?period=${period}`, {
    method: "GET",
  }) as Promise<RevenueStatistics>;

export const exportRevenueReport = (period: "week" | "month" | "year") =>
  sendRequest(`/host/revenue/export?period=${period}`, {
    method: "GET",
  });

// UC18: Payment transfer after check-in
export const fetchPaymentTransfers = () =>
  sendRequest("/host/payments", {
    method: "GET",
  }) as Promise<PaymentTransfer[]>;

export const getPaymentTransferDetails = (transferId: number) =>
  sendRequest(`/host/payments/${transferId}`, {
    method: "GET",
  }) as Promise<PaymentTransfer>;

// Host chat messages
export const fetchHostConversations = () =>
  sendRequest("/host/chat/conversations", {
    method: "GET",
  });

export const fetchHostChatMessages = (conversationId: number) =>
  sendRequest(`/host/chat/conversations/${conversationId}/messages`, {
    method: "GET",
  });

export const sendHostChatMessage = (conversationId: number, message: string) =>
  sendRequest(`/host/chat/conversations/${conversationId}/messages`, {
    method: "POST",
    payload: { message },
  });

// Host Dashboard APIs
export const fetchHostStatistics = () =>
  sendRequest("/api/v1/host/dashboard/statistics", {
    method: "GET",
  }) as Promise<HostStatistics>;

export const fetchHostRevenue = (period: "week" | "month" | "year") =>
  sendRequest(`/api/v1/host/dashboard/revenue?period=${period}`, {
    method: "GET",
  }) as Promise<RevenueStatistics>;

export const fetchTopHomestays = (limit: number = 5) =>
  sendRequest(`/api/v1/host/dashboard/top-homestays?limit=${limit}`, {
    method: "GET",
  }) as Promise<TopHomestay[]>;
