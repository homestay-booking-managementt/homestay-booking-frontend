import { useEffect, useState } from "react";
import { fetchUsers, fetchRevenueReport, fetchAdminBookings } from "@/api/adminApi";
import type { AdminUser, AdminRevenueReport, AdminBookingSummary } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaUsers, FaCalendarAlt, FaHome, FaDollarSign } from "react-icons/fa";

const AdminMainDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [revenue, setRevenue] = useState<AdminRevenueReport | null>(null);
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);
  const [userGrowthError, setUserGrowthError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, revenueData, bookingsData] = await Promise.all([
        fetchUsers().catch(() => []),
        fetchRevenueReport().catch(() => null),
        fetchAdminBookings().catch(() => []),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setRevenue(revenueData);
      setBookings(Array.isArray(bookingsData) ? bookingsData : []);

      // Check for errors
      if (!revenueData) {
        setStatsError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      }
      if (!usersData || usersData.length === 0) {
        setUserGrowthError("Không thể tải dữ liệu tăng trưởng người dùng. Hiện thị dữ liệu trống.");
      }
    } catch (error) {
      showAlert("Không thể tải dữ liệu dashboard", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 1).length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter((b) => b.status === "COMPLETED").length;

  // Generate month labels (T1 - T12)
  const last12Months = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);

  const totalRevenue = revenue?.items?.reduce((sum, item) => sum + (item.totalRevenue || 0), 0) || 0;

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Statistics Error Alert */}
      {statsError && (
        <div className="alert alert-error">
          <span className="alert-icon">⚠️</span>
          <span>{statsError}</span>
        </div>
      )}

      {/* Quick Stats - Moved to top */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h4>Tổng người dùng</h4>
            <p className="stat-value">{totalUsers}</p>
            <p className="stat-detail">
              Active: {activeUsers} | Inactive: {totalUsers - activeUsers}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-pink">
            <FaCalendarAlt />
          </div>
          <div className="stat-content">
            <h4>Đặt phòng</h4>
            <p className="stat-value">{totalBookings}</p>
            <p className="stat-detail">
              Hoàn thành: {completedBookings} | Đang xử lý: {totalBookings - completedBookings}
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <FaHome />
          </div>
          <div className="stat-content">
            <h4>Homestay</h4>
            <p className="stat-value">{revenue?.items?.length || 0}</p>
            <p className="stat-detail">Tổng số homestay trong hệ thống</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h4>Doanh thu</h4>
            <p className="stat-value">{totalRevenue.toLocaleString("vi-VN")} VND</p>
            <p className="stat-detail">Tổng doanh thu từ đặt phòng</p>
          </div>
        </div>
      </div>

      {/* User Growth Chart */}
      <div className="dashboard-card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3>Biểu đồ Tăng trưởng Người dùng</h3>
          <p className="card-subtitle">Số lượng user mới theo tháng (12 tháng gần nhất)</p>
        </div>

        {userGrowthError ? (
          <div className="alert alert-warning">
            <span className="alert-icon">ℹ️</span>
            <span>{userGrowthError}</span>
          </div>
        ) : (
          <div className="chart-wrapper">
            <div className="chart-y-axis">
              <span>4</span>
              <span>3</span>
              <span>2</span>
              <span>1</span>
              <span>0</span>
            </div>
            <div className="chart-content">
              <div className="chart-area">
                <svg className="chart-svg" viewBox="0 0 1200 280" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="1200" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="70" x2="1200" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="140" x2="1200" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="210" x2="1200" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="0" y1="280" x2="1200" y2="280" stroke="#e5e7eb" strokeWidth="1" />

                  {/* Line - Tổng user mới */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    points="0,280 100,280 200,280 300,280 400,280 500,280 600,280 700,280 800,280 900,280 1000,280 1100,280 1200,280"
                  />

                  {/* Line - User active */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    points="0,280 100,280 200,280 300,280 400,280 500,280 600,280 700,280 800,280 900,280 1000,280 1100,280 1200,280"
                  />

                  {/* Data points */}
                  {last12Months.map((_, index) => {
                    const x = (index * 1200) / 11;
                    return (
                      <g key={index}>
                        <circle cx={x} cy="280" r="4" fill="#3b82f6" />
                        <circle cx={x} cy="280" r="4" fill="#10b981" />
                      </g>
                    );
                  })}
                </svg>
              </div>
              <div className="chart-x-labels">
                {last12Months.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-dot blue" />
                  <span>Tổng số user mới</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot green" />
                  <span>Những user mới vẫn còn active</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Revenue & Payment Chart */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Biểu đồ Doanh thu & Thanh toán</h3>
          <p className="card-subtitle">Doanh thu và số lượng thanh toán theo tháng</p>
        </div>

        <div className="chart-wrapper">
          <div className="chart-y-axis">
            <span>4</span>
            <span>3</span>
            <span>2</span>
            <span>1</span>
            <span>0</span>
          </div>
          <div className="chart-content">
            <div className="chart-area">
              <svg className="chart-svg" viewBox="0 0 1200 280" preserveAspectRatio="none">
                {/* Grid lines */}
                <line x1="0" y1="0" x2="1200" y2="0" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="70" x2="1200" y2="70" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="140" x2="1200" y2="140" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="210" x2="1200" y2="210" stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1="280" x2="1200" y2="280" stroke="#e5e7eb" strokeWidth="1" />

                {/* Revenue line */}
                <polyline
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  points="0,280 100,280 200,280 300,280 400,280 500,280 600,280 700,280 800,280 900,280 1000,280 1100,280 1200,280"
                />

                {/* Data points */}
                {last12Months.map((_, index) => {
                  const x = (index * 1200) / 11;
                  return <circle key={index} cx={x} cy="280" r="4" fill="#8b5cf6" />;
                })}
              </svg>
            </div>
            <div className="chart-x-labels">
              {last12Months.map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
            <p className="chart-note">Tháng</p>
          </div>
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1400px;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Alert Styles */
        .alert {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .alert-error {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-warning {
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .alert-icon {
          font-size: 20px;
        }

        /* Dashboard Cards */
        .dashboard-card {
          background: white;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .card-header {
          margin-bottom: 20px;
        }

        .card-header h3 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .card-subtitle {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Chart Styles */
        .chart-wrapper {
          display: flex;
          gap: 16px;
        }

        .chart-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 10px 0;
          color: #6b7280;
          font-size: 12px;
          min-width: 20px;
          text-align: right;
        }

        .chart-content {
          flex: 1;
        }

        .chart-area {
          position: relative;
          height: 280px;
          margin-bottom: 12px;
        }

        .chart-svg {
          width: 100%;
          height: 100%;
        }

        .chart-x-labels {
          display: flex;
          justify-content: space-between;
          color: #6b7280;
          font-size: 12px;
          padding: 0 4px;
        }

        .chart-note {
          text-align: center;
          color: #6b7280;
          font-size: 12px;
          margin: 8px 0 0 0;
        }

        .chart-legend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #4b5563;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .legend-dot.blue {
          background: #3b82f6;
        }

        .legend-dot.green {
          background: #10b981;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: flex-start;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

        .stat-icon-purple {
          background: #e5e7eb;
        }

        .stat-icon-pink {
          background: #e5e7eb;
        }

        .stat-icon-blue {
          background: #e5e7eb;
        }

        .stat-icon-green {
          background: #e5e7eb;
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }

        .stat-value {
          margin: 0 0 4px 0;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-detail {
          margin: 0;
          font-size: 13px;
          color: #9ca3af;
        }

        /* Dark Mode */
        .dark .dashboard-card,
        .dark .stat-card {
          background: #1e293b;
        }

        .dark .card-header h3,
        .dark .stat-value {
          color: #f1f5f9;
        }

        .dark .card-subtitle,
        .dark .stat-content h4 {
          color: #94a3b8;
        }

        .dark .stat-detail,
        .dark .chart-y-axis,
        .dark .chart-x-labels,
        .dark .chart-note,
        .dark .legend-item {
          color: #64748b;
        }

        .dark .alert-error {
          background: #450a0a;
          color: #fca5a5;
          border-color: #7f1d1d;
        }

        .dark .alert-warning {
          background: #451a03;
          color: #fcd34d;
          border-color: #78350f;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .chart-area {
            height: 200px;
          }

          .chart-legend {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminMainDashboard;
