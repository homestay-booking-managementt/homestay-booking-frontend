import { useEffect, useState } from "react";
import { fetchAdminBookings } from "@/api/adminApi";
import type { AdminBookingSummary } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaCalendarAlt, FaCheckCircle, FaClock, FaDollarSign } from "react-icons/fa";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách đặt phòng", "danger");
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings =
    filter === "ALL" ? bookings : bookings.filter((b) => b.status === filter);

  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="admin-bookings-page">
      <div className="page-header">
        <h1>Quản lý Đặt phòng</h1>
        <p>Theo dõi và quản lý tất cả đơn đặt phòng trong hệ thống</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng đơn</span>
            <span className="stat-value">{totalBookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đã hoàn thành</span>
            <span className="stat-value">{completedBookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <FaClock />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đang chờ</span>
            <span className="stat-value">{pendingBookings}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng doanh thu</span>
            <span className="stat-value">{totalRevenue.toLocaleString("vi-VN")} VND</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button className={`filter-btn ${filter === "ALL" ? "active" : ""}`} onClick={() => setFilter("ALL")}>
          Tất cả
        </button>
        <button className={`filter-btn ${filter === "PENDING" ? "active" : ""}`} onClick={() => setFilter("PENDING")}>
          Đang chờ
        </button>
        <button
          className={`filter-btn ${filter === "CONFIRMED" ? "active" : ""}`}
          onClick={() => setFilter("CONFIRMED")}
        >
          Đã xác nhận
        </button>
        <button
          className={`filter-btn ${filter === "COMPLETED" ? "active" : ""}`}
          onClick={() => setFilter("COMPLETED")}
        >
          Hoàn thành
        </button>
        <button
          className={`filter-btn ${filter === "CANCELLED" ? "active" : ""}`}
          onClick={() => setFilter("CANCELLED")}
        >
          Đã hủy
        </button>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Homestay</th>
                <th>Khách</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.homestayName}</td>
                  <td>{booking.guestName}</td>
                  <td>
                    <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                  </td>
                  <td className="price">{booking.totalPrice?.toLocaleString("vi-VN") || "0"} VND</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-bookings-page {
          max-width: 1400px;
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: center;
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
          color: #6b7280;
          background: #e5e7eb;
        }

        .stat-icon.blue {
          background: #e5e7eb;
        }

        .stat-icon.green {
          background: #e5e7eb;
        }

        .stat-icon.yellow {
          background: #e5e7eb;
        }

        .stat-icon.purple {
          background: #e5e7eb;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .filter-bar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          background: white;
          border-radius: 12px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
        }

        .bookings-table thead {
          background: #f9fafb;
        }

        .bookings-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bookings-table td {
          padding: 16px 20px;
          border-top: 1px solid #f3f4f6;
          font-size: 14px;
          color: #1f2937;
        }

        .bookings-table tbody tr:hover {
          background: #f9fafb;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.confirmed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        .price {
          font-weight: 600;
          color: #059669;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .stat-value {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .stat-label {
          color: #94a3b8;
        }

        .dark .stat-card,
        .dark .filter-bar,
        .dark .loading,
        .dark .table-container {
          background: #1e293b;
        }

        .dark .filter-btn {
          background: #0f172a;
          color: #cbd5e0;
          border-color: #334155;
        }

        .dark .filter-btn:hover {
          background: #1e293b;
        }

        .dark .bookings-table thead {
          background: #0f172a;
        }

        .dark .bookings-table th {
          color: #94a3b8;
        }

        .dark .bookings-table td {
          color: #e2e8f0;
          border-top-color: #334155;
        }

        .dark .bookings-table tbody tr:hover {
          background: #0f172a;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .filter-bar {
            flex-direction: column;
          }

          .table-container {
            overflow-x: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminBookingsPage;
