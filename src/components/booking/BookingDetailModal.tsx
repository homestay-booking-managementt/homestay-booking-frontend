import { useEffect, useState } from "react";
import { FaTimes, FaCalendarAlt, FaUser, FaHome, FaCreditCard, FaSpinner, FaBed, FaBath, FaUsers, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import { fetchBookingDetail } from "@/api/adminApi";
import type { BookingDetail } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { formatCurrency } from "@/utils/bookingUtils";

interface BookingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: number | null;
}

const BookingDetailModal = ({ isOpen, onClose, bookingId }: BookingDetailModalProps) => {
  const [bookingDetail, setBookingDetail] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch booking detail when modal opens
  useEffect(() => {
    if (isOpen && bookingId) {
      loadBookingDetail();
    }
  }, [isOpen, bookingId]);

  const loadBookingDetail = async () => {
    if (!bookingId) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookingDetail(bookingId);
      setBookingDetail(data);
    } catch (error: any) {
      const errorMessage = error?.message || "Không thể tải chi tiết đặt phòng. Vui lòng thử lại.";
      setError(errorMessage);
      showAlert(errorMessage, "danger");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !bookingId) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return `${date.toLocaleDateString("vi-VN")} ${date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`;
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-section">
            <h2 id="modal-title">Chi tiết đặt phòng #{bookingId}</h2>
            {bookingDetail && (
              <span className={`status-badge ${bookingDetail.status.toLowerCase()}`}>
                {bookingDetail.status}
              </span>
            )}
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Đóng modal"
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {loading ? (
            <div className="loading-state">
              <FaSpinner className="spinner" />
              <p>Đang tải thông tin...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p className="error-message">{error}</p>
              <button className="btn-retry" onClick={loadBookingDetail}>
                Thử lại
              </button>
            </div>
          ) : bookingDetail ? (
            <>
            {/* Hero Banner with Key Info */}
            <div className="hero-banner">
              <div className="hero-content">
                <div className="hero-main">
                  <div className="hero-icon-wrapper">
                    <FaHome className="hero-icon" />
                  </div>
                  <div className="hero-text">
                    <h3 className="hero-title">{bookingDetail.homestayName || "N/A"}</h3>
                    <p className="hero-subtitle">{bookingDetail.homestayCity || "N/A"}</p>
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat-box">
                    <FaCalendarAlt className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-value">{bookingDetail.nights || 0}</span>
                      <span className="stat-label">đêm</span>
                    </div>
                  </div>
                  <div className="stat-box highlight">
                    <FaCreditCard className="stat-icon" />
                    <div className="stat-content">
                      <span className="stat-value">{formatCurrency(bookingDetail.totalPrice || 0)}</span>
                      <span className="stat-label">Tổng tiền</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information - Full Width */}
            <div className="full-width-section">
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon-wrapper booking">
                    <FaCalendarAlt />
                  </div>
                  <h3>Thông tin đặt phòng</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Mã đặt phòng</span>
                    <span className="value">#{bookingDetail.id}</span>
                  </div>
                  {bookingDetail.createdAt && (
                    <div className="info-row">
                      <span className="label">Ngày đặt</span>
                      <span className="value">{formatDateTime(bookingDetail.createdAt)}</span>
                    </div>
                  )}
                  <div className="date-range-box">
                    <div className="date-item">
                      <span className="date-label">Check-in</span>
                      <span className="date-value">{formatDate(bookingDetail.checkIn)}</span>
                      {bookingDetail.checkInTime && <span className="time-value">{bookingDetail.checkInTime}</span>}
                    </div>
                    <div className="date-arrow">→</div>
                    <div className="date-item">
                      <span className="date-label">Check-out</span>
                      <span className="date-value">{formatDate(bookingDetail.checkOut)}</span>
                      {bookingDetail.checkOutTime && <span className="time-value">{bookingDetail.checkOutTime}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Two Column Layout - Guest & Owner */}
            <div className="two-column-grid">
              {/* Guest Information Card */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon-wrapper guest">
                    <FaUser />
                  </div>
                  <h3>Thông tin khách hàng</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Tên khách</span>
                    <span className="value">{bookingDetail.guestName || bookingDetail.userName || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email</span>
                    <span className="value">
                      {(bookingDetail.guestEmail || bookingDetail.userEmail) ? (
                        <a href={`mailto:${bookingDetail.guestEmail || bookingDetail.userEmail}`} className="contact-link">
                          <FaEnvelope className="link-icon" />
                          {bookingDetail.guestEmail || bookingDetail.userEmail}
                        </a>
                      ) : "N/A"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="label">Số điện thoại</span>
                    <span className="value">
                      {(bookingDetail.guestPhone || bookingDetail.userPhone || bookingDetail.phone) ? (
                        <a href={`tel:${bookingDetail.guestPhone || bookingDetail.userPhone || bookingDetail.phone}`} className="contact-link">
                          <FaPhone className="link-icon" />
                          {bookingDetail.guestPhone || bookingDetail.userPhone || bookingDetail.phone}
                        </a>
                      ) : "N/A"}
                    </span>
                  </div>
                  {bookingDetail.guestAddress && (
                    <div className="info-row">
                      <span className="label">Địa chỉ</span>
                      <span className="value">{bookingDetail.guestAddress}</span>
                    </div>
                  )}
                  {(bookingDetail.numberOfGuests || bookingDetail.numberOfAdults || bookingDetail.numberOfChildren) && (
                    <div className="info-row">
                      <span className="label">Số lượng khách</span>
                      <span className="value">
                        <FaUsers className="inline-icon" />
                        {bookingDetail.numberOfGuests ? `${bookingDetail.numberOfGuests} khách` : 
                         `${bookingDetail.numberOfAdults || 0} người lớn${bookingDetail.numberOfChildren ? `, ${bookingDetail.numberOfChildren} trẻ em` : ''}`}
                      </span>
                    </div>
                  )}
                  {bookingDetail.specialRequests && (
                    <div className="special-requests">
                      <span className="label">Yêu cầu đặc biệt</span>
                      <p className="request-text">{bookingDetail.specialRequests}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Owner Information Card */}
              {(bookingDetail.ownerName || bookingDetail.ownerEmail || bookingDetail.ownerPhone) && (
                <div className="info-card owner-card">
                  <div className="card-header owner-header-card">
                    <div className="card-icon-wrapper owner">
                      <FaUser />
                    </div>
                    <h3>Thông tin chủ nhà</h3>
                  </div>
                  <div className="card-body">
                    {bookingDetail.ownerName && (
                      <div className="info-row">
                        <span className="label">Tên</span>
                        <span className="value">{bookingDetail.ownerName}</span>
                      </div>
                    )}
                    {bookingDetail.ownerEmail && (
                      <div className="info-row">
                        <span className="label">Email</span>
                        <span className="value">
                          <a href={`mailto:${bookingDetail.ownerEmail}`} className="contact-link">
                            <FaEnvelope className="link-icon" />
                            {bookingDetail.ownerEmail}
                          </a>
                        </span>
                      </div>
                    )}
                    {bookingDetail.ownerPhone && (
                      <div className="info-row">
                        <span className="label">SĐT</span>
                        <span className="value">
                          <a href={`tel:${bookingDetail.ownerPhone}`} className="contact-link">
                            <FaPhone className="link-icon" />
                            {bookingDetail.ownerPhone}
                          </a>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment & Homestay - Full Width */}
            <div className="full-width-section">
              {/* Payment Information Card */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon-wrapper payment">
                    <FaCreditCard />
                  </div>
                  <h3>Thanh toán</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Phương thức</span>
                    <span className="value">{bookingDetail.paymentMethod || "N/A"}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Trạng thái</span>
                    <span className="value">{bookingDetail.paymentStatus || "N/A"}</span>
                  </div>
                  <div className="payment-total">
                    <span className="total-label">Tổng thanh toán</span>
                    <span className="total-value">{formatCurrency(bookingDetail.totalPrice || 0)}</span>
                  </div>
                </div>
              </div>
              {/* Homestay Information Card - Full Width */}
              <div className="info-card">
                <div className="card-header">
                  <div className="card-icon-wrapper homestay">
                    <FaHome />
                  </div>
                  <h3>Thông tin homestay</h3>
                </div>
                <div className="card-body">
                  <div className="info-row">
                    <span className="label">Tên homestay</span>
                    <span className="value">{bookingDetail.homestayName || "N/A"}</span>
                  </div>
                  {bookingDetail.homestayType && (
                    <div className="info-row">
                      <span className="label">Loại hình</span>
                      <span className="value">{bookingDetail.homestayType}</span>
                    </div>
                  )}
                  {bookingDetail.homestayAddress && (
                    <div className="info-row">
                      <span className="label">Địa chỉ</span>
                      <span className="value">
                        <FaMapMarkerAlt className="inline-icon" />
                        {bookingDetail.homestayAddress}
                      </span>
                    </div>
                  )}
                  {bookingDetail.homestayWard && (
                    <div className="info-row">
                      <span className="label">Phường/Xã</span>
                      <span className="value">{bookingDetail.homestayWard}</span>
                    </div>
                  )}
                  {bookingDetail.homestayDistrict && (
                    <div className="info-row">
                      <span className="label">Quận/Huyện</span>
                      <span className="value">{bookingDetail.homestayDistrict}</span>
                    </div>
                  )}
                  {bookingDetail.homestayCity && (
                    <div className="info-row">
                      <span className="label">Thành phố</span>
                      <span className="value">{bookingDetail.homestayCity}</span>
                    </div>
                  )}
                  
                  {(bookingDetail.homestayNumRooms || bookingDetail.homestayBathroomCount || bookingDetail.homestayCapacity) && (
                    <div className="amenities-grid">
                      {bookingDetail.homestayCapacity && (
                        <div className="amenity-item">
                          <FaUsers className="amenity-icon" />
                          <span>{bookingDetail.homestayCapacity} khách</span>
                        </div>
                      )}
                      {bookingDetail.homestayNumRooms && (
                        <div className="amenity-item">
                          <FaBed className="amenity-icon" />
                          <span>{bookingDetail.homestayNumRooms} phòng ngủ</span>
                        </div>
                      )}
                      {bookingDetail.homestayBathroomCount && (
                        <div className="amenity-item">
                          <FaBath className="amenity-icon" />
                          <span>{bookingDetail.homestayBathroomCount} phòng tắm</span>
                        </div>
                      )}
                    </div>
                  )}

                  {bookingDetail.homestayBasePrice && (
                    <div className="price-per-night">
                      <span className="price-label">Giá/đêm</span>
                      <span className="price-value">{formatCurrency(bookingDetail.homestayBasePrice)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </>
          ) : null}
        </div>

      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          overflow-y: auto;
        }

        .modal-container {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .modal-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .modal-title-section h2 {
          margin: 0;
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .modal-close-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          border: none;
          border-radius: 8px;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 18px;
        }

        .modal-close-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 0;
        }

        /* Hero Banner */
        .hero-banner {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 32px 24px;
          color: white;
        }

        .hero-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .hero-main {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .hero-icon-wrapper {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .hero-icon {
          font-size: 28px;
        }

        .hero-text {
          flex: 1;
        }

        .hero-title {
          margin: 0 0 4px 0;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.3;
        }

        .hero-subtitle {
          margin: 0;
          font-size: 14px;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          gap: 16px;
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          padding: 16px 20px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 140px;
        }

        .stat-box.highlight {
          background: rgba(255, 255, 255, 0.25);
        }

        .stat-icon {
          font-size: 24px;
          opacity: 0.9;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 12px;
          opacity: 0.9;
        }

        /* Full Width Section */
        .full-width-section {
          padding: 0 24px;
          margin-bottom: 20px;
        }

        .full-width-section:first-child {
          padding-top: 24px;
        }

        /* Two Column Grid */
        .two-column-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 0 24px;
          margin-bottom: 20px;
        }

        /* Info Cards */
        .info-card {
          background: white;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .info-card:hover {
          border-color: #8b5cf6;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
          border-bottom: 2px solid #e5e7eb;
        }

        .card-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
        }

        .card-icon-wrapper.booking {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
        }

        .card-icon-wrapper.guest {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
        }

        .card-icon-wrapper.payment {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        .card-icon-wrapper.homestay {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }

        .card-icon-wrapper.owner {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }

        /* Owner Card Styling */
        .owner-card {
          border-color: #86efac;
        }

        .owner-card:hover {
          border-color: #10b981;
        }

        .owner-header-card {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }

        .owner-card .card-body {
          background: #f0fdf4;
        }

        .owner-card .info-row {
          border-bottom-color: #d1fae5;
        }

        .owner-card .label {
          color: #166534;
        }

        .owner-card .value {
          color: #166534;
          font-weight: 600;
        }

        .owner-card .contact-link {
          color: #059669;
        }

        .owner-card .contact-link:hover {
          background: #d1fae5;
          color: #047857;
        }

        .card-header h3 {
          margin: 0;
          font-size: 17px;
          font-weight: 700;
          color: #1f2937;
        }

        .card-body {
          padding: 20px;
        }

        /* Info Rows */
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
          gap: 16px;
        }

        .info-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-row:first-child {
          padding-top: 0;
        }

        .info-row .label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
        }

        .info-row .value {
          font-size: 14px;
          font-weight: 500;
          color: #1f2937;
          text-align: right;
          word-break: break-word;
        }

        /* Contact Links */
        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #8b5cf6;
          text-decoration: none;
          transition: all 0.2s;
          padding: 4px 8px;
          border-radius: 6px;
          margin: -4px -8px;
        }

        .contact-link:hover {
          background: #f3e8ff;
          color: #7c3aed;
        }

        .link-icon {
          font-size: 12px;
        }

        .inline-icon {
          font-size: 12px;
          margin-right: 6px;
          color: #8b5cf6;
        }

        /* Date Range Box */
        .date-range-box {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 12px;
          margin-top: 12px;
        }

        .date-item {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .date-label {
          font-size: 11px;
          font-weight: 600;
          color: #6b21a8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .date-value {
          font-size: 15px;
          font-weight: 700;
          color: #5b21b6;
        }

        .time-value {
          font-size: 13px;
          color: #7c3aed;
          font-weight: 500;
        }

        .date-arrow {
          font-size: 20px;
          color: #8b5cf6;
          font-weight: 700;
        }

        /* Special Requests */
        .special-requests {
          margin-top: 12px;
          padding: 16px;
          background: #fef3c7;
          border-radius: 10px;
          border-left: 4px solid #f59e0b;
        }

        .special-requests .label {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #92400e;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .request-text {
          margin: 0;
          font-size: 14px;
          color: #78350f;
          line-height: 1.6;
        }

        /* Payment Total */
        .payment-total {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-radius: 12px;
          margin-top: 12px;
        }

        .total-label {
          font-size: 13px;
          font-weight: 700;
          color: #065f46;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .total-value {
          font-size: 20px;
          font-weight: 800;
          color: #047857;
        }

        /* Amenities Grid */
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 12px;
          margin-top: 12px;
        }

        .amenity-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          background: #f3f4f6;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .amenity-icon {
          font-size: 16px;
          color: #8b5cf6;
        }

        /* Price Per Night */
        .price-per-night {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #fef3c7;
          border-radius: 10px;
          margin-top: 12px;
        }

        .price-label {
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
        }

        .price-value {
          font-size: 16px;
          font-weight: 700;
          color: #78350f;
        }

        /* Owner Info */
        .owner-info {
          margin-top: 20px;
          padding: 0;
          background: #f0fdf4;
          border-radius: 12px;
          border: 2px solid #86efac;
          overflow: hidden;
        }

        .owner-header {
          font-size: 14px;
          font-weight: 700;
          color: #166534;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          margin: 0;
          padding: 14px 20px;
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border-bottom: 2px solid #86efac;
        }

        .owner-info .info-row {
          padding: 14px 20px;
          border-bottom-color: #d1fae5;
          margin: 0;
        }

        .owner-info .info-row:last-child {
          border-bottom: none;
        }

        .owner-info .label {
          font-size: 12px;
          font-weight: 600;
          color: #166534;
        }

        .owner-info .value {
          color: #166534;
          font-weight: 600;
        }

        .owner-info .contact-link {
          color: #059669;
        }

        .owner-info .contact-link:hover {
          background: #d1fae5;
          color: #047857;
        }



        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }

        .spinner {
          font-size: 32px;
          color: #8b5cf6;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state p {
          margin: 0;
          color: #6b7280;
          font-size: 15px;
        }

        .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          gap: 16px;
        }

        .error-message {
          margin: 0;
          color: #dc2626;
          font-size: 15px;
          text-align: center;
        }

        .btn-retry {
          padding: 10px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-retry:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }



        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.confirmed {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.cancelled {
          background: #fee2e2;
          color: #991b1b;
        }

        /* Dark Mode */
        .dark .modal-container {
          background: #1e293b;
        }

        .dark .modal-header {
          border-bottom-color: #334155;
        }

        .dark .modal-title-section h2 {
          color: #f1f5f9;
        }

        .dark .modal-close-btn {
          background: #0f172a;
          color: #94a3b8;
        }

        .dark .modal-close-btn:hover {
          background: #334155;
          color: #cbd5e1;
        }

        .dark .hero-banner {
          background: linear-gradient(135deg, #4c1d95 0%, #5b21b6 100%);
        }

        .dark .info-card {
          background: #0f172a;
          border-color: #334155;
        }

        .dark .info-card:hover {
          border-color: #8b5cf6;
        }

        .dark .card-header {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          border-bottom-color: #334155;
        }

        .dark .card-header h3 {
          color: #f1f5f9;
        }

        .dark .info-row {
          border-bottom-color: #1e293b;
        }

        .dark .info-row .label {
          color: #94a3b8;
        }

        .dark .info-row .value {
          color: #e2e8f0;
        }

        .dark .contact-link:hover {
          background: #1e293b;
        }

        .dark .date-range-box {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
        }

        .dark .date-label {
          color: #a78bfa;
        }

        .dark .date-value {
          color: #c4b5fd;
        }

        .dark .time-value {
          color: #a78bfa;
        }

        .dark .special-requests {
          background: #422006;
          border-left-color: #f59e0b;
        }

        .dark .special-requests .label {
          color: #fbbf24;
        }

        .dark .request-text {
          color: #fcd34d;
        }

        .dark .payment-total {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
        }

        .dark .total-label {
          color: #6ee7b7;
        }

        .dark .total-value {
          color: #a7f3d0;
        }

        .dark .amenity-item {
          background: #1e293b;
          color: #cbd5e1;
        }

        .dark .price-per-night {
          background: #422006;
        }

        .dark .price-label {
          color: #fbbf24;
        }

        .dark .price-value {
          color: #fcd34d;
        }

        .dark .owner-info {
          background: #064e3b;
          border-color: #047857;
        }

        .dark .owner-header {
          color: #6ee7b7;
          background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
          border-bottom-color: #047857;
        }

        .dark .owner-info .info-row {
          border-bottom-color: #065f46;
        }

        .dark .owner-info .label {
          color: #6ee7b7;
        }

        .dark .owner-info .value {
          color: #a7f3d0;
        }

        .dark .owner-info .contact-link {
          color: #34d399;
        }

        .dark .owner-info .contact-link:hover {
          background: #065f46;
          color: #6ee7b7;
        }

        /* Dark Mode - Owner Card */
        .dark .owner-card {
          background: #064e3b;
          border-color: #047857;
        }

        .dark .owner-card:hover {
          border-color: #10b981;
        }

        .dark .owner-header-card {
          background: linear-gradient(135deg, #064e3b 0%, #065f46 100%);
        }

        .dark .owner-card .card-body {
          background: #064e3b;
        }

        .dark .owner-card .info-row {
          border-bottom-color: #065f46;
        }

        .dark .owner-card .label {
          color: #6ee7b7;
        }

        .dark .owner-card .value {
          color: #a7f3d0;
        }

        .dark .owner-card .contact-link {
          color: #34d399;
        }

        .dark .owner-card .contact-link:hover {
          background: #065f46;
          color: #6ee7b7;
        }

        .dark .loading-state p {
          color: #94a3b8;
        }

        .dark .error-message {
          color: #f87171;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 0;
            align-items: flex-end;
          }

          .modal-container {
            max-width: 100%;
            max-height: 95vh;
            border-radius: 16px 16px 0 0;
            animation: modalSlideUp 0.3s ease-out;
          }

          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(100%);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .modal-header {
            padding: 20px;
          }

          .modal-title-section h2 {
            font-size: 20px;
          }

          .modal-body {
            padding: 0;
          }

          .hero-banner {
            padding: 24px 20px;
          }

          .hero-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .hero-main {
            width: 100%;
          }

          .hero-icon-wrapper {
            width: 48px;
            height: 48px;
          }

          .hero-icon {
            font-size: 24px;
          }

          .hero-title {
            font-size: 18px;
          }

          .hero-subtitle {
            font-size: 13px;
          }

          .hero-stats {
            width: 100%;
            flex-direction: column;
            gap: 12px;
          }

          .stat-box {
            width: 100%;
            min-width: auto;
          }

          .full-width-section {
            padding: 0 20px;
            margin-bottom: 16px;
          }

          .full-width-section:first-child {
            padding-top: 20px;
          }

          .two-column-grid {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 0 20px;
            margin-bottom: 16px;
          }

          .info-card {
            border-radius: 12px;
          }

          .card-header {
            padding: 16px;
          }

          .card-icon-wrapper {
            width: 36px;
            height: 36px;
            font-size: 16px;
          }

          .card-header h3 {
            font-size: 16px;
          }

          .card-body {
            padding: 16px;
          }

          .info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .info-row .value {
            text-align: left;
          }

          .date-range-box {
            flex-direction: column;
            gap: 12px;
          }

          .date-arrow {
            transform: rotate(90deg);
          }

          .amenities-grid {
            grid-template-columns: 1fr;
          }

          .modal-footer {
            padding: 16px 20px;
            flex-direction: column-reverse;
          }

          .btn-secondary,
          .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingDetailModal;
