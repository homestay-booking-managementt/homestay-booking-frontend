import React from "react";
import type { Booking } from "@/types/booking";
import BookingTimeline from "./BookingTimeLine";

interface Props {
  booking: Booking;
}

const BookingDetailInfo: React.FC<Props> = ({ booking }) => (
  <section className="mb-5">
    <h5 className="fw-semibold text-primary mb-3">Chi tiết đặt phòng</h5>

    <div className="my-4">
      <BookingTimeline
        status={booking.status}
        created_at={booking.created_at}
        check_in={booking.check_in}
        check_out={booking.check_out}
      />
    </div>

    <div className="p-4 bg-white rounded-4 shadow-sm border">
      <h4 className="fw-bold mb-1 text-dark">{booking.homestay.name}</h4>
      <p className="text-muted mb-3">{booking.homestay.address}</p>

      <ul className="list-unstyled small lh-lg text-secondary">
        <li><strong>Ngày nhận phòng:</strong> {booking.check_in}</li>
        <li><strong>Ngày trả phòng:</strong> {booking.check_out}</li>
        <li><strong>Số đêm:</strong> {booking.nights}</li>
        <li><strong>Tổng tiền:</strong> {booking.total_price.toLocaleString()} VND</li>
        <li><strong>Ngày đặt:</strong> {new Date(booking.created_at).toLocaleString()}</li>
      </ul>
    </div>
  </section>
);

export default BookingDetailInfo;
