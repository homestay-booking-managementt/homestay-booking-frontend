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
 * @returns Formatted month label like "Tháng 1/2024"
 */
const formatMonthLabel = (month: string): string => {
  if (!month) return "";
  const [year, monthNum] = month.split("-");
  return `Tháng ${parseInt(monthNum)}/${year}`;
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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          aria-label="Biểu đồ cột thể hiện doanh thu và số đơn đặt phòng theo tháng"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="monthLabel"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            angle={-45}
            textAnchor="end"
            height={80}
            aria-label="Trục tháng"
          />
          <YAxis
            yAxisId="left"
            stroke="#00BCD4"
            style={{ fontSize: "12px" }}
            tickFormatter={formatRevenueAxis}
            label={{
              value: "Doanh thu (VND)",
              angle: -90,
              position: "insideLeft",
            }}
            aria-label="Trục doanh thu"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#0D6EFD"
            style={{ fontSize: "12px" }}
            label={{
              value: "Số đơn",
              angle: 90,
              position: "insideRight",
            }}
            aria-label="Trục số lượng đơn"
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "Doanh thu") {
                return formatChartTooltip(value, "revenue");
              }
              return [value, name];
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as MonthlyRevenueData;
                return (
                  <div
                    style={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                  >
                    <p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
                      {data.monthLabel}
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#00BCD4" }}>
                      Doanh thu: {formatChartTooltip(data.revenue, "revenue")}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#0D6EFD" }}>
                      Số đơn: {data.bookings}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Doanh thu"
            fill="#00BCD4"
            radius={[8, 8, 0, 0]}
          />
          <Bar
            yAxisId="right"
            dataKey="bookings"
            name="Số đơn"
            fill="#0D6EFD"
            radius={[8, 8, 0, 0]}
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

export default memo(MonthlyRevenueChart);
