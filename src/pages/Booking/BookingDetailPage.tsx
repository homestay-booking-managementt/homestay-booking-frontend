
/* eslint-disable prettier/prettier */
import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import type { BookingDetail } from "@/types/booking";
import { showAlert } from "@/utils/showAlert";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import BookingDetailInfo from "@/components/booking/BookingDetailInfo";
import { useAppSelector } from "@/app/hooks";
import AppDialog from "@/components/common/AppDialog";
import { cancelBooking } from "@/api/bookingApi";

const BookingDetailPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useAppSelector((store) => store.auth.currentUser);
  const userId = currentUser.userId ||0;
  const navigate = useNavigate();

  interface DialogState {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;   //  ✔ phải có dấu ?
  onCancel?: () => void;    // nếu anh có dùng
}

const [dialog, setDialog] = useState<DialogState>({
  show: false,
  title: "",
  message: "",
  confirmText: "",
});

const confirmCancelBooking = async (bookingId: number) => {
  try {
    await cancelBooking(bookingId,userId, "Khách tự hủy");

    setDialog({
      show: true,
      title: "Đã hủy đặt phòng",
      message: "Bạn đã hủy đặt phòng thành công.",
      confirmText: "Đã hiểu",
      cancelText: "",
      onConfirm: () => {
      window.location.reload();
    }
    });


  } catch (err) {
    setDialog({
      show: true,
      title: "Lỗi",
      message: "Không thể hủy đặt phòng, vui lòng thử lại!",
      confirmText: "Đã hiểu",
      cancelText: "",
    });
  }
};

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        // 🟣 Gọi API thật từ Spring Boot
        const res = await fetch(
          `http://localhost:8084/api/v1/bookings/${bookingId}?userId=${userId}`,
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
        console.log(data);
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
  const handleCancel = (bookingId: number) => {
  console.log("Cancel booking: ", bookingId);
  setDialog({
    show: true,
    title: "Xác nhận hủy đặt phòng",
    message: "Bạn có chắc chắn muốn hủy đặt phòng này không?",
    confirmText: "Hủy ngay",
    cancelText: "Không",
    onConfirm: () => {
      confirmCancelBooking(bookingId);
    }
  });
};

const handlePay = (bookingId: number) => {
  console.log("Pay booking: ", bookingId);
  window.open(booking.payUrl, "_blank");
};



  return (
    <div className="container py-5" style={{ maxWidth: 900 }}>
      <AppDialog
        show={dialog.show}
        title={dialog.title}
        message={dialog.message}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        onConfirm={dialog.onConfirm}
        onClose={() => setDialog({ ...dialog, show: false })}
      />

      <BookingHeader
        homestayId={booking.homestay.id}
        homestayName={booking.homestay.name}
        bookingStatus={booking.status}
        imageUrl={imageUrl}
      />
      <BookingCustomerInfo user={booking.user} />
      <BookingDetailInfo booking={booking} />

      {/* Hàng chứa 2 nút */}
<div className="d-flex justify-content-center gap-3 mt-4">

  {/* Nút Hủy */}
  <button
    className="btn btn-outline-danger px-4"
    disabled={!(booking.status === "pending_payment" || booking.status === "confirmed")}

    onClick={() => handleCancel(booking.bookingId)}
    style={{
      opacity:
        booking.status === "pending_payment" || booking.status === "confirmed"
          ? 1
          : 0.5,
      pointerEvents:
        booking.status === "pending_payment" || booking.status === "confirmed"
          ? "auto"
          : "none",
    }}
  >
    {booking.status === "pending_payment" || booking.status === "confirmed" ? "Hủy đặt phòng": "Không thể hủy"}
    
  </button>

  {/* Nút Thanh toán */}
  <button
    className="btn btn-primary px-4"
    disabled={booking.status !== "pending_payment"}

    onClick={() => handlePay(booking.bookingId)}
    style={{
      opacity: booking.status === "pending_payment" ? 1 : 0.5,
      pointerEvents: booking.status === "pending_payment" ? "auto" : "none",
    }}
  >
    {booking.status === "cancelled"?"Thanh toán":"Thanh toán"}
    
  </button>

</div>

    </div>
  );
};

export default BookingDetailPage;


