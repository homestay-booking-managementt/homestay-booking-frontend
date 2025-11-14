import { useEffect, useState } from "react";
import {
  fetchUsers,
  fetchRevenueReport,
  fetchAdminBookings,
  fetchPendingHomestayRequests,
  fetchAllHomestaysForAdmin,
} from "@/api/adminApi";
import type {
  AdminUser,
  AdminRevenueReport,
  AdminBookingSummary,
  AdminHomestayRequest,
} from "@/types/admin";
import type { Homestay } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { FaUsers, FaCalendarAlt, FaHome, FaDollarSign } from "react-icons/fa";

const AdminMainDashboard = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [revenue, setRevenue] = useState<AdminRevenueReport | null>(null);
  const [bookings, setBookings] = useState<AdminBookingSummary[]>([]);
  const [homestayRequests, setHomestayRequests] = useState<AdminHomestayRequest[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'api' | 'mock'>('mock');

  // Helper function: Tính toán doanh thu theo homestay từ bookings
  const calculateRevenueByHomestay = (
    revenueData: AdminRevenueReport | null,
    bookings: AdminBookingSummary[],
    homestays: Homestay[]
  ): AdminRevenueReport => {
    // Tính toán revenue per homestay từ completed bookings
    const homestayRevenueMap = new Map<number, { name: string; revenue: number }>();

    bookings
      .filter((b) => b.status === "COMPLETED" || b.status === "completed")
      .forEach((booking) => {
        const homestayId = booking.homestayId;
        const homestayName = booking.homestayName || "Unknown";
        const revenue = booking.totalPrice || 0;

        if (homestayId) {
          const existing = homestayRevenueMap.get(homestayId);
          if (existing) {
            existing.revenue += revenue;
          } else {
            homestayRevenueMap.set(homestayId, { name: homestayName, revenue });
          }
        }
      });

    // Convert map to items array
    const items = Array.from(homestayRevenueMap.entries()).map(([homestayId, data]) => ({
      homestayId,
      homestayName: data.name,
      totalRevenue: data.revenue,
    }));

    console.log("📊 [calculateRevenueByHomestay] Calculated items:", items);

    return {
      ...revenueData,
      items,
    };
  };

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    
    try {
      console.log("📊 Đang tải dữ liệu Admin Dashboard từ Backend API...");
      
      const [usersData, revenueData, bookingsData, requestsData, homestaysData] =
        await Promise.all([
          fetchUsers().catch((err: Error) => {
            console.error("❌ Lỗi tải users:", err);
            return [];
          }),
          fetchRevenueReport().catch((err: Error) => {
            console.error("❌ Lỗi tải revenue:", err);
            return null;
          }),
          fetchAdminBookings().catch((err: Error) => {
            console.error("❌ Lỗi tải bookings:", err);
            return [];
          }),
          fetchPendingHomestayRequests().catch((err: Error) => {
            console.error("❌ Lỗi tải homestay requests:", err);
            return [];
          }),
          fetchAllHomestaysForAdmin().catch((err: Error) => {
            console.error("❌ Lỗi tải homestays:", err);
            return [];
          }),
        ]);

      // Kiểm tra xem có ít nhất 1 API trả về data không
      const hasUsersData = Array.isArray(usersData) && usersData.length > 0;
      const hasBookingsData = Array.isArray(bookingsData) && bookingsData.length > 0;
      const hasHomestaysData = Array.isArray(homestaysData) && homestaysData.length > 0;
      const hasAnyApiData = hasUsersData || hasBookingsData || hasHomestaysData;
      
      if (hasAnyApiData) {
        console.log("✅ Đã tải dữ liệu thực từ Backend API");
        setUsers(usersData);
        
        // Tính toán top homestays từ bookings data
        const revenueWithItems = calculateRevenueByHomestay(
          revenueData, 
          Array.isArray(bookingsData) ? bookingsData : [],
          Array.isArray(homestaysData) ? homestaysData : []
        );
        setRevenue(revenueWithItems);
        
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setHomestayRequests(Array.isArray(requestsData) ? requestsData : []);
        setHomestays(Array.isArray(homestaysData) ? homestaysData : []);
        setDataSource("api");
      } else {
        console.log("⚠️ Sử dụng dữ liệu mẫu (Mock Data)");
        setUsers(getMockUsers());
        setRevenue(getMockRevenue());
        setBookings(getMockBookings());
        setHomestayRequests(getMockHomestayRequests());
        setDataSource('mock');
        showAlert("Đang sử dụng dữ liệu mẫu. Vui lòng kiểm tra kết nối Backend.", "warning");
      }
    } catch (error) {
      console.error("❌ Lỗi nghiêm trọng khi tải dashboard:", error);
      showAlert("Không thể tải dữ liệu dashboard", "danger");
      // Use mock data on error
      setUsers(getMockUsers());
      setRevenue(getMockRevenue());
      setBookings(getMockBookings());
      setHomestayRequests(getMockHomestayRequests());
      setDataSource('mock');
    } finally {
      setLoading(false);
    }
  };

  // Mock data generators
  const getMockUsers = (): AdminUser[] => [
    { id: 1, name: "Nguyễn Văn A", email: "nguyenvana@example.com", role: "CUSTOMER", status: 1 },
    { id: 2, name: "Trần Thị B", email: "tranthib@example.com", role: "CUSTOMER", status: 1 },
    { id: 3, name: "Lê Văn C", email: "levanc@example.com", role: "HOST", status: 1 },
    { id: 4, name: "Phạm Thị D", email: "phamthid@example.com", role: "HOST", status: 1 },
    { id: 5, name: "Hoàng Văn E", email: "hoangvane@example.com", role: "CUSTOMER", status: 0 },
    { id: 6, name: "Võ Thị F", email: "vothif@example.com", role: "ADMIN", status: 1 },
    { id: 7, name: "Đỗ Văn G", email: "dovang@example.com", role: "CUSTOMER", status: 1 },
    { id: 8, name: "Bùi Thị H", email: "buithih@example.com", role: "HOST", status: 1 },
  ];

  const getMockBookings = (): AdminBookingSummary[] => [
    { id: 1, homestayName: "Villa Đà Lạt", guestName: "Nguyễn Văn A", status: "COMPLETED", totalPrice: 5000000 },
    { id: 2, homestayName: "Homestay Hội An", guestName: "Trần Thị B", status: "CONFIRMED", totalPrice: 3000000 },
    { id: 3, homestayName: "Beach House Nha Trang", guestName: "Lê Văn C", status: "PENDING", totalPrice: 8000000 },
    { id: 4, homestayName: "Mountain View Sapa", guestName: "Phạm Thị D", status: "COMPLETED", totalPrice: 4500000 },
    { id: 5, homestayName: "City Apartment Hà Nội", guestName: "Hoàng Văn E", status: "CANCELLED", totalPrice: 2500000 },
    { id: 6, homestayName: "Riverside Huế", guestName: "Võ Thị F", status: "CONFIRMED", totalPrice: 6000000 },
    { id: 7, homestayName: "Garden House Đà Lạt", guestName: "Đỗ Văn G", status: "PENDING", totalPrice: 3500000 },
    { id: 8, homestayName: "Lake View Homestay", guestName: "Bùi Thị H", status: "COMPLETED", totalPrice: 7000000 },
  ];

  const getMockHomestayRequests = (): AdminHomestayRequest[] => [
    { id: 1, homestayName: "Villa Luxury Đà Lạt", ownerName: "Nguyễn Văn X", type: "CREATE", submittedAt: "2024-11-01" },
    { id: 2, homestayName: "Homestay View Biển", ownerName: "Trần Thị Y", type: "CREATE", submittedAt: "2024-11-03" },
    { id: 3, homestayName: "Mountain Resort", ownerName: "Lê Văn Z", type: "UPDATE", submittedAt: "2024-11-05" },
    { id: 4, homestayName: "City Center Apartment", ownerName: "Phạm Thị M", type: "CREATE", submittedAt: "2024-11-07" },
  ];

  const getMockRevenue = (): AdminRevenueReport => ({
    items: [
      { homestayId: 1, homestayName: "Villa Đà Lạt", totalRevenue: 15000000, month: "2024-01" },
      { homestayId: 2, homestayName: "Homestay Hội An", totalRevenue: 12000000, month: "2024-01" },
      { homestayId: 3, homestayName: "Beach House Nha Trang", totalRevenue: 25000000, month: "2024-01" },
      { homestayId: 4, homestayName: "Mountain View Sapa", totalRevenue: 18000000, month: "2024-01" },
      { homestayId: 5, homestayName: "City Apartment Hà Nội", totalRevenue: 8000000, month: "2024-01" },
      { homestayId: 6, homestayName: "Riverside Huế", totalRevenue: 22000000, month: "2024-01" },
      { homestayId: 7, homestayName: "Garden House Đà Lạt", totalRevenue: 14000000, month: "2024-01" },
      { homestayId: 8, homestayName: "Lake View Homestay", totalRevenue: 20000000, month: "2024-01" },
      { homestayId: 9, homestayName: "Forest Retreat", totalRevenue: 16000000, month: "2024-01" },
      { homestayId: 10, homestayName: "Seaside Villa", totalRevenue: 19000000, month: "2024-01" },
    ],
    generatedAt: new Date().toISOString(),
  });

  // Calculate statistics - ưu tiên dùng data từ revenue report nếu có
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 1).length;
  
  // Sử dụng data từ revenue report nếu có, không thì tính từ bookings array
  const totalBookings = revenue?.totalBookings || bookings.length;
  const completedBookings = revenue?.completedBookings || bookings.filter((b) => b.status === "COMPLETED" || b.status === "completed").length;
  const pendingBookings = revenue?.pendingBookings || bookings.filter((b) => b.status === "PENDING" || b.status === "pending").length;
  const cancelledBookings = revenue?.cancelledBookings || bookings.filter((b) => b.status === "CANCELLED" || b.status === "cancelled").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "confirmed").length;
  
  // Tổng homestays: Ưu tiên từ API homestays, không thì từ revenue report
  const totalHomestays = homestays.length || revenue?.totalHomestays || 0;
  const approvedHomestays = homestays.filter((h) => h.status === "approved" || h.status === "2").length;
  const pendingRequests = homestayRequests.filter((r) => r.type === "CREATE").length;

  // Lấy doanh thu từ revenue report (ưu tiên totalRevenue từ BE)
  const totalRevenue = revenue?.totalRevenue || 
    revenue?.items?.reduce((sum, item) => sum + (item.totalRevenue || 0), 0) || 0;

  // Group users by role (exclude Admin from chart - Admin is unique account)
  const customerCount = users.filter((u) => u.role === "CUSTOMER" || (u.roles && u.roles.includes("CUSTOMER"))).length;
  const hostCount = users.filter((u) => u.role === "HOST" || (u.roles && u.roles.includes("HOST"))).length;
  const nonAdminUsers = customerCount + hostCount; // Total users excluding Admin

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
      {/* Data Source Badge */}
      {dataSource === 'mock' && (
        <div className="data-source-badge">
          <span className="badge-icon">⚠️</span>
          <span className="badge-text">Đang sử dụng dữ liệu mẫu</span>
          <span className="badge-hint">Vui lòng kiểm tra kết nối Backend API</span>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="stats-grid">
        <div
          className="stat-card clickable"
          onClick={() => (window.location.href = "/admin/users")}
        >
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

        <div
          className="stat-card clickable"
          onClick={() => (window.location.href = "/admin/bookings")}
        >
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

        <div
          className="stat-card clickable"
          onClick={() => (window.location.href = "/admin/homestays")}
        >
          <div className="stat-icon stat-icon-blue">
            <FaHome />
          </div>
          <div className="stat-content">
            <h4>Homestay</h4>
            <p className="stat-value">{totalHomestays}</p>
            <p className="stat-detail">Chờ duyệt: {pendingRequests}</p>
          </div>
        </div>

        <div
          className="stat-card clickable"
          onClick={() => (window.location.href = "/admin/revenue")}
        >
          <div className="stat-icon stat-icon-green">
            <FaDollarSign />
          </div>
          <div className="stat-content">
            <h4>Doanh thu</h4>
            <p className="stat-value">{totalRevenue.toLocaleString("vi-VN")} ₫</p>
            <p className="stat-detail">Tổng doanh thu từ đặt phòng</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* User Distribution Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Phân bố Người dùng</h3>
            <p className="card-subtitle">Theo vai trò trong hệ thống</p>
          </div>
          <div className="chart-container">
            <div className="pie-chart">
              <div className="pie-segment customer" style={{ 
                background: `conic-gradient(
                  #3b82f6 0% ${(customerCount / (customerCount + hostCount)) * 100}%,
                  #ec4899 ${(customerCount / (customerCount + hostCount)) * 100}% 100%
                )`
              }}>
                <div className="pie-center">
                  <div className="pie-total">{customerCount + hostCount}</div>
                  <div className="pie-label">Tổng</div>
                </div>
              </div>
            </div>
            <div className="chart-legend-vertical">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#3b82f6" }} />
                <span>Khách hàng</span>
                <strong>{customerCount}</strong>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#ec4899" }} />
                <span>Chủ nhà</span>
                <strong>{hostCount}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Status Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Trạng thái Đặt phòng</h3>
            <p className="card-subtitle">Thống kê theo trạng thái</p>
          </div>
          <div className="chart-container">
            <div className="bar-chart">
              <div className="bar-item">
                <div className="bar-label">Chờ xử lý</div>
                <div className="bar-wrapper">
                  <div
                    className="bar-fill pending"
                    style={{ width: `${totalBookings > 0 ? (pendingBookings / totalBookings) * 100 : 0}%` }}
                  >
                    <span className="bar-value">{pendingBookings}</span>
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Đã xác nhận</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill confirmed"
                    style={{ width: `${totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0}%` }}
                  >
                    <span className="bar-value">{confirmedBookings}</span>
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Hoàn thành</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill completed"
                    style={{ width: `${totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0}%` }}
                  >
                    <span className="bar-value">{completedBookings}</span>
                  </div>
                </div>
              </div>
              <div className="bar-item">
                <div className="bar-label">Đã hủy</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar-fill cancelled"
                    style={{ width: `${totalBookings > 0 ? (cancelledBookings / totalBookings) * 100 : 0}%` }}
                  >
                    <span className="bar-value">{cancelledBookings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Homestay Chart */}
      <div className="dashboard-card">
        <div className="card-header">
          <h3>Top 10 Homestay theo Doanh thu</h3>
          <p className="card-subtitle">Homestay có doanh thu cao nhất</p>
        </div>
        <div className="chart-container">
          {loading ? (
            <div className="chart-loading">
              <div className="spinner" />
              <p>Đang tải dữ liệu doanh thu...</p>
            </div>
          ) : (revenue?.items && revenue.items.length > 0) ? (
            <div className="horizontal-bar-chart">
              {revenue.items
                .sort((a, b) => b.totalRevenue - a.totalRevenue)
                .slice(0, 10)
                .map((item, index) => {
                  const maxRevenue = Math.max(...(revenue.items || []).map((i) => i.totalRevenue));
                  const percentage = maxRevenue > 0 ? (item.totalRevenue / maxRevenue) * 100 : 0;
                  
                  // Gradient colors based on ranking (top 3 get special colors)
                  const getGradient = (rank: number) => {
                    if (rank === 0) return "linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)"; // Gold
                    if (rank === 1) return "linear-gradient(90deg, #94a3b8 0%, #64748b 100%)"; // Silver
                    if (rank === 2) return "linear-gradient(90deg, #ea580c 0%, #c2410c 100%)"; // Bronze
                    return "linear-gradient(90deg, #667eea 0%, #764ba2 33%, #f093fb 66%, #4facfe 100%)"; // Default
                  };
                  
                  return (
                    <div key={item.homestayId || index} className="h-bar-item">
                      <div className="h-bar-rank" style={{ 
                        color: index === 0 ? "#f59e0b" : index === 1 ? "#64748b" : index === 2 ? "#ea580c" : undefined 
                      }}>
                        #{index + 1}
                      </div>
                      <div className="h-bar-label" title={item.homestayName}>
                        {item.homestayName}
                      </div>
                      <div className="h-bar-wrapper">
                        <div
                          className="h-bar-fill"
                          style={{ 
                            width: `${percentage}%`,
                            background: getGradient(index)
                          }}
                        />
                        <span className="h-bar-value">
                          {item.totalRevenue.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="chart-empty">
              <div className="empty-icon">📊</div>
              <p className="empty-title">Chưa có dữ liệu doanh thu</p>
              <p className="empty-subtitle">
                Dữ liệu doanh thu sẽ được hiển thị khi có booking hoàn thành
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .admin-dashboard {
          max-width: 1400px;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 24px;
          margin: 24px 0;
        }

        .pie-chart {
          width: 200px;
          height: 200px;
          margin: 0 auto 20px;
        }

        .pie-segment {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pie-center {
          width: 120px;
          height: 120px;
          background: #ffffff;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(148, 163, 184, 0.12);
        }

        .dark .pie-center {
          background: #1e293b;
        }

        .pie-total {
          font-size: 36px;
          font-weight: 700;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .dark .pie-total {
          background: linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .pie-label {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
        }

        .dark .pie-label {
          color: #94a3b8;
        }

        .chart-legend-vertical {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chart-legend-vertical .legend-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }

        .chart-legend-vertical .legend-item:hover {
          background: #f1f5f9;
          transform: translateX(4px);
          border-color: #cbd5e1;
        }

        .dark .chart-legend-vertical .legend-item {
          background: #0f172a;
          border-color: #334155;
        }

        .dark .chart-legend-vertical .legend-item:hover {
          background: #1e293b;
        }

        .chart-legend-vertical .legend-item strong {
          margin-left: auto;
          font-size: 18px;
          color: #1f2937;
        }

        .dark .chart-legend-vertical .legend-item strong {
          color: #f1f5f9;
        }

        .bar-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .bar-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .bar-label {
          font-size: 14px;
          font-weight: 500;
          color: #4b5563;
        }

        .dark .bar-label {
          color: #9ca3af;
        }

        .bar-wrapper {
          position: relative;
          height: 40px;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
        }

        .dark .bar-wrapper {
          background: #0f172a;
          border-color: #334155;
        }

        .bar-fill {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 12px;
          border-radius: 8px;
          transition: width 0.3s ease;
        }

        .bar-fill.pending {
          background: linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 2px 8px rgba(251, 191, 36, 0.3);
        }

        .bar-fill.confirmed {
          background: linear-gradient(90deg, #60a5fa 0%, #3b82f6 100%);
          box-shadow: 0 2px 8px rgba(96, 165, 250, 0.3);
        }

        .bar-fill.completed {
          background: linear-gradient(90deg, #34d399 0%, #10b981 100%);
          box-shadow: 0 2px 8px rgba(52, 211, 153, 0.3);
        }

        .bar-fill.cancelled {
          background: linear-gradient(90deg, #f87171 0%, #ef4444 100%);
          box-shadow: 0 2px 8px rgba(248, 113, 113, 0.3);
        }

        .bar-value {
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .horizontal-bar-chart {
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-x: hidden;
        }

        .h-bar-item {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 4px 0;
          transition: all 0.2s ease;
        }

        .h-bar-item:hover {
          transform: translateX(4px);
        }

        .h-bar-rank {
          min-width: 35px;
          font-size: 14px;
          font-weight: 700;
          color: #0ea5e9;
          text-align: center;
        }

        .dark .h-bar-rank {
          color: #38bdf8;
        }

        .h-bar-label {
          min-width: 180px;
          max-width: 180px;
          font-size: 13px;
          font-weight: 500;
          color: #4b5563;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dark .h-bar-label {
          color: #9ca3af;
        }

        .h-bar-wrapper {
          flex: 1;
          position: relative;
          height: 32px;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
        }

        .dark .h-bar-wrapper {
          background: #0f172a;
          border-color: #334155;
        }

        .h-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, 
            #667eea 0%, 
            #764ba2 33%, 
            #f093fb 66%, 
            #4facfe 100%
          );
          border-radius: 6px;
          transition: width 0.3s ease;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .h-bar-value {
          position: absolute;
          right: 12px;
          font-size: 12px;
          font-weight: 600;
          color: #334155;
        }

        .dark .h-bar-value {
          color: #e2e8f0;
        }

        .chart-container {
          padding: 20px;
        }

        @media (max-width: 768px) {
          .charts-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Stats Grid */
        .admin-dashboard {
          max-width: 1400px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
          display: flex;
          gap: 16px;
          align-items: flex-start;
          transition: all 0.3s ease;
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, 
            #667eea 0%, 
            #764ba2 25%, 
            #f093fb 50%, 
            #4facfe 75%, 
            #00f2fe 100%
          );
          opacity: 0.6;
        }

        .stat-card.clickable {
          cursor: pointer;
        }

        .stat-card.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(148, 163, 184, 0.15);
          border-color: rgba(99, 179, 237, 0.3);
        }

        .stat-card.clickable:hover::before {
          opacity: 1;
        }

        .dark .stat-card {
          background: #1e293b;
          border-color: rgba(51, 65, 85, 0.8);
        }

        .dark .stat-card.clickable:hover {
          box-shadow: 0 8px 20px rgba(99, 179, 237, 0.3);
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
        }

        .stat-icon svg {
          color: white;
        }

        .stat-icon-purple {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.35);
        }

        .stat-icon-pink {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          box-shadow: 0 4px 15px rgba(240, 147, 251, 0.35);
        }

        .stat-icon-blue {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          box-shadow: 0 4px 15px rgba(79, 172, 254, 0.35);
        }

        .stat-icon-green {
          background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
          box-shadow: 0 4px 15px rgba(67, 233, 123, 0.35);
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.05) rotate(5deg);
          transition: transform 0.3s ease;
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

        .dark .stat-content h4 {
          color: #9ca3af;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin: 0 0 8px 0;
        }

        .dark .stat-value {
          color: #f1f5f9;
        }

        .stat-detail {
          margin: 0;
          font-size: 12px;
          color: #9ca3af;
        }

        .dark .stat-detail {
          color: #64748b;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 16px;
        }

        .chart-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 12px;
        }

        .chart-loading p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .dark .chart-loading p {
          color: #94a3b8;
        }

        .chart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          gap: 12px;
          padding: 40px 20px;
        }

        .empty-icon {
          font-size: 64px;
          opacity: 0.5;
          margin-bottom: 8px;
        }

        .empty-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .dark .empty-title {
          color: #f1f5f9;
        }

        .empty-subtitle {
          margin: 0;
          font-size: 14px;
          color: #64748b;
          text-align: center;
          max-width: 400px;
        }

        .dark .empty-subtitle {
          color: #94a3b8;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .dark .spinner {
          border-color: #334155;
          border-top-color: #38bdf8;
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
          background: #ffffff;
          border-radius: 20px;
          padding: 28px;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
          margin-bottom: 24px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          position: relative;
          overflow: hidden;
        }

        .dashboard-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, 
            #667eea 0%, 
            #764ba2 20%,
            #f093fb 40%,
            #4facfe 60%,
            #00f2fe 80%,
            #43e97b 100%
          );
        }

        .dark .dashboard-card {
          background: #1e293b;
          border-color: rgba(51, 65, 85, 0.8);
        }

        .card-header {
          margin-bottom: 20px;
        }

        .card-header h3 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .card-header h3 {
          background: linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .card-subtitle {
          margin: 0;
          font-size: 14px;
          color: #64748b;
        }

        .dark .card-subtitle {
          color: #94a3b8;
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

        /* Data Source Badge */
        .data-source-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #fbbf24;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
        }

        .dark .data-source-badge {
          background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
          border-color: #f59e0b;
        }

        .badge-icon {
          font-size: 24px;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .badge-text {
          font-size: 15px;
          font-weight: 600;
          color: #92400e;
        }

        .dark .badge-text {
          color: #fbbf24;
        }

        .badge-hint {
          font-size: 13px;
          color: #78350f;
          margin-left: auto;
        }

        .dark .badge-hint {
          color: #fcd34d;
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
