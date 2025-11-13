import React from "react";

interface Props {
  status: string;
}

// Map trạng thái sang tiếng Việt
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  CANCELED: "Đã hủy",
  PAID: "Đã thanh toán",
  CHECKED_IN: "Đã nhận phòng",
  CHECKED_OUT: "Đã trả phòng",
  REFUNDED: "Đã hoàn tiền",
  // Lowercase versions
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  canceled: "Đã hủy",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  refunded: "Đã hoàn tiền",
};

const BookingStatusBadge: React.FC<Props> = ({ status }) => {
  const map: Record<string, string> = {
    pending: "bg-warning text-dark",
    confirmed: "bg-info text-white",
    paid: "bg-primary text-white",
    checked_in: "bg-success text-white",
    checked_out: "bg-secondary text-white",
    completed: "bg-gradient bg-success text-light fw-semibold",
    canceled: "bg-danger text-white",
    refunded: "bg-dark text-white",
  };

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status] || status;
  };

  return (
    <span className={`badge ${map[status.toLowerCase()] || "bg-light text-dark"} px-3 py-2`}>
      {getStatusLabel(status)}
    </span>
  );
};

export default BookingStatusBadge;
