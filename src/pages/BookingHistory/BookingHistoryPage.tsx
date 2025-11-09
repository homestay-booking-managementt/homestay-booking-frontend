/* eslint-disable prettier/prettier */

import { useEffect, useMemo, useState } from "react";
import BookingFilterAdvanced from "@/components/booking/BookingFilterBar";
import BookingList from "@/components/booking/BookingList";
import { BookingStatusPayload, Booking } from "@/types/booking";
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
      // await new Promise((r) => setTimeout(r, 400));
      // setBookings(bookingData as BookingHistoryItem[]);

      // Gọi API từ mock server
      const res = await fetchBookings();

      // const data = Array.isArray(res)
      //   ? res // trường hợp mock trả về mảng thuần
      //   : Array.isArray(res.items)
      //   ? res.items // trường hợp trả về dạng PaginatedResponse
      //   : [];
      const data = [
        {
          "id": 3,
          "user_id": 2,
          "homestay_id": 3,
          "check_in": "2025-04-10",
          "check_out": "2025-04-12",
          "nights": 2,
          "total_price": 2400000,
          "status": "confirmed",
          "created_at": "2025-03-28T09:30:00",
          "user": {
            "id": 2,
            "role_id": 1,
            "name": "Trần Văn Dũng",
            "email": "dung@example.com",
            "phone": "0987654321",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-02T09:00:00"
          },
          "homestay": {
            "id": 3,
            "user_id": 4,
            "approved_by": 3,
            "name": "Green Garden Homestay",
            "description": "Không gian xanh giữa lòng thành phố",
            "address": "Đà Nẵng",
            "rating": 4.7,
            "capacity": 5,
            "num_rooms": 2,
            "bathroom_count": 1,
            "base_price": 1200000,
            "amenities": ["wifi", "garden"],
            "status": 1,
            "created_at": "2025-01-10T08:00:00",
            "approved_at": "2025-01-12T09:00:00",
            "is_deleted": false
          }
        }
      ];


      console.log(data)
      // Cắt ra số lượng hiển thị ban đầu
      setBookings(data as Booking[]);
      setDisplayedBookings((data as Booking[]).slice(0, visibleCount));
    } catch {
      showAlert("Không thể tải dữ liệu", "danger");
      setErrorMsg("Không thể tải dữ liệu JSON.");
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
        <button className="btn btn-outline-primary" disabled={loading} onClick={loadBookings} type="button">
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
                        <span className={`badge ${getStatusBadgeClass(booking.status)} text-uppercase`}>
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
                        <a className="btn btn-sm btn-outline-primary" href={`/reviews?bookingId=${booking.id}`}>
                          Write Review
                        </a>
                      )}
                      {(booking.status === "paid" || booking.status === "confirmed") && (
                        <button className="btn btn-sm btn-outline-danger" type="button">
                          Request Cancellation
                        </button>
                      )}
                      <a className="btn btn-sm btn-outline-secondary" href={`/bookings/${booking.id}`}>
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
