
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { BookingDetail } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
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
        // 🟣 Gọi API thật từ Spring Boot
        const res = await fetch(
          `http://localhost:8084/api/v1/bookings/${bookingId}?userId=1`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          if (res.status === 404) {
            showAlert("Không tìm thấy đặt phòng!", "warning");
            setBooking(null);
            return;
          }
          throw new Error(`Lỗi tải dữ liệu (${res.status})`);
        }

        // ✅ Parse dữ liệu từ JSON
        const data: BookingDetail = await res.json();
        setBooking(data);
      } catch (error) {
        console.error(error);
        showAlert("Lỗi khi tải dữ liệu từ server!", "danger");
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
        imageUrl={imageUrl}
      />
      <BookingCustomerInfo user={booking.user} />
      <BookingDetailInfo booking={booking} />
    </div>
  );
};

export default BookingDetailPage;
