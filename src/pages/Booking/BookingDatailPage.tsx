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
        const found = data.find((b) => b.id === Number(bookingId));
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

