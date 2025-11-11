/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Booking, BookingDetail } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import { fetchBookings } from "@/api/bookingApi";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import BookingDetailInfo from "@/components/booking/BookingDetailInfo";

const BookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        const all = await fetchBookings();
        const data = [
          {
    "bookingId": 4,
    "checkIn": "2025-10-01",
    "checkOut": "2025-10-03",
    "nights": 2,
    "totalPrice": 1900000.00,
    "status": "completed",
    "createdAt": "2025-10-27T17:45:27",
    "homestay": {
        "id": 1,
        "name": "Villa Biển Đà Nẵng",
        "description": "Villa sang trọng view biển, gần bãi tắm Mỹ Khê",
        "address": "123 Võ Nguyên Giáp, Sơn Trà",
        "city": "Đà Nẵng",
        "lat": 16.0471,
        "longVal": 108.2376,
        "capacity": 8,
        "numRooms": 3,
        "bathroomCount": 2,
        "basePrice": 2500000.00,
        "amenities": "{\"wifi\": true, \"pool\": true, \"parking\": true, \"ac\": true, \"kitchen\": true}",
        "images": [
            {
                "url": "https://diff.vn/wp-content/uploads/2025/04/Thumb-homestay-1.jpg",
                "alt": null,
                "isPrimary": true
            },
            {
                "url": "https://example.com/images/villa-danang-2.jpg",
                "alt": null,
                "isPrimary": false
            },
            {
                "url": "/images/homestay1a.jpg",
                "alt": null,
                "isPrimary": false
            },
            {
                "url": "/images/homestay1b.jpg",
                "alt": null,
                "isPrimary": false
            }
        ]
    },
    "user": {
        "userId": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567"
    }
},
{
    "bookingId": 3,
    "checkIn": "2025-11-20",
    "checkOut": "2025-11-25",
    "nights": 5,
    "totalPrice": 6000000.00,
    "status": "pending",
    "createdAt": "2025-10-22T14:00:00",
    "homestay": {
        "id": 3,
        "name": "Căn Hộ Phố Cổ Hà Nội",
        "description": "Căn hộ hiện đại ngay trung tâm phố cổ Hà Nội",
        "address": "78 Hàng Bạc, Hoàn Kiếm",
        "city": "Hà Nội",
        "lat": 21.0285,
        "longVal": 105.8542,
        "capacity": 4,
        "numRooms": 1,
        "bathroomCount": 1,
        "basePrice": 1200000.00,
        "amenities": "{\"wifi\": true, \"ac\": true, \"elevator\": true, \"city_view\": true}",
        "images": [
            {
                "url": "https://motogo.vn/wp-content/uploads/2023/03/homestay-pho-co-ha-noi-17.jpg",
                "alt": null,
                "isPrimary": true
            },
            {
                "url": "/images/homestay3a.jpg",
                "alt": null,
                "isPrimary": false
            }
        ]
    },
    "user": {
        "userId": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567"
    }
}
        ];
        const found = data.find((b) => b.bookingId === Number(bookingId));
        if (!found) showAlert("Không tìm thấy đặt phòng!", "warning");
        setBooking(found as BookingDetail ?? null);
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
  const imageUrl =
  booking.homestay.images?.find((img) => img.isPrimary)?.url ||
  "https://lh5.googleusercontent.com/proxy/nH41Vr6ylN54asO756GjctdXANZmbAaR4QH8GKMgNvBWs3Lo3FHTCmiO0-vqAX39B0kVqbK15o_bVLywjdIr5yGCuI-28Gv5";
  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <BookingHeader
        homestayId={booking.homestay.id}
        homestayName={booking.homestay.name}
        bookingStatus={booking.status}
        imageUrl= {imageUrl}
      />
      <BookingCustomerInfo user={booking.user } />
      <BookingDetailInfo booking={booking} />
    </div>
  );
};

export default BookingDetailPage;
  
