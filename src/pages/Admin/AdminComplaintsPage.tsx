import { useEffect, useState } from "react";
import { fetchAdminComplaints, updateComplaintStatus } from "@/api/adminApi";
import type { AdminComplaintSummary, ComplaintStatus } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaExclamationTriangle, FaClipboardList, FaCheckCircle, FaChartLine, FaInbox } from "react-icons/fa";
import ComplaintDetailModal from "./ComplaintDetailModal";
import ResolveComplaintModal from "./ResolveComplaintModal";

const AdminComplaintsPage = () => {
  const [complaints, setComplaints] = useState<AdminComplaintSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState<AdminComplaintSummary | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      OPEN: "Đang xử lý",
      IN_PROGRESS: "Đang tiến hành",
      RESOLVED: "Đã giải quyết",
      CLOSED: "Đã đóng",
      pending: "Đang xử lý",
      in_review: "Đang tiến hành",
      resolved: "Đã giải quyết",
      closed: "Đã đóng",
    };
    return statusMap[status] || status;
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const [loadError, setLoadError] = useState(false);

  const loadComplaints = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await fetchAdminComplaints();
      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading complaints:", error);
      setLoadError(true);
      showAlert("Không thể tải danh sách khiếu nại", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (complaint: AdminComplaintSummary) => {
    setSelectedComplaint(complaint);
    setShowDetailModal(true);
  };

  const handleResolve = (complaint: AdminComplaintSummary) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
  };

  const handleCloseModals = () => {
    setShowDetailModal(false);
    setShowResolveModal(false);
    setSelectedComplaint(null);
  };

  const handleStatusUpdate = async (complaintId: number, newStatus: ComplaintStatus, note?: string) => {
    try {
      await updateComplaintStatus(complaintId, { status: newStatus, note });
      
      // Optimistic update: cập nhật local state
      setComplaints((prev) =>
        prev.map((c) => (c.id === complaintId ? { ...c, status: newStatus } : c))
      );
      
      showAlert("Cập nhật trạng thái thành công", "success");
      handleCloseModals();
      
      // Reload để đảm bảo data đồng bộ
      loadComplaints();
    } catch (error: any) {
      console.error("Error updating complaint status:", error);
      showAlert(error?.message || "Không thể cập nhật trạng thái khiếu nại", "danger");
      throw error;
    }
  };

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

      {/* Complaints List */}
      {loadError ? (
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Không thể tải dữ liệu</h3>
          <p>Đã xảy ra lỗi khi tải danh sách khiếu nại</p>
          <button className="retry-btn" onClick={loadComplaints} type="button">
            🔄 Thử lại
          </button>
        </div>
      ) : loading ? (
        <div className="complaints-list">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="complaint-row skeleton-row">
              <div className="skeleton skeleton-id" />
              <div className="skeleton skeleton-badge" />
              <div className="skeleton skeleton-subject" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
              <div className="skeleton skeleton-text" />
            </div>
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <FaInbox className="empty-icon" />
          <h3>Không có khiếu nại</h3>
          <p>Không tìm thấy khiếu nại nào</p>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="complaint-row"
              onClick={() => handleViewDetail(complaint)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleViewDetail(complaint);
                }
              }}
            >
              <div className="row-cell id-cell">#{complaint.id}</div>
              <div className="row-cell status-cell">
                <span className={`status-badge ${complaint.status.toLowerCase()}`}>
                  {getStatusText(complaint.status)}
                </span>
              </div>
              <div className="row-cell subject-cell">{complaint.subject}</div>
              <div className="row-cell homestay-cell">{complaint.homestayName || "-"}</div>
              <div className="row-cell user-cell">{complaint.userName || "-"}</div>
              <div className="row-cell date-cell">
                {complaint.createdAt 
                  ? new Date(complaint.createdAt).toLocaleDateString('vi-VN')
                  : "-"}
              </div>
              <div className="row-cell assigned-cell">
                {complaint.assignedTo || complaint.assignedAdminName || "-"}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={handleCloseModals}
        onResolve={handleResolve}
        show={showDetailModal}
      />
      <ResolveComplaintModal
        complaint={selectedComplaint}
        onClose={handleCloseModals}
        onConfirm={handleStatusUpdate}
        show={showResolveModal}
      />

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
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
          transition: transform 0.2s;
        }

        .stat-card:hover .stat-icon {
          transform: scale(1.1);
        }

        .stat-icon.red {
          background: #fee2e2;
          color: #dc2626;
        }

        .stat-icon.yellow {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-icon.green {
          background: #d1fae5;
          color: #059669;
        }

        .stat-icon.blue {
          background: #dbeafe;
          color: #2563eb;
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

        .error-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .error-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .error-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #dc2626;
        }

        .error-state p {
          margin: 0 0 24px 0;
          color: #6b7280;
        }

        .retry-btn {
          padding: 12px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .retry-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        /* Complaints List */
        .complaints-list {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .complaint-row {
          display: grid;
          grid-template-columns: 80px 120px 1fr 180px 150px 120px 150px;
          gap: 16px;
          padding: 16px 20px;
          border-bottom: 1px solid #e5e7eb;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .complaint-row:last-child {
          border-bottom: none;
        }

        .complaint-row:hover {
          background: #f9fafb;
        }

        .row-cell {
          font-size: 14px;
          color: #1f2937;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .id-cell {
          font-weight: 600;
          color: #6b7280;
        }

        .status-cell {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
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

        .subject-cell {
          font-weight: 600;
        }

        .homestay-cell,
        .user-cell,
        .assigned-cell {
          color: #6b7280;
        }

        .date-cell {
          color: #6b7280;
          font-size: 13px;
        }

        /* Skeleton Loading */
        .skeleton-row {
          pointer-events: none;
        }

        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s ease-in-out infinite;
          border-radius: 4px;
          height: 16px;
        }

        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        .skeleton-id {
          width: 60px;
        }

        .skeleton-badge {
          width: 100px;
          height: 24px;
          border-radius: 12px;
        }

        .skeleton-subject {
          width: 100%;
        }

        .skeleton-text {
          width: 80%;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .stat-value,
        .dark .empty-state h3 {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .stat-label,
        .dark .empty-state p {
          color: #94a3b8;
        }

        .dark .error-state {
          background: #1e293b;
        }

        .dark .error-state h3 {
          color: #f87171;
        }

        .dark .error-state p {
          color: #94a3b8;
        }

        .dark .stat-card,
        .dark .loading,
        .dark .empty-state {
          background: #1e293b;
        }

        .dark .complaints-list {
          background: #1e293b;
        }

        .dark .complaint-row {
          border-bottom-color: #334155;
        }

        .dark .complaint-row:hover {
          background: #334155;
        }

        .dark .row-cell {
          color: #e2e8f0;
        }

        .dark .id-cell,
        .dark .homestay-cell,
        .dark .user-cell,
        .dark .assigned-cell,
        .dark .date-cell {
          color: #94a3b8;
        }

        .dark .skeleton {
          background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
          background-size: 200% 100%;
        }

        @media (max-width: 1024px) {
          .complaint-row {
            grid-template-columns: 80px 120px 1fr 180px 150px 120px;
          }

          .assigned-cell {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .complaint-row {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 16px;
          }

          .row-cell {
            white-space: normal;
          }

          .homestay-cell,
          .user-cell,
          .date-cell,
          .assigned-cell {
            display: none;
          }

          .id-cell::before {
            content: "ID: ";
            font-weight: 400;
            color: #9ca3af;
          }

          .subject-cell {
            font-size: 15px;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminComplaintsPage;
