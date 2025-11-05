export interface ComplaintPayload {
  subject: string;
  content: string;
  bookingId?: number;
  homestayId?: number;
}

export interface Complaint {
  id: number;
  subject: string;
  content: string;
  status?: string;
  createdAt?: string;
}
