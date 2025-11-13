import { FaChartBar, FaRedo } from "react-icons/fa";

interface ChartErrorProps {
  message?: string;
  onRetry?: () => void;
}

const ChartError = ({
  message = "Không thể tải dữ liệu biểu đồ",
  onRetry,
}: ChartErrorProps) => {
  return (
    <div className="chart-error">
      <div className="chart-error-icon">
        <FaChartBar />
      </div>
      <p className="chart-error-message">{message}</p>
      {onRetry && (
        <button className="chart-error-retry-btn" onClick={onRetry}>
          <FaRedo /> Thử lại
        </button>
      )}

      <style>{`
        .chart-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 350px;
          padding: 20px;
          text-align: center;
        }

        .chart-error-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-radius: 50%;
          color: #dc2626;
          font-size: 20px;
          margin-bottom: 12px;
        }

        .chart-error-message {
          margin: 0 0 16px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .chart-error-retry-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .chart-error-retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .chart-error-retry-btn:active {
          transform: translateY(0);
        }

        .dark .chart-error-message {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ChartError;
