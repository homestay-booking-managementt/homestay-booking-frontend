import React, { Component, ReactNode } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });

    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="error-boundary-fallback">
          <div className="error-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Đã xảy ra lỗi</h3>
          <p>Không thể hiển thị nội dung này. Vui lòng thử lại.</p>
          {this.state.error && (
            <details className="error-details">
              <summary>Chi tiết lỗi</summary>
              <pre>{this.state.error.message}</pre>
            </details>
          )}
          <button className="retry-btn" onClick={this.handleReset}>
            <FaRedo /> Thử lại
          </button>

          <style>{`
            .error-boundary-fallback {
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

            .error-icon {
              width: 64px;
              height: 64px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
              border-radius: 50%;
              color: #dc2626;
              font-size: 28px;
              margin-bottom: 16px;
            }

            .error-boundary-fallback h3 {
              margin: 0 0 8px 0;
              font-size: 20px;
              font-weight: 600;
              color: #991b1b;
            }

            .error-boundary-fallback p {
              margin: 0 0 20px 0;
              color: #6b7280;
              font-size: 14px;
            }

            .error-details {
              margin-bottom: 20px;
              padding: 12px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              text-align: left;
              max-width: 100%;
              overflow: auto;
            }

            .error-details summary {
              cursor: pointer;
              font-size: 13px;
              color: #6b7280;
              font-weight: 500;
              user-select: none;
            }

            .error-details summary:hover {
              color: #374151;
            }

            .error-details pre {
              margin: 12px 0 0 0;
              padding: 12px;
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 6px;
              font-size: 12px;
              color: #dc2626;
              overflow-x: auto;
              white-space: pre-wrap;
              word-wrap: break-word;
            }

            .retry-btn {
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

            .retry-btn:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
            }

            .retry-btn:active {
              transform: translateY(0);
            }

            .dark .error-boundary-fallback {
              background: #1e293b;
              border-color: #7f1d1d;
            }

            .dark .error-boundary-fallback h3 {
              color: #fca5a5;
            }

            .dark .error-boundary-fallback p {
              color: #94a3b8;
            }

            .dark .error-details {
              background: #0f172a;
              border-color: #334155;
            }

            .dark .error-details summary {
              color: #94a3b8;
            }

            .dark .error-details summary:hover {
              color: #cbd5e1;
            }

            .dark .error-details pre {
              background: #1e293b;
              border-color: #334155;
              color: #fca5a5;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
