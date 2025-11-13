import { memo } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState = ({ icon = "📊", title, message, action }: EmptyStateProps) => {
  return (
    <div className="empty-state">
      <div className="empty-state-content">
        <div className="empty-state-icon">{icon}</div>
        <h3 className="empty-state-title">{title}</h3>
        <p className="empty-state-message">{message}</p>
        {action && (
          <button onClick={action.onClick} className="empty-state-action">
            {action.label}
          </button>
        )}
      </div>

      <style>{`
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 350px;
          padding: 40px 20px;
          background: white;
          border-radius: 12px;
        }

        .empty-state-content {
          text-align: center;
          max-width: 400px;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.8;
        }

        .empty-state-title {
          margin: 0 0 12px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .empty-state-message {
          margin: 0 0 24px 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        .empty-state-action {
          padding: 10px 24px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .empty-state-action:hover {
          background: #7c3aed;
          transform: translateY(-1px);
        }

        .empty-state-action:active {
          transform: translateY(0);
        }

        /* Dark Mode */
        .dark .empty-state {
          background: #1e293b;
        }

        .dark .empty-state-title {
          color: #f1f5f9;
        }

        .dark .empty-state-message {
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .empty-state {
            min-height: 300px;
            padding: 30px 20px;
          }

          .empty-state-icon {
            font-size: 48px;
          }

          .empty-state-title {
            font-size: 18px;
          }

          .empty-state-message {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default memo(EmptyState);
