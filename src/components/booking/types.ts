export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "checked_in"
  | "checked_out"
  | "canceled"
  | "refunded";

export interface BookingHistoryItem {
  id: number;
  homestayName: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalPrice: number;
  numGuests: number;
}

export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  canceled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export const STATUS_BADGE: Record<BookingStatus, string> = {
  pending: "bg-warning-subtle text-warning-emphasis",
  confirmed: "bg-info-subtle text-info-emphasis",
  paid: "bg-success-subtle text-success-emphasis",
  checked_in: "bg-primary-subtle text-primary-emphasis",
  checked_out: "bg-secondary-subtle text-secondary-emphasis",
  canceled: "bg-danger-subtle text-danger-emphasis",
  refunded: "bg-dark-subtle text-dark-emphasis",
};

export const formatCurrency = (vnd: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(vnd);
