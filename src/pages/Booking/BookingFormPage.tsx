import BookingCustomerInfo from "@/components/booking/BookingCustomInfo";
import { useState } from "react";


const BookingFormPage = () => {
  const bookingInfo = {
    bookingId: 3,
    checkIn: "2025-11-20",
    checkOut: "2025-11-25",
    nights: 5,
    totalPrice: 6000000,
    status: "pending",
    createdAt: "2025-10-22T14:00:00",
    homestay: {
      id: 3,
      name: "Căn Hộ Phố Cổ Hà Nội",
      description: "Căn hộ hiện đại ngay trung tâm phố cổ Hà Nội",
      address: "78 Hàng Bạc, Hoàn Kiếm",
      city: "Hà Nội",
      images: [
        { url: "https://motogo.vn/wp-content/uploads/2023/03/homestay-pho-co-ha-noi-17.jpg", isPrimary: true },
      ],
    },
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Tạo JSON đầy đủ
    const payload = {
      bookingInfo,
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
    alert("Đã tạo JSON booking! Xem console log để kiểm tra.");
  };
  const user = {
        "userId": 1,
        "name": "Nguyễn Văn A",
        "email": "nguyenvana@example.com",
        "phone": "0901234567"
    };
  return (
    <div className="container my-4">
      <div className="row g-4">
        {/* LEFT: Form */}
        <div className="col-md-8">
            <BookingCustomerInfo user={user } />
          <div className="card shadow-sm">
            <div className="card-body">
                
              {/* <form onSubmit={handleSubmit}>
                <h5>Yêu cầu đặc biệt</h5>
                <div className="mb-2">
                  <label className="form-label">Quy định hút thuốc:</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="smokingPreference"
                        value="non_smoking"
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Không hút thuốc</label>
                    </div>
                    <div className="form-check form-check-inline">
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

                <div className="mb-3">
                  <label className="form-label">Loại giường:</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        type="radio"
                        className="form-check-input"
                        name="bedPreference"
                        value="double_bed"
                        onChange={handleChange}
                      />
                      <label className="form-check-label">Giường đôi</label>
                    </div>
                    <div className="form-check form-check-inline">
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

                <div className="mb-3">
                  <label className="form-label">Ghi chú khác (nếu có):</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="form-control"
                    rows={3}
                    placeholder="Ví dụ: Cần tầng cao, gần cửa sổ view phố..."
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-3">
                  Kế tiếp: Bước cuối cùng
                </button>
              </form> */}
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
                    <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-semibold">
                    Kế tiếp: Bước cuối cùng
                    </button>
                </form>
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
              src={bookingInfo.homestay.images[0].url}
              alt={bookingInfo.homestay.name}
              className="card-img-top"
              style={{ height: "200px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5>{bookingInfo.homestay.name}</h5>
              <p className="text-muted">{bookingInfo.homestay.address}</p>
              <hr />
              <p>
                <strong>Nhận phòng:</strong> {bookingInfo.checkIn}
                <br />
                <strong>Trả phòng:</strong> {bookingInfo.checkOut}
                <br />
                <strong>Số đêm:</strong> {bookingInfo.nights}
              </p>
              <p className="fw-bold text-success">
                Tổng tiền: {bookingInfo.totalPrice.toLocaleString()} VND
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
