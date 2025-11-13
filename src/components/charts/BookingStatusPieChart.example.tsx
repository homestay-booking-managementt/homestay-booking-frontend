/**
 * Example usage of BookingStatusPieChart component
 * 
 * This file demonstrates how to use the BookingStatusPieChart component
 * in the AdminRevenuePage or other admin pages.
 */

import { useState, useEffect } from "react";
import BookingStatusPieChart from "./BookingStatusPieChart";
import { fetchAllBookings } from "@/api/adminApi";
import type { AdminBookingSummary } from "@/types/admin";

const BookingStatusPieChartExample = () => {
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (err) {
      setError("Không thể tải dữ liệu đặt phòng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chart-container">
      <h3>Phân bố Đơn đặt phòng theo Trạng thái</h3>
      <BookingStatusPieChart
        data={bookings}
        loading={loading}
        error={error}
        onRetry={loadBookings}
      />
    </div>
  );
};

export default BookingStatusPieChartExample;

/**
 * Integration Example in AdminRevenuePage:
 * 
 * import BookingStatusPieChart from "@/components/charts/BookingStatusPieChart";
 * 
 * // Inside your component:
 * const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
 * 
 * // In your JSX:
 * <div className="charts-section">
 *   <div className="chart-card">
 *     <h3>Phân bố Đơn đặt phòng</h3>
 *     <BookingStatusPieChart 
 *       data={bookings} 
 *       loading={loading}
 *       error={error}
 *       onRetry={loadBookings}
 *     />
 *   </div>
 * </div>
 */
