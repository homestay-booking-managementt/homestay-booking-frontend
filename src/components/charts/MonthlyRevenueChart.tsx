import { memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyRevenueData } from "@/types/admin";
import { formatChartTooltip, formatRevenueAxis } from "@/utils/bookingUtils";
import ChartError from "./ChartError";

interface MonthlyRevenueChartProps {
  data: MonthlyRevenueData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

/**
 * Format month string to Vietnamese label
 * @param month - Month string in YYYY-MM format
 * @returns Formatted month label like "T1/2024"
 */
const formatMonthLabel = (month: string): string => {
  if (!month) return "";
  const [year, monthNum] = month.split("-");
  return `T${parseInt(monthNum)}/${year}`;
};

/**
 * Prepare chart data with formatted labels
 */
const prepareChartData = (data: MonthlyRevenueData[]): MonthlyRevenueData[] => {
  if (!Array.isArray(data)) return [];
  
  // Limit to last 12 months and add formatted labels
  return data
    .slice(-12)
    .map(item => ({
      ...item,
      monthLabel: item.monthLabel || formatMonthLabel(item.month),
    }));
};

const MonthlyRevenueChart = ({
  data,
  loading,
  error,
  onRetry,
}: MonthlyRevenueChartProps) => {
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

  const chartData = prepareChartData(data);

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
      className="monthly-revenue-chart"
      role="img"
      aria-label="Biểu đồ doanh thu theo tháng"
    >
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 40,
            left: 20,
            bottom: 40,
          }}
          aria-label="Biểu đồ cột thể hiện doanh thu và số đơn đặt phòng theo tháng"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.75} />
            </linearGradient>
            <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="monthLabel"
            stroke="#6b7280"
            style={{ fontSize: "12px", fontWeight: 500 }}
            angle={0}
            textAnchor="middle"
            height={50}
            interval={0}
            tick={{ fill: "#374151" }}
            aria-label="Trục tháng"
          />
          <YAxis
            yAxisId="left"
            stroke="#10b981"
            style={{ fontSize: "12px", fontWeight: 500 }}
            tickFormatter={formatRevenueAxis}
            tick={{ fill: "#10b981" }}
            label={{
              value: "Doanh thu (VND)",
              angle: -90,
              position: "insideLeft",
              style: { fill: "#10b981", fontWeight: 600, fontSize: 13 },
            }}
            aria-label="Trục doanh thu"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#3b82f6"
            style={{ fontSize: "12px", fontWeight: 500 }}
            tick={{ fill: "#3b82f6" }}
            label={{
              value: "Số đơn",
              angle: 90,
              position: "insideRight",
              style: { fill: "#3b82f6", fontWeight: 600, fontSize: 13 },
            }}
            aria-label="Trục số lượng đơn"
          />
          <Tooltip
            cursor={{ fill: "rgba(102, 126, 234, 0.1)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as MonthlyRevenueData;
                return (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.98)",
                      border: "2px solid #e5e7eb",
                      borderRadius: "12px",
                      padding: "14px 16px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    <p style={{ margin: "0 0 10px 0", fontWeight: 700, fontSize: "15px", color: "#1f2937" }}>
                      {data.monthLabel}
                    </p>
                    <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#10b981", fontWeight: 600 }}>
                      💰 Doanh thu: {formatChartTooltip(data.revenue, "revenue")}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#3b82f6", fontWeight: 600 }}>
                      📦 Số đơn: {data.bookings}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "24px",
              fontSize: "14px",
              fontWeight: 600,
            }}
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Doanh thu"
            fill="url(#revenueGradient)"
            radius={[10, 10, 0, 0]}
            maxBarSize={60}
          />
          <Bar
            yAxisId="right"
            dataKey="bookings"
            name="Số đơn"
            fill="url(#bookingsGradient)"
            radius={[10, 10, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>

      <style>{`
        .monthly-revenue-chart {
          width: 100%;
          height: 100%;
        }

        .chart-loading,
        .chart-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
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

export default memo(MonthlyRevenueChart);
