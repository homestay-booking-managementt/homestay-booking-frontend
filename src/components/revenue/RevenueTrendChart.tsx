import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RevenueTrendData } from '@/types/admin';
import ChartContainer from './ChartContainer';

interface RevenueTrendChartProps {
  data: RevenueTrendData[];
  loading?: boolean;
}

const RevenueTrendChart = ({ data, loading }: RevenueTrendChartProps) => {
  const formatRevenue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{payload[0].payload.date}</p>
          <p className="tooltip-revenue">
            Doanh thu: {payload[0].value.toLocaleString('vi-VN')} VND
          </p>
          <p className="tooltip-bookings">
            Số đơn: {payload[1].value}
          </p>
          <style>{`
            .custom-tooltip {
              background: white;
              padding: 12px;
              border-radius: 8px;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              border: 1px solid #e5e7eb;
            }

            .tooltip-date {
              margin: 0 0 8px 0;
              font-weight: 600;
              color: #1f2937;
              font-size: 13px;
            }

            .tooltip-revenue {
              margin: 0 0 4px 0;
              color: #8b5cf6;
              font-size: 12px;
            }

            .tooltip-bookings {
              margin: 0;
              color: #3b82f6;
              font-size: 12px;
            }

            .dark .custom-tooltip {
              background: #1e293b;
              border-color: #334155;
            }

            .dark .tooltip-date {
              color: #f1f5f9;
            }
          `}</style>
        </div>
      );
    }
    return null;
  };

  const chartData = data.map(item => ({
    ...item,
    dateFormatted: formatDate(item.date),
  }));

  return (
    <ChartContainer 
      title="Xu hướng Doanh thu" 
      loading={loading}
      empty={!data || data.length === 0}
      emptyMessage="Không có dữ liệu xu hướng doanh thu"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="dateFormatted" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="left"
            stroke="#8b5cf6"
            tickFormatter={formatRevenue}
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            stroke="#3b82f6"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value) => {
              if (value === 'revenue') return 'Doanh thu (VND)';
              if (value === 'bookings') return 'Số đơn';
              return value;
            }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="revenue" 
            stroke="#8b5cf6" 
            strokeWidth={2}
            dot={{ fill: '#8b5cf6', r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="bookings" 
            stroke="#3b82f6" 
            strokeWidth={2}
            dot={{ fill: '#3b82f6', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RevenueTrendChart;
