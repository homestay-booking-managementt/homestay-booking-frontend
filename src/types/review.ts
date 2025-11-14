export interface ReviewPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface ReviewReplyPayload {
  message: string;
}
export interface ReviewCustomer {
  userId: number;
  name: string;
  email: string;
  phone: string;
}

export interface Review {
  id: number;
  bookingId: number;
  rating: number;
  comment: string;
  createdAt: string;
  customer: ReviewCustomer;
}
