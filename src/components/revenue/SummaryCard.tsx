import type { ReactNode } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: 'purple' | 'blue' | 'green' | 'yellow' | 'orange' | 'red' | 'teal' | 'pink';
  format?: 'currency' | 'number';
  comparison?: {
    value: number;
    percentage: number;
  };
  loading?: boolean;
}

const SummaryCard = ({ title, value, icon, color, format = 'number', comparison, loading }: SummaryCardProps) => {
  // Format value based on format prop
  const formattedValue = format === 'currency' 
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value))
    : new Intl.NumberFormat('vi-VN').format(Number(value));

  // Determine trend from percentage
  const trend = comparison && comparison.percentage >= 0 ? 'up' : 'down';
  if (loading) {
    return (
      <div className="summary-card">
        <div className={`summary-icon ${color} skeleton`}></div>
        <div className="summary-content">
          <div className="skeleton-text skeleton"></div>
          <div className="skeleton-value skeleton"></div>
        </div>
        <style>{`
          .skeleton {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }

          .skeleton-text {
            height: 14px;
            width: 100px;
            border-radius: 4px;
            margin-bottom: 8px;
          }

          .skeleton-value {
            height: 24px;
            width: 150px;
            border-radius: 4px;
          }

          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="summary-card">
      <div className={`summary-icon ${color}`}>
        {icon}
      </div>
      <div className="summary-content">
        <span className="summary-label">{title}</span>
        <span className="summary-value">{formattedValue}</span>
        {comparison && (
          <div className={`comparison ${trend}`}>
            {trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
            <span>{Math.abs(comparison.percentage).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <style>{`
        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .summary-icon {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          flex-shrink: 0;
          color: white;
        }

        .summary-icon.purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .summary-icon.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .summary-icon.green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .summary-icon.yellow {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .summary-icon.orange {
          background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
        }

        .summary-icon.red {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
        }

        .summary-icon.teal {
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        }

        .summary-icon.pink {
          background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
        }

        .summary-content {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .summary-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }

        .comparison {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .comparison.up {
          color: #10b981;
        }

        .comparison.down {
          color: #ef4444;
        }

        .comparison svg {
          font-size: 10px;
        }

        /* Dark Mode */
        .dark .summary-card {
          background: #1e293b;
        }

        .dark .summary-label {
          color: #94a3b8;
        }

        .dark .summary-value {
          color: #f1f5f9;
        }

        @media (max-width: 768px) {
          .summary-card {
            padding: 16px;
          }

          .summary-icon {
            width: 48px;
            height: 48px;
            font-size: 20px;
          }

          .summary-value {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default SummaryCard;
