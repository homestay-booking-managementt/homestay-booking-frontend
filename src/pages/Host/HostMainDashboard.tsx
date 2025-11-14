import { useEffect, useState } from "react";
import {
  fetchHostStatistics,
  fetchHostRevenue,
  fetchTopHomestays,
} from "@/api/hostApi";
import { fetchMyHomestays } from "@/api/homestayApi";
import type {
  HostStatistics,
  RevenueStatistics,
  TopHomestay,
} from "@/types/host";
import type { Homestay } from "@/types/homestay";
import {
  FaHome,
  FaCalendarAlt,
  FaDollarSign,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

const HostMainDashboard = () => {
  // State for dashboard data
  const [statistics, setStatistics] = useState<HostStatistics | null>(null);
  const [revenue, setRevenue] = useState<RevenueStatistics | null>(null);
  const [topHomestays, setTopHomestays] = useState<TopHomestay[]>([]);
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("🔄 Loading dashboard data...");
      
      const [statisticsData, revenueData, topHomestaysData, homestaysData] =
        await Promise.all([
          fetchHostStatistics(),
          fetchHostRevenue("month"),
          fetchTopHomestays(5),
          fetchMyHomestays(),
        ]);

      console.log("✅ Statistics:", statisticsData);
      console.log("✅ Revenue:", revenueData);
      console.log("✅ Top Homestays:", topHomestaysData);
      console.log("✅ Homestays:", homestaysData);

      setStatistics(statisticsData);
      setRevenue(revenueData);
      setTopHomestays(topHomestaysData);
      setHomestays(homestaysData);
    } catch (error) {
      console.error("❌ Không thể tải dữ liệu dashboard:", error);
      setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from API data
  const totalHomestays = statistics?.totalHomestays || 0;
  const approvedHomestays = statistics?.approvedHomestays || 0;
  const totalBookings = statistics?.totalBookings || 0;
  const pendingBookings = statistics?.pendingBookings || 0;
  const confirmedBookings = statistics?.confirmedBookings || 0;
  const completedBookings = statistics?.completedBookings || 0;
  const rejectedBookings = statistics?.cancelledBookings || 0;

  const totalRevenue = revenue?.totalRevenue || 0;
  const totalPayments = statistics?.totalPayments || 0;
  const completedPayments = statistics?.completedPayments || 0;
  const pendingPayments = statistics?.pendingPayments || 0;

  if (loading) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{hostCommonStyles}</style>
      <div className="host-page">
        {/* Quick Stats */}
        <div className="stats-grid">
          <div
            className="stat-card clickable"
            onClick={() => (window.location.href = "/host/homestays")}
          >
            <div className="stat-icon stat-icon-green">
              <FaHome />
            </div>
            <div className="stat-content">
              <h4>Homestay</h4>
              <p className="stat-value">{totalHomestays}</p>
              <p className="stat-detail">
                Đã duyệt: {approvedHomestays} | Chờ duyệt:{" "}
                {totalHomestays - approvedHomestays}
              </p>
            </div>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => (window.location.href = "/host/booking-requests")}
          >
            <div className="stat-icon stat-icon-teal">
              <FaCalendarAlt />
            </div>
            <div className="stat-content">
              <h4>Đặt phòng</h4>
              <p className="stat-value">{totalBookings}</p>
              <p className="stat-detail">
                Hoàn thành: {completedBookings} | Đang xử lý: {pendingBookings}
              </p>
            </div>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => (window.location.href = "/host/revenue")}
          >
            <div className="stat-icon stat-icon-blue">
              <FaDollarSign />
            </div>
            <div className="stat-content">
              <h4>Doanh thu</h4>
              <p className="stat-value">
                {totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
              <p className="stat-detail">Tổng doanh thu từ đặt phòng</p>
            </div>
          </div>

          <div
            className="stat-card clickable"
            onClick={() => (window.location.href = "/host/payments")}
          >
            <div className="stat-icon stat-icon-yellow">
              <FaMoneyCheckAlt />
            </div>
            <div className="stat-content">
              <h4>Thanh toán</h4>
              <p className="stat-value">{totalPayments}</p>
              <p className="stat-detail">
                Hoàn tất: {completedPayments} | Chờ xử lý: {pendingPayments}
              </p>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="charts-grid">
          {/* Booking Status Distribution */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Trạng thái Đặt phòng</h3>
              <p className="card-subtitle">Theo trạng thái</p>
            </div>
            <div className="chart-container">
              <div
                className="pie-chart"
                style={{
                  background: totalBookings > 0 ? `conic-gradient(
                    #f59e0b 0% ${(pendingBookings / totalBookings) * 100}%,
                    #06b6d4 ${(pendingBookings / totalBookings) * 100}% ${
                    ((pendingBookings + confirmedBookings) / totalBookings) * 100
                  }%,
                    #10b981 ${
                      ((pendingBookings + confirmedBookings) / totalBookings) * 100
                    }% ${
                    ((pendingBookings + confirmedBookings + completedBookings) /
                      totalBookings) *
                    100
                  }%,
                    #ef4444 ${
                      ((pendingBookings + confirmedBookings + completedBookings) /
                        totalBookings) *
                      100
                    }% 100%
                  )` : '#f1f5f9',
                }}
              >
                <div className="pie-center">
                  <div className="pie-center-value">{totalBookings}</div>
                  <div className="pie-center-label">Tổng</div>
                </div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-label">
                    <div
                      className="legend-color"
                      style={{ background: "#f59e0b" }}
                    />
                    <span className="legend-text">Chờ xử lý</span>
                  </div>
                  <span className="legend-value">{pendingBookings}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-label">
                    <div
                      className="legend-color"
                      style={{ background: "#06b6d4" }}
                    />
                    <span className="legend-text">Đã xác nhận</span>
                  </div>
                  <span className="legend-value">{confirmedBookings}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-label">
                    <div
                      className="legend-color"
                      style={{ background: "#10b981" }}
                    />
                    <span className="legend-text">Hoàn thành</span>
                  </div>
                  <span className="legend-value">{completedBookings}</span>
                </div>
                <div className="legend-item">
                  <div className="legend-label">
                    <div
                      className="legend-color"
                      style={{ background: "#ef4444" }}
                    />
                    <span className="legend-text">Đã hủy</span>
                  </div>
                  <span className="legend-value">{rejectedBookings}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Trend */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className="card-title">Doanh thu theo thời gian</h3>
              <p className="card-subtitle">Tháng này</p>
            </div>
            <div className="chart-container">
              <div className="bar-chart">
                {revenue?.periodData && revenue.periodData.length > 0 ? (
                  revenue.periodData.map((data, index) => {
                    const maxRevenue = Math.max(
                      ...revenue.periodData.map((d) => d.revenue)
                    );
                  const percentage = (data.revenue / maxRevenue) * 100;
                  const colors = [
                    "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                    "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                    "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  ];

                  return (
                    <div key={index} className="bar-item">
                      <div className="bar-label">
                        <span className="bar-label-text">{data.period}</span>
                        <span className="bar-label-value">
                          {data.revenue.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${percentage}%`,
                            background: colors[index % colors.length],
                          }}
                        >
                          {data.bookings} đơn
                        </div>
                      </div>
                    </div>
                  );
                })
                ) : (
                  <div className="empty-state">
                    <p>Chưa có dữ liệu doanh thu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Top Homestays by Revenue */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">
              Top Homestay theo Doanh thu
            </h3>
            <p className="card-subtitle">Homestay có doanh thu cao nhất</p>
          </div>
          <div className="bar-chart">
            {topHomestays && topHomestays.length > 0 ? (
              topHomestays.map((homestay, index) => {
                const maxRevenue = Math.max(
                  ...topHomestays.map((h) => h.totalRevenue)
                );
                const percentage = maxRevenue > 0 ? (homestay.totalRevenue / maxRevenue) * 100 : 0;
                const colors = [
                  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                ];

                return (
                  <div key={homestay.homestayId} className="bar-item">
                    <div className="bar-label">
                      <span className="bar-label-text">{homestay.homestayName}</span>
                      <span className="bar-label-value">
                        {homestay.totalRevenue.toLocaleString("vi-VN")} ₫ ({homestay.totalBookings} đơn)
                      </span>
                    </div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                          background: colors[index % colors.length],
                        }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">
                <p>Chưa có dữ liệu doanh thu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostMainDashboard;
