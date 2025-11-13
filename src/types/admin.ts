export interface AdminUser {
  id: number;
  name: string;
  email: string;
  username?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  role?: "CUSTOMER" | "HOST" | "ADMIN"; // Single role for backward compatibility
  roles?: string[]; // Array of roles from Backend
  status: number; // Backend có thể trả về 1, 2, 3 không chỉ 0 | 1
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export interface UpdateUserStatusPayload {
  status: 0 | 1 | 2 | 3; // 0:chờ duyệt, 1:hoạt động, 2:tạm khóa, 3:bị chặn
  reason?: string; // Lý do thay đổi trạng thái
}

export interface UserStatusHistory {
  id: number;
  userId: number;
  oldStatus: number | null;
  newStatus: number | null;
  reason: string | null;
  changedBy: number | null;
  changedByName: string | null;
  changedByEmail: string | null;
  changedAt: string;
}

export interface HomestayRequestReviewPayload {
  status: "approved" | "rejected";
  adminComment?: string;
}

export interface RevenueReportItem {
  homestayId: number;
  homestayName: string;
  totalRevenue: number;
  month?: string;
}

export interface AdminFaqPayload {
  question: string;
  answer: string;
  category?: string;
}

export interface AdminFaqItem extends AdminFaqPayload {
  id: number;
  updatedAt?: string;
}

export interface AdminBookingSummary {
  id: number;
  userId?: number;
  homestayId?: number;
  homestayName?: string;
  guestName?: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  phone?: string;
  status: string;
  totalPrice?: number;
  checkIn?: string;
  checkOut?: string;
  nights?: number;
  createdAt?: string;
}

export interface BookingStatusHistory {
  id: number;
  bookingId: number;
  oldStatus: string | null;
  newStatus: string | null;
  reason: string | null;
  changedBy: number | null;
  changedByName: string | null;
  changedByEmail: string | null;
  changedAt: string;
}

export interface BookingDetail extends AdminBookingSummary {
  // Guest info (có thể có trong tương lai)
  guestEmail?: string;
  guestPhone?: string;
  guestAddress?: string;
  numberOfGuests?: number;
  numberOfAdults?: number;
  numberOfChildren?: number;
  
  // Homestay info (từ backend)
  homestayAddress?: string;        // Có từ backend
  homestayCity?: string;           // Có từ backend
  homestayCapacity?: number;       // Có từ backend
  homestayNumRooms?: number;       // Có từ backend (số phòng ngủ)
  homestayBathroomCount?: number;  // Có từ backend (số phòng tắm)
  homestayBasePrice?: number;      // Có từ backend (giá/đêm)
  
  // Homestay info (chưa có từ backend)
  homestayDistrict?: string;
  homestayWard?: string;
  homestayType?: string;
  
  // Owner info (chưa có từ backend)
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  
  // Booking details (chưa có từ backend)
  checkInTime?: string;
  checkOutTime?: string;
  specialRequests?: string;
  paymentMethod?: string;
  paymentStatus?: string;
  statusHistory?: BookingStatusHistory[];
}

export interface AdminComplaintSummary {
  id: number;
  subject: string;
  status: string;
  assignedTo?: string;
}

export interface AdminHomestayRequest {
  id: number;
  homestayName: string;
  ownerName: string;
  type: "CREATE" | "UPDATE";
  submittedAt?: string;
}

export interface AdminRevenueReport {
  // Tổng quan
  totalRevenue?: number;
  totalBookings?: number;
  completedBookings?: number;
  cancelledBookings?: number;
  pendingBookings?: number;

  // Doanh thu theo trạng thái
  completedRevenue?: number;
  pendingRevenue?: number;
  confirmedRevenue?: number;

  // Thống kê
  averageBookingValue?: number;
  totalHomestays?: number;
  totalCustomers?: number;

  // Thời gian báo cáo
  reportGeneratedAt?: string;
  period?: string;

  // Để tương thích với code cũ
  items?: RevenueReportItem[];
  generatedAt?: string;
}

export interface CustomerInfo {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface CustomerBookingsResponse {
  bookings: AdminBookingSummary[];
  customerInfo: CustomerInfo | null;
}
