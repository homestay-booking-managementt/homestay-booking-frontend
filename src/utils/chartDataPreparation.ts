import { format, subDays, isSameDay, startOfDay } from "date-fns";
import type { AdminBookingSummary } from "@/types/admin";

/**
 * Interface for booking trend data point
 */
export interface BookingTrendData {
  date: string; // Format: "DD/MM"
  bookings: number; // Number of bookings on this date
  revenue: number; // Revenue on this date
}

/**
 * Interface for revenue by status data point
 */
export interface RevenueByStatusData {
  status: string; // Status label in Vietnamese
  revenue: number; // Revenue for this status
  count: number; // Number of bookings with this status
  color: string; // Color for the bar
}

/**
 * Status colors mapping - Ocean theme palette
 * Supports both uppercase and lowercase status values
 */
export const STATUS_COLORS: Record<string, string> = {
  // Uppercase
  PENDING: "#FFA726",      // Orange 400 - Cam sáng (chờ xác nhận)
  CONFIRMED: "#0D6EFD",    // Ocean Blue - Xanh dương biển (đã xác nhận)
  COMPLETED: "#10B981",    // Emerald 500 - Xanh lá (hoàn tất)
  CANCELLED: "#EF4444",    // Red 500 - Đỏ (đã hủy)
  PAID: "#9B5DE5",         // Purple 500 - Tím (đã thanh toán)
  CHECKED_IN: "#00BCD4",   // Cyan 500 - Xanh ngọc (đã nhận phòng)
  CHECKED_OUT: "#607D8B",  // Blue Grey 500 - Xám xanh (đã trả phòng)
  REFUNDED: "#FF6B6B",     // Coral Red - Đỏ san hô (đã hoàn tiền)
  // Lowercase (for backend compatibility)
  pending: "#FFA726",
  confirmed: "#0D6EFD",
  completed: "#10B981",
  cancelled: "#EF4444",
  paid: "#9B5DE5",
  checked_in: "#00BCD4",
  checked_out: "#607D8B",
  refunded: "#FF6B6B",
};

/**
 * Status labels in Vietnamese
 * Supports both uppercase and lowercase status values
 */
export const STATUS_LABELS: Record<string, string> = {
  // Uppercase
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  PAID: "Đã thanh toán",
  CHECKED_IN: "Đã nhận phòng",
  CHECKED_OUT: "Đã trả phòng",
  REFUNDED: "Đã hoàn tiền",
  // Lowercase (for backend compatibility)
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  refunded: "Đã hoàn tiền",
};

/**
 * Get last N days as Date array
 * @param days - Number of days to get
 * @returns Array of Date objects
 */
const getLast30Days = (days: number = 30): Date[] => {
  const dates: Date[] = [];
  const today = startOfDay(new Date());

  for (let i = days - 1; i >= 0; i--) {
    dates.push(subDays(today, i));
  }

  return dates;
};

/**
 * Prepare booking trends data for line chart
 * @param bookings - Array of booking summaries
 * @param days - Number of days to include (default: 30)
 * @returns Array of booking trend data points
 */
export const prepareBookingTrendsData = (
  bookings: AdminBookingSummary[],
  days: number = 30
): BookingTrendData[] => {
  if (!Array.isArray(bookings)) {
    return [];
  }

  const last30Days = getLast30Days(days);

  return last30Days.map((date) => {
    const dayBookings = bookings.filter((b) => {
      if (!b.createdAt) return false;
      const bookingDate = new Date(b.createdAt);
      return isSameDay(bookingDate, date);
    });

    return {
      date: format(date, "dd/MM"),
      bookings: dayBookings.length,
      revenue: dayBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
    };
  });
};

/**
 * Get status color by status key (case-insensitive)
 */
const getStatusColor = (status: string): string => {
  const upperStatus = status.toUpperCase();
  return STATUS_COLORS[upperStatus] || STATUS_COLORS[status] || "#6b7280";
};

/**
 * Prepare revenue by status data for bar chart
 * @param bookings - Array of booking summaries
 * @returns Array of revenue by status data points
 */
export const prepareRevenueByStatusData = (
  bookings: AdminBookingSummary[]
): RevenueByStatusData[] => {
  if (!Array.isArray(bookings)) {
    return [];
  }

  // Get unique statuses from bookings
  const uniqueStatuses = Array.from(new Set(bookings.map((b) => b.status)));

  // If no bookings, return default statuses
  const statuses = uniqueStatuses.length > 0 
    ? uniqueStatuses 
    : ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

  return statuses.map((status) => {
    const statusBookings = bookings.filter((b) => b.status === status);
    const upperStatus = status.toUpperCase();

    return {
      status: STATUS_LABELS[upperStatus] || STATUS_LABELS[status] || status,
      revenue: statusBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      count: statusBookings.length,
      color: getStatusColor(status),
    };
  }).filter(data => data.count > 0); // Only include statuses with bookings
};

/**
 * Format tooltip value for charts
 * @param value - Numeric value
 * @param name - Name of the data series
 * @returns Formatted string
 */
export const formatChartTooltip = (value: number, name: string): string => {
  if (name.toLowerCase().includes("revenue") || name.toLowerCase().includes("doanh thu")) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }
  return value.toString();
};

/**
 * Format Y-axis tick for revenue
 * @param value - Numeric value
 * @returns Formatted string
 */
export const formatRevenueAxis = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  }
  return value.toString();
};
