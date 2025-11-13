import type { ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  children: ReactNode;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}

const ChartContainer = ({ 
  title, 
  children, 
  loading, 
  empty, 
  emptyMessage = "Không có dữ liệu để hiển thị" 
}: ChartContainerProps) => {
  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>{title}</h3>
      </div>
      <div className="chart-content">
        {loading ? (
          <div className="chart-skeleton">
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
            <div className="skeleton-bar"></div>
          </div>
        ) : empty ? (
          <div className="empty-state">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
            </svg>
            <p>{emptyMessage}</p>
          </div>
        ) : (
          children
        )}
      </div>

      <style>{`
        .chart-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .chart-header {
          padding: 20px 24px;
          border-bottom: 1px solid #f3f4f6;
        }

        .chart-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .chart-content {
          padding: 24px;
          min-height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chart-skeleton {
          width: 100%;
          display: flex;
          align-items: flex-end;
          gap: 16px;
          height: 250px;
        }

        .skeleton-bar {
          flex: 1;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 4px;
        }

        .skeleton-bar:nth-child(1) { height: 60%; }
        .skeleton-bar:nth-child(2) { height: 80%; }
        .skeleton-bar:nth-child(3) { height: 50%; }
        .skeleton-bar:nth-child(4) { height: 90%; }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #9ca3af;
          text-align: center;
        }

        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        /* Dark Mode */
        .dark .chart-container {
          background: #1e293b;
        }

        .dark .chart-header {
          border-bottom-color: #334155;
        }

        .dark .chart-header h3 {
          color: #f1f5f9;
        }

        .dark .empty-state p {
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .chart-content {
            padding: 16px;
            min-height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default ChartContainer;
