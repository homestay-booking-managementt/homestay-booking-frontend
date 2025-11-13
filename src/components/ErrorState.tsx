import { FaExclamationCircle, FaRedo } from "react-icons/fa";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
}

const ErrorState = ({
  message = "Đã xảy ra lỗi khi tải dữ liệu",
  onRetry,
  retrying = false,
}: ErrorStateProps) => {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <FaExclamationCircle />
      </div>
      <p className="error-state-message">{message}</p>
      {onRetry && (
        <button
          className="error-state-retry-btn"
          onClick={onRetry}
          disabled={retrying}
        >
          {retrying ? (
            <>
              <div className="retry-spinner"></div>
              Đang thử lại...
            </>
          ) : (
            <>
              <FaRedo /> Thử lại
            </>
          )}
        </button>
      )}

      <style>{`
        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          background: white;
          border-radius: 12px;
          border: 2px solid #fee2e2;
          text-align: center;
        }

        .error-state-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-radius: 50%;
          color: #dc2626;
          font-size: 24px;
          margin-bottom: 16px;
        }

        .error-state-message {
          margin: 0 0 20px 0;
          color: #6b7280;
          font-size: 14px;
          max-width: 400px;
        }

        .error-state-retry-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .error-state-retry-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }

        .error-state-retry-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .error-state-retry-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .retry-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .dark .error-state {
          background: #1e293b;
          border-color: #7f1d1d;
        }

        .dark .error-state-message {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default ErrorState;
