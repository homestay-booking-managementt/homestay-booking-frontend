import type { AdminComplaintSummary, ComplaintStatus } from "@/types/admin";
import { useEffect, useState } from "react";

interface ResolveComplaintModalProps {
  complaint: AdminComplaintSummary | null;
  show: boolean;
  onClose: () => void;
  onConfirm: (complaintId: number, newStatus: ComplaintStatus, note?: string) => Promise<void>;
}

const STATUS_OPTIONS: { value: ComplaintStatus; label: string }[] = [
  { value: "OPEN", label: "Đang xử lý" },
  { value: "IN_PROGRESS", label: "Đang tiến hành" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "CLOSED", label: "Đã đóng" },
];

const ResolveComplaintModal = ({ complaint, show, onClose, onConfirm }: ResolveComplaintModalProps) => {
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("RESOLVED");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleClose = () => {
    if (!loading) {
      setNewStatus("RESOLVED");
      setNote("");
      setError("");
      onClose();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!complaint) return;

    // Validation: new status must be different from current status
    if (newStatus === complaint.status) {
      setError("Trạng thái mới phải khác trạng thái hiện tại");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await onConfirm(complaint.id, newStatus, note || undefined);
      handleClose();
    } catch (err) {
      setError("Có lỗi xảy ra khi cập nhật trạng thái");
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!show || !complaint) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={handleBackdropClick}>
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header-custom">
                <h3 className="modal-title">Cập nhật trạng thái khiếu nại</h3>
                <button
                  className="modal-close-btn"
                  disabled={loading}
                  onClick={handleClose}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body-custom">
            <div className="complaint-info">
              <div className="info-row">
                <span className="info-label">ID:</span>
                <span className="info-value">#{complaint.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Tiêu đề:</span>
                <span className="info-value">{complaint.subject}</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="current-status">
                Trạng thái hiện tại
              </label>
              <input
                className="form-control-readonly"
                id="current-status"
                readOnly
                type="text"
                value={complaint.status}
              />
            </div>

            <div className="form-group">
              <label className="form-label required" htmlFor="new-status">
                Trạng thái mới
              </label>
              <select
                className="form-control-select"
                disabled={loading}
                id="new-status"
                onChange={(e) => {
                  setNewStatus(e.target.value as ComplaintStatus);
                  setError("");
                }}
                required
                value={newStatus}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="note">
                Ghi chú (tùy chọn)
              </label>
              <textarea
                className="form-control-textarea"
                disabled={loading}
                id="note"
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nhập ghi chú về việc thay đổi trạng thái..."
                rows={3}
                value={note}
              />
            </div>

                {error && (
                  <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    {error}
                  </div>
                )}
              </div>
              <div className="modal-footer-custom">
                <button
                  className="btn-cancel"
                  disabled={loading}
                  onClick={handleClose}
                  type="button"
                >
                  Hủy
                </button>
                <button
                  className="btn-confirm"
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <>
                      <span className="spinner" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 20px;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-dialog {
          width: 100%;
          max-width: 600px;
          animation: slideUp 0.3s ease-out;
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
        }

        .modal-title {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
        }

        .modal-close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 32px;
          line-height: 1;
          cursor: pointer;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .modal-close-btn:hover:not(:disabled) {
          opacity: 1;
        }

        .modal-close-btn:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .modal-header-custom {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-bottom: none;
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header-custom .btn-close {
          filter: brightness(0) invert(1);
          opacity: 0.8;
        }

        .modal-header-custom .btn-close:hover {
          opacity: 1;
        }

        .modal-body-custom {
          padding: 24px;
        }

        .complaint-info {
          background: #f9fafb;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
        }

        .info-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .info-row:last-child {
          margin-bottom: 0;
        }

        .info-label {
          font-weight: 600;
          color: #6b7280;
          min-width: 80px;
        }

        .info-value {
          color: #1f2937;
          flex: 1;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-label.required::after {
          content: " *";
          color: #ef4444;
        }

        .form-control-readonly {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          background: #f9fafb;
          color: #6b7280;
          cursor: not-allowed;
        }

        .form-control-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          background: white;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .form-control-select:hover:not(:disabled) {
          border-color: #9ca3af;
        }

        .form-control-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control-select:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .form-control-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          color: #1f2937;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-control-textarea:hover:not(:disabled) {
          border-color: #9ca3af;
        }

        .form-control-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .form-control-textarea:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 8px;
          padding: 12px;
          color: #dc2626;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .error-icon {
          font-size: 16px;
        }

        .modal-footer-custom {
          border-top: 1px solid #e5e7eb;
          padding: 16px 24px;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-cancel {
          padding: 10px 20px;
          background: #e5e7eb;
          color: #1f2937;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-cancel:hover:not(:disabled) {
          background: #d1d5db;
        }

        .btn-cancel:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-confirm {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-confirm:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .btn-confirm:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Dark Mode */
        .dark .modal-backdrop {
          background: rgba(0, 0, 0, 0.7);
        }

        .dark .modal-content {
          background: #1e293b;
          color: #f1f5f9;
        }

        .dark .complaint-info {
          background: #0f172a;
        }

        .dark .info-label {
          color: #94a3b8;
        }

        .dark .info-value {
          color: #e2e8f0;
        }

        .dark .form-label {
          color: #cbd5e1;
        }

        .dark .form-control-readonly {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }

        .dark .form-control-select,
        .dark .form-control-textarea {
          background: #0f172a;
          border-color: #334155;
          color: #e2e8f0;
        }

        .dark .form-control-select:hover:not(:disabled),
        .dark .form-control-textarea:hover:not(:disabled) {
          border-color: #475569;
        }

        .dark .form-control-select:disabled,
        .dark .form-control-textarea:disabled {
          background: #0f172a;
        }

        .dark .error-message {
          background: #450a0a;
          border-color: #7f1d1d;
          color: #fca5a5;
        }

        .dark .modal-footer-custom {
          border-top-color: #334155;
        }

        .dark .btn-cancel {
          background: #0f172a;
          color: #cbd5e0;
        }

        .dark .btn-cancel:hover:not(:disabled) {
          background: #334155;
        }

        @media (max-width: 768px) {
          .modal-backdrop {
            padding: 10px;
          }

          .modal-dialog {
            max-width: 100%;
          }

          .modal-header-custom {
            padding: 16px 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-body-custom {
            padding: 20px;
          }

          .complaint-info {
            padding: 14px;
          }

          .info-row {
            flex-direction: column;
            gap: 4px;
          }

          .info-label {
            min-width: auto;
            font-size: 12px;
          }

          .info-value {
            font-size: 14px;
          }

          .form-label {
            font-size: 13px;
          }

          .form-control-readonly,
          .form-control-select,
          .form-control-textarea {
            font-size: 14px;
          }

          .modal-footer-custom {
            flex-direction: column-reverse;
            padding: 16px 20px;
          }

          .btn-cancel,
          .btn-confirm {
            width: 100%;
            justify-content: center;
            padding: 12px 20px;
          }
        }

        @media (max-width: 480px) {
          .modal-backdrop {
            padding: 5px;
          }

          .modal-content {
            border-radius: 10px;
          }

          .modal-header-custom {
            padding: 14px 16px;
          }

          .modal-title {
            font-size: 16px;
          }

          .modal-body-custom {
            padding: 16px;
          }

          .complaint-info {
            padding: 12px;
            margin-bottom: 20px;
          }

          .form-group {
            margin-bottom: 16px;
          }
        }
      `}</style>
    </>
  );
};

export default ResolveComplaintModal;
