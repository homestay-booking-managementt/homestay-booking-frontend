import type { Booking, BookingPayload, BookingStatusPayload } from "../types/booking";
import type { PaginatedResponse } from "../types/pagination";
import { sendRequest } from "../utils/sendRequest";

const BOOKINGS_ENDPOINT = "/bookings" as const;

export const fetchBookings = () =>
  sendRequest(BOOKINGS_ENDPOINT, { method: "GET" }) as Promise<PaginatedResponse<Booking>>;

export const createBooking = (payload: BookingPayload) =>
  sendRequest('http://localhost:8084/api/v1/bookings', {
    method: "POST",
    payload,
  });

export const fetchBookingsByUser = async (userId: number): Promise<Booking[]> => {
  const data = await sendRequest("/bookings", {
    method: "GET",
    payload: { userId },
  });

  return data as Booking[];
};
export const cancelBooking = (bookingId: number, userId: number, reason: string) =>
  sendRequest(`http://localhost:8084/api/v1/bookings/${bookingId}/cancel?userId=${userId}`, {
    method: "PATCH",
    payload: { cancellationReason: reason },
  });


export const updateBookingStatus = (bookingId: number, payload: BookingStatusPayload) =>
  sendRequest(`${BOOKINGS_ENDPOINT}/${bookingId}/status`, {
    method: "PUT",
    payload,
  });
