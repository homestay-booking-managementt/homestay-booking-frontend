
import React from "react";
import { useNavigate } from "react-router-dom";
import "@/styles/BookingTimeline.css";
import { Link } from "react-router-dom"; // ✅ thêm dòng này


export interface BookingTimelineProps {
  bookingId?: number;     
  status: string;
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
  bookingId,
  status,
  created_at,
  check_in,
  check_out,
}) => {
  const navigate = useNavigate();

  const getStepStatus = (key: string): { isDone: boolean; isActive: boolean } => {
    const order = [
      "pending",
      "confirmed",
      "paid",
      "checked_in",
      "checked_out",
      "completed",
      "review",
    ];
    const currentIndex = order.indexOf(status);
    const stepIndex = order.indexOf(key);
    return {
      isDone: stepIndex <= currentIndex && currentIndex > 0,
      isActive: stepIndex === currentIndex,
    };
  };

  const steps: Step[] = [
    { key: "pending", label: "Đã Đặt", date: created_at, ...getStepStatus("pending") },
    { key: "confirmed", label: "Đã Xác Nhận", ...getStepStatus("confirmed") },
    { key: "checked_in", label: "Đã Nhận Phòng", date: check_in, ...getStepStatus("checked_in") },
    { key: "checked_out", label: "Đã Trả Phòng", date: check_out, ...getStepStatus("checked_out") },
    { key: "completed", label: "Hoàn tất", ...getStepStatus("completed") },
    { key: "review", label: "Đánh Giá", ...getStepStatus("review") },
  ];

  const isCanceled = ["canceled", "refunded"].includes(status);

  // 🧭 Khi click "Đánh Giá"
  const handleReviewClick = () => {
    if (bookingId) navigate(`/review/${bookingId}`);
  };

  return (
    <div className="booking-timeline d-flex justify-content-between align-items-start position-relative py-4">
      {steps.map((step, index) => {
        const isReviewStep = step.key === "review";

        return (
          <div key={step.key} className="timeline-step text-center flex-fill">
            {index < steps.length - 1 && (
              <div
                className={`timeline-line ${
                  step.isDone && !isCanceled ? "completed" : ""
                }`}
              ></div>
            )}
            {isReviewStep && status === "completed" ? (
              <Link
                to={`/reviews/${bookingId}`}
                className="timeline-circle clickable d-inline-flex align-items-center justify-content-center "
                title="Nhấn để đánh giá"
              >
                {index + 1}
              </Link>
            ) : (
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
            )}
            <div
              className={`timeline-label mt-2 fw-semibold ${
                isCanceled ? "text-danger" : ""
              }`}
            >
              {isReviewStep && status === "completed" ? (
                <span
                  className="text-success review-link"
                  onClick={handleReviewClick}
                  style={{ cursor: "pointer", textDecoration: "underline" }}
                >
                  {step.label}
                </span>
              ) : (
                step.label
              )}
            </div>

            {step.date && (
              <div className="timeline-date small text-muted mt-1">
                {new Date(step.date).toLocaleDateString("vi-VN")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BookingTimeline;
