/* eslint-disable prettier/prettier */
  import { useAppSelector } from "@/app/hooks";
  import { BookingDetail } from "@/types/booking";
  import React, { useEffect, useState } from "react";
  import { useNavigate, useParams, useSearchParams } from "react-router-dom";
  const PaymentPage: React.FC = () => {
    const navigate = useNavigate();
    const {bookingId} = useParams();
    const currentUser = useAppSelector((store) => store.auth.currentUser);
    const userId = currentUser.userId;
      
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState("credit");
    const [error, setError] = useState("");
    // 💰 Thông tin từ booking trước đó (demo cứng, sau này có thể lấy từ context hoặc params)
    const bookingInfo = {
      homestayName: "Căn Hộ Phố Cổ Hà Nội",
      totalPrice: 6000000,
      nights: 5,
      checkIn: "2025-11-20",
      checkOut: "2025-11-25",
    };
    //lay booking
    useEffect(() => {
        const loadBooking = async () => {
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
          } 
        };
    
        loadBooking();
      }, [bookingId]);

    

    const applyCoupon = () => {
      if (coupon.trim().toUpperCase() === "GIAM10") {
        setDiscount(0.1); // 10%
        setError("");
      } else if (coupon.trim() === "") {
        setDiscount(0);
        setError("");
      } else {
        setError("❌ Mã giảm giá không hợp lệ");
        setDiscount(0);
      }
    };

    const finalTotal = booking? booking.totalPrice * (1 - discount) :0 ;

    const handlePayment = () => {
      alert(`Thanh toán thành công ${finalTotal.toLocaleString()} VND qua ${paymentMethod}`);
      navigate("/bookings/history"); // chuyển sang trang hoàn tất (anh sẽ làm sau)
    };

    return (
      <div className="container my-4">
        <div className="row g-4">
          {/* LEFT: Payment Info */}
          <div className="col-md-8">
            <div className="card shadow-sm border-0 rounded-4">
              <div className="card-body">
                <h4 className="mb-3 fw-semibold">Thanh toán đặt phòng</h4>

                {/* Tổng tiền */}
                <div className="mb-4">
                  <h6 className="text-secondary">Tổng tiền phòng</h6>
                  <p className="fs-5 fw-bold text-success">
                    {booking?.totalPrice.toLocaleString()} VND
                  </p>
                  <small className="text-muted">
                    ({booking?.nights} đêm từ {booking?.checkIn} đến {booking?.checkOut})
                  </small>
                </div>

                <hr />

                {/* Mã giảm giá */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Mã giảm giá</label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã (ví dụ: GIAM10)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={applyCoupon}
                    >
                      Áp dụng
                    </button>
                  </div>
                  {error && <div className="text-danger mt-2 small">{error}</div>}
                  {discount > 0 && (
                    <div className="text-success mt-2 small">
                      ✅ Áp dụng mã giảm giá {discount * 100}% thành công!
                    </div>
                  )}
                </div>

                <hr />

                {/* Phương thức thanh toán */}
                <div className="mb-4">
                  <label className="form-label fw-semibold">Phương thức thanh toán</label>
                  <div className="d-flex flex-column gap-2">
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="paymentMethod"
                        value="credit"
                        checked={paymentMethod === "credit"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">Thẻ tín dụng / ghi nợ</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="paymentMethod"
                        value="momo"
                        checked={paymentMethod === "momo"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">Ví MoMo</label>
                    </div>
                    <div className="form-check">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label">Thanh toán khi nhận phòng</label>
                    </div>
                  </div>
                </div>

                <hr />

                {/* Tổng cuối cùng */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0 fw-semibold">Tổng thanh toán:</h5>
                  <h5 className="mb-0 text-success fw-bold">
                    {finalTotal.toLocaleString()} VND
                  </h5>
                </div>

                <button
                  className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                  onClick={handlePayment}
                >
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Homestay Summary */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <img
                src= {booking?.homestay?.images?.[0].url}
                alt={booking?.homestay.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{booking?.homestay.name}</h5>
                <p className="text-muted small">
                  {booking?.checkIn} → {booking?.checkOut} <br />
                  ({booking?.nights} đêm)
                </p>
                <p className="fw-bold text-success mb-0">
                  {booking?.totalPrice.toLocaleString()} VND
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default PaymentPage;
