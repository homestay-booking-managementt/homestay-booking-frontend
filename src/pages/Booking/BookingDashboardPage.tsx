import { cancelBooking, createBooking, fetchBookings, updateBookingStatus } from "@/api/bookingApi";
import type { BookingPayload, BookingStatusPayload } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useMemo, useState } from "react";

interface BookingListItem {
  id: number;
  homestayId?: number;
  homestayName?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  status?: string;
  numGuests?: number;
  totalPrice?: number;
}

const statusOptions: BookingStatusPayload["status"][] = [
  "pending",
  "confirmed",
  "paid",
  "checked_in",
  "checked_out",
  "canceled",
  "refunded",
];

const BookingDashboardPage = () => {
  const [bookings, setBookings] = useState<BookingListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [createForm, setCreateForm] = useState({
    homestayId: "",
    checkIn: "",
    checkOut: "",
    numGuests: "",
  });

  const [statusForm, setStatusForm] = useState({
    bookingId: "",
    status: "confirmed" as BookingStatusPayload["status"],
  });

  const upcomingBookings = useMemo(
    () => bookings.filter((booking) => booking.status && ["pending", "confirmed", "paid"].includes(booking.status)),
    [bookings]
  );

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchBookings();
      const items = Array.isArray(response) ? response : Array.isArray(response?.items) ? response.items : [];
      setBookings(items);
    } catch (error) {
      showAlert("Unable to load bookings", "danger");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCreateBooking = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const homestayId = Number(createForm.homestayId);
    if (Number.isNaN(homestayId)) {
      showAlert("Homestay ID must be a number", "warning");
      return;
    }

    const payload: BookingPayload = {
      homestay_id: homestayId,
      check_in: createForm.checkIn,
      check_out: createForm.checkOut,
      num_guest: createForm.numGuests ? Number(createForm) : undefined,
    };

    setCreating(true);
    try {
      await createBooking(payload);
      showAlert("Booking request created", "success");
      setCreateForm({ homestayId: "", checkIn: "", checkOut: "", numGuests: "" });
      loadBookings();
    } catch (error) {
      showAlert("Failed to create booking", "danger");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingId = Number(statusForm.bookingId);
    if (Number.isNaN(bookingId)) {
      showAlert("Booking ID must be a number", "warning");
      return;
    }

    setUpdating(true);
    try {
      await updateBookingStatus(bookingId, { status: statusForm.status });
      showAlert("Booking status updated", "success");
      setStatusForm((prev) => ({ ...prev, bookingId: "" }));
      loadBookings();
    } catch (error) {
      showAlert("Failed to update booking status", "danger");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (typeof window !== "undefined" && !window.confirm("Cancel this booking?")) {
      return;
    }
    setCanceling(true);
    try {
      await cancelBooking(bookingId);
      showAlert("Booking cancelled", "success");
      loadBookings();
    } catch (error) {
      showAlert("Unable to cancel booking", "danger");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="container">
      <div className="d-flex flex-column flex-xl-row justify-content-between align-items-xl-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Bookings</h1>
          <p className="text-muted mb-0">
            View, create, and manage bookings for your homestays.
          </p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Upcoming bookings</div>
          <div>{upcomingBookings.length}</div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">New booking</h5>
              <form className="row g-3" onSubmit={handleCreateBooking}>
                <div className="col-12">
                  <label className="form-label" htmlFor="booking-homestayId">
                    Homestay ID
                  </label>
                  <input
                    className="form-control"
                    id="booking-homestayId"
                    name="homestayId"
                    type="number"
                    min={1}
                    value={createForm.homestayId}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, homestayId: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="booking-checkIn">
                    Check-in
                  </label>
                  <input
                    className="form-control"
                    id="booking-checkIn"
                    name="checkIn"
                    type="date"
                    value={createForm.checkIn}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, checkIn: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="booking-checkOut">
                    Check-out
                  </label>
                  <input
                    className="form-control"
                    id="booking-checkOut"
                    name="checkOut"
                    type="date"
                    value={createForm.checkOut}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, checkOut: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="booking-numGuests">
                    Guests (optional)
                  </label>
                  <input
                    className="form-control"
                    id="booking-numGuests"
                    name="numGuests"
                    type="number"
                    min={1}
                    value={createForm.numGuests}
                    onChange={(event) => setCreateForm((prev) => ({ ...prev, numGuests: event.target.value }))}
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary" disabled={creating} type="submit">
                    {creating ? "Creating..." : "Create booking"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title">Update status</h5>
              <form className="row g-3" onSubmit={handleUpdateStatus}>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="booking-id">
                    Booking ID
                  </label>
                  <input
                    className="form-control"
                    id="booking-id"
                    name="bookingId"
                    type="number"
                    min={1}
                    value={statusForm.bookingId}
                    onChange={(event) => setStatusForm((prev) => ({ ...prev, bookingId: event.target.value }))}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label" htmlFor="booking-status">
                    Status
                  </label>
                  <select
                    className="form-select"
                    id="booking-status"
                    name="status"
                    value={statusForm.status}
                    onChange={(event) =>
                      setStatusForm((prev) => ({ ...prev, status: event.target.value as BookingStatusPayload["status"] }))
                    }
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-outline-primary" disabled={updating} type="submit">
                    {updating ? "Updating..." : "Update status"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title mb-0">Booking log</h5>
            <button className="btn btn-sm btn-outline-secondary" disabled={loading} onClick={loadBookings} type="button">
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>
          {loading ? (
            <div className="text-center py-5">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="alert alert-info mb-0">No bookings yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Homestay</th>
                    <th>Guest</th>
                    <th>Dates</th>
                    <th>Status</th>
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.id}</td>
                      <td>
                        <div className="fw-semibold">
                          {booking.homestayName || `Homestay #${booking.homestayId ?? "?"}`}
                        </div>
                        <div className="text-muted small">Guests: {booking.numGuests ?? "--"}</div>
                      </td>
                      <td>{booking.guestName ?? "--"}</td>
                      <td>
                        <div>{booking.checkIn ?? "--"}</div>
                        <div className="text-muted small">{booking.checkOut ?? "--"}</div>
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-uppercase">{booking.status ?? "unknown"}</span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={canceling}
                          onClick={() => handleCancelBooking(booking.id)}
                          type="button"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingDashboardPage;
