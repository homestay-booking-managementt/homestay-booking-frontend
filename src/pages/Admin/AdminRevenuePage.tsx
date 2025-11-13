import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  fetchRevenueReport,
  fetchRevenueTrends,
  fetchRevenueByStatus,
  fetchTopHomestays,
  fetchMonthlyRevenue,
  fetchRevenueComparison,
  fetchAllBookings,
} from "@/api/adminApi";
import type {
  AdminRevenueReport,
  AdminBookingSummary,
  RevenueTrendData,
  RevenueByStatusData,
  TopHomestayData,
  MonthlyRevenueData,
  ComparisonData,
  TimeRange,
} from "@/types/admin";
import type { BookingTrendData } from "@/utils/bookingUtils";
import { showAlert } from "@/utils/showAlert";
import TimeFilterBar from "@/components/revenue/TimeFilterBar";
import SummaryCard from "@/components/revenue/SummaryCard";
import BookingTrendsChart from "@/components/charts/BookingTrendsChart";
import RevenueByStatusChart from "@/components/charts/RevenueByStatusChart";
import BookingStatusPieChart from "@/components/charts/BookingStatusPieChart";
import MonthlyRevenueChart from "@/components/charts/MonthlyRevenueChart";
import TopHomestaysTable from "@/components/revenue/TopHomestaysTable";
import ChartErrorBoundary from "@/components/revenue/ChartErrorBoundary";
import EmptyState from "@/components/revenue/EmptyState";
import {
  FaDollarSign,
  FaCheckCircle,
  FaShoppingCart,
  FaChartLine,
  FaHome,
  FaUsers,
} from "react-icons/fa";

const AdminRevenuePage = () => {
  // State for time range
  const [timeRange, setTimeRange] = useState<TimeRange>({
    type: "30d",
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
  });

  // State for data
  const [revenueReport, setRevenueReport] = useState<AdminRevenueReport | null>(null);
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [revenueTrends, setRevenueTrends] = useState<BookingTrendData[]>([]);
  const [revenueByStatus, setRevenueByStatus] = useState<RevenueByStatusData[]>([]);
  const [topHomestays, setTopHomestays] = useState<TopHomestayData[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenueData[]>([]);
  const [comparison, setComparison] = useState<ComparisonData | null>(null);

  // State for loading and errors
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const navigate = useNavigate();

  /**
   * Convert RevenueTrendData to BookingTrendData format
   */
  const convertTrendData = useCallback((data: RevenueTrendData[]): BookingTrendData[] => {
    return data.map(item => ({
      date: format(new Date(item.date), "dd/MM"),
      bookings: item.bookings,
      revenue: item.revenue,
    }));
  }, []);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setErrors({});

    const startDate = timeRange.startDate.toISOString().split("T")[0];
    const endDate = timeRange.endDate.toISOString().split("T")[0];

    try {
      // Fetch all data in parallel for better performance
      const [
        reportData,
        bookingsData,
        trendsData,
        statusData,
        homestaysData,
        monthlyData,
        comparisonData,
      ] = await Promise.allSettled([
        fetchRevenueReport(),
        fetchAllBookings(),
        fetchRevenueTrends(startDate, endDate),
        fetchRevenueByStatus(startDate, endDate),
        fetchTopHomestays(startDate, endDate, 10),
        fetchMonthlyRevenue(startDate, endDate),
        fetchRevenueComparison(startDate, endDate),
      ]);

      // Handle revenue report
      if (reportData.status === "fulfilled") {
        setRevenueReport(reportData.value);
      } else {
        setErrors((prev) => ({ ...prev, report: "Không thể tải báo cáo doanh thu" }));
      }

      // Handle bookings
      if (bookingsData.status === "fulfilled") {
        setBookings(bookingsData.value);
      } else {
        setErrors((prev) => ({ ...prev, bookings: "Không thể tải dữ liệu đặt phòng" }));
      }

      // Handle revenue trends
      if (trendsData.status === "fulfilled") {
        setRevenueTrends(convertTrendData(trendsData.value));
      } else {
        setErrors((prev) => ({ ...prev, trends: "Không thể tải dữ liệu xu hướng" }));
      }

      // Handle revenue by status
      if (statusData.status === "fulfilled") {
        // Add colors to status data
        const dataWithColors = statusData.value.map((item: RevenueByStatusData) => {
          const upperStatus = item.status.toUpperCase();
          const STATUS_COLORS: Record<string, string> = {
            PENDING: "#FFA726",
            CONFIRMED: "#0D6EFD",
            COMPLETED: "#10B981",
            CANCELLED: "#EF4444",
            PAID: "#9B5DE5",
            CHECKED_IN: "#00BCD4",
            CHECKED_OUT: "#607D8B",
            REFUNDED: "#FF6B6B",
            pending: "#FFA726",
            confirmed: "#0D6EFD",
            completed: "#10B981",
            cancelled: "#EF4444",
            paid: "#9B5DE5",
            checked_in: "#00BCD4",
            checked_out: "#607D8B",
            refunded: "#FF6B6B",
          };
          const STATUS_LABELS: Record<string, string> = {
            PENDING: "Chờ xác nhận",
            CONFIRMED: "Đã xác nhận",
            COMPLETED: "Hoàn tất",
            CANCELLED: "Đã hủy",
            pending: "Chờ xác nhận",
            confirmed: "Đã xác nhận",
            completed: "Hoàn tất",
            cancelled: "Đã hủy",
          };
          
          return {
            ...item,
            status: STATUS_LABELS[upperStatus] || STATUS_LABELS[item.status] || item.status,
            color: STATUS_COLORS[upperStatus] || STATUS_COLORS[item.status] || "#6b7280",
          };
        });
        setRevenueByStatus(dataWithColors);
      } else {
        setErrors((prev) => ({ ...prev, status: "Không thể tải dữ liệu theo trạng thái" }));
      }

      // Handle top homestays
      if (homestaysData.status === "fulfilled") {
        // Add rank numbers starting from 1
        const homestaysWithRank = homestaysData.value.map((item: TopHomestayData, index: number) => ({
          ...item,
          rank: index + 1,
        }));
        setTopHomestays(homestaysWithRank);
      } else {
        setErrors((prev) => ({ ...prev, homestays: "Không thể tải top homestays" }));
      }

      // Handle monthly revenue
      if (monthlyData.status === "fulfilled") {
        setMonthlyRevenue(monthlyData.value);
      } else {
        setErrors((prev) => ({ ...prev, monthly: "Không thể tải dữ liệu theo tháng" }));
      }

      // Handle comparison
      if (comparisonData.status === "fulfilled") {
        setComparison(comparisonData.value);
      } else {
        setErrors((prev) => ({ ...prev, comparison: "Không thể tải dữ liệu so sánh" }));
      }
    } catch (error) {
      showAlert("Có lỗi xảy ra khi tải dữ liệu", "danger");
    } finally {
      setLoading(false);
    }
  }, [timeRange, convertTrendData]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleTimeRangeChange = useCallback((newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
  }, []);

  const handleHomestayClick = useCallback((homestayId: number) => {
    navigate(`/admin/homestays/${homestayId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    loadAllData();
  }, [loadAllData]);

  // Memoize comparison values for summary cards
  const revenueComparison = useMemo(() => {
    if (!comparison) return undefined;
    return {
      value: comparison.revenueChange,
      percentage: comparison.revenueChangePercentage,
    };
  }, [comparison]);

  const bookingsComparison = useMemo(() => {
    if (!comparison) return undefined;
    return {
      value: comparison.bookingsChange,
      percentage: comparison.bookingsChangePercentage,
    };
  }, [comparison]);

  // Check if we have any data
  const hasData = useMemo(() => {
    return (
      (revenueReport?.totalRevenue || 0) > 0 ||
      revenueTrends.length > 0 ||
      revenueByStatus.length > 0 ||
      bookings.length > 0
    );
  }, [revenueReport, revenueTrends, revenueByStatus, bookings]);

  // Show empty state if no data and not loading
  if (!loading && !hasData) {
    return (
      <div className="admin-revenue-page">
        <div className="page-header">
          <h1>Báo cáo Doanh thu</h1>
          <p>Thống kê và phân tích doanh thu từ đặt phòng homestay</p>
        </div>

        <TimeFilterBar value={timeRange} onChange={handleTimeRangeChange} />

        <EmptyState
          icon="📊"
          title="Chưa có dữ liệu doanh thu"
          message="Hiện tại chưa có dữ liệu đặt phòng trong khoảng thời gian này. Hãy thử thay đổi bộ lọc thời gian hoặc kiểm tra lại sau."
          action={{
            label: "Thử lại",
            onClick: handleRetry,
          }}
        />
      </div>
    );
  }

  return (
    <div className="admin-revenue-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Báo cáo Doanh thu</h1>
        <p>Thống kê và phân tích doanh thu từ đặt phòng homestay</p>
      </div>

      {/* Time Filter */}
      <TimeFilterBar
        value={timeRange}
        onChange={handleTimeRangeChange}
      />

      {/* Summary Cards */}
      <div className="summary-grid">
        <SummaryCard
          title="Tổng doanh thu"
          value={revenueReport?.totalRevenue || 0}
          icon={<FaDollarSign />}
          color="purple"
          format="currency"
          loading={loading}
          comparison={revenueComparison}
        />
        <SummaryCard
          title="Doanh thu hoàn thành"
          value={revenueReport?.completedRevenue || 0}
          icon={<FaCheckCircle />}
          color="green"
          format="currency"
          loading={loading}
        />
        <SummaryCard
          title="Số đơn đặt phòng"
          value={revenueReport?.totalBookings || 0}
          icon={<FaShoppingCart />}
          color="blue"
          format="number"
          loading={loading}
          comparison={bookingsComparison}
        />
        <SummaryCard
          title="Giá trị trung bình/đơn"
          value={revenueReport?.averageBookingValue || 0}
          icon={<FaChartLine />}
          color="orange"
          format="currency"
          loading={loading}
        />
        <SummaryCard
          title="Số Homestay hoạt động"
          value={revenueReport?.totalHomestays || 0}
          icon={<FaHome />}
          color="teal"
          format="number"
          loading={loading}
        />
        <SummaryCard
          title="Số khách hàng"
          value={revenueReport?.totalCustomers || 0}
          icon={<FaUsers />}
          color="pink"
          format="number"
          loading={loading}
        />
      </div>

      {/* Charts Grid */}
      <ChartErrorBoundary onReset={handleRetry}>
        <div className="charts-grid">
          {/* Revenue Trends Chart */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Xu hướng Doanh thu</h3>
              <p className="chart-subtitle">Doanh thu và số đơn theo ngày</p>
            </div>
            <ChartErrorBoundary onReset={handleRetry}>
              <BookingTrendsChart
                data={revenueTrends}
                loading={loading}
                error={errors.trends}
                onRetry={handleRetry}
              />
            </ChartErrorBoundary>
          </div>

          {/* Revenue by Status Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Doanh thu theo Trạng thái</h3>
              <p className="chart-subtitle">Phân bố doanh thu theo trạng thái đơn</p>
            </div>
            <ChartErrorBoundary onReset={handleRetry}>
              <RevenueByStatusChart
                data={revenueByStatus}
                loading={loading}
                error={errors.status}
                onRetry={handleRetry}
              />
            </ChartErrorBoundary>
          </div>

          {/* Booking Status Pie Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Phân bố Đơn đặt phòng</h3>
              <p className="chart-subtitle">Tỷ lệ đơn theo trạng thái</p>
            </div>
            <ChartErrorBoundary onReset={handleRetry}>
              <BookingStatusPieChart
                data={bookings}
                loading={loading}
                error={errors.bookings}
                onRetry={handleRetry}
              />
            </ChartErrorBoundary>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="chart-card full-width">
            <div className="chart-header">
              <h3>Doanh thu theo Tháng</h3>
              <p className="chart-subtitle">12 tháng gần nhất</p>
            </div>
            <ChartErrorBoundary onReset={handleRetry}>
              <MonthlyRevenueChart
                data={monthlyRevenue}
                loading={loading}
                error={errors.monthly}
                onRetry={handleRetry}
              />
            </ChartErrorBoundary>
          </div>
        </div>
      </ChartErrorBoundary>

      {/* Top Homestays Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Top 10 Homestay theo Doanh thu</h3>
          <p className="table-subtitle">Homestays có doanh thu cao nhất trong kỳ</p>
        </div>
        <TopHomestaysTable
          data={topHomestays}
          loading={loading}
          error={errors.homestays}
          onHomestayClick={handleHomestayClick}
          onRetry={handleRetry}
        />
      </div>

      <style>{`
        .admin-revenue-page {
          max-width: 1400px;
          padding: 0;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin: 24px 0;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
          margin: 24px 0;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .chart-card.full-width {
          grid-column: 1 / -1;
        }

        .chart-header {
          margin-bottom: 20px;
        }

        .chart-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .chart-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .table-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          margin: 24px 0;
        }

        .table-header {
          padding: 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .table-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .table-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .chart-header h3,
        .dark .table-header h3 {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .chart-subtitle,
        .dark .table-subtitle {
          color: #94a3b8;
        }

        .dark .chart-card,
        .dark .table-card {
          background: #1e293b;
        }

        .dark .table-header {
          border-bottom-color: #334155;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .chart-card.full-width {
            grid-column: 1;
          }
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 24px;
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .chart-card,
          .table-card {
            padding: 16px;
          }

          .chart-header,
          .table-header {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminRevenuePage;
