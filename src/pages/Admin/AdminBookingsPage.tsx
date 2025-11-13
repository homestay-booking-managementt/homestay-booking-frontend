import { useEffect, useState, useMemo, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { fetchAdminBookings, fetchBookingsByCustomerId } from "@/api/adminApi";
import type { AdminBookingSummary } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import {
  calculateStatistics,
  formatCurrency,
  prepareBookingTrendsData,
  prepareRevenueByStatusData,
} from "@/utils/bookingUtils";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaDollarSign,
  FaChartLine,
  FaTimes,
  FaSortUp,
  FaSortDown,
  FaSort,
  FaUsers,
} from "react-icons/fa";
import BookingTrendsChart from "@/components/charts/BookingTrendsChart";
import RevenueByStatusChart from "@/components/charts/RevenueByStatusChart";
import BookingCard from "@/components/booking/BookingCard";
import BookingDetailModal from "@/components/booking/BookingDetailModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorState from "@/components/ErrorState";
import "./AdminBookingsPage.customer.css";

type SortField = "id" | "checkIn" | "totalPrice";
type SortDirection = "asc" | "desc";

const AdminBookingsPage = () => {
  // Read query params for customer filter
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId');
  const customerName = searchParams.get('customerName');

  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [customerInfo, setCustomerInfo] = useState<{
    id: number;
    name: string;
    email: string;
    phone: string;
  } | null>(null);
  const itemsPerPage = 5;

  useEffect(() => {
    loadBookings();
  }, []);

  // Handle view detail
  const handleViewDetail = (bookingId: number) => {
    setSelectedBookingId(bookingId);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedBookingId(null);
  };

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Handle Escape key to clear selection or search
    if (event.key === "Escape") {
      if (showDetailModal) {
        handleCloseModal();
        event.preventDefault();
      } else if (searchTerm) {
        setSearchTerm("");
        event.preventDefault();
      }
    }
  }, [showDetailModal, searchTerm]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const loadBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      if (customerId) {
        // Load bookings for specific customer
        console.log("🔵 [AdminBookingsPage] Loading bookings for customer:", customerId);
        const result = await fetchBookingsByCustomerId(Number(customerId));
        console.log("🔵 [AdminBookingsPage] Result:", result);
        setBookings(Array.isArray(result.bookings) ? result.bookings : []);
        setCustomerInfo(result.customerInfo || null);
        console.log("🔵 [AdminBookingsPage] Bookings set:", result.bookings?.length || 0);
      } else {
        // Load all bookings
        const data = await fetchAdminBookings();
        setBookings(Array.isArray(data) ? data : []);
        setCustomerInfo(null);
      }
      setError(null);
    } catch (error: any) {
      console.error("🔴 [AdminBookingsPage] Error loading bookings:", error);
      const errorMessage = error?.message || "Không thể tải danh sách đặt phòng. Vui lòng thử lại.";
      setError(errorMessage);
      showAlert(errorMessage, "danger");
      setBookings([]);
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await loadBookings();
  };

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let result = bookings;

    // Filter by status
    if (filter !== "ALL") {
      result = result.filter((b) => b.status === filter);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.id.toString().includes(searchLower) ||
          b.homestayName?.toLowerCase().includes(searchLower) ||
          b.guestName?.toLowerCase().includes(searchLower) ||
          b.userName?.toLowerCase().includes(searchLower)
      );
    }

    // Sort bookings
    if (sortField) {
      result = [...result].sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case "id":
            aValue = a.id;
            bValue = b.id;
            break;
          case "checkIn":
            aValue = a.checkIn ? new Date(a.checkIn).getTime() : 0;
            bValue = b.checkIn ? new Date(b.checkIn).getTime() : 0;
            break;
          case "totalPrice":
            aValue = a.totalPrice || 0;
            bValue = b.totalPrice || 0;
            break;
          default:
            return 0;
        }

        if (sortDirection === "asc") {
          return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
        } else {
          return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
        }
      });
    }

    return result;
  }, [bookings, filter, searchTerm, sortField, sortDirection]);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field with ascending direction
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  // Calculate statistics using utility function with memoization
  const statistics = useMemo(() => calculateStatistics(bookings), [bookings]);

  // Prepare chart data with memoization
  const trendData = useMemo(() => prepareBookingTrendsData(bookings), [bookings]);
  const statusData = useMemo(() => prepareRevenueByStatusData(bookings), [bookings]);

  return (
    <div className="admin-bookings-page">
      <div className="page-header">
        {customerId && customerName ? (
          <>
            <div className="breadcrumb">
              <Link to="/admin/users" className="breadcrumb-link">
                <FaUsers /> Quản lý người dùng
              </Link>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-current">
                <FaCalendarAlt /> Booking của {decodeURIComponent(customerName)}
              </span>
            </div>
            <h1>Booking của {decodeURIComponent(customerName)}</h1>
            {customerInfo && (
              <div className="customer-info-card">
                <div className="customer-avatar">
                  {customerInfo.name.charAt(0).toUpperCase()}
                </div>
                <div className="customer-details">
                  <p className="customer-name">{customerInfo.name}</p>
                  <p className="customer-email">{customerInfo.email}</p>
                  {customerInfo.phone && <p className="customer-phone">{customerInfo.phone}</p>}
                  <p className="customer-id">ID: {customerInfo.id}</p>
                </div>
                <div className="customer-stats">
                  <span className="stat-badge">
                    <FaCalendarAlt /> {bookings.length} booking
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <h1>Quản lý Đặt phòng</h1>
            <p>Theo dõi và quản lý tất cả đơn đặt phòng trong hệ thống</p>
          </>
        )}
      </div>

      {/* Stats Cards - Only show when NOT viewing specific customer */}
      {!customerId && (
      <section className="stats-grid" aria-label="Thống kê tổng quan đặt phòng">
        <article className="stat-card" aria-label="Tổng số đơn đặt phòng">
          <div className="stat-icon blue" aria-hidden="true">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng đơn</span>
            <span className="stat-value" aria-label={`${statistics.totalBookings} đơn`}>{statistics.totalBookings}</span>
          </div>
        </article>

        <article className="stat-card" aria-label="Số đơn đã hoàn thành">
          <div className="stat-icon green" aria-hidden="true">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đã hoàn thành</span>
            <span className="stat-value" aria-label={`${statistics.completedBookings} đơn`}>{statistics.completedBookings}</span>
          </div>
        </article>

        <article className="stat-card" aria-label="Số đơn đang chờ">
          <div className="stat-icon yellow" aria-hidden="true">
            <FaClock />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đang chờ</span>
            <span className="stat-value" aria-label={`${statistics.pendingBookings} đơn`}>{statistics.pendingBookings}</span>
          </div>
        </article>

        <article className="stat-card" aria-label="Tổng doanh thu">
          <div className="stat-icon purple" aria-hidden="true">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng doanh thu</span>
            <span className="stat-value" aria-label={`${formatCurrency(statistics.totalRevenue)}`}>{formatCurrency(statistics.totalRevenue)}</span>
          </div>
        </article>
      </section>
      )}

      {/* Charts Section - Only show when NOT viewing specific customer */}
      {!customerId && (
      <section className="charts-section" aria-label="Biểu đồ phân tích">
        <article className="chart-card">
          <header className="chart-header">
            <FaChartLine className="chart-icon" aria-hidden="true" />
            <h3>Xu hướng đặt phòng (30 ngày gần nhất)</h3>
          </header>
          <ErrorBoundary onReset={handleRetry}>
            <BookingTrendsChart 
              data={trendData} 
              loading={loading} 
              error={error}
              onRetry={handleRetry}
            />
          </ErrorBoundary>
        </article>

        <article className="chart-card">
          <header className="chart-header">
            <FaChartLine className="chart-icon" aria-hidden="true" />
            <h3>Doanh thu theo trạng thái</h3>
          </header>
          <ErrorBoundary onReset={handleRetry}>
            <RevenueByStatusChart 
              data={statusData} 
              loading={loading} 
              error={error}
              onRetry={handleRetry}
            />
          </ErrorBoundary>
        </article>
      </section>
      )}

      {/* Search and Filters */}
      <section className="search-filter-section" aria-label="Tìm kiếm và lọc đặt phòng">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm theo ID, tên homestay, tên khách..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Tìm kiếm đặt phòng"
          />
          {searchTerm && (
            <button 
              className="clear-btn" 
              onClick={() => setSearchTerm("")} 
              title="Xóa tìm kiếm"
              aria-label="Xóa tìm kiếm"
            >
              <FaTimes aria-hidden="true" />
            </button>
          )}
        </div>

        {searchTerm && (
          <div className="search-results-info" role="status" aria-live="polite">
            Tìm thấy <strong>{filteredBookings.length}</strong> kết quả cho "{searchTerm}"
          </div>
        )}
      </section>

      {/* Bookings List */}
      {loading ? (
        <div className="loading" role="status" aria-live="polite">Đang tải...</div>
      ) : error ? (
        <ErrorState 
          message={error} 
          onRetry={handleRetry}
          retrying={retrying}
        />
      ) : (
        <section className="bookings-grid" aria-label="Danh sách đặt phòng">
          {paginatedBookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onClick={() => handleViewDetail(booking.id)}
            />
          ))}
        </section>
      )}

      {/* Pagination */}
      {!loading && filteredBookings.length > 0 && totalPages > 1 && (
        <nav className="pagination-wrapper" aria-label="Phân trang danh sách đặt phòng">
            <div className="pagination-info" role="status" aria-live="polite">
              Hiển thị {startIndex + 1} - {Math.min(endIndex, filteredBookings.length)} trong tổng số{" "}
              {filteredBookings.length} đơn
            </div>
            <div className="pagination" role="navigation" aria-label="Điều hướng trang">
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Trang trước"
              >
                Trước
              </button>

              {getPageNumbers().map((page, index) =>
                typeof page === "number" ? (
                  <button
                    key={index}
                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                    aria-label={`Trang ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ) : (
                  <span key={index} className="pagination-ellipsis" aria-hidden="true">
                    {page}
                  </span>
                )
              )}

              <button
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Trang sau"
              >
                Sau
              </button>
            </div>
          </nav>
        )}

      {/* Booking Detail Modal */}
      <BookingDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        bookingId={selectedBookingId}
      />

      <style>{`
        .admin-bookings-page {
          max-width: 1400px;
          padding: 24px;
        }

        .page-header {
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
          line-height: 1.5;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
          gap: 24px;
          margin-bottom: 32px;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .chart-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #e5e7eb;
        }

        .chart-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.4;
        }

        .chart-icon {
          font-size: 20px;
          color: #8b5cf6;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .stat-card:hover {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transform: translateY(-4px);
          border-color: #e5e7eb;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          color: white;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .stat-icon.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .stat-icon.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .stat-icon.yellow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .stat-icon.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
          line-height: 1.4;
          font-weight: 500;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .search-filter-section {
          margin-bottom: 24px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s ease;
          margin-bottom: 12px;
        }

        .search-box:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1f2937;
          background: transparent;
          padding-left: 4px;
        }

        .search-box input:focus {
          outline: none;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .clear-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .clear-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .clear-btn:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .search-results-info {
          padding: 8px 12px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
          border-radius: 8px;
          font-size: 14px;
          color: #4c1d95;
        }

        .search-results-info strong {
          color: #5b21b6;
          font-weight: 700;
        }



        .loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          background: white;
          border-radius: 12px;
        }

        .bookings-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #78350f;
        }

        .status-badge.confirmed {
          background: #dbeafe;
          color: #1e3a8a;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #064e3b;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #7f1d1d;
        }

        .price {
          font-weight: 600;
          color: #059669;
        }

        /* Pagination */
        .pagination-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .pagination {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pagination-btn {
          padding: 8px 12px;
          min-width: 40px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-btn:focus {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .pagination-ellipsis {
          padding: 8px 4px;
          color: #9ca3af;
          font-size: 14px;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .stat-value,
        .dark .chart-header h3 {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .stat-label {
          color: #94a3b8;
        }

        .dark .stat-card,
        .dark .chart-card,
        .dark .loading,
        .dark .pagination-wrapper {
          background: #1e293b;
        }

        .dark .pagination-btn {
          background: #0f172a;
          color: #cbd5e0;
          border-color: #334155;
        }

        .dark .pagination-btn:hover:not(:disabled) {
          background: #1e293b;
        }

        /* Dark mode status badges with improved contrast */
        .dark .status-badge.pending {
          background: #92400e;
          color: #fef3c7;
        }

        .dark .status-badge.confirmed {
          background: #1e3a8a;
          color: #dbeafe;
        }

        .dark .status-badge.completed {
          background: #064e3b;
          color: #d1fae5;
        }

        .dark .status-badge.cancelled {
          background: #7f1d1d;
          color: #fee2e2;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-card {
            padding: 16px;
          }

          .stat-icon {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }

          .stat-value {
            font-size: 20px;
          }

          .stat-label {
            font-size: 13px;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .chart-card {
            padding: 16px;
          }

          .chart-header h3 {
            font-size: 16px;
          }

          .filter-bar {
            flex-direction: column;
          }

          .pagination-wrapper {
            flex-direction: column;
            gap: 16px;
          }

          .pagination {
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBookingsPage;
