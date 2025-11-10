import { useEffect, useState } from "react";
import { fetchPendingHomestayRequests, reviewHomestayRequest } from "@/api/adminApi";
import type { AdminHomestayRequest } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaEdit, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

const AdminHomestayUpdateRequestsPage = () => {
  const [requests, setRequests] = useState<AdminHomestayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<number | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await fetchPendingHomestayRequests();
      // Filter only UPDATE requests
      const updateRequests = Array.isArray(data) ? data.filter((r) => r.type === "UPDATE") : [];
      setRequests(updateRequests);
    } catch (error) {
      showAlert("Không thể tải danh sách yêu cầu cập nhật", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (requestId: number, status: "approved" | "rejected", comment?: string) => {
    setReviewingId(requestId);
    try {
      await reviewHomestayRequest(requestId, { status, adminComment: comment });
      showAlert(`Yêu cầu đã được ${status === "approved" ? "phê duyệt" : "từ chối"}`, "success");
      loadRequests();
    } catch (error) {
      showAlert("Không thể xử lý yêu cầu", "danger");
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="admin-update-requests-page">
      <div className="page-header">
        <h1>Yêu cầu Cập nhật Homestay</h1>
        <p>Duyệt các yêu cầu cập nhật thông tin homestay từ chủ nhà</p>
      </div>

      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">Tổng yêu cầu</span>
          <span className="stat-value">{requests.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Đang chờ duyệt</span>
          <span className="stat-value pending">{requests.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : requests.length === 0 ? (
        <div className="empty-state">
          <FaEdit className="empty-icon" />
          <h3>Không có yêu cầu cập nhật</h3>
          <p>Hiện tại không có yêu cầu cập nhật homestay nào đang chờ duyệt</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>{request.homestayName}</h3>
                  <p className="owner-name">Chủ nhà: {request.ownerName}</p>
                </div>
                <span className="type-badge update">Cập nhật</span>
              </div>

              <div className="request-info">
                <div className="info-item">
                  <span className="info-label">ID Yêu cầu:</span>
                  <span className="info-value">#{request.id}</span>
                </div>
                {request.submittedAt && (
                  <div className="info-item">
                    <span className="info-label">Ngày gửi:</span>
                    <span className="info-value">{new Date(request.submittedAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                )}
              </div>

              <div className="request-actions">
                <button
                  className="action-btn approve"
                  onClick={() => handleReview(request.id, "approved")}
                  disabled={reviewingId === request.id}
                >
                  {reviewingId === request.id ? (
                    <>
                      <FaSpinner className="spinner" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Phê duyệt
                    </>
                  )}
                </button>
                <button
                  className="action-btn reject"
                  onClick={() => handleReview(request.id, "rejected", "Không đủ điều kiện")}
                  disabled={reviewingId === request.id}
                >
                  {reviewingId === request.id ? (
                    <>
                      <FaSpinner className="spinner" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FaTimes />
                      Từ chối
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .admin-update-requests-page {
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

        .stats-bar {
          display: flex;
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-item {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-value.pending {
          color: #f59e0b;
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

        .requests-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .request-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .request-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .request-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .request-header h3 {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
        }

        .owner-name {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .type-badge {
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .type-badge.update {
          background: #fef3c7;
          color: #92400e;
        }

        .request-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          font-size: 14px;
        }

        .info-label {
          color: #6b7280;
        }

        .info-value {
          font-weight: 600;
          color: #1f2937;
        }

        .request-actions {
          display: flex;
          gap: 8px;
        }

        .action-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .action-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .action-btn svg {
          color: #6b7280;
        }

        .action-btn.approve {
          background: #10b981;
          color: white;
        }

        .action-btn.approve:hover:not(:disabled) {
          background: #059669;
        }

        .action-btn.reject {
          background: #ef4444;
          color: white;
        }

        .action-btn.reject:hover:not(:disabled) {
          background: #dc2626;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .empty-state h3,
        .dark .request-header h3,
        .dark .stat-value,
        .dark .info-value {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .empty-state p,
        .dark .owner-name,
        .dark .stat-label,
        .dark .info-label {
          color: #94a3b8;
        }

        .dark .stat-item,
        .dark .loading,
        .dark .empty-state,
        .dark .request-card {
          background: #1e293b;
        }

        .dark .request-header {
          border-bottom-color: #334155;
        }
      `}</style>
    </div>
  );
};

export default AdminHomestayUpdateRequestsPage;
