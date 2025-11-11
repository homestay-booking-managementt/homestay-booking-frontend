// Dữ liệu gửi khi tạo booking
export interface BookingPayload {
  homestayId: number;
  checkIn: string;
  checkOut: string;
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
    | "refunded"
    | "completed";
}
// Dữ liệu nhận từ API (danh sách booking)
export interface Booking {
  bookingId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: BookingStatusPayload["status"];
  createdAt: string ;
  homestay: {
    id: number;
    name: string;
    city?: string;
    address?: string | null;
    primaryImageUrl?: string;
  };
}
export type BookingHistoryItem = Booking;
// Thông tin hình ảnh homestay
export interface HomestayImage {
  url: string;
  alt?: string | null;
  isPrimary: boolean;
}
// Thông tin chi tiết homestay trong booking
export interface BookingHomestay {
  id: number;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  lat?: number;
  longVal?: number; // ✅ chú ý key longVal theo API
  capacity?: number;
  numRooms?: number;
  bathroomCount?: number;
  basePrice?: number;
  amenities?: string; // API trả JSON string → FE parse lại nếu cần
  images?: HomestayImage[];
}
// Thông tin user đặt phòng
export interface BookingUser {
  userId: number;
  name: string;
  email?: string;
  phone?: string;
}
// Booking chi tiết
export interface BookingDetail {
  bookingId: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  status: BookingStatusPayload["status"];
  createdAt: string ;
  homestay: BookingHomestay;
  user: BookingUser;
}
export const STATUS_LABEL: Record<BookingStatusPayload["status"], string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  canceled: "Đã hủy",
  refunded: "Đã hoàn tiền",
  completed: "Hoàn tất",
};
export const STATUS_BADGE: Record<BookingStatusPayload["status"], string> = {
  pending: "bg-warning-subtle text-warning-emphasis",
  confirmed: "bg-info-subtle text-info-emphasis",
  paid: "bg-success-subtle text-success-emphasis",
  checked_in: "bg-primary-subtle text-primary-emphasis",
  checked_out: "bg-secondary-subtle text-secondary-emphasis",
  canceled: "bg-danger-subtle text-danger-emphasis",
  refunded: "bg-dark-subtle text-dark-emphasis",
  completed: "bg-success-subtle text-success-emphasis",
};
export const formatCurrency = (vnd: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(vnd);
