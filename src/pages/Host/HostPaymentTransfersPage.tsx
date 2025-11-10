import { useEffect, useState } from "react";
import { fetchPaymentTransfers } from "@/api/hostApi";
import type { PaymentTransfer } from "@/types/host";
import { showAlert } from "@/utils/showAlert";
import { FaEye, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

const HostPaymentTransfersPage = () => {
  const [payments, setPayments] = useState<PaymentTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const data = await fetchPaymentTransfers();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách thanh toán", "danger");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    if (filter === "all") return true;
    return p.status === filter;
  });

  const totalAmount = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const completedAmount = filteredPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = filteredPayments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

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
          <h1>Quản lý Thanh toán</h1>
          <p>Theo dõi các giao dịch chuyển khoản từ hệ thống</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h4>Tổng thanh toán</h4>
              <p className="stat-value">{totalAmount.toLocaleString("vi-VN")} ₫</p>
              <p className="stat-detail">{filteredPayments.length} giao dịch</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <FaCheckCircle />
            </div>
            <div className="stat-content">
              <h4>Đã hoàn tất</h4>
              <p className="stat-value">
                {completedAmount.toLocaleString("vi-VN")} ₫
              </p>
              <p className="stat-detail">
                {filteredPayments.filter((p) => p.status === "completed").length}{" "}
                giao dịch
              </p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-yellow">
              <FaClock />
            </div>
            <div className="stat-content">
              <h4>Chờ xử lý</h4>
              <p className="stat-value">{pendingAmount.toLocaleString("vi-VN")} ₫</p>
              <p className="stat-detail">
                {filteredPayments.filter((p) => p.status === "pending").length}{" "}
                giao dịch
              </p>
            </div>
          </div>
        </div>

        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">Danh sách Thanh toán</h3>
            <div className="filters-bar">
              <select
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="all">Tất cả</option>
                <option value="completed">Hoàn tất</option>
                <option value="pending">Chờ xử lý</option>
                <option value="failed">Thất bại</option>
              </select>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="empty-state">
              <h3>Không có thanh toán nào</h3>
              <p>Chưa có giao dịch thanh toán nào phù hợp</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID Giao dịch</th>
                  <th>ID Đặt phòng</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày thanh toán</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id}>
                    <td>#{payment.id}</td>
                    <td>#{payment.bookingId}</td>
                    <td>
                      <strong>{payment.amount.toLocaleString("vi-VN")} ₫</strong>
                    </td>
                    <td>
                      <span className={`status-badge ${payment.status}`}>
                        {payment.status === "completed" && (
                          <>
                            <FaCheckCircle /> Hoàn tất
                          </>
                        )}
                        {payment.status === "pending" && (
                          <>
                            <FaClock /> Chờ xử lý
                          </>
                        )}
                        {payment.status === "failed" && (
                          <>
                            <FaTimesCircle /> Thất bại
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      {payment.transferredAt
                        ? new Date(payment.transferredAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>
                    <td>
                      {payment.errorMessage ? (
                        <span style={{ color: "#ef4444", fontSize: "13px" }}>
                          {payment.errorMessage}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn action-btn-view"
                          title="Xem chi tiết"
                        >
                          <FaEye />
                        </button>
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

export default HostPaymentTransfersPage;
