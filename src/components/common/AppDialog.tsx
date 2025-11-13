import React from "react";
import "@/styles/AppDialog.css"

interface AppDialogProps {
  show: boolean;
  title?: string;
  message: React.ReactNode;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const AppDialog: React.FC<AppDialogProps> = ({
  show,
  title = "Thông báo",
  message,
  onClose,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText,
}) => {
  return (
    <div className={`app-modal-backdrop ${show ? "show" : ""}`}>
      <div className="app-modal-dialog">
        <div className="app-modal-content shadow">

          <div className="app-modal-header">
            <h5 className="app-modal-title">{title}</h5>
            <button className="app-modal-close" onClick={onClose}>×</button>
          </div>

          <div className="app-modal-body">
            {typeof message === "string"
              ? <p className="mb-0">{message}</p>
              : message}
          </div>

          <div className="app-modal-footer">
            {cancelText && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
      onCancel?.();
      onClose?.();
    }}
              >
                {cancelText}
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={() => {
                onConfirm?.();
                onClose?.();
              }}
            >
              {confirmText}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppDialog;
