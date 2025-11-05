export interface BookingPayload {
  homestayId: number;
  checkIn: string;
  checkOut: string;
  numGuests?: number;
}

export interface BookingStatusPayload {
  status: "pending" | "confirmed" | "paid" | "checked_in" | "checked_out" | "canceled" | "refunded";
}

export interface Booking {
  id: number;
  homestayId: number;
  checkIn: string;
  checkOut: string;
  status: BookingStatusPayload["status"];
  numGuests?: number;
  totalPrice?: number;
}
