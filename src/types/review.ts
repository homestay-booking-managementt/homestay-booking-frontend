export interface ReviewPayload {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface ReviewReplyPayload {
  message: string;
}
