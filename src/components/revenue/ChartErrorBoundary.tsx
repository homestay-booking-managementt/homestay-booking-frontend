import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Chart Error Boundary caught an error:", error, errorInfo);
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
        <div className="chart-error-boundary">
          <div className="error-content">
            <div className="error-icon">⚠️</div>
            <h3>Có lỗi xảy ra khi hiển thị biểu đồ</h3>
            <p className="error-message">
              {this.state.error?.message || "Đã xảy ra lỗi không xác định"}
            </p>
            <button onClick={this.handleReset} className="retry-button">
              Thử lại
            </button>
          </div>

          <style>{`
            .chart-error-boundary {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 350px;
              background: white;
              border-radius: 12px;
              padding: 40px 20px;
            }

            .error-content {
              text-align: center;
              max-width: 400px;
            }

            .error-icon {
              font-size: 64px;
              margin-bottom: 16px;
            }

            .error-content h3 {
              margin: 0 0 12px 0;
              font-size: 20px;
              font-weight: 600;
              color: #dc2626;
            }

            .error-message {
              margin: 0 0 24px 0;
              font-size: 14px;
              color: #6b7280;
              line-height: 1.5;
            }

            .retry-button {
              padding: 10px 24px;
              background: #8b5cf6;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s ease;
            }

            .retry-button:hover {
              background: #7c3aed;
            }

            .retry-button:active {
              transform: scale(0.98);
            }

            /* Dark Mode */
            .dark .chart-error-boundary {
              background: #1e293b;
            }

            .dark .error-content h3 {
              color: #f87171;
            }

            .dark .error-message {
              color: #94a3b8;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChartErrorBoundary;
