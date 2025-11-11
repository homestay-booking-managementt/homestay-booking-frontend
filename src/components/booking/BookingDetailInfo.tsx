import React from "react";
import type { Booking, BookingDetail } from "@/types/booking";
import BookingTimeline from "./BookingTimeline";

interface Props {
  booking: BookingDetail;
}

const BookingDetailInfo: React.FC<Props> = ({ booking }) => (
  <section className="mb-5">
    <h5 className="fw-semibold text-primary mb-3">Chi tiết đặt phòng</h5>

    <div className="my-4">
      <BookingTimeline
        bookingId={booking.bookingId}
        status={booking.status}
        created_at={booking.createdAt}
        check_in={booking.checkIn}
        check_out={booking.checkOut}
      />
    </div>

    <div className="p-4 bg-white rounded-4 shadow-sm border">
      <div className="fw-bold mb-1 fs-2">{booking.homestay.name}</div>
      <div className="text-muted mb-3">{booking.homestay.address}</div>

      <ul className="list-unstyled lh-lg text-secondary">
        <li><strong>Ngày nhận phòng:</strong> {booking.checkIn}</li>
        <li><strong>Ngày trả phòng:</strong> {booking.checkOut}</li>
        <li><strong>Số đêm:</strong> {booking.nights}</li>
        <li><strong>Tổng tiền:</strong> {booking.totalPrice.toLocaleString()} VND</li>
        <li><strong>Ngày đặt:</strong> {new Date(booking.createdAt).toLocaleString()}</li>
      </ul>
    </div>
  </section>
);

export default BookingDetailInfo;
