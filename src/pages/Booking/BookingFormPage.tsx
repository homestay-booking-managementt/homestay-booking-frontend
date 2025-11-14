/* eslint-disable prettier/prettier */
import { fetchUsers } from "@/api/adminApi";
import { createBooking } from "@/api/bookingApi";
import { fetchHomestayById } from "@/api/homestayApi";
import { useAppSelector } from "@/app/hooks";
import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import BookingPaymentModal from "@/components/booking/BookingPaymentModal";
import AppDialog from "@/components/common/AppDialog";
import { Homestay } from "@/types/homestay";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const BookingFormPage = () => {
  //khoi tao
const [searchParams] = useSearchParams();
const navigate = useNavigate();
//lay du lieu can thiet
const homestayId = searchParams.get("homestayId");
const checkIn = searchParams.get("checkIn") || "2025-12-12" ;
const checkOut = searchParams.get("checkOut") || "2025-12-12";
console.log(homestayId,checkIn,checkOut); 
const nights =
  (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
  (1000 * 60 * 60 * 24);
    //lay homestay
const [homestay, setHomestay] = useState<Homestay | null>(null);
    
const loadHomestay = async (id: number) => {
  try {
    const data = await fetchHomestayById(id);
    if(data)
    setHomestay(data);
  } catch {
    console.log("Không thể tải chi tiết homestay", "danger");
  } 
};
    
useEffect(() => {
  if (homestayId) {
    const id = Number(homestayId);
    loadHomestay(id);
  }
}, [homestayId, navigate]);
//popup sau dat phong
interface DialogState {
  show: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const [dialog, setDialog] = useState<DialogState>({
  show: false,
  title: "",
  message: "",
  confirmText: "",
});
const translateError = (msg: string) => {
  if (!msg) return "Đã xảy ra lỗi.";

  if (msg.includes("already booked"))
    return "Homestay đã được đặt trong khoảng thời gian này.";

  if (msg.includes("not found"))
    return "Không tìm thấy dữ liệu.";

  return msg; // fallback
};


  // form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Việt Nam",
    smokingPreference: "",
    bedPreference: "",
    notes: "",
  });
  const [user1,setUser1] = useState({
    "userId": 1,
      "name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "phone": "0901234567"
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Tạo JSON đầy đủ
    const payload = {
      userInfo: {
        name: `${form.lastName} ${form.firstName}`.trim(),
        email: form.email,
        phone: form.phone,
        country: form.country,
      },
      specialRequests: {
        smokingPreference: form.smokingPreference || null,
        bedPreference: form.bedPreference || null,
        notes: form.notes || null,
      },
    };

    console.log("📦 Dữ liệu gửi API:", payload);
  };
    const currentUser = useAppSelector((store) => store.auth.currentUser);
    useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchUsers();
        console.log("Users:", data);
        const found = data.find(d => d.id === currentUser.userId);
        console.log("FOUND", found );
        if (found) {
        setUser1({
          userId: found.id,
          name: found.name,
          email: found.email,
          phone: found.phone || "",
        });
      }
        
      } catch (err) {
        console.error("Lỗi fetchUsers:", err);
      }
    };

    load();
  }, []);
    console.log(currentUser);
    console.log("user1",user1);
    const [showModal, setShowModal] = useState(false);
  const bookingInfo = {
    homestayName: homestay?.name || "",
    totalPrice: homestay?.basePrice && nights 
  ? homestay.basePrice * nights 
  : 0,

    checkIn: checkIn,
    checkOut: checkOut,
    nights: nights,
  };
 
// 🌟 Tạo booking trước khi thanh toán
const handleCreateBooking = async () => {
  try {
    const payload = {
      homestayId: Number(homestayId),
      userId: currentUser.userId,
      checkIn,
      checkOut,
    };

    const created = await createBooking(payload);
    const future = getFutureTime(100);

// 👉 Format ra tiếng Việt chuẩn MySQL
    const bookingDl = formatDateTimeVN(future);
    console.log(created);
    if(created?.momoResponse){
      console.log("🎉 Tạo booking thành công:", created);
    setDialog({
      show: true,
      title: "Đặt phòng thành công",
      message: `Bạn đã đặt phòng thành công. Vui lòng thanh toán trước ${bookingDl} nữa để giữ phòng.`,
      confirmText: "Thanh toán luôn ",
      cancelText: "Để sau",
      onConfirm: () => {
        window.open(created.momoResponse.payUrl, "_blank");
        navigate(`/bookings/history`);
      },
      onCancel: () => {
        navigate(`/bookings/history`);
      }
    });
    }else{
      setDialog({
      show: true,
      title: "Lỗi",
      message: "1 Đặt phòng thất bại, vui lòng thử lại!",
      confirmText: "Đã hiểu",
      cancelText: "",
    });
    }
    
  } catch (err:any) {
    console.error("❌ Lỗi tạo booking:", err);
      const msg =
    err?.response?.data?.message ||
    err?.message ||
    "Đặt phòng thất bại!";

  setDialog({
    show: true,
    title: "Lỗi khi đặt phòng",
    message: translateError(msg),
    confirmText: "Đã hiểu",
    cancelText: "",
  });
  }
};

  const handleConfirm = (data: { code: string; method: string }) => {
    console.log("Xác nhận thanh toán:", data);
    alert("Thanh toán thành công!");
    setShowModal(false);
  };
  const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN"); 
};
// ⭐ Format thời gian theo chuẩn MySQL, giờ Việt Nam (UTC+7)
function formatDateTimeVN(date: Date) {
  const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000); // chuyển sang UTC+7

  const yyyy = vnDate.getUTCFullYear();
  const mm = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(vnDate.getUTCDate()).padStart(2, "0");
  const hh = String(vnDate.getUTCHours()).padStart(2, "0");
  const min = String(vnDate.getUTCMinutes()).padStart(2, "0");
  const ss = String(vnDate.getUTCSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}
function getFutureTime(minutesToAdd: number) {
  return new Date(Date.now() + minutesToAdd * 60 * 1000);
}

  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* LEFT: Form */}
        <div className="col-md-8">
            <BookingCustomerInfo user={user1} />
          <div className="card shadow-sm">
            <div className="card-body">
              {/* FORM YÊU CẦU ĐẶC BIỆT */}
            <section className="mb-4">
            <h5 className="mb-3">Yêu cầu đặc biệt</h5>

            <div className="card shadow-sm border-0 rounded-4">
                <div className="card-body text-secondary small lh-lg">
                <form onSubmit={handleSubmit}>
                    {/* Quy định hút thuốc */}
                    <div className="mb-3">
                    <label className="form-label fw-semibold">Quy định hút thuốc:</label>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="smokingPreference"
                            value="non_smoking"
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Không hút thuốc</label>
                        </div>
                        <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="smokingPreference"
                            value="smoking"
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Có hút thuốc</label>
                        </div>
                    </div>
                    </div>

                    {/* Loại giường */}
                    <div className="mb-3">
                    <label className="form-label fw-semibold">Loại giường:</label>
                    <div className="d-flex flex-wrap gap-3">
                        <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="bedPreference"
                            value="double_bed"
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Giường đôi</label>
                        </div>
                        <div className="form-check">
                        <input
                            type="radio"
                            className="form-check-input"
                            name="bedPreference"
                            value="twin_beds"
                            onChange={handleChange}
                        />
                        <label className="form-check-label">Hai giường đơn</label>
                        </div>
                    </div>
                    </div>

                    {/* Ghi chú khác */}
                    <div className="mb-4">
                    <label className="form-label fw-semibold">
                        Ghi chú khác (nếu có):
                    </label>
                    <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="form-control rounded-3"
                        rows={3}
                        placeholder="Ví dụ: Cần tầng cao, gần cửa sổ view phố..."
                    />
                    </div>

                    {/* Nút gửi */}
                    {/* <button type="submit" onClick={()=>setShowModal(true)} className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"> */}
                    <div className="d-flex justify-content-center">
                      <button
                        type="submit"
                        onClick={handleCreateBooking}
                        className="btn btn-primary rounded-pill py-2 fw-semibold px-5 fs-5"
                      >
                        Đặt phòng
                      </button>
                    </div>

                </form>
                
                </div>
            </div>
            </section>

            </div>
          </div>
        </div>
<BookingPaymentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        bookingInfo={bookingInfo}
        onConfirm={handleConfirm}
      />
        {/* RIGHT: Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            {homestay?.images?.[0] && (
              <img
                src={homestay.images[0].url}
                alt={homestay.images[0].alt}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
            )}

            <div className="card-body">
              <h5>{homestay?.name}</h5>
              <p className="text-muted">{homestay?.address}</p>
              <hr />
              <p>
                <strong>Nhận phòng:</strong> {fmtDate(checkIn)}
                <br />
                <strong>Trả phòng:</strong> {fmtDate(checkOut)}
                <br />
                <strong>Số đêm:</strong> {nights}
              </p>
              <p className="fw-bold text-success">
                Tổng tiền:{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(homestay?.basePrice && nights 
  ? homestay.basePrice * nights 
  : 0)}
              </p>

              <ul className="small list-unstyled">
                <li>✔ Wifi miễn phí</li>
                <li>✔ Điều hòa</li>
                <li>✔ Thang máy</li>
                <li>✔ View thành phố</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <AppDialog
  show={dialog.show}
  title={dialog.title}
  message={dialog.message}
  confirmText={dialog.confirmText}
  cancelText={dialog.cancelText}
  onConfirm={dialog.onConfirm}
  onCancel={dialog.onCancel}
  onClose={() => setDialog((old) => ({ ...old, show: false }))}
/>

    </div>
  );
};

export default BookingFormPage;
