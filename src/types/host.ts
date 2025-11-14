export interface HostBookingRequest {
  id: number;
  guestId: number;
  guestName: string;
  guestEmail: string;
  homestayId: number;
  homestayName: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected" | "completed" | "cancelled";
  createdAt: string;
}

export interface HostBookingConfirmPayload {
  status: "confirmed" | "rejected";
  message?: string;
}

export interface RevenueStatistics {
  totalRevenue: number;
  totalBookings: number;
  averageBookingValue: number;
  period: "week" | "month" | "year";
  periodData: {
    period: string;
    revenue: number;
    bookings: number;
  }[];
}

export interface PaymentTransfer {
  id: number;
  bookingId: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  transferredAt?: string;
  errorMessage?: string;
}

export interface HostStatistics {
  totalHomestays: number;
  approvedHomestays: number;
  pendingHomestays: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  failedPayments: number;
}

export interface TopHomestay {
  homestayId: number;
  homestayName: string;
  totalRevenue: number;
  totalBookings: number;
}
