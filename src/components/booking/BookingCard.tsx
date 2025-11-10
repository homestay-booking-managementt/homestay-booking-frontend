import { useNavigate } from "react-router-dom";
import { Booking, STATUS_BADGE, STATUS_LABEL, formatCurrency } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard = ({ booking }: BookingCardProps) => {
  const navigate = useNavigate();

  const handleReviewClick = () => {
    navigate(`/reviews?bookingId=${booking.bookingId}`);
  };

  return (
    <div className="col-12 fade-in">
      <div className="card shadow-sm">
        <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h5 className="card-title mb-0">{booking.homestay?.name}</h5>
              <span className={`badge text-uppercase ${STATUS_BADGE[booking.status]}`}>
                {STATUS_LABEL[booking.status]}
              </span>
            </div>

            <div className="text-muted mb-2">
              <div>
                <strong>Check-in:</strong> {booking.checkIn}
              </div>
              <div>
                <strong>Check-out:</strong> {booking.checkOut}
              </div>
              <div>
                <strong>Số đêm:</strong> {booking.nights}
              </div>
            </div>

            <div className="fw-semibold text-primary">
              Tổng: {formatCurrency(booking.totalPrice)}
            </div>
          </div>

          <div className="d-flex flex-column gap-2">
            {(booking.status === "confirmed" || booking.status === "paid") && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => showAlert("Yêu cầu hủy đã được gửi.", "info")}
              >
                Yêu cầu hủy
              </button>
            )}

            <a
              href={`/bookings/${booking.bookingId}`}
              className="btn btn-sm btn-outline-secondary"
            >
              Xem chi tiết
            </a>

            {booking.status === "checked_out" && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleReviewClick}
              >
                Đánh giá
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
