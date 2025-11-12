// import { useParams, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { FaStar } from "react-icons/fa";
// import { constants } from "buffer";

// const ReviewHomestayPage = () => {
//   const { bookingId } = useParams<{ bookingId: string }>();
//   const navigate = useNavigate();
//     console.log(bookingId);
//   // Dữ liệu demo - sau này anh fetch từ API bằng bookingId
//   const booking = {
//     bookingId,
//     homestay: {
//       id: 3,
//       name: "Căn Hộ Phố Cổ Hà Nội",
//       address: "78 Hàng Bạc, Hoàn Kiếm, Hà Nội",
//       image:
//         "https://motogo.vn/wp-content/uploads/2023/03/homestay-pho-co-ha-noi-17.jpg",
//     },
//   };

//   const [rating, setRating] = useState<number>(0);
//   const [hover, setHover] = useState<number | null>(null);
//   const [comment, setComment] = useState("");
//   const [submitted, setSubmitted] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!rating) return alert("Vui lòng chọn số sao đánh giá!");
//     if (!comment.trim()) return alert("Vui lòng nhập nhận xét!");

//     console.log("Đánh giá gửi đi:", {
//       bookingId,
//       homestayId: booking.homestay.id,
//       rating,
//       comment,
//     });

//     // Mock gửi thành công
//     setSubmitted(true);
//     setTimeout(() => navigate("/bookings"), 1500);
//   };

//   if (submitted)
//     return (
//       <div className="container py-5 text-center">
//         <h4 className="text-success fw-bold mb-3">
//           🎉 Cảm ơn bạn đã đánh giá homestay!
//         </h4>
//         <p>Đánh giá của bạn đã được ghi nhận.</p>
//       </div>
//     );

//   return (
//     <div className="container py-5" style={{ maxWidth: "700px" }}>
//       <div className="card border-0 shadow-sm rounded-4">
//         <div className="card-body">
//           <div className="text-center mb-4">
//             <img
//               src={booking.homestay.image}
//               alt={booking.homestay.name}
//               className="rounded-3 shadow-sm"
//               style={{ width: "100%", maxHeight: "250px", objectFit: "cover" }}
//             />
//             <h4 className="mt-3 fw-bold">{booking.homestay.name}</h4>
//             <p className="text-muted">{booking.homestay.address}</p>
//           </div>

//           <form onSubmit={handleSubmit}>
//             {/* Rating */}
//             <div className="mb-3 text-center">
//               <label className="form-label fw-semibold d-block mb-2">
//                 Đánh giá của bạn
//               </label>
//               <div className="d-flex justify-content-center gap-1">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <FaStar
//                     key={star}
//                     size={26}
//                     color={
//                       star <= (hover ?? rating) ? "#ffc107" : "#ddd"
//                     }
//                     style={{ cursor: "pointer", transition: "color 0.25s" }}
//                     onClick={() => setRating(star)}
//                     onMouseEnter={() => setHover(star)}
//                     onMouseLeave={() => setHover(null)}
//                   />
//                 ))}
//               </div>
//             </div>

//             {/* Comment */}
//             <div className="mb-4">
//               <label className="form-label fw-semibold">Nhận xét</label>
//               <textarea
//                 className="form-control"
//                 rows={4}
//                 placeholder="Chia sẻ trải nghiệm của bạn..."
//                 value={comment}
//                 onChange={(e) => setComment(e.target.value)}
//               />
//             </div>

//             {/* Buttons */}
//             <div className="text-center">
//               <button type="submit" className="btn btn-primary px-4">
//                 Gửi đánh giá
//               </button>
//               <button
//                 type="button"
//                 className="btn btn-outline-secondary px-4 ms-2"
//                 onClick={() => navigate("/bookings")}
//               >
//                 Hủy
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReviewHomestayPage;
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { showAlert } from "@/utils/showAlert"; // nếu anh có sẵn alert

const ReviewHomestayPage = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // 🟣 Lấy thông tin booking từ API
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await fetch(`http://localhost:8084/api/v1/bookings?userId=1`);
        if (!res.ok) throw new Error("Không thể tải thông tin booking!");
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error(err);
        showAlert?.("Lỗi khi tải thông tin đặt phòng!", "danger");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  // 🟢 Gửi đánh giá lên server
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return alert("Vui lòng chọn số sao đánh giá!");
    if (!comment.trim()) return alert("Vui lòng nhập nhận xét!");

    try {
      const payload = {
        bookingId,
        homestayId: booking?.homestay?.id,
        rating,
        comment,
        userId: 1, // hoặc lấy từ context/token nếu có
      };

      console.log("Dữ liệu gửi đi:", payload);

      const res = await fetch("http://localhost:8084/api/v1/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Lỗi khi gửi đánh giá!");
      showAlert?.("🎉 Cảm ơn bạn đã đánh giá homestay!", "success");

      setSubmitted(true);
      setTimeout(() => navigate("/bookings"), 1500);
    } catch (error) {
      console.error(error);
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
            <p className="text-muted">{booking.homestay?.address}</p>
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
