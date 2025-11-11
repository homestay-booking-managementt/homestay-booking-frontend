import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface BookingHistoryItem {
  id: number;
  homestayName: string;
  checkIn: string;
  checkOut: string;
  status: "pending" | "confirmed" | "paid" | "checked_in" | "checked_out" | "canceled" | "refunded";
  totalPrice: number;
  numGuests: number;
}

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState<BookingHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with booking history API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData: BookingHistoryItem[] = [
        {
          id: 1,
          homestayName: "Cozy Mountain Retreat",
          checkIn: "2025-01-15",
          checkOut: "2025-01-18",
          status: "checked_out",
          totalPrice: 2400000,
          numGuests: 2,
        },
        {
          id: 2,
          homestayName: "Beachfront Villa",
          checkIn: "2025-02-10",
          checkOut: "2025-02-15",
          status: "paid",
          totalPrice: 5000000,
          numGuests: 4,
        },
      ];
      setBookings(mockData);
    } catch (error) {
      showAlert("Unable to load booking history", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const getStatusBadgeClass = (status: BookingHistoryItem["status"]) => {
    const statusMap: Record<BookingHistoryItem["status"], string> = {
      pending: "bg-warning-subtle text-warning-emphasis",
      confirmed: "bg-info-subtle text-info-emphasis",
      paid: "bg-success-subtle text-success-emphasis",
      checked_in: "bg-primary-subtle text-primary-emphasis",
      checked_out: "bg-secondary-subtle text-secondary-emphasis",
      canceled: "bg-danger-subtle text-danger-emphasis",
      refunded: "bg-dark-subtle text-dark-emphasis",
    };
    return statusMap[status] || "bg-secondary-subtle";
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Booking History</h1>
          <p className="text-muted mb-0">Review your past and upcoming homestay reservations.</p>
        </div>
        <button
          className="btn btn-outline-primary"
          disabled={loading}
          onClick={loadBookings}
          type="button"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-3">You haven't made any bookings yet.</p>
            <a className="btn btn-primary" href="/homestays">
              Browse Homestays
            </a>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => (
            <div className="col-12" key={booking.id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3">
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <h5 className="card-title mb-0">{booking.homestayName}</h5>
                        <span
                          className={`badge ${getStatusBadgeClass(booking.status)} text-uppercase`}
                        >
                          {booking.status.replace("_", " ")}
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
                          <strong>Guests:</strong> {booking.numGuests}
                        </div>
                      </div>
                      <div className="fw-semibold text-primary">
                        Total: {booking.totalPrice.toLocaleString()}₫
                      </div>
                    </div>
                    <div className="d-flex flex-column gap-2">
                      {booking.status === "checked_out" && (
                        <a
                          className="btn btn-sm btn-outline-primary"
                          href={`/reviews?bookingId=${booking.id}`}
                        >
                          Write Review
                        </a>
                      )}
                      {(booking.status === "paid" || booking.status === "confirmed") && (
                        <button className="btn btn-sm btn-outline-danger" type="button">
                          Request Cancellation
                        </button>
                      )}
                      <a
                        className="btn btn-sm btn-outline-secondary"
                        href={`/bookings/${booking.id}`}
                      >
                        View Details
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistoryPage;
