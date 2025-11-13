import type { AdminComplaintSummary } from "@/types/admin";
import { useEffect } from "react";

interface ComplaintDetailModalProps {
  complaint: AdminComplaintSummary | null;
  show: boolean;
  onClose: () => void;
  onResolve: (complaint: AdminComplaintSummary) => void;
}

const ComplaintDetailModal = ({ complaint, show, onClose, onResolve }: ComplaintDetailModalProps) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [show]);

  if (!show || !complaint) return null;

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "open" || statusLower === "pending") return "status-open";
    if (statusLower === "in_progress" || statusLower === "in_review") return "status-progress";
    if (statusLower === "resolved") return "status-resolved";
    if (statusLower === "closed") return "status-closed";
    return "status-open";
  };

  const getStatusText = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "open" || statusLower === "pending") return "Đang xử lý";
    if (statusLower === "in_progress" || statusLower === "in_review") return "Đang tiến hành";
    if (statusLower === "resolved") return "Đã giải quyết";
    if (statusLower === "closed") return "Đã đóng";
    return status;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div className="complaint-modal-overlay" onClick={handleBackdropClick}>
        <div className="complaint-modal-container">
          {/* Header */}
          <div className="complaint-modal-header">
            <div className="header-content">
              <span className="complaint-id">#{complaint.id}</span>
              <span className={`status-badge ${getStatusBadgeClass(complaint.status)}`}>
                {getStatusText(complaint.status)}
              </span>
            </div>
            <button className="close-button" onClick={onClose} type="button">×</button>
          </div>

          <div className="complaint-modal-title">{complaint.subject}</div>

          {/* Body with 2-column layout */}
          <div className="complaint-modal-body">
            {/* Left Column - Homestay Info */}
            <div className="info-column homestay-column">
              <div className="column-header">
                <span className="column-icon">🏠</span>
                <h3 className="column-title">Homestay bị khiếu nại</h3>
              </div>
              <div className="column-content">
                {complaint.homestayId && (
                  <div className="info-item">
                    <div className="info-label">ID HOMESTAY:</div>
                    <div className="info-value">#{complaint.homestayId}</div>
                  </div>
                )}
                {complaint.homestayName && (
                  <div className="info-item">
                    <div className="info-label">TÊN HOMESTAY:</div>
                    <div className="info-value">{complaint.homestayName}</div>
                  </div>
                )}
                {complaint.homestayAddress && (
                  <div className="info-item">
                    <div className="info-label">ĐỊA CHỈ:</div>
                    <div className="info-value">{complaint.homestayAddress}</div>
                  </div>
                )}
                {complaint.homestayOwner && (
                  <div className="info-item">
                    <div className="info-label">CHỦ HOMESTAY:</div>
                    <div className="info-value">{complaint.homestayOwner}</div>
                  </div>
                )}
                {complaint.homestayOwnerPhone && (
                  <div className="info-item">
                    <div className="info-label">SỐ ĐIỆN THOẠI CHỦ:</div>
                    <div className="info-value">{complaint.homestayOwnerPhone}</div>
                  </div>
                )}
                {complaint.homestayOwnerEmail && (
                  <div className="info-item">
                    <div className="info-label">EMAIL CHỦ:</div>
                    <div className="info-value">{complaint.homestayOwnerEmail}</div>
                  </div>
                )}
                {!complaint.homestayId && !complaint.homestayName && (
                  <div className="no-data">Không có thông tin homestay</div>
                )}
              </div>
            </div>

            {/* Right Column - User Info */}
            <div className="info-column user-column">
              <div className="column-header">
                <span className="column-icon">👤</span>
                <h3 className="column-title">Người khiếu nại</h3>
              </div>
              <div className="column-content">
                {complaint.userId && (
                  <div className="info-item">
                    <div className="info-label">ID NGƯỜI DÙNG:</div>
                    <div className="info-value">#{complaint.userId}</div>
                  </div>
                )}
                {complaint.userName && (
                  <div className="info-item">
                    <div className="info-label">TÊN:</div>
                    <div className="info-value">{complaint.userName}</div>
                  </div>
                )}
                {complaint.userEmail && (
                  <div className="info-item">
                    <div className="info-label">EMAIL:</div>
                    <div className="info-value">{complaint.userEmail}</div>
                  </div>
                )}
                {complaint.userPhone && (
                  <div className="info-item">
                    <div className="info-label">SỐ ĐIỆN THOẠI:</div>
                    <div className="info-value">{complaint.userPhone}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full Width Content Section */}
          {complaint.content && (
            <div className="complaint-content-section">
              <div className="content-header">
                <span className="content-icon">📝</span>
                <h3 className="content-title">Nội dung khiếu nại</h3>
              </div>
              <div className="content-body">{complaint.content}</div>
            </div>
          )}

          {/* Footer Info */}
          <div className="complaint-modal-info">
            {complaint.createdAt && (
              <div className="info-footer-item">
                <span className="footer-label">Ngày gửi:</span>
                <span className="footer-value">
                  {new Date(complaint.createdAt).toLocaleString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            <div className="info-footer-item">
              <span className="footer-label">Trạng thái hiện tại:</span>
              <span className={`status-badge-small ${getStatusBadgeClass(complaint.status)}`}>
                {getStatusText(complaint.status)}
              </span>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="complaint-modal-footer">
            <button className="btn-resolve" onClick={() => onResolve(complaint)} type="button">
              Giải quyết khiếu nại
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* Modal Overlay */
        .complaint-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Modal Container */
        .complaint-modal-container {
          background: white;
          border-radius: 20px;
          width: 750px;
          max-width: 95vw;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.4);
          animation: slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }

        /* Header */
        .complaint-modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 24px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .complaint-id {
          font-size: 24px;
          font-weight: 800;
          color: white;
          letter-spacing: -0.5px;
        }

        .status-badge {
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .status-badge.status-open {
          background: rgba(254, 243, 199, 0.95);
          color: #92400e;
        }

        .status-badge.status-progress {
          background: rgba(219, 234, 254, 0.95);
          color: #1e40af;
        }

        .status-badge.status-resolved {
          background: rgba(209, 250, 229, 0.95);
          color: #065f46;
        }

        .status-badge.status-closed {
          background: rgba(229, 231, 235, 0.95);
          color: #4b5563;
        }

        .close-button {
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          font-size: 28px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all 0.3s;
        }

        .close-button:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: rotate(90deg) scale(1.1);
        }

        /* Title */
        .complaint-modal-title {
          padding: 20px 30px;
          background: white;
          border-bottom: 2px solid #f3f4f6;
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.5;
        }

        /* Body with 2-column layout */
        .complaint-modal-body {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          background: white;
          overflow-y: auto;
          max-height: calc(90vh - 400px);
        }

        /* Info Columns */
        .info-column {
          padding: 20px;
          display: flex;
          flex-direction: column;
        }

        .homestay-column {
          background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
          border-right: 1px solid #e0e7ff;
        }

        .user-column {
          background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
        }

        .column-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 2px solid rgba(0, 0, 0, 0.1);
        }

        .column-icon {
          font-size: 24px;
        }

        .column-title {
          font-size: 15px;
          font-weight: 800;
          color: #1f2937;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .homestay-column .column-title {
          color: #1e40af;
        }

        .user-column .column-title {
          color: #92400e;
        }

        .column-content {
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .info-item {
          background: rgba(255, 255, 255, 0.7);
          padding: 10px 12px;
          border-radius: 8px;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }

        .homestay-column .info-item {
          border-left-color: #93c5fd;
        }

        .user-column .info-item {
          border-left-color: #fcd34d;
        }

        .info-item:hover {
          background: white;
          transform: translateX(3px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .info-label {
          font-size: 10px;
          font-weight: 700;
          color: #6b7280;
          letter-spacing: 1px;
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1.5;
          word-break: break-word;
          overflow-wrap: break-word;
        }

        .no-data {
          font-size: 13px;
          color: #9ca3af;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }



        /* Content Section */
        .complaint-content-section {
          background: white;
          padding: 18px 24px;
          border-top: 2px solid #f3f4f6;
          overflow-y: auto;
          max-height: 300px;
        }

        .content-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .content-icon {
          font-size: 18px;
        }

        .content-title {
          font-size: 13px;
          font-weight: 800;
          color: #4c1d95;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .content-body {
          background: #f9fafb;
          padding: 12px;
          border-radius: 10px;
          border: 2px solid #e5e7eb;
          font-size: 13px;
          color: #374151;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
        }

        /* Footer Info */
        .complaint-modal-info {
          background: #fafbfc;
          padding: 14px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 2px solid #e5e7eb;
          flex-wrap: wrap;
          gap: 12px;
        }

        .info-footer-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .footer-label {
          font-size: 12px;
          font-weight: 600;
          color: #6b7280;
        }

        .footer-value {
          font-size: 13px;
          font-weight: 600;
          color: #111827;
        }

        .status-badge-small {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.6px;
        }

        .status-badge-small.status-open {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge-small.status-progress {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge-small.status-resolved {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge-small.status-closed {
          background: #e5e7eb;
          color: #4b5563;
        }

        /* Footer Buttons */
        .complaint-modal-footer {
          background: white;
          padding: 16px 24px;
          display: flex;
          justify-content: center;
          border-top: 2px solid #e5e7eb;
        }

        .btn-resolve {
          padding: 12px 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.35);
        }

        .btn-resolve:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(102, 126, 234, 0.45);
        }

        .btn-resolve:active {
          transform: translateY(-1px);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .complaint-modal-container {
            width: 95%;
            max-width: 95%;
            margin: 20px;
            max-height: 95vh;
          }

          .complaint-modal-header {
            padding: 16px 20px;
          }

          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .complaint-id {
            font-size: 20px;
          }

          .complaint-modal-title {
            padding: 16px 20px;
            font-size: 16px;
          }

          .complaint-modal-body {
            grid-template-columns: 1fr;
            gap: 0;
            padding: 0;
            max-height: calc(95vh - 350px);
            overflow-y: auto;
          }

          .info-column {
            padding: 16px 20px;
            border-right: none;
            border-bottom: 2px solid rgba(0, 0, 0, 0.1);
          }

          .info-column:last-child {
            border-bottom: none;
          }

          .column-header {
            margin-bottom: 12px;
            padding-bottom: 8px;
          }

          .column-title {
            font-size: 13px;
          }

          .column-icon {
            font-size: 18px;
          }

          .info-item {
            padding: 8px 10px;
          }

          .info-label {
            font-size: 9px;
            margin-bottom: 4px;
          }

          .info-value {
            font-size: 12px;
          }

          .complaint-content-section {
            padding: 16px 20px;
            max-height: 250px;
          }

          .content-body {
            font-size: 13px;
            padding: 12px;
            max-height: 180px;
            overflow-y: auto;
          }

          .complaint-modal-info {
            flex-direction: column;
            align-items: flex-start;
            padding: 16px 20px;
          }

          .complaint-modal-footer {
            padding: 16px 20px;
          }

          .btn-resolve {
            width: 100%;
            padding: 14px;
          }
        }

        /* Dark Mode Support */
        [data-theme="dark"] .complaint-modal-overlay {
          background: rgba(0, 0, 0, 0.85);
        }

        [data-theme="dark"] .complaint-modal-container {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          box-shadow: 0 25px 80px rgba(0, 0, 0, 0.8);
        }

        [data-theme="dark"] .complaint-modal-header {
          background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
        }

        [data-theme="dark"] .complaint-id {
          color: #f1f5f9;
        }

        [data-theme="dark"] .status-badge.status-open {
          background: rgba(146, 64, 14, 0.3);
          color: #fbbf24;
        }

        [data-theme="dark"] .status-badge.status-progress {
          background: rgba(30, 64, 175, 0.3);
          color: #60a5fa;
        }

        [data-theme="dark"] .status-badge.status-resolved {
          background: rgba(6, 95, 70, 0.3);
          color: #34d399;
        }

        [data-theme="dark"] .status-badge.status-closed {
          background: rgba(75, 85, 99, 0.3);
          color: #d1d5db;
        }

        [data-theme="dark"] .complaint-modal-title {
          background: #1e293b;
          color: #f1f5f9;
          border-bottom-color: #334155;
        }

        [data-theme="dark"] .complaint-modal-body {
          background: #0f172a;
        }

        [data-theme="dark"] .info-column {
          background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
          border-color: #334155;
        }

        [data-theme="dark"] .homestay-column {
          background: linear-gradient(145deg, #1e3a5f 0%, #1e293b 100%);
          border-right-color: #334155;
        }

        [data-theme="dark"] .user-column {
          background: linear-gradient(145deg, #422006 0%, #1e293b 100%);
        }

        [data-theme="dark"] .column-title {
          color: #f1f5f9;
        }

        [data-theme="dark"] .info-item {
          background: rgba(255, 255, 255, 0.05);
        }

        [data-theme="dark"] .info-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        [data-theme="dark"] .info-label {
          color: #94a3b8;
        }

        [data-theme="dark"] .info-value {
          color: #f1f5f9;
        }

        [data-theme="dark"] .complaint-content-section {
          background: #1e293b;
          border-top-color: #334155;
        }

        [data-theme="dark"] .content-title {
          color: #a78bfa;
        }

        [data-theme="dark"] .content-body {
          background: #0f172a;
          border-color: #334155;
          color: #cbd5e1;
        }

        [data-theme="dark"] .complaint-modal-info {
          background: #0f172a;
          border-top-color: #334155;
        }

        [data-theme="dark"] .footer-label {
          color: #94a3b8;
        }

        [data-theme="dark"] .footer-value {
          color: #f1f5f9;
        }

        [data-theme="dark"] .status-badge-small.status-open {
          background: rgba(146, 64, 14, 0.3);
          color: #fbbf24;
        }

        [data-theme="dark"] .status-badge-small.status-progress {
          background: rgba(30, 64, 175, 0.3);
          color: #60a5fa;
        }

        [data-theme="dark"] .status-badge-small.status-resolved {
          background: rgba(6, 95, 70, 0.3);
          color: #34d399;
        }

        [data-theme="dark"] .status-badge-small.status-closed {
          background: rgba(75, 85, 99, 0.3);
          color: #d1d5db;
        }

        [data-theme="dark"] .complaint-modal-footer {
          background: #1e293b;
          border-top-color: #334155;
        }

        /* Scrollbar Styling */
        .complaint-modal-body::-webkit-scrollbar,
        .complaint-content-section::-webkit-scrollbar,
        .content-body::-webkit-scrollbar {
          width: 6px;
        }

        .complaint-modal-body::-webkit-scrollbar-track,
        .complaint-content-section::-webkit-scrollbar-track,
        .content-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .complaint-modal-body::-webkit-scrollbar-thumb,
        .complaint-content-section::-webkit-scrollbar-thumb,
        .content-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .complaint-modal-body::-webkit-scrollbar-thumb:hover,
        .complaint-content-section::-webkit-scrollbar-thumb:hover,
        .content-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        [data-theme="dark"] .complaint-modal-body::-webkit-scrollbar-track,
        [data-theme="dark"] .complaint-content-section::-webkit-scrollbar-track,
        [data-theme="dark"] .content-body::-webkit-scrollbar-track {
          background: #0f172a;
        }

        [data-theme="dark"] .complaint-modal-body::-webkit-scrollbar-thumb,
        [data-theme="dark"] .complaint-content-section::-webkit-scrollbar-thumb,
        [data-theme="dark"] .content-body::-webkit-scrollbar-thumb {
          background: #334155;
        }

        [data-theme="dark"] .complaint-modal-body::-webkit-scrollbar-thumb:hover,
        [data-theme="dark"] .complaint-content-section::-webkit-scrollbar-thumb:hover,
        [data-theme="dark"] .content-body::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }

        /* Small screen adjustments */
        @media (max-width: 480px) {
          .complaint-modal-overlay {
            padding: 10px;
          }

          .complaint-modal-container {
            border-radius: 16px;
          }

          .complaint-modal-header {
            padding: 14px 16px;
          }

          .complaint-id {
            font-size: 18px;
          }

          .status-badge {
            font-size: 10px;
            padding: 5px 12px;
          }

          .complaint-modal-title {
            padding: 14px 16px;
            font-size: 15px;
          }

          .info-column {
            padding: 14px 16px;
          }

          .complaint-content-section {
            padding: 14px 16px;
          }

          .complaint-modal-info {
            padding: 12px 16px;
          }

          .complaint-modal-footer {
            padding: 12px 16px;
          }
        }
      `}</style>
    </>
  );
};

export default ComplaintDetailModal;
