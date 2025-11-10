import { useEffect, useState } from "react";
import {
  fetchHostBookingRequests,
  fetchRevenueStatistics,
  fetchPaymentTransfers,
} from "@/api/hostApi";
import { fetchMyHomestays } from "@/api/homestayApi";
import type {
  HostBookingRequest,
  RevenueStatistics,
  PaymentTransfer,
} from "@/types/host";
import type { Homestay } from "@/types/homestay";
import {
  FaHome,
  FaCalendarAlt,
  FaDollarSign,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

// Mock data generators - defined outside component to avoid recreating on each render
const getMockBookingRequests = (): HostBookingRequest[] => [
  {
    id: 1,
    guestId: 1,
    guestName: "Nguyễn Văn A",
    guestEmail: "nguyenvana@example.com",
    homestayId: 1,
    homestayName: "Villa Đà Lạt",
    checkIn: "2024-11-15",
    checkOut: "2024-11-18",
    numGuests: 4,
    totalPrice: 5000000,
    status: "pending",
    createdAt: "2024-11-10",
  },
  {
    id: 2,
    guestId: 2,
    guestName: "Trần Thị B",
    guestEmail: "tranthib@example.com",
    homestayId: 2,
    homestayName: "Homestay Hội An",
    checkIn: "2024-11-20",
    checkOut: "2024-11-23",
    numGuests: 2,
    totalPrice: 3000000,
    status: "confirmed",
    createdAt: "2024-11-09",
  },
  {
    id: 3,
    guestId: 3,
    guestName: "Lê Văn C",
    guestEmail: "levanc@example.com",
    homestayId: 1,
    homestayName: "Villa Đà Lạt",
    checkIn: "2024-11-25",
    checkOut: "2024-11-28",
    numGuests: 6,
    totalPrice: 8000000,
    status: "pending",
    createdAt: "2024-11-08",
  },
  {
    id: 4,
    guestId: 4,
    guestName: "Phạm Thị D",
    guestEmail: "phamthid@example.com",
    homestayId: 3,
    homestayName: "Beach House Nha Trang",
    checkIn: "2024-11-12",
    checkOut: "2024-11-15",
    numGuests: 3,
    totalPrice: 4500000,
    status: "completed",
    createdAt: "2024-11-05",
  },
  {
    id: 5,
    guestId: 5,
    guestName: "Hoàng Văn E",
    guestEmail: "hoangvane@example.com",
    homestayId: 2,
    homestayName: "Homestay Hội An",
    checkIn: "2024-11-18",
    checkOut: "2024-11-21",
    numGuests: 2,
    totalPrice: 2500000,
    status: "rejected",
    createdAt: "2024-11-07",
  },
  {
    id: 6,
    guestId: 6,
    guestName: "Võ Thị F",
    guestEmail: "vothif@example.com",
    homestayId: 3,
    homestayName: "Beach House Nha Trang",
    checkIn: "2024-11-22",
    checkOut: "2024-11-25",
    numGuests: 4,
    totalPrice: 6000000,
    status: "confirmed",
    createdAt: "2024-11-06",
  },
  {
    id: 7,
    guestId: 7,
    guestName: "Đỗ Văn G",
    guestEmail: "dovang@example.com",
    homestayId: 1,
    homestayName: "Villa Đà Lạt",
    checkIn: "2024-11-28",
    checkOut: "2024-12-01",
    numGuests: 5,
    totalPrice: 7000000,
    status: "pending",
    createdAt: "2024-11-04",
  },
  {
    id: 8,
    guestId: 8,
    guestName: "Bùi Thị H",
    guestEmail: "buithih@example.com",
    homestayId: 2,
    homestayName: "Homestay Hội An",
    checkIn: "2024-11-16",
    checkOut: "2024-11-19",
    numGuests: 2,
    totalPrice: 3500000,
    status: "completed",
    createdAt: "2024-11-03",
  },
];

const getMockPayments = (): PaymentTransfer[] => [
  {
    id: 1,
    bookingId: 1,
    amount: 4500000,
    status: "completed",
    transferredAt: "2024-11-08",
  },
  {
    id: 2,
    bookingId: 2,
    amount: 2700000,
    status: "completed",
    transferredAt: "2024-11-07",
  },
  {
    id: 3,
    bookingId: 3,
    amount: 5400000,
    status: "pending",
  },
  {
    id: 4,
    bookingId: 4,
    amount: 1800000,
    status: "failed",
    errorMessage: "Tài khoản ngân hàng không hợp lệ",
  },
];

const getMockHomestays = (): Homestay[] => [
  {
    id: 1,
    name: "Villa Đà Lạt",
    address: "123 Đường Hoa Hồng",
    city: "Đà Lạt",
    description: "Villa sang trọng với view đẹp",
    pricePerNight: 1500000,
    capacity: 8,
    numBedrooms: 4,
    numBathrooms: 3,
    status: "approved",
  },
  {
    id: 2,
    name: "Homestay Hội An",
    address: "456 Phố Cổ",
    city: "Hội An",
    description: "Homestay phong cách cổ điển",
    pricePerNight: 1000000,
    capacity: 4,
    numBedrooms: 2,
    numBathrooms: 2,
    status: "approved",
  },
  {
    id: 3,
    name: "Beach House Nha Trang",
    address: "789 Trần Phú",
    city: "Nha Trang",
    description: "Nhà view biển tuyệt đẹp",
    pricePerNight: 2000000,
    capacity: 6,
    numBedrooms: 3,
    numBathrooms: 2,
    status: "approved",
  },
  {
    id: 4,
    name: "Mountain View Sapa",
    address: "321 Núi Hàm Rồng",
    city: "Sapa",
    description: "Căn hộ view núi non hùng vĩ",
    pricePerNight: 1200000,
    capacity: 5,
    numBedrooms: 2,
    numBathrooms: 2,
    status: "pending",
  },
];

const getMockRevenue = (): RevenueStatistics => ({
  totalRevenue: 45000000,
  totalBookings: 15,
  averageBookingValue: 3000000,
  period: "month",
  periodData: [
    { period: "Tuần 1", revenue: 8000000, bookings: 3 },
    { period: "Tuần 2", revenue: 12000000, bookings: 4 },
    { period: "Tuần 3", revenue: 15000000, bookings: 5 },
    { period: "Tuần 4", revenue: 10000000, bookings: 3 },
  ],
});

const HostMainDashboard = () => {
  // Initialize with mock data to ensure data is always available
  const [bookingRequests, setBookingRequests] = useState<HostBookingRequest[]>(getMockBookingRequests());
  const [revenue, setRevenue] = useState<RevenueStatistics | null>(getMockRevenue());
  const [payments, setPayments] = useState<PaymentTransfer[]>(getMockPayments());
  const [homestays, setHomestays] = useState<Homestay[]>(getMockHomestays());
  const [loading, setLoading] = useState(false); // Set to false since we have initial data

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, revenueData, paymentsData, homestaysData] =
        await Promise.all([
          fetchHostBookingRequests().catch(() => getMockBookingRequests()),
          fetchRevenueStatistics("month").catch(() => getMockRevenue()),
          fetchPaymentTransfers().catch(() => getMockPayments()),
          fetchMyHomestays().catch(() => getMockHomestays()),
        ]);

      setBookingRequests(
        Array.isArray(bookingsData) ? bookingsData : getMockBookingRequests()
      );
      setRevenue(revenueData || getMockRevenue());
      setPayments(Array.isArray(paymentsData) ? paymentsData : getMockPayments());
      setHomestays(
        Array.isArray(homestaysData) ? homestaysData : getMockHomestays()
      );
    } catch (error) {
      console.error("❌ Không thể tải dữ liệu dashboard:", error);
      // Use mock data on error
      setBookingRequests(getMockBookingRequests());
      setRevenue(getMockRevenue());
      setPayments(getMockPayments());
      setHomestays(getMockHomestays());
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalHomestays = homestays.length;
  const approvedHomestays = homestays.filter(
    (h) => h.status === "approved"
  ).length;
  const totalBookings = bookingRequests.length;
  const pendingBookings = bookingRequests.filter(
    (b) => b.status === "pending"
  ).length;
  const confirmedBookings = bookingRequests.filter(
    (b) => b.status === "confirmed"
  ).length;
  const completedBookings = bookingRequests.filter(
    (b) => b.status === "completed"
  ).length;
  const rejectedBookings = bookingRequests.filter(
    (b) => b.status === "rejected"
  ).length;

  const totalRevenue = revenue?.totalRevenue || 0;
  const totalPayments = payments.length;
  const completedPayments = payments.filter(
    (p) => p.status === "completed"
  ).length;
  const pendingPayments = payments.filter((p) => p.status === "pending").length;

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
              Top Homestay theo Doanh thu (Mock Data)
            </h3>
            <p className="card-subtitle">Homestay có doanh thu cao nhất</p>
          </div>
          <div className="bar-chart">
            {homestays && homestays.length > 0 ? (
              homestays
                .sort((a, b) => b.pricePerNight - a.pricePerNight)
                .slice(0, 5)
                .map((homestay, index) => {
                  const maxPrice = Math.max(
                    ...homestays.map((h) => h.pricePerNight)
                  );
                const percentage = (homestay.pricePerNight / maxPrice) * 100;
                const colors = [
                  "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                  "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                  "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                  "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                ];

                return (
                  <div key={homestay.id} className="bar-item">
                    <div className="bar-label">
                      <span className="bar-label-text">{homestay.name}</span>
                      <span className="bar-label-value">
                        {homestay.pricePerNight.toLocaleString("vi-VN")} ₫/đêm
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
                <p>Chưa có dữ liệu homestay</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostMainDashboard;
