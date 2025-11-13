// import type { AdminBookingSummary } from "@/types/admin";
// import { formatCurrency } from "@/utils/bookingUtils";
// import { FaCalendarAlt, FaArrowRight } from "react-icons/fa";

// interface BookingCardProps {
//   booking: AdminBookingSummary;
//   onClick?: () => void;
// }
// Map trạng thái sang tiếng Việt
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Hoàn tất",
  CANCELLED: "Đã hủy",
  CANCELED: "Đã hủy",
  PAID: "Đã thanh toán",
  CHECKED_IN: "Đã nhận phòng",
  CHECKED_OUT: "Đã trả phòng",
  REFUNDED: "Đã hoàn tiền",
  // Lowercase versions
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  completed: "Hoàn tất",
  cancelled: "Đã hủy",
  canceled: "Đã hủy",
  paid: "Đã thanh toán",
  checked_in: "Đã nhận phòng",
  checked_out: "Đã trả phòng",
  refunded: "Đã hoàn tiền",
};

interface BookingCardProps {
  booking: AdminBookingSummary;
  onClick?: () => void;
}

// const BookingCard = ({ booking, onClick }: BookingCardProps) => {
//   const getStatusClass = (status: string) => {
//     return status.toLowerCase();
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && onClick) {
//       onClick();
//     }
//   };

//   return (
//     <div 
//       className="booking-card" 
//       onClick={onClick}
//       onKeyDown={handleKeyDown}
//       tabIndex={0}
//       role="button"
//       aria-label={`Xem chi tiết đặt phòng #${booking.id} tại ${booking.homestayName || "N/A"}`}
//     >
//       <div className="booking-card-header">
//         <span className="booking-id">#{booking.id}</span>
//         <span className={`status-badge ${getStatusClass(booking.status)}`}>
//           {booking.status}
//         </span>
//       </div>

//       <div className="booking-card-body">
//         <h4 className="homestay-name">{booking.homestayName || "N/A"}</h4>
//         <p className="guest-name">{booking.guestName || booking.userName || "N/A"}</p>

//         <div className="booking-dates">
//           <FaCalendarAlt className="date-icon" aria-hidden="true" />
//           <span>
//             {booking.checkIn
//               ? new Date(booking.checkIn).toLocaleDateString("vi-VN")
//               : "N/A"}
//           </span>
//           <FaArrowRight className="arrow-icon" aria-hidden="true" />
//           <span>
//             {booking.checkOut
//               ? new Date(booking.checkOut).toLocaleDateString("vi-VN")
//               : "N/A"}
//           </span>
//           <span className="nights">({booking.nights || 0} đêm)</span>
//         </div>

//         <div className="booking-price">
//           💰 {formatCurrency(booking.totalPrice || 0)}
//         </div>
//       </div>

//       <style>{`
//         .booking-card {
//           background: white;
//           border-radius: 12px;
//           padding: 16px;
//           box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
//           border: 2px solid transparent;
//           transition: all 0.3s ease;
//           cursor: pointer;
//         }

//         .booking-card:hover,
//         .booking-card:focus {
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
//           border-color: #8b5cf6;
//           transform: translateY(-2px);
//           outline: 2px solid #8b5cf6;
//           outline-offset: 2px;
//         }

//         .booking-card-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 12px;
//         }

//         .booking-id {
//           font-size: 14px;
//           font-weight: 700;
//           color: #6b7280;
//           line-height: 1.4;
//         }

//         .booking-card-body {
//           display: flex;
//           flex-direction: column;
//           gap: 8px;
//         }

//         .homestay-name {
//           margin: 0;
//           font-size: 16px;
//           font-weight: 600;
//           color: #1f2937;
//           line-height: 1.4;
//           letter-spacing: -0.01em;
//         }

//         .guest-name {
//           margin: 0;
//           font-size: 14px;
//           color: #6b7280;
//           line-height: 1.5;
//         }

//         .booking-dates {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//           color: #374151;
//           margin-top: 4px;
//           line-height: 1.5;
//         }

//         .date-icon {
//           color: #8b5cf6;
//         }

//         .arrow-icon {
//           font-size: 12px;
//           color: #9ca3af;
//         }

//         .nights {
//           color: #6b7280;
//           font-size: 13px;
//         }

//         .booking-price {
//           font-size: 18px;
//           font-weight: 700;
//           color: #059669;
//           margin-top: 8px;
//           line-height: 1.3;
//           letter-spacing: -0.01em;
//         }

//         .status-badge {
//           display: inline-block;
//           padding: 6px 12px;
//           border-radius: 12px;
//           font-size: 12px;
//           font-weight: 600;
//           line-height: 1.2;
//           letter-spacing: 0.02em;
//         }

//         .status-badge.pending {
//           background: #fef3c7;
//           color: #78350f;
//         }

//         .status-badge.confirmed {
//           background: #dbeafe;
//           color: #1e3a8a;
//         }

//         .status-badge.completed {
//           background: #d1fae5;
//           color: #064e3b;
//         }

//         .status-badge.cancelled {
//           background: #fee2e2;
//           color: #7f1d1d;
//         }

//         /* Dark Mode */
//         .dark .booking-card {
//           background: #1e293b;
//         }

//         .dark .homestay-name {
//           color: #f1f5f9;
//         }

//         .dark .guest-name,
//         .dark .booking-dates {
//           color: #94a3b8;
//         }

//         .dark .booking-id {
//           color: #cbd5e1;
//         }

//         /* Dark mode status badges with improved contrast */
//         .dark .status-badge.pending {
//           background: #92400e;
//           color: #fef3c7;
//         }

//         .dark .status-badge.confirmed {
//           background: #1e3a8a;
//           color: #dbeafe;
//         }

//         .dark .status-badge.completed {
//           background: #064e3b;
//           color: #d1fae5;
//         }

//         .dark .status-badge.cancelled {
//           background: #7f1d1d;
//           color: #fee2e2;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BookingCard;
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

  const getStatusLabel = (status: string) => {
    return STATUS_LABELS[status] || status;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && onClick) {
      onClick();
    }
  };
  return (
    <span className={`badge badge-status bg-${map[status]}`}>{labelMap[status]}</span>
    <div 
      className="booking-card" 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Xem chi tiết đặt phòng #${booking.id} tại ${booking.homestayName || "N/A"}`}
    >
      <div className="booking-card-header">
        <span className="booking-id">#{booking.id}</span>
        <span className={`status-badge ${getStatusClass(booking.status)}`}>
          {getStatusLabel(booking.status)}
        </span>
      </div>

      <div className="booking-card-body">
        <h4 className="homestay-name">{booking.homestayName || "N/A"}</h4>
        <p className="guest-name">{booking.guestName || booking.userName || "N/A"}</p>

        <div className="booking-dates">
          <FaCalendarAlt className="date-icon" aria-hidden="true" />
          <span>
            {booking.checkIn
              ? new Date(booking.checkIn).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
          <FaArrowRight className="arrow-icon" aria-hidden="true" />
          <span>
            {booking.checkOut
              ? new Date(booking.checkOut).toLocaleDateString("vi-VN")
              : "N/A"}
          </span>
          <span className="nights">({booking.nights || 0} đêm)</span>
        </div>

        <div className="booking-price">
          💰 {formatCurrency(booking.totalPrice || 0)}
        </div>
      </div>

      <style>{`
        .booking-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 2px solid transparent;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .booking-card:hover,
        .booking-card:focus {
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: #8b5cf6;
          transform: translateY(-2px);
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }

        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .booking-id {
          font-size: 14px;
          font-weight: 700;
          color: #6b7280;
          line-height: 1.4;
        }

        .booking-card-body {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .homestay-name {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.4;
          letter-spacing: -0.01em;
        }

        .guest-name {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.5;
        }

        .booking-dates {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          margin-top: 4px;
          line-height: 1.5;
        }

        .date-icon {
          color: #8b5cf6;
        }

        .arrow-icon {
          font-size: 12px;
          color: #9ca3af;
        }

        .nights {
          color: #6b7280;
          font-size: 13px;
        }

        .booking-price {
          font-size: 18px;
          font-weight: 700;
          color: #059669;
          margin-top: 8px;
          line-height: 1.3;
          letter-spacing: -0.01em;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: 0.02em;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #78350f;
        }

        .status-badge.confirmed {
          background: #dbeafe;
          color: #1e3a8a;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #064e3b;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #7f1d1d;
        }

        /* Dark Mode */
        .dark .booking-card {
          background: #1e293b;
        }

        .dark .homestay-name {
          color: #f1f5f9;
        }

        .dark .guest-name,
        .dark .booking-dates {
          color: #94a3b8;
        }

        .dark .booking-id {
          color: #cbd5e1;
        }

        /* Dark mode status badges with improved contrast */
        .dark .status-badge.pending {
          background: #92400e;
          color: #fef3c7;
        }

        .dark .status-badge.confirmed {
          background: #1e3a8a;
          color: #dbeafe;
        }

        .dark .status-badge.completed {
          background: #064e3b;
          color: #d1fae5;
        }

        .dark .status-badge.cancelled {
          background: #7f1d1d;
          color: #fee2e2;
        }
      `}</style>
    </div>
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
