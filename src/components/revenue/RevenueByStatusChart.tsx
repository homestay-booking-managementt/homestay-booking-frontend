import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { RevenueByStatusData } from '@/types/admin';
import ChartContainer from './ChartContainer';

interface RevenueByStatusChartProps {
  data: RevenueByStatusData[];
  loading?: boolean;
}

const STATUS_LABELS: Record<string, string> = {
  completed: 'Hoàn thành',
  confirmed: 'Đã xác nhận',
  pending: 'Chờ xử lý',
  cancelled: 'Đã hủy',
};

const STATUS_COLORS: Record<string, string> = {
  completed: '#10b981',
  confirmed: '#3b82f6',
  pending: '#f59e0b',
  cancelled: '#ef4444',
};

const RevenueByStatusChart = ({ data, loading }: RevenueByStatusChartProps) => {
  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-status">{STATUS_LABELS[data.status] || data.status}</p>
          <p className="tooltip-revenue">
            Doanh thu: {data.revenue.toLocaleString('vi-VN')} VND
          </p>
          <p className="tooltip-count">
            Số đơn: {data.count}
          </p>
          <style>{`
            .custom-tooltip {
              background: white;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              border: 1px solid #e5e7eb;
            }

            .tooltip-status {
              margin: 0 0 8px 0;
              font-weight: 600;
              color: #1f2937;
              font-size: 13px;
            }

            .tooltip-revenue {
              margin: 0 0 4px 0;
              color: #6b7280;
              font-size: 12px;
            }

            .tooltip-count {
              margin: 0;
              color: #6b7280;
              font-size: 12px;
            }

            .dark .custom-tooltip {
              background: #1e293b;
              border-color: #334155;
            }

            .dark .tooltip-status {
              color: #f1f5f9;
            }

            .dark .tooltip-revenue,
            .dark .tooltip-count {
              color: #94a3b8;
            }
          `}</style>
        </div>
      );
    }
    return null;
  };

  // Thêm label và color cho mỗi item, sau đó sắp xếp theo revenue giảm dần
  const chartData = data
    .map(item => ({
      ...item,
      statusLabel: STATUS_LABELS[item.status] || item.status,
      color: STATUS_COLORS[item.status] || '#6b7280',
    }))
    .sort((a, b) => b.revenue - a.revenue);

  return (
    <ChartContainer 
      title="Doanh thu theo Trạng thái" 
      loading={loading}
      empty={!data || data.length === 0}
      emptyMessage="Không có dữ liệu doanh thu theo trạng thái"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="statusLabel" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            tickFormatter={formatRevenue}
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="revenue" 
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Bar key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RevenueByStatusChart;
