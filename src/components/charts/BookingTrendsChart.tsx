import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { BookingTrendData } from "@/utils/bookingUtils";
import { formatChartTooltip, formatRevenueAxis } from "@/utils/bookingUtils";
import ChartError from "./ChartError";

interface BookingTrendsChartProps {
  data: BookingTrendData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const BookingTrendsChart = ({ data, loading, error, onRetry }: BookingTrendsChartProps) => {
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

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty" role="status">
        <p aria-hidden="true">📊</p>
        <p>Không có dữ liệu để hiển thị</p>
      </div>
    );
  }

  return (
    <div className="booking-trends-chart" role="img" aria-label="Biểu đồ xu hướng đặt phòng 30 ngày gần nhất">
      <ResponsiveContainer width="100%" height={350}>
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          aria-label="Biểu đồ đường thể hiện số lượng đặt phòng và doanh thu theo ngày"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            aria-label="Trục ngày tháng"
          />
          <YAxis
            yAxisId="left"
            stroke="#3b82f6"
            style={{ fontSize: "12px" }}
            label={{ value: "Số đơn", angle: -90, position: "insideLeft" }}
            aria-label="Trục số lượng đơn đặt phòng"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10b981"
            style={{ fontSize: "12px" }}
            tickFormatter={formatRevenueAxis}
            label={{ value: "Doanh thu", angle: 90, position: "insideRight" }}
            aria-label="Trục doanh thu"
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "Doanh thu") {
                return formatChartTooltip(value, "revenue");
              }
              return [value, name];
            }}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="bookings"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Số đơn"
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="revenue"
            stroke="#10b981"
            strokeWidth={2}
            name="Doanh thu"
            dot={{ fill: "#10b981", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <style>{`
        .booking-trends-chart {
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

export default BookingTrendsChart;
