import { useEffect, useState } from "react";
import {
  fetchHostBookingRequests,
  confirmBookingRequest,
  rejectBookingRequest,
} from "@/api/hostApi";
import type { HostBookingRequest, HostBookingConfirmPayload } from "@/types/host";
import { showAlert } from "@/utils/showAlert";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

const HostBookingRequestsPage = () => {
  const [bookings, setBookings] = useState<HostBookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const data = await fetchHostBookingRequests();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách đặt phòng", "danger");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: number) => {
    if (!window.confirm("Xác nhận đặt phòng này?")) return;
    try {
      const payload: HostBookingConfirmPayload = {
        status: "confirmed",
        message: "Đặt phòng đã được xác nhận",
      };
      await confirmBookingRequest(bookingId, payload);
      showAlert("Xác nhận đặt phòng thành công", "success");
      loadBookings();
    } catch (error) {
      showAlert("Không thể xác nhận đặt phòng", "danger");
    }
  };

  const handleReject = async (bookingId: number) => {
    const reason = window.prompt("Lý do từ chối:");
    if (!reason) return;
    try {
      const payload: HostBookingConfirmPayload = {
        status: "rejected",
        message: reason,
      };
      await rejectBookingRequest(bookingId, payload);
      showAlert("Từ chối đặt phòng thành công", "success");
      loadBookings();
    } catch (error) {
      showAlert("Không thể từ chối đặt phòng", "danger");
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;
    return b.status === filter;
  });

  if (loading) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="loading-state">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{hostCommonStyles}</style>
      <div className="host-page">
        <div className="page-header">
          <h1>Yêu cầu Đặt phòng</h1>
          <p>Quản lý các yêu cầu đặt phòng từ khách hàng</p>
        </div>

        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">Danh sách Đặt phòng</h3>
            <div className="filters-bar">
              <select
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="all">Tất cả</option>
                <option value="pending">Chờ xử lý</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="completed">Hoàn thành</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="empty-state">
              <h3>Không có đặt phòng nào</h3>
              <p>Chưa có yêu cầu đặt phòng nào phù hợp</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Homestay</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Số khách</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <div>
                        <strong>{booking.guestName}</strong>
                        <br />
                        <small style={{ color: "#64748b" }}>
                          {booking.guestEmail}
                        </small>
                      </div>
                    </td>
                    <td>{booking.homestayName}</td>
                    <td>{new Date(booking.checkIn).toLocaleDateString("vi-VN")}</td>
                    <td>{new Date(booking.checkOut).toLocaleDateString("vi-VN")}</td>
                    <td>{booking.numGuests} người</td>
                    <td>{booking.totalPrice.toLocaleString("vi-VN")} ₫</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status === "pending"
                          ? "Chờ xử lý"
                          : booking.status === "confirmed"
                            ? "Đã xác nhận"
                            : booking.status === "completed"
                              ? "Hoàn thành"
                              : booking.status === "canceled" || booking.status === "cancelled"
                                ? "Đã hủy"
                                : "Đã từ chối"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-view"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
                        {booking.status === "pending" && (
                          <>
                            <button
                              className="action-btn action-btn-confirm"
                              onClick={() => handleConfirm(booking.id)}
                              title="Xác nhận"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="action-btn action-btn-delete"
                              onClick={() => handleReject(booking.id)}
                              title="Từ chối"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default HostBookingRequestsPage;
