
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Booking } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { fetchBookings } from "@/api/bookingApi";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import BookingDetailInfo from "@/components/booking/BookingDetailInfo";

const BookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        const all = await fetchBookings();
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
        //const found = data.find((b) => b.id === Number(bookingId));
        const found = data.find((b) => b.id === 3);
        if (!found) showAlert("Không tìm thấy đặt phòng!", "warning");
        setBooking(found as Booking ?? null);
      } catch {
        showAlert("Lỗi tải dữ liệu!", "danger");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (!booking)
    return (
      <div className="container py-5 text-center text-muted">
        Không tìm thấy thông tin đặt phòng.
      </div>
    );

  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <BookingHeader
        homestayId={booking.homestay.id}
        homestayName={booking.homestay.name}
        bookingStatus={booking.status}
      />
      <BookingCustomerInfo user={booking.user} />
      <BookingDetailInfo booking={booking} />
    </div>
  );
};

export default BookingDetailPage;

