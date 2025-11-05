export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "HOST" | "ADMIN";
  status: 0 | 1;
}

export interface UpdateUserStatusPayload {
  status: 0 | 1;
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
  homestayName: string;
  guestName: string;
  status: string;
  totalPrice?: number;
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
  items: RevenueReportItem[];
  generatedAt?: string;
}
