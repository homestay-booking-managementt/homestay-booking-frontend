// export interface BookingPayload {
//   homestayId: number;
//   checkIn: string;
//   checkOut: string;
//   numGuests?: number;
// }

// export interface BookingStatusPayload {
//   status: "pending" | "confirmed" | "paid" | "checked_in" | "checked_out" | "canceled" | "refunded";
// }

// export interface Booking {
//   id: number;
//   homestayId: number;
//   checkIn: string;
//   checkOut: string;
//   status: BookingStatusPayload["status"];
//   numGuests?: number;
//   totalPrice?: number;
// }
// Dữ liệu gửi lên khi tạo mới booking
export interface BookingPayload {
  homestay_id: number;
  check_in: string;
  check_out: string;
  nights?: number;
}

// Dữ liệu cập nhật trạng thái
export interface BookingStatusPayload {
  status:
  | "pending"
  | "confirmed"
  | "paid"
  | "checked_in"
  | "checked_out"
  | "canceled"
  | "refunded";
}

// Dữ liệu nhận từ API (JSON Server / DB)
export interface Booking {
  id: number;
  user_id: number;
  homestay_id: number;
  check_in: string;
  check_out: string;
  status: BookingStatusPayload["status"];
  nights: number;
  total_price: number;
  // Nếu anh dùng _expand trên json-server:
  homestay?: {
    id: number;
    name: string;
    address?: string;
  };
  user?: {
    id: number;
    name: string;
    email?: string;
  };
}
export interface BookingHistoryItem {
  id: number;
  user_id: number;
  homestay_id: number;
  check_in: string;
  check_out: string;
  status: BookingStatusPayload["status"];
  nights: number;
  total_price: number;
}
export const STATUS_LABEL: Record<BookingStatusPayload["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  canceled: "Đã hủy",
  refunded: "Đã hoàn tiền",
};

export const STATUS_BADGE: Record<BookingStatusPayload["status"], string> = {
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
