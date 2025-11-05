import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface BookingRequest {
  id: number;
  guestName: string;
  guestEmail: string;
  homestayName: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
}

const HostBookingManagementPage = () => {
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<number | null>(null);

  const loadBookings = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with host bookings API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockData: BookingRequest[] = [
        {
          id: 1,
          guestName: "Nguyen Van A",
          guestEmail: "nguyenvana@example.com",
          homestayName: "Cozy Mountain Retreat",
          checkIn: "2025-11-20",
          checkOut: "2025-11-23",
          numGuests: 2,
          totalPrice: 2400000,
          status: "pending",
          createdAt: "2025-11-05T10:30:00Z",
        },
        {
          id: 2,
          guestName: "Tran Thi B",
          guestEmail: "tranthib@example.com",
          homestayName: "Beachfront Villa",
          checkIn: "2025-11-25",
          checkOut: "2025-11-28",
          numGuests: 4,
          totalPrice: 3600000,
          status: "pending",
          createdAt: "2025-11-04T14:20:00Z",
        },
      ];
      setBookings(mockData);
    } catch (error) {
      showAlert("Unable to load booking requests", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleConfirm = async (bookingId: number) => {
    if (typeof window !== "undefined" && !window.confirm("Confirm this booking?")) {
      return;
    }

    setProcessing(bookingId);
    try {
      // TODO: Integrate with booking confirmation API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Booking confirmed", "success");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "confirmed" as const } : b))
      );
    } catch (error) {
      showAlert("Failed to confirm booking", "danger");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (bookingId: number) => {
    if (typeof window !== "undefined" && !window.confirm("Reject this booking?")) {
      return;
    }

    setProcessing(bookingId);
    try {
      // TODO: Integrate with booking rejection API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showAlert("Booking rejected", "success");
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: "rejected" as const } : b))
      );
    } catch (error) {
      showAlert("Failed to reject booking", "danger");
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status: BookingRequest["status"]) => {
    const statusMap = {
      pending: { class: "bg-warning-subtle text-warning-emphasis", text: "Pending" },
      confirmed: { class: "bg-success-subtle text-success-emphasis", text: "Confirmed" },
      rejected: { class: "bg-danger-subtle text-danger-emphasis", text: "Rejected" },
    };
    return statusMap[status];
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="container">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Booking Requests</h1>
          <p className="text-muted mb-0">Review and manage incoming reservation requests from guests.</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Pending requests</div>
          <div className="h4 mb-0 text-warning">{pendingCount}</div>
        </div>
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
            <p className="text-muted mb-0">No booking requests yet.</p>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const statusInfo = getStatusBadge(booking.status);
            return (
              <div className="col-12" key={booking.id}>
                <div className="card shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-column flex-lg-row justify-content-between gap-3">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className="card-title mb-0">{booking.homestayName}</h5>
                          <span className={`badge ${statusInfo.class}`}>{statusInfo.text}</span>
                        </div>
                        <div className="row g-2 mb-3">
                          <div className="col-md-6">
                            <div className="text-muted small">Guest</div>
                            <div className="fw-semibold">{booking.guestName}</div>
                            <div className="text-muted small">{booking.guestEmail}</div>
                          </div>
                          <div className="col-md-6">
                            <div className="text-muted small">Check-in / Check-out</div>
                            <div className="fw-semibold">
                              {booking.checkIn} → {booking.checkOut}
                            </div>
                            <div className="text-muted small">{booking.numGuests} guests</div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center gap-3">
                          <div>
                            <div className="text-muted small">Total amount</div>
                            <div className="fw-bold text-primary">{booking.totalPrice.toLocaleString()}₫</div>
                          </div>
                          <div className="vr"></div>
                          <div>
                            <div className="text-muted small">Requested</div>
                            <div className="small">{new Date(booking.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      {booking.status === "pending" && (
                        <div className="d-flex flex-column gap-2">
                          <button
                            className="btn btn-success"
                            disabled={processing === booking.id}
                            onClick={() => handleConfirm(booking.id)}
                            type="button"
                          >
                            {processing === booking.id ? "Processing..." : "Confirm"}
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            disabled={processing === booking.id}
                            onClick={() => handleReject(booking.id)}
                            type="button"
                          >
                            Reject
                          </button>
                          <button className="btn btn-outline-secondary" type="button">
                            Message Guest
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HostBookingManagementPage;
