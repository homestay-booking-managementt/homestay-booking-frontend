import { useEffect, useState } from "react";
import { fetchRevenueReport } from "@/api/adminApi";
import type { AdminRevenueReport } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaDollarSign, FaChartBar, FaTrophy, FaHome } from "react-icons/fa";

const AdminRevenuePage = () => {
  const [revenue, setRevenue] = useState<AdminRevenueReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRevenue();
  }, []);

  const loadRevenue = async () => {
    setLoading(true);
    try {
      const data = await fetchRevenueReport();
      setRevenue(data);
    } catch (error) {
      showAlert("Không thể tải báo cáo doanh thu", "danger");
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = revenue?.items?.reduce((sum, item) => sum + (item.totalRevenue || 0), 0) || 0;
  const averageRevenue = revenue?.items?.length ? totalRevenue / revenue.items.length : 0;
  const topHomestay = revenue?.items?.sort((a, b) => (b.totalRevenue || 0) - (a.totalRevenue || 0))[0];

  return (
    <div className="admin-revenue-page">
      <div className="page-header">
        <h1>Báo cáo Doanh thu</h1>
        <p>Thống kê và phân tích doanh thu từ đặt phòng homestay</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon purple">
            <FaDollarSign />
          </div>
          <div className="summary-content">
            <span className="summary-label">Tổng doanh thu</span>
            <span className="summary-value">{totalRevenue.toLocaleString("vi-VN")} VND</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon blue">
            <FaChartBar />
          </div>
          <div className="summary-content">
            <span className="summary-label">Trung bình/Homestay</span>
            <span className="summary-value">{Math.round(averageRevenue).toLocaleString("vi-VN")} VND</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon green">
            <FaTrophy />
          </div>
          <div className="summary-content">
            <span className="summary-label">Homestay xuất sắc nhất</span>
            <span className="summary-value">{topHomestay?.homestayName || "N/A"}</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon yellow">
            <FaHome />
          </div>
          <div className="summary-content">
            <span className="summary-label">Số lượng Homestay</span>
            <span className="summary-value">{revenue?.items?.length || 0}</span>
          </div>
        </div>
      </div>

      {/* Revenue Table */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h2>Chi tiết Doanh thu theo Homestay</h2>
            {revenue?.generatedAt && (
              <span className="generated-time">
                Cập nhật: {new Date(revenue.generatedAt).toLocaleString("vi-VN")}
              </span>
            )}
          </div>

          <table className="revenue-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Homestay</th>
                <th>Tháng</th>
                <th>Doanh thu</th>
                <th>% Tổng doanh thu</th>
              </tr>
            </thead>
            <tbody>
              {revenue?.items?.map((item, index) => {
                const percentage = totalRevenue > 0 ? ((item.totalRevenue || 0) / totalRevenue) * 100 : 0;
                return (
                  <tr key={index}>
                    <td>{item.homestayId}</td>
                    <td className="homestay-name">{item.homestayName}</td>
                    <td>{item.month || "Tất cả"}</td>
                    <td className="revenue-value">{(item.totalRevenue || 0).toLocaleString("vi-VN")} VND</td>
                    <td>
                      <div className="percentage-bar">
                        <div className="percentage-fill" style={{ width: `${percentage}%` }} />
                        <span className="percentage-text">{percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-revenue-page {
          max-width: 1400px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: center;
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
          color: #6b7280;
          background: #e5e7eb;
        }

        .summary-icon.purple {
          background: #e5e7eb;
        }

        .summary-icon.blue {
          background: #e5e7eb;
        }

        .summary-icon.green {
          background: #e5e7eb;
        }

        .summary-icon.yellow {
          background: #e5e7eb;
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
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          background: white;
          border-radius: 12px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .table-header {
          padding: 24px;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .generated-time {
          font-size: 14px;
          color: #6b7280;
        }

        .revenue-table {
          width: 100%;
          border-collapse: collapse;
        }

        .revenue-table thead {
          background: #f9fafb;
        }

        .revenue-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .revenue-table td {
          padding: 16px 20px;
          border-top: 1px solid #f3f4f6;
          font-size: 14px;
          color: #1f2937;
        }

        .revenue-table tbody tr:hover {
          background: #f9fafb;
        }

        .homestay-name {
          font-weight: 500;
        }

        .revenue-value {
          font-weight: 600;
          color: #059669;
        }

        .percentage-bar {
          position: relative;
          width: 100%;
          height: 32px;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
        }

        .percentage-fill {
          position: absolute;
          height: 100%;
          background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
          transition: width 0.3s ease;
        }

        .percentage-text {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          font-size: 12px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .summary-value,
        .dark .table-header h2 {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .summary-label,
        .dark .generated-time {
          color: #94a3b8;
        }

        .dark .summary-card,
        .dark .loading,
        .dark .table-container {
          background: #1e293b;
        }

        .dark .table-header {
          border-bottom-color: #334155;
        }

        .dark .revenue-table thead {
          background: #0f172a;
        }

        .dark .revenue-table th {
          color: #94a3b8;
        }

        .dark .revenue-table td {
          color: #e2e8f0;
          border-top-color: #334155;
        }

        .dark .revenue-table tbody tr:hover {
          background: #0f172a;
        }

        .dark .percentage-bar {
          background: #0f172a;
        }

        .dark .percentage-text {
          color: #e2e8f0;
        }

        @media (max-width: 768px) {
          .summary-grid {
            grid-template-columns: 1fr;
          }

          .table-container {
            overflow-x: auto;
          }

          .table-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminRevenuePage;
