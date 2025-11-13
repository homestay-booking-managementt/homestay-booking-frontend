/* eslint-disable prettier/prettier */
import { Booking } from "@/types/booking";
import { Link } from "react-router-dom";

const fmtDate = (iso: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};
const toVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    n
  );
// ======================
// Booking Badge theo trạng thái
// ======================
const StatusBadge: React.FC<{ status: Booking["status"] }> = ({ status }) => {
  const map: Record<Booking["status"], string> = {
    pending: "warning",
    confirmed: "primary",
    paid: "info",
    checked_in: "info",
    checked_out: "secondary",
    cancelled: "danger",
    refunded: "dark",
    completed: "success",
  };
  const labelMap: Record<Booking["status"], string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    paid: "Đã thanh toán",
    checked_in: "Đã nhận phòng",
    checked_out: "Đã trả phòng",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
    completed: "Hoàn tất",
  };
  return (
    <span className={`badge badge-status bg-${map[status]}`}>{labelMap[status]}</span>
  );
};

export const BookingCard: React.FC<{ b: Booking }> = ({ b }) => {
  return (
    
    <Link to={`/bookings/${b.bookingId}`} className="text-decoration-none text-reset">
  <div className="booking-card h-100">
      {b.homestay.primaryImageUrl && (
        <div className="ratio ratio-16x9">
          <img
            src={b.homestay.primaryImageUrl}
            alt={b.homestay.name}
            className="w-100 h-100"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}

      <div className="p-3">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <h5 className="mb-0">{b.homestay.name}</h5>
          <StatusBadge status={b.status} />
        </div>
        <div className="text-muted mb-2">{b.homestay.city}</div>

        <div className="small mb-2">
          <i className="bi bi-calendar3 me-1" />
          <strong>{fmtDate(b.checkIn)}</strong> → <strong>{fmtDate(b.checkOut)}</strong>
          <span className="ms-2">({b.nights} đêm)</span>
        </div>

        <div className="fw-semibold mb-2">
          <i className="bi bi-cash-coin me-1" />
          {toVND(b.totalPrice)}
        </div>

        <div className="text-secondary small">
          Tạo lúc: {fmtDate(b.createdAt)}
        </div>
      </div>
    </div>
    </Link>
  );
};
