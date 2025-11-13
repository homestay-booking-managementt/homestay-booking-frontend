import type { AdminBookingSummary } from "@/types/admin";

/**
 * Interface for booking statistics
 */
export interface BookingStatistics {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  completedRevenue: number;
}

/**
 * Calculate booking statistics from booking data
 * @param bookings - Array of booking summaries
 * @returns Calculated statistics
 */
export const calculateStatistics = (bookings: AdminBookingSummary[]): BookingStatistics => {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return {
      totalBookings: 0,
      completedBookings: 0,
      pendingBookings: 0,
      cancelledBookings: 0,
      confirmedBookings: 0,
      totalRevenue: 0,
      completedRevenue: 0,
    };
  }

  const completed = bookings.filter((b) => b.status === "COMPLETED");
  const pending = bookings.filter((b) => b.status === "PENDING");
  const cancelled = bookings.filter((b) => b.status === "CANCELLED");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");

  return {
    totalBookings: bookings.length,
    completedBookings: completed.length,
    pendingBookings: pending.length,
    cancelledBookings: cancelled.length,
    confirmedBookings: confirmed.length,
    totalRevenue: bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    completedRevenue: completed.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  };
};

/**
 * Format currency value to Vietnamese Dong
 * @param value - Numeric value to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

/**
 * Format large numbers with K/M suffix
 * @param value - Numeric value to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};
