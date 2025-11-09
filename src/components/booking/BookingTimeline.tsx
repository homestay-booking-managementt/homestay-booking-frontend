import React from "react";
import "@/styles/BookingTimeline.css";


export interface BookingTimelineProps {
  status: string;        // Trạng thái hiện tại
  created_at: string;
  check_in: string;
  check_out: string;
}

interface Step {
  key: string;
  label: string;
  date?: string;
  isDone: boolean;
  isActive: boolean;
}

const BookingTimeline: React.FC<BookingTimelineProps> = ({
  status,
  created_at,
  check_in,
  check_out,
}) => {

  // 💡 Xác định các bước nào hoàn thành dựa theo trạng thái booking
  const getStepStatus = (key: string): { isDone: boolean; isActive: boolean } => {
    const order = ["pending", "confirmed", "paid", "checked_in", "checked_out", "review"];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(key);
    return {
      isDone: stepIndex <= currentIndex && currentIndex > 0,
      isActive: stepIndex === currentIndex,
    };
  };

  // 🧱 Danh sách bước
  const steps: Step[] = [
    { key: "pending", label: "Đã Đặt", date: created_at, ...getStepStatus("pending") },
    { key: "confirmed", label: "Đã Xác Nhận", ...getStepStatus("confirmed") },
    { key: "checked_in", label: "Đã Nhận Phòng", date: check_in, ...getStepStatus("checked_in") },
    { key: "checked_out", label: "Đã Trả Phòng", date: check_out, ...getStepStatus("checked_out") },
    { key: "review", label: "Đánh Giá", ...getStepStatus("review") },
  ];

  // Nếu booking bị hủy hoặc hoàn tiền
  const isCanceled = ["canceled", "refunded"].includes(status);

  return (
    <div className="booking-timeline d-flex justify-content-between align-items-start position-relative py-4">
      {steps.map((step, index) => (
        <div key={step.key} className="timeline-step text-center flex-fill">
          {/* --- Đường nối --- */}
          {index < steps.length - 1 && (
            <div
              className={`timeline-line ${
                step.isDone && !isCanceled ? "completed" : ""
              }`}
            ></div>
          )}

          {/* --- Vòng tròn --- */}
          <div
            className={`timeline-circle ${
              isCanceled
                ? "canceled"
                : step.isDone
                ? "completed"
                : step.isActive
                ? "active"
                : ""
            }`}
          >
            {index + 1}
          </div>

          {/* --- Nhãn + Ngày --- */}
          <div
            className={`timeline-label mt-2 fw-semibold ${
              isCanceled ? "text-danger" : ""
            }`}
          >
            {step.label}
          </div>
          {step.date && (
            <div className="timeline-date small text-muted mt-1">
              {new Date(step.date).toLocaleDateString("vi-VN")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BookingTimeline;
