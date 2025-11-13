import { memo } from "react";
import type { TopHomestayData } from "@/types/admin";
import { formatCurrency } from "@/utils/bookingUtils";

interface TopHomestaysTableProps {
  data: TopHomestayData[];
  loading?: boolean;
  error?: string | null;
  onHomestayClick?: (homestayId: number) => void;
  onRetry?: () => void;
}

const TopHomestaysTable = ({
  data,
  loading,
  error,
  onHomestayClick,
  onRetry,
}: TopHomestaysTableProps) => {
  if (loading) {
    return (
      <div className="table-loading" role="status" aria-live="polite">
        <div className="skeleton-rows">
          {[...Array(10)].map((_, index) => (
            <div key={index} className="skeleton-row">
              <div className="skeleton skeleton-rank"></div>
              <div className="skeleton skeleton-name"></div>
              <div className="skeleton skeleton-number"></div>
              <div className="skeleton skeleton-number"></div>
              <div className="skeleton skeleton-progress"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-error" role="alert">
        <p className="error-icon" aria-hidden="true">⚠️</p>
        <p className="error-message">{error}</p>
        {onRetry && (
          <button onClick={onRetry} className="retry-button">
            Thử lại
          </button>
        )}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty" role="status">
        <p aria-hidden="true">🏠</p>
        <p>Không có dữ liệu homestay</p>
      </div>
    );
  }

  const handleRowClick = (homestayId: number) => {
    if (onHomestayClick) {
      onHomestayClick(homestayId);
    }
  };

  return (
    <div className="top-homestays-table">
      <table role="table" aria-label="Bảng top 10 homestays theo doanh thu">
        <thead>
          <tr>
            <th scope="col" className="col-rank">Hạng</th>
            <th scope="col" className="col-name">Tên Homestay</th>
            <th scope="col" className="col-bookings">Số đơn</th>
            <th scope="col" className="col-revenue">Doanh thu</th>
            <th scope="col" className="col-percentage">% Tổng doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {data.map((homestay) => (
            <tr
              key={homestay.homestayId}
              onClick={() => handleRowClick(homestay.homestayId)}
              className={onHomestayClick ? "clickable" : ""}
              role="row"
            >
              <td className="col-rank">
                <div className="rank-badge">
                  {homestay.rank && homestay.rank <= 3 ? (
                    <span className={`medal medal-${homestay.rank}`}>
                      {homestay.rank === 1 ? "🥇" : homestay.rank === 2 ? "🥈" : "🥉"}
                    </span>
                  ) : (
                    <span className="rank-number">{homestay.rank}</span>
                  )}
                </div>
              </td>
              <td className="col-name">
                <span className="homestay-name">{homestay.homestayName}</span>
              </td>
              <td className="col-bookings">
                <span className="bookings-count">{homestay.bookings}</span>
              </td>
              <td className="col-revenue">
                <span className="revenue-value">
                  {formatCurrency(homestay.revenue)}
                </span>
              </td>
              <td className="col-percentage">
                <div className="percentage-container">
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{ width: `${homestay.percentage}%` }}
                      role="progressbar"
                      aria-valuenow={homestay.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                  <span className="percentage-text">
                    {homestay.percentage.toFixed(1)}%
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        .top-homestays-table {
          width: 100%;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        thead {
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
        }

        th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .col-rank {
          width: 80px;
          text-align: center;
        }

        .col-name {
          min-width: 200px;
        }

        .col-bookings,
        .col-revenue {
          width: 120px;
          text-align: right;
        }

        .col-percentage {
          width: 200px;
        }

        tbody tr {
          border-bottom: 1px solid #f3f4f6;
          transition: background-color 0.2s ease;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        tbody tr.clickable {
          cursor: pointer;
        }

        tbody tr.clickable:hover {
          background: #f3f4f6;
        }

        td {
          padding: 16px 20px;
          font-size: 14px;
          color: #1f2937;
        }

        .rank-badge {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .medal {
          font-size: 24px;
        }

        .rank-number {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: #e5e7eb;
          border-radius: 50%;
          font-weight: 600;
          color: #6b7280;
        }

        .homestay-name {
          font-weight: 500;
          color: #1f2937;
        }

        .bookings-count {
          font-weight: 500;
          color: #3b82f6;
        }

        .revenue-value {
          font-weight: 600;
          color: #059669;
        }

        .percentage-container {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .percentage-bar {
          flex: 1;
          height: 24px;
          background: #f3f4f6;
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }

        .percentage-fill {
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
          transition: width 0.3s ease;
          border-radius: 12px;
        }

        .percentage-text {
          min-width: 50px;
          text-align: right;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        /* Loading State */
        .table-loading {
          padding: 20px;
          background: white;
        }

        .skeleton-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .skeleton-row {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .skeleton {
          background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          border-radius: 4px;
        }

        .skeleton-rank {
          width: 40px;
          height: 32px;
          border-radius: 50%;
        }

        .skeleton-name {
          flex: 1;
          height: 20px;
        }

        .skeleton-number {
          width: 80px;
          height: 20px;
        }

        .skeleton-progress {
          width: 200px;
          height: 24px;
          border-radius: 12px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        /* Error State */
        .table-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: white;
          color: #6b7280;
        }

        .error-icon {
          font-size: 48px;
          margin: 0 0 12px 0;
        }

        .error-message {
          margin: 0 0 16px 0;
          font-size: 14px;
        }

        .retry-button {
          padding: 8px 16px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .retry-button:hover {
          background: #7c3aed;
        }

        /* Empty State */
        .table-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: white;
          color: #6b7280;
        }

        .table-empty p:first-child {
          font-size: 48px;
          margin: 0 0 12px 0;
        }

        .table-empty p:last-child {
          margin: 0;
          font-size: 14px;
        }

        /* Dark Mode */
        .dark table,
        .dark .table-loading,
        .dark .table-error,
        .dark .table-empty {
          background: #1e293b;
        }

        .dark thead {
          background: #0f172a;
        }

        .dark th {
          color: #94a3b8;
        }

        .dark tbody tr {
          border-bottom-color: #334155;
        }

        .dark tbody tr:hover {
          background: #0f172a;
        }

        .dark tbody tr.clickable:hover {
          background: #334155;
        }

        .dark td {
          color: #e2e8f0;
        }

        .dark .homestay-name {
          color: #f1f5f9;
        }

        .dark .rank-number {
          background: #334155;
          color: #94a3b8;
        }

        .dark .percentage-bar {
          background: #0f172a;
        }

        .dark .percentage-text {
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          th,
          td {
            padding: 12px 8px;
            font-size: 12px;
          }

          .col-rank {
            width: 60px;
          }

          .col-name {
            min-width: 150px;
          }

          .col-bookings,
          .col-revenue {
            width: 100px;
          }

          .col-percentage {
            width: 150px;
          }

          .percentage-container {
            gap: 8px;
          }

          .percentage-text {
            min-width: 40px;
            font-size: 11px;
          }

          .medal {
            font-size: 20px;
          }

          .rank-number {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(TopHomestaysTable);
