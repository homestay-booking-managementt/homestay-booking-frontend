import { useEffect, useState } from "react";
import { fetchAdminComplaints } from "@/api/adminApi";
import type { AdminComplaintSummary } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaExclamationTriangle, FaClipboardList, FaCheckCircle, FaChartLine, FaInbox } from "react-icons/fa";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState<AdminComplaintSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    loadComplaints();
  }, []);

  const loadComplaints = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách khiếu nại", "danger");
    } finally {
      setLoading(false);
    }
  };

  const filteredComplaints =
    filter === "ALL" ? complaints : complaints.filter((c) => c.status === filter);

  const totalComplaints = complaints.length;
  const openComplaints = complaints.filter((c) => c.status === "OPEN").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "RESOLVED").length;

  return (
    <div className="admin-complaints-page">
      <div className="page-header">
        <h1>Quản lý Khiếu nại</h1>
        <p>Theo dõi và xử lý các khiếu nại từ người dùng</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon red">
            <FaExclamationTriangle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tổng khiếu nại</span>
            <span className="stat-value">{totalComplaints}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <FaClipboardList />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đang xử lý</span>
            <span className="stat-value">{openComplaints}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FaCheckCircle />
          </div>
          <div className="stat-content">
            <span className="stat-label">Đã giải quyết</span>
            <span className="stat-value">{resolvedComplaints}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <FaChartLine />
          </div>
          <div className="stat-content">
            <span className="stat-label">Tỉ lệ giải quyết</span>
            <span className="stat-value">
              {totalComplaints > 0 ? ((resolvedComplaints / totalComplaints) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <button className={`filter-btn ${filter === "ALL" ? "active" : ""}`} onClick={() => setFilter("ALL")}>
          Tất cả
        </button>
        <button className={`filter-btn ${filter === "OPEN" ? "active" : ""}`} onClick={() => setFilter("OPEN")}>
          Đang xử lý
        </button>
        <button
          className={`filter-btn ${filter === "IN_PROGRESS" ? "active" : ""}`}
          onClick={() => setFilter("IN_PROGRESS")}
        >
          Đang tiến hành
        </button>
        <button className={`filter-btn ${filter === "RESOLVED" ? "active" : ""}`} onClick={() => setFilter("RESOLVED")}>
          Đã giải quyết
        </button>
        <button className={`filter-btn ${filter === "CLOSED" ? "active" : ""}`} onClick={() => setFilter("CLOSED")}>
          Đã đóng
        </button>
      </div>

      {/* Complaints Grid */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <FaInbox className="empty-icon" />
          <h3>Không có khiếu nại</h3>
          <p>Không tìm thấy khiếu nại nào phù hợp với bộ lọc</p>
        </div>
      ) : (
        <div className="complaints-grid">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="complaint-card">
              <div className="complaint-header">
                <span className="complaint-id">#{complaint.id}</span>
                <span className={`status-badge ${complaint.status.toLowerCase()}`}>{complaint.status}</span>
              </div>

              <h3 className="complaint-subject">{complaint.subject}</h3>

              {complaint.assignedTo && (
                <div className="assigned-to">
                  <span className="assigned-label">Phụ trách:</span>
                  <span className="assigned-name">{complaint.assignedTo}</span>
                </div>
              )}

              <div className="complaint-actions">
                <button className="action-btn view">👁️ Xem chi tiết</button>
                <button className="action-btn resolve">✓ Giải quyết</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-complaints-page {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 16px;
          align-items: center;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
          color: #6b7280;
          background: #e5e7eb;
        }

        .stat-icon.red {
          background: #e5e7eb;
        }

        .stat-icon.yellow {
          background: #e5e7eb;
        }

        .stat-icon.green {
          background: #e5e7eb;
        }

        .stat-icon.blue {
          background: #e5e7eb;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .filter-bar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          background: white;
          border-radius: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          color: #9ca3af;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .empty-state p {
          margin: 0;
          color: #6b7280;
        }

        .complaints-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .complaint-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .complaint-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .complaint-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .complaint-id {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.open {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.in_progress {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.resolved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.closed {
          background: #e5e7eb;
          color: #4b5563;
        }

        .complaint-subject {
          margin: 0 0 16px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .assigned-to {
          margin-bottom: 16px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          display: flex;
          gap: 8px;
          font-size: 14px;
        }

        .assigned-label {
          color: #6b7280;
        }

        .assigned-name {
          color: #1f2937;
          font-weight: 500;
        }

        .complaint-actions {
          display: flex;
          gap: 12px;
        }

        .action-btn {
          flex: 1;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: #e5e7eb;
          color: #1f2937;
        }

        .action-btn.view:hover {
          background: #d1d5db;
        }

        .action-btn.resolve {
          background: #10b981;
          color: white;
        }

        .action-btn.resolve:hover {
          background: #059669;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .stat-value,
        .dark .empty-state h3,
        .dark .complaint-subject {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .stat-label,
        .dark .empty-state p,
        .dark .complaint-id {
          color: #94a3b8;
        }

        .dark .stat-card,
        .dark .filter-bar,
        .dark .loading,
        .dark .empty-state,
        .dark .complaint-card {
          background: #1e293b;
        }

        .dark .filter-btn {
          background: #0f172a;
          color: #cbd5e0;
          border-color: #334155;
        }

        .dark .filter-btn:hover {
          background: #1e293b;
        }

        .dark .assigned-to {
          background: #0f172a;
        }

        .dark .assigned-name {
          color: #e2e8f0;
        }

        .dark .action-btn.view {
          background: #0f172a;
          color: #cbd5e0;
        }

        .dark .action-btn.view:hover {
          background: #334155;
        }

        @media (max-width: 768px) {
          .stats-grid,
          .complaints-grid {
            grid-template-columns: 1fr;
          }

          .filter-bar {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminComplaintsPage;
