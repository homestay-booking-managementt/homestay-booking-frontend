import { memo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AdminBookingSummary } from "@/types/admin";
import { STATUS_COLORS, STATUS_LABELS } from "@/utils/bookingUtils";
import ChartError from "../charts/ChartError";

interface BookingStatusData {
  status: string;
  statusLabel: string;
  count: number;
  percentage: number;
  color: string;
}

interface BookingStatusPieChartProps {
  data: AdminBookingSummary[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * Prepare pie chart data from bookings
 */
const prepareBookingStatusData = (
  bookings: AdminBookingSummary[]
): BookingStatusData[] => {
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return [];
  }

  // Get unique statuses and count bookings
  const statusCounts = bookings.reduce((acc, booking) => {
    const status = booking.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalBookings = bookings.length;

  // Convert to array and calculate percentages
  return Object.entries(statusCounts)
    .map(([status, count]) => ({
      status,
      statusLabel: STATUS_LABELS[status] || status,
      count,
      percentage: (count / totalBookings) * 100,
      color: STATUS_COLORS[status] || "#6b7280",
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
};

/**
 * Custom label to display percentage on pie slices
 */
const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percentage,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percentage: number;
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Only show label if percentage is >= 5% to avoid clutter
  if (percentage < 5) {
    return null;
  }

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      style={{ fontSize: "14px", fontWeight: 600 }}
    >
      {`${percentage.toFixed(1)}%`}
    </text>
  );
};

const BookingStatusPieChart = ({
  data,
  loading,
  error,
  onRetry,
}: BookingStatusPieChartProps) => {
  if (loading) {
    return (
      <div className="chart-loading" role="status" aria-live="polite">
        <div className="loading-spinner" aria-hidden="true"></div>
        <p>Đang tải dữ liệu biểu đồ...</p>
      </div>
    );
  }

  if (error) {
    return <ChartError message={error} onRetry={onRetry} />;
  }

  const chartData = prepareBookingStatusData(data);

  if (chartData.length === 0) {
    return (
      <div className="chart-empty" role="status">
        <p aria-hidden="true">📊</p>
        <p>Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div
      className="booking-status-pie-chart"
      role="img"
      aria-label="Biểu đồ tròn phân bố đơn đặt phòng theo trạng thái"
    >
      <ResponsiveContainer width="100%" height={350}>
        <PieChart
          aria-label="Biểu đồ tròn thể hiện phần trăm đơn đặt phòng theo từng trạng thái"
        >
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="count"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as BookingStatusData;
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontWeight: 600,
                        color: data.color,
                      }}
                    >
                      {data.statusLabel}
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                      Số đơn: {data.count}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                      Tỷ lệ: {data.percentage.toFixed(1)}%
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const data = entry.payload as BookingStatusData;
              return `${data.statusLabel} (${data.count})`;
            }}
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <style>{`
        .booking-status-pie-chart {
          width: 100%;
          height: 100%;
        }

        .chart-loading,
        .chart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          color: #6b7280;
        }

        .chart-empty p:first-child {
          font-size: 48px;
          margin: 0 0 12px 0;
        }

        .chart-empty p:last-child {
          margin: 0;
          font-size: 14px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e5e7eb;
          border-top-color: #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default memo(BookingStatusPieChart);
