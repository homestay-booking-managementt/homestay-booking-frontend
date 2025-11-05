import type { Booking, BookingPayload, BookingStatusPayload } from "../types/booking";
import type { PaginatedResponse } from "../types/pagination";
import { sendRequest } from "../utils/sendRequest";

const BOOKINGS_ENDPOINT = "/bookings" as const;

export const fetchBookings = () =>
  sendRequest(BOOKINGS_ENDPOINT, { method: "GET" }) as Promise<PaginatedResponse<Booking>>;

export const createBooking = (payload: BookingPayload) =>
  sendRequest(BOOKINGS_ENDPOINT, {
    method: "POST",
    payload,
  });

export const cancelBooking = (bookingId: number) =>
  sendRequest(`${BOOKINGS_ENDPOINT}/${bookingId}/cancel`, {
    method: "POST",
  });

export const updateBookingStatus = (bookingId: number, payload: BookingStatusPayload) =>
  sendRequest(`${BOOKINGS_ENDPOINT}/${bookingId}/status`, {
    method: "PUT",
    payload,
  });
