import React from "react";
import { Link, useNavigate } from "react-router-dom";
import BookingStatusBadge from "./BookingStatusBadge";

interface Props {
  homestayId: number;
  homestayName: string;
  bookingStatus: string;
  imageUrl?: string; // thêm thuộc tính tùy chọn cho ảnh
}

const BookingHeader: React.FC<Props> = ({
  homestayId,
  homestayName,
  bookingStatus,
  imageUrl,
}) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link
          to="/bookings"
          className="btn btn-light border rounded-pill px-3 shadow-sm"
        >
          ← Quay lại danh sách
        </Link>
        <button
          className="btn btn-outline-primary rounded-pill px-3 shadow-sm"
          onClick={() => navigate(`/homestays/${homestayId}`)}
        >
          Xem chi tiết homestay →
        </button>
      </div>

      {/* Ảnh homestay */}
      <div className="position-relative rounded-4 overflow-hidden shadow-sm border">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={homestayName}
            className="w-100 h-100 object-fit-cover object-position-center"
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center text-muted"
            style={{ height: 320 }}
          >
            Không có ảnh homestay
          </div>
        )}

        {/* Badge trạng thái */}
        <div className="position-absolute top-0 end-0 m-3">
          <BookingStatusBadge status={bookingStatus} />
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
