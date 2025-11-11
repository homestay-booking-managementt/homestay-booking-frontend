import { useState } from "react";
import {
  FaDollarSign,
  FaCalendarAlt,
  FaChartLine,
  FaArrowUp,
  FaCheckCircle,
  FaClock,
  FaFilter,
  FaDownload,
  FaTrophy,
} from "react-icons/fa";

// Mock data for revenue statistics
const generateMockRevenueData = (period: "week" | "month" | "year") => {
  if (period === "week") {
    return {
      totalRevenue: 15750000,
      totalBookings: 12,
      averageBookingValue: 1312500,
      growthRate: 15.5,
      periodData: [
        { period: "T2", date: "06/01", bookings: 2, revenue: 2500000 },
        { period: "T3", date: "07/01", bookings: 1, revenue: 1200000 },
        { period: "T4", date: "08/01", bookings: 3, revenue: 3800000 },
        { period: "T5", date: "09/01", bookings: 2, revenue: 2400000 },
        { period: "T6", date: "10/01", bookings: 2, revenue: 3200000 },
        { period: "T7", date: "11/01", bookings: 1, revenue: 1650000 },
        { period: "CN", date: "12/01", bookings: 1, revenue: 1000000 },
      ],
    };
  } else if (period === "month") {
    return {
      totalRevenue: 68500000,
      totalBookings: 45,
      averageBookingValue: 1522222,
      growthRate: 22.3,
      periodData: [
        { period: "Tuần 1", date: "01-07/01", bookings: 8, revenue: 12500000 },
        { period: "Tuần 2", date: "08-14/01", bookings: 12, revenue: 18200000 },
        { period: "Tuần 3", date: "15-21/01", bookings: 15, revenue: 22800000 },
        { period: "Tuần 4", date: "22-28/01", bookings: 10, revenue: 15000000 },
      ],
    };
  } else {
    // year
    return {
      totalRevenue: 425000000,
      totalBookings: 280,
      averageBookingValue: 1517857,
      growthRate: 35.8,
      periodData: [
        { period: "T1", date: "01/2025", bookings: 18, revenue: 28000000 },
        { period: "T2", date: "02/2025", bookings: 20, revenue: 32000000 },
        { period: "T3", date: "03/2025", bookings: 25, revenue: 38000000 },
        { period: "T4", date: "04/2025", bookings: 28, revenue: 42000000 },
        { period: "T5", date: "05/2025", bookings: 30, revenue: 45000000 },
        { period: "T6", date: "06/2025", bookings: 32, revenue: 48000000 },
        { period: "T7", date: "07/2025", bookings: 35, revenue: 52000000 },
        { period: "T8", date: "08/2025", bookings: 28, revenue: 40000000 },
        { period: "T9", date: "09/2025", bookings: 22, revenue: 35000000 },
        { period: "T10", date: "10/2025", bookings: 20, revenue: 32000000 },
        { period: "T11", date: "11/2025", bookings: 12, revenue: 18000000 },
        { period: "T12", date: "12/2025", bookings: 10, revenue: 15000000 },
      ],
    };
  }
};

const generateMockTransactions = () => {
  return [
    {
      id: "TX001",
      bookingCode: "BK2025011001",
      homestay: "Villa Biển Xanh",
      guest: "Nguyễn Văn A",
      checkIn: "15/01/2025",
      checkOut: "17/01/2025",
      nights: 2,
      amount: 3200000,
      commission: 320000,
      netRevenue: 2880000,
      status: "completed",
      paidAt: "17/01/2025 14:30",
    },
    {
      id: "TX002",
      bookingCode: "BK2025011002",
      homestay: "Nhà Vườn Xanh",
      guest: "Trần Thị B",
      checkIn: "16/01/2025",
      checkOut: "18/01/2025",
      nights: 2,
      amount: 2400000,
      commission: 240000,
      netRevenue: 2160000,
      status: "completed",
      paidAt: "18/01/2025 11:20",
    },
    {
      id: "TX003",
      bookingCode: "BK2025011003",
      homestay: "Villa Biển Xanh",
      guest: "Lê Văn C",
      checkIn: "18/01/2025",
      checkOut: "20/01/2025",
      nights: 2,
      amount: 3200000,
      commission: 320000,
      netRevenue: 2880000,
      status: "completed",
      paidAt: "20/01/2025 16:45",
    },
    {
      id: "TX004",
      bookingCode: "BK2025011004",
      homestay: "Căn Hộ Sunset View",
      guest: "Phạm Thị D",
      checkIn: "20/01/2025",
      checkOut: "23/01/2025",
      nights: 3,
      amount: 4500000,
      commission: 450000,
      netRevenue: 4050000,
      status: "pending",
      paidAt: "-",
    },
    {
      id: "TX005",
      bookingCode: "BK2025011005",
      homestay: "Nhà Vườn Xanh",
      guest: "Hoàng Văn E",
      checkIn: "22/01/2025",
      checkOut: "24/01/2025",
      nights: 2,
      amount: 2400000,
      commission: 240000,
      netRevenue: 2160000,
      status: "pending",
      paidAt: "-",
    },
  ];
};

const HostRevenueStatsPage = () => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const [showTransactions, setShowTransactions] = useState(false);

  const revenueData = generateMockRevenueData(period);
  const transactions = generateMockTransactions();

  const getPeriodLabel = () => {
    switch (period) {
      case "week":
        return "Tuần này";
      case "month":
        return "Tháng này";
      case "year":
        return "Năm này";
    }
  };

  const getChartSubtitle = () => {
    switch (period) {
      case "week":
        return "Theo ngày trong tuần";
      case "month":
        return "Theo tuần trong tháng";
      case "year":
        return "Theo tháng trong năm";
    }
  };

  return (
    <>
      <style>{pageStyles}</style>
      <div style={{ padding: "24px" }}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              background: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "8px",
            }}
          >
            Thống kê Doanh thu
          </h1>
          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Theo dõi và phân tích doanh thu từ các đặt phòng homestay
          </p>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            background: "white",
            padding: "16px 20px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <FaFilter style={{ color: "#10b981", fontSize: "16px" }} />
            <label
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              Chu kỳ thống kê:
            </label>
            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value as "week" | "month" | "year")
              }
              style={{
                padding: "8px 16px",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "14px",
                color: "#374151",
                cursor: "pointer",
                outline: "none",
                minWidth: "150px",
              }}
            >
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm này</option>
            </select>
          </div>

          <button
            onClick={() => setShowTransactions(!showTransactions)}
            style={{
              padding: "8px 16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FaDownload />
            {showTransactions ? "Ẩn chi tiết" : "Xem giao dịch"}
          </button>
        </div>

        {/* Stats Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginBottom: "24px",
          }}
        >
          {/* Total Revenue */}
          <div
            style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                fontSize: "120px",
                opacity: "0.1",
              }}
            >
              <FaDollarSign />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <FaDollarSign />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
                  Tổng doanh thu
                </h4>
              </div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  margin: "8px 0",
                }}
              >
                {revenueData.totalRevenue.toLocaleString("vi-VN")} ₫
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    background: "rgba(255,255,255,0.2)",
                    padding: "4px 8px",
                    borderRadius: "6px",
                  }}
                >
                  <FaArrowUp />
                  <span>{revenueData.growthRate}%</span>
                </div>
                <span style={{ opacity: 0.9 }}>so với kỳ trước</span>
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div
            style={{
              background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(20, 184, 166, 0.2)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                fontSize: "120px",
                opacity: "0.1",
              }}
            >
              <FaCalendarAlt />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <FaCalendarAlt />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
                  Tổng đặt phòng
                </h4>
              </div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  margin: "8px 0",
                }}
              >
                {revenueData.totalBookings}
              </p>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                <span>Đơn đặt phòng thành công</span>
              </div>
            </div>
          </div>

          {/* Average Booking Value */}
          <div
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 6px rgba(6, 182, 212, 0.2)",
              color: "white",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-20px",
                right: "-20px",
                fontSize: "120px",
                opacity: "0.1",
              }}
            >
              <FaChartLine />
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    background: "rgba(255,255,255,0.2)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                  }}
                >
                  <FaChartLine />
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: "500", margin: 0 }}>
                  Trung bình/đơn
                </h4>
              </div>
              <p
                style={{
                  fontSize: "32px",
                  fontWeight: "700",
                  margin: "8px 0",
                }}
              >
                {revenueData.averageBookingValue.toLocaleString("vi-VN")} ₫
              </p>
              <div style={{ fontSize: "13px", opacity: 0.9 }}>
                <span>Giá trị trung bình mỗi đơn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Trend Chart */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: "24px",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "4px",
              }}
            >
              <FaChartLine
                style={{
                  color: "#10b981",
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              Xu hướng Doanh thu - {getPeriodLabel()}
            </h3>
            <p style={{ fontSize: "13px", color: "#6b7280", margin: 0 }}>
              {getChartSubtitle()}
            </p>
          </div>

          {/* Bar Chart */}
          <div style={{ padding: "0 8px" }}>
            {revenueData.periodData.map((data, index) => {
              const maxRevenue = Math.max(
                ...revenueData.periodData.map((d) => d.revenue)
              );
              const percentage = (data.revenue / maxRevenue) * 100;
              const colors = [
                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
                "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
                "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                "linear-gradient(135deg, #84cc16 0%, #65a30d 100%)",
                "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
                "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
                "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
              ];

              return (
                <div
                  key={index}
                  style={{
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: "8px" }}
                    >
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#374151",
                          minWidth: "80px",
                        }}
                      >
                        {data.period}
                      </span>
                      <span
                        style={{
                          fontSize: "12px",
                          color: "#9ca3af",
                        }}
                      >
                        ({data.date})
                      </span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "#10b981",
                        }}
                      >
                        {data.revenue.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: "32px",
                      background: "#f3f4f6",
                      borderRadius: "8px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percentage}%`,
                        background: colors[index % colors.length],
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        paddingRight: "12px",
                        transition: "width 0.6s ease",
                        minWidth: data.bookings > 0 ? "80px" : "0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "600",
                          color: "white",
                          textShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      >
                        {data.bookings} đơn
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Table */}
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "12px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            marginBottom: showTransactions ? "24px" : "0",
          }}
        >
          <h3
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#111827",
              marginBottom: "16px",
            }}
          >
            <FaTrophy
              style={{
                color: "#f59e0b",
                marginRight: "8px",
                fontSize: "16px",
              }}
            />
            Chi tiết theo kỳ
          </h3>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    background:
                      "linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)",
                  }}
                >
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#059669",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    Kỳ
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#059669",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    Ngày
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#059669",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    Số đơn
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#059669",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    Doanh thu
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "#059669",
                      borderBottom: "2px solid #10b981",
                    }}
                  >
                    Trung bình/đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {revenueData.periodData.map((data, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #f3f4f6",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      {data.period}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        fontSize: "13px",
                        color: "#6b7280",
                      }}
                    >
                      {data.date}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "14px",
                        color: "#374151",
                      }}
                    >
                      <span
                        style={{
                          background: "#e0f2fe",
                          color: "#0369a1",
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "13px",
                          fontWeight: "600",
                        }}
                      >
                        {data.bookings}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#10b981",
                      }}
                    >
                      {data.revenue.toLocaleString("vi-VN")} ₫
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {data.bookings > 0
                        ? Math.round(
                            data.revenue / data.bookings
                          ).toLocaleString("vi-VN")
                        : 0}{" "}
                      ₫
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: "#f9fafb" }}>
                  <td
                    colSpan={2}
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#111827",
                      borderTop: "2px solid #e5e7eb",
                    }}
                  >
                    Tổng cộng
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#111827",
                      borderTop: "2px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        background: "#dbeafe",
                        color: "#1e40af",
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "13px",
                      }}
                    >
                      {revenueData.totalBookings}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#10b981",
                      borderTop: "2px solid #e5e7eb",
                    }}
                  >
                    {revenueData.totalRevenue.toLocaleString("vi-VN")} ₫
                  </td>
                  <td
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "14px",
                      fontWeight: "700",
                      color: "#6b7280",
                      borderTop: "2px solid #e5e7eb",
                    }}
                  >
                    {revenueData.averageBookingValue.toLocaleString("vi-VN")} ₫
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Transactions Detail */}
        {showTransactions && (
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#111827",
                marginBottom: "16px",
              }}
            >
              <FaCheckCircle
                style={{
                  color: "#10b981",
                  marginRight: "8px",
                  fontSize: "16px",
                }}
              />
              Chi tiết Giao dịch
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "13px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        "linear-gradient(135deg, #f0fdf4 0%, #ccfbf1 100%)",
                    }}
                  >
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Mã GD
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Homestay
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Khách
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "left",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Check-in/out
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Đêm
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Tổng tiền
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Phí (10%)
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Thu nhập
                    </th>
                    <th
                      style={{
                        padding: "10px 12px",
                        textAlign: "center",
                        fontSize: "12px",
                        fontWeight: "600",
                        color: "#059669",
                        borderBottom: "2px solid #10b981",
                      }}
                    >
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx.id}
                      style={{
                        borderBottom: "1px solid #f3f4f6",
                        transition: "background-color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#f9fafb";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontWeight: "600",
                          color: "#374151",
                        }}
                      >
                        {tx.bookingCode}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#374151",
                        }}
                      >
                        {tx.homestay}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#6b7280",
                        }}
                      >
                        {tx.guest}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          color: "#6b7280",
                          fontSize: "12px",
                        }}
                      >
                        <div>{tx.checkIn}</div>
                        <div>{tx.checkOut}</div>
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "center",
                          color: "#374151",
                        }}
                      >
                        {tx.nights}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#374151",
                          fontWeight: "600",
                        }}
                      >
                        {tx.amount.toLocaleString("vi-VN")}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#dc2626",
                        }}
                      >
                        -{tx.commission.toLocaleString("vi-VN")}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          color: "#10b981",
                          fontWeight: "600",
                        }}
                      >
                        {tx.netRevenue.toLocaleString("vi-VN")}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "center",
                        }}
                      >
                        {tx.status === "completed" ? (
                          <span
                            style={{
                              background: "#d1fae5",
                              color: "#065f46",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FaCheckCircle />
                            Hoàn tất
                          </span>
                        ) : (
                          <span
                            style={{
                              background: "#fef3c7",
                              color: "#92400e",
                              padding: "4px 10px",
                              borderRadius: "6px",
                              fontSize: "11px",
                              fontWeight: "600",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <FaClock />
                            Chờ thanh toán
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const pageStyles = `
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

export default HostRevenueStatsPage;
