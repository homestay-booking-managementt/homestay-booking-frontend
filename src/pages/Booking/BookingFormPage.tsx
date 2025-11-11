/* eslint-disable prettier/prettier */
import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import BookingPaymentModal from "@/components/booking/BookingPaymentModal";
import { useState } from "react";
import { useLocation } from "react-router-dom";


const BookingFormPage = () => {
  const localtion = useLocation();
  const { homestayId, checkIn, checkOut } = {
  homestayId: 1,
  checkIn: "2025-12-10",
  checkOut: "2025-12-12",
};//localtion.state || {};
  const nights =
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
    (1000 * 60 * 60 * 24);
  const data = {
        "id": 1,
        "userId": 1,
        "name": "Villa Biển Đà Nẵng",
        "description": "Villa sang trọng view biển, gần bãi tắm Mỹ Khê",
        "address": "123 Võ Nguyên Giáp, Sơn Trà",
        "city": "Đà Nẵng",
        "lat": 16.0471,
        "longitude": 108.2376,
        "capacity": 8,
        "numRooms": 3,
        "bathroomCount": 2,
        "basePrice": 2500000.00,
        "amenities": "{\"wifi\": true, \"pool\": true, \"parking\": true, \"ac\": true, \"kitchen\": true}",
        "status": 2,
        "createdAt": "2025-01-10 08:30:00",
        "updatedAt": "2025-01-15 10:00:00",
        "images": [
            {
                "id": 1,
                "url": "https://chefjob.vn/wp-content/uploads/2020/07/biet-thu-vinpearl-da-nang-resort-villas.jpg",
                "alt": "Villa Biển Đà Nẵng - Mặt tiền",
                "isPrimary": true,
                "createdAt": "2025-10-26 22:41:57"
            },
            {
                "id": 2,
                "url": "https://example.com/images/villa-danang-2.jpg",
                "alt": "Villa Biển Đà Nẵng - Hồ bơi",
                "isPrimary": false,
                "createdAt": "2025-10-26 22:41:57"
            },
            {
                "id": 8,
                "url": "/images/homestay1a.jpg",
                "alt": "Phòng khách Bình An",
                "isPrimary": false,
                "createdAt": "2025-10-27 17:45:27"
            },
            {
                "id": 9,
                "url": "/images/homestay1b.jpg",
                "alt": "Phòng ngủ Bình An",
                "isPrimary": false,
                "createdAt": "2025-10-27 17:45:27"
            }
        ]
    }

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
  const user = {
        "userId": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567"
    };
    const [showModal, setShowModal] = useState(false);

  const bookingInfo = {
    homestayName: "Villa Biển Đà Nẵng",
    totalPrice: 5000000,
    checkIn: "2025-12-10",
    checkOut: "2025-12-12",
    nights: 2,
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
  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* LEFT: Form */}
        <div className="col-md-8">
            <BookingCustomerInfo user={user } />
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
                    <button type="submit" onClick={()=>setShowModal(true)} className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    Kế tiếp: Bước cuối cùng
                    </button>
                </form>
                <BookingPaymentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        bookingInfo={bookingInfo}
        onConfirm={handleConfirm}
      />
                </div>
            </div>
            </section>

            </div>
          </div>
        </div>

        {/* RIGHT: Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <img
              src={data.images[0].url}
              alt={data.images[0].alt}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5>{data.name}</h5>
              <p className="text-muted">{data.address}</p>
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
                }).format(data.basePrice * nights)}
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
    </div>
  );
};

export default BookingFormPage;
