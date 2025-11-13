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
      <ResponsiveContainer width="100%" height={350}>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          aria-label="Biểu đồ cột thể hiện doanh thu theo từng trạng thái đặt phòng"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="status"
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            aria-label="Trục trạng thái đặt phòng"
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: "12px" }}
            tickFormatter={formatRevenueAxis}
            label={{ value: "Doanh thu (VND)", angle: -90, position: "insideLeft" }}
            aria-label="Trục doanh thu"
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
                const data = payload[0].payload as RevenueByStatusData;
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
                      {data.status}
                    </p>
                    <p style={{ margin: "0 0 4px 0", fontSize: "14px" }}>
                      Doanh thu: {formatChartTooltip(data.revenue, "revenue")}
                    </p>
                    <p style={{ margin: 0, fontSize: "14px", color: "#6b7280" }}>
                      Số đơn: {data.count}
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
          <Bar dataKey="revenue" name="Doanh thu" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
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

export default RevenueByStatusChart;
