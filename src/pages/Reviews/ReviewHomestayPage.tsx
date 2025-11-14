
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useId } from "react";
import { FaStar } from "react-icons/fa";
import { showAlert } from "@/utils/showAlert"; // nếu anh có sẵn alert
import { BookingDetail } from "@/types/admin";
import { useAppSelector } from "@/app/hooks";
import { createReview } from "@/api/reviewApi";
import { ReviewPayload } from "@/types/review";
import { number } from "framer-motion";

const ReviewHomestayPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const currentUser = useAppSelector((store) => store.auth.currentUser);
  const userId = currentUser.userId ||0;
  // 🟣 Lấy thông tin booking từ API
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

  // 🟢 Gửi đánh giá lên server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return alert("Vui lòng chọn số sao đánh giá!");
    if (!comment.trim()) return alert("Vui lòng nhập nhận xét!");

    try {
      const payload : ReviewPayload= {
        bookingId: Number(bookingId),
        rating,
        comment,
      };
      console.log("Dữ liệu gửi đi:", payload);
      const res = await createReview(userId,payload);
      console.log("danhgia",res);
      setSubmitted(true);
      setTimeout(() => navigate("/bookings"), 1500);
    } catch (error) {
      console.error("loi",error);
      showAlert?.("Không thể gửi đánh giá!", "danger");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  if (submitted)
    return (
      <div className="container py-5 text-center">
        <h4 className="text-success fw-bold mb-3">
          🎉 Cảm ơn bạn đã đánh giá homestay!
        </h4>
        <p>Đánh giá của bạn đã được ghi nhận.</p>
      </div>
    );

  if (!booking)
    return (
      <div className="container py-5 text-center text-muted">
        Không tìm thấy thông tin đặt phòng.
      </div>
    );

  return (
    <div className="container py-5" style={{ maxWidth: "700px" }}>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body">
          <div className="text-center mb-4">
            {/* <img
              src={
                booking.homestay?.images?.find((img: any) => img.isPrimary)?.url ||
                "https://placehold.co/800x400?text=Homestay"
              }
              alt={booking.homestay?.name}
              className="rounded-3 shadow-sm"
              style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
            />
            <h4 className="mt-3 fw-bold">{booking.homestay?.name}</h4>
            <p className="text-muted">{booking.homestay?.address}</p> */}
            <div className="text-center mb-4">
  <img
    src={
      booking.homestay?.images?.find((img: any) => img.isPrimary)?.url ||
      "https://placehold.co/800x400?text=Homestay"
    }
    alt={booking.homestay?.name}
    className="rounded-3 shadow-sm"
    style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
  />

  <h4 className="mt-3 fw-bold">{booking.homestay?.name}</h4>
  <p className="text-muted mb-1">
    <i className="bi bi-geo-alt-fill text-danger me-1"></i>
    {booking.homestay?.address}
  </p>

  {/* NGÀY CHECK-IN / CHECK-OUT */}
  <div className="mt-3 d-flex justify-content-center gap-4 text-purple fw-semibold">
    <div>
      <i className="bi bi-calendar-check"></i> Check-in:<br />
      <span className="text-dark fw-bold">
        {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
      </span>
    </div>
    <div>
      <i className="bi bi-calendar-x"></i> Check-out:<br />
      <span className="text-dark fw-bold">
        {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
      </span>
    </div>
  </div>

  {/* CHI TIẾT THANH TOÁN */}
  <div className="mt-3 text-muted small">
    <div>Số đêm: <strong>{booking.nights}</strong></div>
    <div>Giá mỗi đêm: <strong>{booking.totalPrice / booking.nights} VND</strong></div>
    <div className="text-success fw-bold mt-1">
      Tổng tiền đã trả: {booking.totalPrice.toLocaleString("vi-VN")} VND
    </div>
  </div>
</div>

          </div>

          {/* Form đánh giá */}
          <form onSubmit={handleSubmit}>
            {/* Rating */}
            <div className="mb-3 text-center">
              <label className="form-label fw-semibold d-block mb-2">
                Đánh giá của bạn
              </label>
              <div className="d-flex justify-content-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    size={26}
                    color={star <= (hover ?? rating) ? "#ffc107" : "#ddd"}
                    style={{ cursor: "pointer", transition: "color 0.25s" }}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </div>
            </div>

            {/* Comment */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Nhận xét</label>
              <textarea
                className="form-control"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            {/* Buttons */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">
                Gửi đánh giá
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary px-4 ms-2"
                onClick={() => navigate("/bookings")}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewHomestayPage;
