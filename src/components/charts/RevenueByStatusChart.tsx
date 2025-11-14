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
  Cell,
} from "recharts";
import type { RevenueByStatusData } from "@/utils/bookingUtils";
import { formatChartTooltip, formatRevenueAxis } from "@/utils/bookingUtils";
import ChartError from "./ChartError";

interface RevenueByStatusChartProps {
  data: RevenueByStatusData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const RevenueByStatusChart = ({ data, loading, error, onRetry }: RevenueByStatusChartProps) => {
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
    <div className="revenue-by-status-chart" role="img" aria-label="Biểu đồ doanh thu theo trạng thái đặt phòng">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 40,
            left: 20,
            bottom: 40,
          }}
          aria-label="Biểu đồ cột thể hiện doanh thu theo từng trạng thái đặt phòng"
        >
          <defs>
            {data.map((entry, index) => (
              <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={entry.color} stopOpacity={0.9} />
                <stop offset="100%" stopColor={entry.color} stopOpacity={0.6} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="status"
            stroke="#6b7280"
            style={{ fontSize: "13px", fontWeight: 600 }}
            tick={{ fill: "#1f2937" }}
            height={60}
            aria-label="Trục trạng thái đặt phòng"
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px", fontWeight: 500 }}
            tickFormatter={formatRevenueAxis}
            tick={{ fill: "#374151" }}
            label={{ 
              value: "Doanh thu (VND)", 
              angle: -90, 
              position: "insideLeft",
              style: { fill: "#1f2937", fontWeight: 600, fontSize: 13 }
            }}
            aria-label="Trục doanh thu"
          />
          <Tooltip
            cursor={{ fill: "rgba(102, 126, 234, 0.1)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload as RevenueByStatusData;
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
                      {data.status}
                    </p>
                    <p style={{ margin: "0 0 6px 0", fontSize: "14px", fontWeight: 600, color: data.color }}>
                      💰 Doanh thu: {formatChartTooltip(data.revenue, "revenue")}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280", fontWeight: 600 }}>
                      📦 Số đơn: {data.count}
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
            iconType="rect"
            iconSize={14}
          />
          <Bar dataKey="revenue" name="Doanh thu" radius={[12, 12, 0, 0]} maxBarSize={100}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <style>{`
        .revenue-by-status-chart {
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

export default memo(RevenueByStatusChart);
