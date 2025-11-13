import { useState } from "react";
import type { TimeRange } from "@/types/admin";

interface TimeFilterBarProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const TimeFilterBar = ({ value, onChange }: TimeFilterBarProps) => {
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const handleQuickFilter = (type: '7d' | '30d' | '90d') => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (type) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(endDate.getDate() - 90);
        break;
    }
    
    onChange({ type, startDate, endDate });
    setShowCustomPicker(false);
  };

  const handleCustomFilter = () => {
    if (customStart && customEnd) {
      const startDate = new Date(customStart);
      const endDate = new Date(customEnd);
      
      if (startDate <= endDate) {
        onChange({ type: 'custom', startDate, endDate });
        setShowCustomPicker(false);
      }
    }
  };

  const formatDateRange = () => {
    const start = value.startDate.toLocaleDateString("vi-VN");
    const end = value.endDate.toLocaleDateString("vi-VN");
    return `${start} - ${end}`;
  };

  return (
    <div className="time-filter-bar">
      <div className="filter-buttons">
        <button
          className={`filter-btn ${value.type === '7d' ? 'active' : ''}`}
          onClick={() => handleQuickFilter('7d')}
        >
          7 ngày qua
        </button>
        <button
          className={`filter-btn ${value.type === '30d' ? 'active' : ''}`}
          onClick={() => handleQuickFilter('30d')}
        >
          30 ngày qua
        </button>
        <button
          className={`filter-btn ${value.type === '90d' ? 'active' : ''}`}
          onClick={() => handleQuickFilter('90d')}
        >
          90 ngày qua
        </button>
        <button
          className={`filter-btn ${value.type === 'custom' ? 'active' : ''}`}
          onClick={() => setShowCustomPicker(!showCustomPicker)}
        >
          Tùy chỉnh
        </button>
      </div>

      {showCustomPicker && (
        <div className="custom-picker">
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            placeholder="Từ ngày"
          />
          <span>đến</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            placeholder="Đến ngày"
          />
          <button onClick={handleCustomFilter} className="apply-btn">
            Áp dụng
          </button>
        </div>
      )}

      <div className="current-range">
        <span className="range-label">Khoảng thời gian:</span>
        <span className="range-value">{formatDateRange()}</span>
      </div>

      <style>{`
        .time-filter-bar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          margin-bottom: 24px;
        }

        .filter-buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .filter-btn.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }

        .custom-picker {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          margin-bottom: 16px;
        }

        .custom-picker input[type="date"] {
          padding: 8px 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
        }

        .custom-picker span {
          color: #6b7280;
          font-size: 14px;
        }

        .apply-btn {
          padding: 8px 16px;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .apply-btn:hover {
          background: #7c3aed;
        }

        .current-range {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #f3f4f6;
        }

        .range-label {
          font-size: 14px;
          color: #6b7280;
        }

        .range-value {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        /* Dark Mode */
        .dark .time-filter-bar {
          background: #1e293b;
        }

        .dark .filter-btn {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }

        .dark .filter-btn:hover {
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .dark .filter-btn.active {
          background: #8b5cf6;
          border-color: #8b5cf6;
          color: white;
        }

        .dark .custom-picker {
          background: #0f172a;
        }

        .dark .custom-picker input[type="date"] {
          background: #1e293b;
          border-color: #334155;
          color: #e2e8f0;
        }

        .dark .current-range {
          border-top-color: #334155;
        }

        .dark .range-value {
          color: #f1f5f9;
        }

        @media (max-width: 768px) {
          .filter-buttons {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
          }

          .custom-picker {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>
    </div>
  );
};

export default TimeFilterBar;
