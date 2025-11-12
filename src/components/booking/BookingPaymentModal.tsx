import { useState, useEffect } from "react";

interface BookingPaymentModalProps {
  show: boolean;
  onClose: () => void;
  bookingInfo: {
    homestayName: string;
    totalPrice: number;
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  onConfirm: (data: { code: string; method: string; finalPrice: number }) => void;
}

const BookingPaymentModal: React.FC<BookingPaymentModalProps> = ({
  show,
  onClose,
  bookingInfo,
  onConfirm,
}) => {
  const [code, setCode] = useState("");
  const [method, setMethod] = useState("bank");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!show) {
      setCode("");
      setDiscount(0);
      setMethod("bank");
    }
  }, [show]);

  const handleCodeChange = (value: string) => {
    setCode(value);
    const codeUpper = value.trim().toUpperCase();
    if (codeUpper === "MX50") setDiscount(0.5);
    else if (codeUpper === "MX20") setDiscount(0.2);
    else if (codeUpper === "MX70") setDiscount(0.7);
    else if (codeUpper === "MX100") setDiscount(1);
    else setDiscount(0);
  };

  const finalPrice = bookingInfo.totalPrice * (1 - discount);

  const handleConfirm = () => {
    onConfirm({ code, method, finalPrice });
  };

  const fmtDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("vi-VN") : "";

  return (
    <div
      className={`modal ${show ? "show" : "fade"}`}
      style={{
        display: show ? "block" : "none",
        backgroundColor: show ? "rgba(0,0,0,0.5)" : "transparent",
      }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Xác nhận thanh toán</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p><strong>Homestay:</strong> {bookingInfo.homestayName}</p>
            <p><strong>Thời gian:</strong> {fmtDate(bookingInfo.checkIn)} → {fmtDate(bookingInfo.checkOut)}</p>
            <p><strong>Số đêm:</strong> {bookingInfo.nights}</p>

            <p className="fw-bold mb-1">
              Tổng tiền gốc: {bookingInfo.totalPrice.toLocaleString("vi-VN")} ₫
            </p>

            {discount > 0 && (
              <p className="text-success mb-1">Giảm giá: {discount * 100}%</p>
            )}

            <p className="text-primary fw-bold fs-5">
              Thành tiền: {finalPrice.toLocaleString("vi-VN")} ₫
            </p>

            <div className="mb-3">
              <label className="form-label fw-semibold">Phương thức thanh toán</label>
              <select
                className="form-select"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="bank">Chuyển khoản ngân hàng</option>
                <option value="momo">Ví MoMo</option>
                <option value="zalo">ZaloPay</option>
                <option value="credit">Thẻ tín dụng</option>
              </select>
            </div>

            <div>
              <label className="form-label fw-semibold">Mã thanh toán</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập mã thanh toán..."
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
            <button className="btn btn-primary" onClick={handleConfirm}>Xác nhận thanh toán</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPaymentModal;
