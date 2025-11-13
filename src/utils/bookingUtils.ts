/**
 * Booking utilities - Central export for all booking-related utilities
 */

// Statistics utilities
export {
  calculateStatistics,
  formatCurrency,
  formatNumber,
  type BookingStatistics,
} from "./bookingStatistics";

// Chart data preparation utilities
export {
  prepareBookingTrendsData,
  prepareRevenueByStatusData,
  formatChartTooltip,
  formatRevenueAxis,
  STATUS_COLORS,
  STATUS_LABELS,
  type BookingTrendData,
  type RevenueByStatusData,
} from "./chartDataPreparation";
