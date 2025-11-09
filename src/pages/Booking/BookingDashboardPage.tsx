// export default BookingDashboardPage;

import {
  cancelBooking,
  createBooking,
  fetchBookings,
  updateBookingStatus,
} from "@/api/bookingApi";
import type { BookingPayload, BookingStatusPayload } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaUserFriends, FaPlusCircle, FaSyncAlt, FaTimes } from "react-icons/fa";

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

const statusColors: Record<string, string> = {
  pending: "warning",
  confirmed: "primary",
  paid: "info",
  checked_in: "success",
  checked_out: "secondary",
  canceled: "danger",
  refunded: "dark",
};

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
    () =>
      bookings.filter(
        (booking) => booking.status && ["pending", "confirmed", "paid"].includes(booking.status)
      ),
    [bookings]
  );

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await fetchBookings();
      const items = Array.isArray(response)
        ? response
        : Array.isArray(response?.items)
        ? response.items
        : [];
      setBookings(items);
    } catch (error) {
      showAlert("❌ Không thể tải danh sách booking", "danger");
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
      showAlert("🏠 Homestay ID phải là số", "warning");
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
      showAlert("✅ Tạo booking thành công", "success");
      setCreateForm({ homestayId: "", checkIn: "", checkOut: "", numGuests: "" });
      loadBookings();
    } catch (error) {
      showAlert("⚠️ Tạo booking thất bại", "danger");
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateStatus = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const bookingId = Number(statusForm.bookingId);
    if (Number.isNaN(bookingId)) {
      showAlert("📄 Booking ID phải là số", "warning");
      return;
    }

    setUpdating(true);
    try {
      await updateBookingStatus(bookingId, { status: statusForm.status });
      showAlert("✅ Cập nhật trạng thái thành công", "success");
      setStatusForm((prev) => ({ ...prev, bookingId: "" }));
      loadBookings();
    } catch (error) {
      showAlert("⚠️ Cập nhật thất bại", "danger");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!window.confirm("Bạn có chắc muốn hủy booking này không?")) return;
    setCanceling(true);
    try {
      await cancelBooking(bookingId);
      showAlert("🛑 Đã hủy booking", "success");
      loadBookings();
    } catch (error) {
      showAlert("⚠️ Không thể hủy booking", "danger");
    } finally {
      setCanceling(false);
    }
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-end mb-4">
        <div>
          <h1 className="fw-bold mb-1 text-primary">
            <FaCalendarAlt className="me-2" />
            Quản lý Booking
          </h1>
          <p className="text-muted mb-0">Tạo, cập nhật và quản lý các đặt phòng của bạn.</p>
        </div>
        <div className="text-end mt-3 mt-lg-0">
          <div className="fw-semibold text-secondary">📅 Booking sắp tới</div>
          <div className="display-6 fw-bold text-primary">{upcomingBookings.length}</div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="row g-4">
        {/* Form Tạo mới */}
        <div className="col-lg-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-primary">
                <FaPlusCircle className="me-2" /> Tạo Booking mới
              </h5>
              <form className="row g-3" onSubmit={handleCreateBooking}>
                <div className="col-12">
                  <label className="form-label fw-semibold">Homestay ID</label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    value={createForm.homestayId}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, homestayId: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Check-in</label>
                  <input
                    className="form-control"
                    type="date"
                    value={createForm.checkIn}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, checkIn: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Check-out</label>
                  <input
                    className="form-control"
                    type="date"
                    value={createForm.checkOut}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, checkOut: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label fw-semibold">
                    <FaUserFriends className="me-1" /> Số khách
                  </label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    value={createForm.numGuests}
                    onChange={(e) =>
                      setCreateForm((prev) => ({ ...prev, numGuests: e.target.value }))
                    }
                  />
                </div>
                <div className="col-12 text-end">
                  <button className="btn btn-primary px-4" disabled={creating} type="submit">
                    {creating ? "Đang tạo..." : "Tạo mới"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Form Cập nhật trạng thái */}
        <div className="col-lg-6">
          <div className="card border-0 shadow h-100">
            <div className="card-body">
              <h5 className="card-title mb-3 text-success">
                <FaSyncAlt className="me-2" /> Cập nhật trạng thái
              </h5>
              <form className="row g-3" onSubmit={handleUpdateStatus}>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Booking ID</label>
                  <input
                    className="form-control"
                    type="number"
                    min={1}
                    value={statusForm.bookingId}
                    onChange={(e) =>
                      setStatusForm((prev) => ({ ...prev, bookingId: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Trạng thái</label>
                  <select
                    className="form-select"
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        status: e.target.value as BookingStatusPayload["status"],
                      }))
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
                  <button className="btn btn-success px-4" disabled={updating} type="submit">
                    {updating ? "Đang cập nhật..." : "Cập nhật"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Danh sách Booking */}
      <div className="card shadow mt-5 border-0">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="card-title text-dark fw-semibold mb-0">
              📜 Danh sách Booking
            </h5>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={loading}
              onClick={loadBookings}
              type="button"
            >
              {loading ? "Đang tải..." : "Làm mới"}
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
              <p className="mt-3 text-muted">Đang tải danh sách...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="alert alert-info text-center mb-0">
              Chưa có booking nào.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Homestay</th>
                    <th>Khách</th>
                    <th>Ngày</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td className="fw-semibold">{b.id}</td>
                      <td>
                        <div className="fw-semibold text-dark">
                          {b.homestayName || `Homestay #${b.homestayId ?? "?"}`}
                        </div>
                        <small className="text-muted">
                          Khách: {b.numGuests ?? "--"}
                        </small>
                      </td>
                      <td>{b.guestName ?? "--"}</td>
                      <td>
                        <div>{b.checkIn ?? "--"}</div>
                        <div className="text-muted small">{b.checkOut ?? "--"}</div>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${statusColors[b.status ?? "pending"]} text-uppercase`}
                        >
                          {b.status ?? "unknown"}
                        </span>
                      </td>
                      <td className="text-end">
                        <button
                          className="btn btn-sm btn-outline-danger"
                          disabled={canceling}
                          onClick={() => handleCancelBooking(b.id)}
                          type="button"
                        >
                          <FaTimes className="me-1" /> Hủy
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
