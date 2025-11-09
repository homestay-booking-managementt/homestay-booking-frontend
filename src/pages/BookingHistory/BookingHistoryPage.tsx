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
        },
        {
          "id": 4,
          "user_id": 3,
          "homestay_id": 4,
          "check_in": "2025-05-02",
          "check_out": "2025-05-06",
          "nights": 4,
          "total_price": 6000000,
          "status": "pending",
          "created_at": "2025-04-20T12:00:00",
          "user": {
            "id": 3,
            "role_id": 1,
            "name": "Lê Thị Mỹ Duyên",
            "email": "duyen@example.com",
            "phone": "0933123456",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-05T09:00:00"
          },
          "homestay": {
            "id": 4,
            "user_id": 5,
            "approved_by": 3,
            "name": "Sunset Riverside Lodge",
            "description": "Nhà nghỉ cạnh sông, ngắm hoàng hôn tuyệt đẹp",
            "address": "Hội An",
            "rating": 4.6,
            "capacity": 4,
            "num_rooms": 2,
            "bathroom_count": 1,
            "base_price": 1500000,
            "amenities": ["wifi", "bike rental"],
            "status": 1,
            "created_at": "2025-01-15T08:00:00",
            "approved_at": "2025-01-17T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 5,
          "user_id": 4,
          "homestay_id": 5,
          "check_in": "2025-06-01",
          "check_out": "2025-06-04",
          "nights": 3,
          "total_price": 5400000,
          "status": "checked_in",
          "created_at": "2025-05-20T11:00:00",
          "user": {
            "id": 4,
            "role_id": 1,
            "name": "Phạm Minh Quân",
            "email": "quan@example.com",
            "phone": "0978123123",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-07T10:00:00"
          },
          "homestay": {
            "id": 5,
            "user_id": 6,
            "approved_by": 3,
            "name": "Skyview Apartment",
            "description": "Căn hộ cao cấp với view toàn cảnh thành phố",
            "address": "Hà Nội",
            "rating": 4.9,
            "capacity": 3,
            "num_rooms": 2,
            "bathroom_count": 1,
            "base_price": 1800000,
            "amenities": ["wifi", "air conditioning"],
            "status": 1,
            "created_at": "2025-01-18T08:00:00",
            "approved_at": "2025-01-19T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 6,
          "user_id": 5,
          "homestay_id": 6,
          "check_in": "2025-07-12",
          "check_out": "2025-07-15",
          "nights": 3,
          "total_price": 3000000,
          "status": "paid",
          "created_at": "2025-06-30T09:00:00",
          "user": {
            "id": 5,
            "role_id": 1,
            "name": "Ngô Đức Huy",
            "email": "huy@example.com",
            "phone": "0966778899",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-08T08:00:00"
          },
          "homestay": {
            "id": 6,
            "user_id": 7,
            "approved_by": 3,
            "name": "Forest Cabin",
            "description": "Ngôi nhà gỗ giữa rừng thông mát mẻ",
            "address": "Bảo Lộc",
            "rating": 4.5,
            "capacity": 2,
            "num_rooms": 1,
            "bathroom_count": 1,
            "base_price": 1000000,
            "amenities": ["fireplace", "parking"],
            "status": 1,
            "created_at": "2025-01-20T08:00:00",
            "approved_at": "2025-01-21T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 7,
          "user_id": 6,
          "homestay_id": 7,
          "check_in": "2025-08-01",
          "check_out": "2025-08-03",
          "nights": 2,
          "total_price": 2800000,
          "status": "canceled",
          "created_at": "2025-07-15T13:00:00",
          "user": {
            "id": 6,
            "role_id": 1,
            "name": "Hoàng Thu Hà",
            "email": "ha@example.com",
            "phone": "0911222333",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-10T10:00:00"
          },
          "homestay": {
            "id": 7,
            "user_id": 8,
            "approved_by": 3,
            "name": "Lakeview Cottage",
            "description": "Ngôi nhà nhỏ bên hồ tuyệt đẹp",
            "address": "Tam Đảo",
            "rating": 4.4,
            "capacity": 4,
            "num_rooms": 2,
            "bathroom_count": 1,
            "base_price": 1400000,
            "amenities": ["lake view", "wifi"],
            "status": 1,
            "created_at": "2025-01-22T08:00:00",
            "approved_at": "2025-01-23T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 8,
          "user_id": 7,
          "homestay_id": 8,
          "check_in": "2025-09-05",
          "check_out": "2025-09-08",
          "nights": 3,
          "total_price": 5100000,
          "status": "refunded",
          "created_at": "2025-08-25T09:00:00",
          "user": {
            "id": 7,
            "role_id": 1,
            "name": "Vũ Thành Tài",
            "email": "tai@example.com",
            "phone": "0909988776",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-12T08:00:00"
          },
          "homestay": {
            "id": 8,
            "user_id": 9,
            "approved_by": 3,
            "name": "Ocean Breeze Bungalow",
            "description": "Bungalow gần biển với gió mát quanh năm",
            "address": "Phú Quốc",
            "rating": 4.8,
            "capacity": 5,
            "num_rooms": 3,
            "bathroom_count": 2,
            "base_price": 1700000,
            "amenities": ["pool", "sea view", "wifi"],
            "status": 1,
            "created_at": "2025-01-25T08:00:00",
            "approved_at": "2025-01-26T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 9,
          "user_id": 8,
          "homestay_id": 9,
          "check_in": "2025-10-12",
          "check_out": "2025-10-15",
          "nights": 3,
          "total_price": 7500000,
          "status": "checked_out",
          "created_at": "2025-09-28T11:00:00",
          "user": {
            "id": 8,
            "role_id": 1,
            "name": "Đào Thị Lệ Thủy",
            "email": "thuy@example.com",
            "phone": "0933555777",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-14T09:00:00"
          },
          "homestay": {
            "id": 9,
            "user_id": 10,
            "approved_by": 3,
            "name": "Mountain View Chalet",
            "description": "Chalet hiện đại nhìn ra đỉnh núi",
            "address": "Sa Pa",
            "rating": 4.9,
            "capacity": 6,
            "num_rooms": 3,
            "bathroom_count": 2,
            "base_price": 2500000,
            "amenities": ["mountain view", "fireplace"],
            "status": 1,
            "created_at": "2025-01-28T08:00:00",
            "approved_at": "2025-01-29T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 10,
          "user_id": 9,
          "homestay_id": 10,
          "check_in": "2025-11-20",
          "check_out": "2025-11-23",
          "nights": 3,
          "total_price": 3900000,
          "status": "paid",
          "created_at": "2025-11-01T10:00:00",
          "user": {
            "id": 9,
            "role_id": 1,
            "name": "Nguyễn Văn Nam",
            "email": "nam@example.com",
            "phone": "0909123456",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-15T08:00:00"
          },
          "homestay": {
            "id": 10,
            "user_id": 11,
            "approved_by": 3,
            "name": "Coastal Hideaway",
            "description": "Homestay ven biển yên tĩnh, gần khu chợ hải sản",
            "address": "Vũng Tàu",
            "rating": 4.7,
            "capacity": 4,
            "num_rooms": 2,
            "bathroom_count": 1,
            "base_price": 1300000,
            "amenities": ["sea view", "wifi", "parking"],
            "status": 1,
            "created_at": "2025-01-30T08:00:00",
            "approved_at": "2025-02-01T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 11,
          "user_id": 10,
          "homestay_id": 11,
          "check_in": "2025-12-05",
          "check_out": "2025-12-07",
          "nights": 2,
          "total_price": 2600000,
          "status": "confirmed",
          "created_at": "2025-11-22T10:00:00",
          "user": {
            "id": 10,
            "role_id": 1,
            "name": "Phan Thanh Hùng",
            "email": "hung@example.com",
            "phone": "0944223344",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-18T08:00:00"
          },
          "homestay": {
            "id": 11,
            "user_id": 12,
            "approved_by": 3,
            "name": "Urban Cozy Studio",
            "description": "Studio nhỏ gọn, hiện đại giữa trung tâm thành phố",
            "address": "TP. Hồ Chí Minh",
            "rating": 4.3,
            "capacity": 2,
            "num_rooms": 1,
            "bathroom_count": 1,
            "base_price": 1300000,
            "amenities": ["wifi", "air conditioning"],
            "status": 1,
            "created_at": "2025-02-02T08:00:00",
            "approved_at": "2025-02-03T09:00:00",
            "is_deleted": false
          }
        },
        {
          "id": 12,
          "user_id": 11,
          "homestay_id": 12,
          "check_in": "2026-01-15",
          "check_out": "2026-01-18",
          "nights": 3,
          "total_price": 4500000,
          "status": "pending",
          "created_at": "2025-12-20T10:00:00",
          "user": {
            "id": 11,
            "role_id": 1,
            "name": "Bùi Quốc Khánh",
            "email": "khanh@example.com",
            "phone": "0911998877",
            "passwd": "123456",
            "status": 1,
            "is_deleted": false,
            "created_at": "2025-01-20T08:00:00"
          },
          "homestay": {
            "id": 12,
            "user_id": 13,
            "approved_by": 3,
            "name": "Misty Valley Resort",
            "description": "Khu nghỉ dưỡng trong thung lũng sương mù",
            "address": "Mộc Châu",
            "rating": 4.9,
            "capacity": 6,
            "num_rooms": 3,
            "bathroom_count": 2,
            "base_price": 1500000,
            "amenities": ["pool", "mountain view", "wifi"],
            "status": 1,
            "created_at": "2025-02-04T08:00:00",
            "approved_at": "2025-02-05T09:00:00",
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
