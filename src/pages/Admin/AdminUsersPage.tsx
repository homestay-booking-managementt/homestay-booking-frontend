import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "@/api/adminApi";
import type { AdminUser } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import {
  FaUsers,
  FaUserPlus,
  FaSearch,
  FaBan,
  FaCheck,
  FaTimes,
  FaUserCheck,
  FaUserClock,
  FaUserSlash,
} from "react-icons/fa";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CUSTOMER" | "HOST">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [actionType, setActionType] = useState<"activate" | "suspend" | "ban">("activate");
  const [actionReason, setActionReason] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách người dùng", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (user: AdminUser, newStatus: 0 | 1 | 2 | 3) => {
    setSelectedUser(user);
    setActionType(newStatus === 1 ? "activate" : newStatus === 2 ? "suspend" : "ban");
    setShowConfirmDialog(true);
  };

  const confirmAction = async () => {
    if (!selectedUser) return;

    try {
      const newStatus = actionType === "activate" ? 1 : actionType === "suspend" ? 2 : 3;
      await updateUserStatus(selectedUser.id, {
        status: newStatus as 0 | 1 | 2 | 3,
        reason: actionReason || undefined,
      });
      showAlert(
        actionType === "activate"
          ? "Kích hoạt tài khoản thành công"
          : actionType === "suspend"
            ? "Tạm khóa tài khoản thành công"
            : "Chặn tài khoản thành công",
        "success"
      );
      setShowConfirmDialog(false);
      setActionReason("");
      setSelectedUser(null);
      loadUsers();
    } catch (error) {
      showAlert("Không thể cập nhật trạng thái", "danger");
    }
  };

  // Lọc bỏ Admin khỏi danh sách
  const allUsersWithoutAdmin = users.filter((user) => {
    const userRole = user.roles && user.roles.length > 0 ? user.roles[0] : user.role;
    return userRole !== "ADMIN";
  });

  // Apply search và filter
  const filteredUsers = allUsersWithoutAdmin.filter((user) => {
    const userRole = user.roles?.[0] || user.role;
    const matchesFilter = filter === "ALL" || userRole === filter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const totalUsers = allUsersWithoutAdmin.length;
  const activeUsers = allUsersWithoutAdmin.filter((u) => u.status === 1).length;
  const customerCount = allUsersWithoutAdmin.filter((u) => {
    const role = u.roles?.[0] || u.role;
    return role === "CUSTOMER";
  }).length;
  const hostCount = allUsersWithoutAdmin.filter((u) => {
    const role = u.roles?.[0] || u.role;
    return role === "HOST";
  }).length;

  // Get current month new users
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const newCustomersThisMonth = allUsersWithoutAdmin.filter((u) => {
    const role = u.roles?.[0] || u.role;
    if (role !== "CUSTOMER") return false;
    if (!u.createdAt) return false;
    const createdDate = new Date(u.createdAt);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  const newHostsThisMonth = allUsersWithoutAdmin.filter((u) => {
    const role = u.roles?.[0] || u.role;
    if (role !== "HOST") return false;
    if (!u.createdAt) return false;
    const createdDate = new Date(u.createdAt);
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  }).length;

  return (
    <div className="admin-users-page-new">
      <div className="page-header">
        <div>
          <h1>Quản lý người dùng</h1>
          <p>Quản lý tài khoản và thông tin người dùng</p>
        </div>
        <button className="refresh-btn" onClick={loadUsers}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.65 2.35C12.2 0.9 10.21 0 8 0C3.58 0 0.01 3.58 0.01 8C0.01 12.42 3.58 16 8 16C11.73 16 14.84 13.45 15.73 10H13.65C12.83 12.33 10.61 14 8 14C4.69 14 2 11.31 2 8C2 4.69 4.69 2 8 2C9.66 2 11.14 2.69 12.22 3.78L9 7H16V0L13.65 2.35Z"
              fill="currentColor"
            />
          </svg>
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h4>Tổng học viên</h4>
            <p className="stat-value">{totalUsers}</p>
            <p className="stat-detail">Đang hoạt động: {activeUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <FaUserPlus />
          </div>
          <div className="stat-content">
            <h4>Đang hoạt động</h4>
            <p className="stat-value">{activeUsers}</p>
            <p className="stat-detail">
              Khách hàng:{" "}
              {
                allUsersWithoutAdmin.filter(
                  (u) => u.status === 1 && (u.roles?.[0] || u.role) === "CUSTOMER"
                ).length
              }{" "}
              | Chủ nhà:{" "}
              {
                allUsersWithoutAdmin.filter(
                  (u) => u.status === 1 && (u.roles?.[0] || u.role) === "HOST"
                ).length
              }
            </p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <FaUserPlus />
          </div>
          <div className="stat-content">
            <h4>Mới tháng này</h4>
            <p className="stat-value">{newCustomersThisMonth + newHostsThisMonth}</p>
            <p className="stat-detail">
              Khách: {newCustomersThisMonth} | Chủ nhà: {newHostsThisMonth}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      <div className="toolbar">
        <div className="tabs">
          <button
            className={`tab ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            <FaUsers />
            Tất cả
            <span className="badge">{totalUsers}</span>
          </button>
          <button
            className={`tab ${filter === "CUSTOMER" ? "active" : ""}`}
            onClick={() => setFilter("CUSTOMER")}
          >
            <FaUsers />
            Khách hàng
            <span className="badge">{customerCount}</span>
          </button>
          <button
            className={`tab ${filter === "HOST" ? "active" : ""}`}
            onClick={() => setFilter("HOST")}
          >
            <FaUsers />
            Chủ nhà
            <span className="badge">{hostCount}</span>
          </button>
        </div>

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username hoặc ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>Đang tải dữ liệu...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="empty-state">
          <FaUsers className="empty-icon" />
          <h3>Không tìm thấy người dùng</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="users-list">
          {filteredUsers.map((user, index) => {
            const userRole = user.roles?.[0] || user.role || "CUSTOMER";

            return (
              <div key={user.id} className="user-card">
                <div className="user-number">{index + 1}</div>

                <div className="user-avatar">{user.name.charAt(0).toUpperCase()}</div>

                <div className="user-info-wrapper">
                  <div className="user-info">
                    <div className="user-header">
                      <h3>{user.name}</h3>
                      <span className="user-id">ID: {user.id}</span>
                    </div>
                    <p className="user-email">{user.email}</p>
                  </div>
                  <div className="user-role">
                    <span className={`role-badge role-${userRole.toLowerCase()}`}>
                      {userRole === "CUSTOMER" ? "Khách hàng" : "Chủ nhà"}
                    </span>
                  </div>
                </div>

                <div className="user-status">
                  {user.status === 1 ? (
                    <span className="status-badge status-active">
                      <FaCheck /> Hoạt động
                    </span>
                  ) : user.status === 2 ? (
                    <span className="status-badge status-suspended">
                      <FaUserClock /> Tạm khóa
                    </span>
                  ) : user.status === 3 ? (
                    <span className="status-badge status-banned">
                      <FaUserSlash /> Bị chặn
                    </span>
                  ) : (
                    <span className="status-badge status-pending">
                      <FaUserClock /> Chờ duyệt
                    </span>
                  )}
                </div>

                <div className="user-actions">
                  <div className="status-switch-container">
                    <button
                      className={`status-btn status-active ${user.status === 1 ? "selected" : ""}`}
                      onClick={() => handleStatusChange(user, 1)}
                      title="Hoạt động"
                    >
                      <FaUserCheck />
                    </button>
                    <button
                      className={`status-btn status-suspend ${user.status === 2 ? "selected" : ""}`}
                      onClick={() => handleStatusChange(user, 2)}
                      title="Tạm khóa"
                    >
                      <FaUserClock />
                    </button>
                    <button
                      className={`status-btn status-ban ${user.status === 3 ? "selected" : ""}`}
                      onClick={() => handleStatusChange(user, 3)}
                      title="Bị chặn"
                    >
                      <FaUserSlash />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Action Modal */}
      {showConfirmDialog && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowConfirmDialog(false)}>
          <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {actionType === "activate" ? (
                  <>
                    <FaCheck /> Kích hoạt tài khoản
                  </>
                ) : (
                  <>
                    <FaBan /> Vô hiệu hóa tài khoản
                  </>
                )}
              </h2>
              <button className="close-btn" onClick={() => setShowConfirmDialog(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <p className="confirm-message">
                Bạn đang {actionType === "activate" ? "kích hoạt" : "vô hiệu hóa"} tài khoản{" "}
                <strong>{selectedUser.email}</strong>.
              </p>
              <p className="confirm-note">
                Vui lòng chọn lý do và ghi rõ chi tiết để lưu vào hệ thống.
              </p>

              <div className="form-group">
                <label>
                  Loại lý do <span className="required">*</span>
                </label>
                <select className="form-select">
                  <option>Khác</option>
                  <option>Vi phạm chính sách</option>
                  <option>Yêu cầu từ người dùng</option>
                </select>
                <p className="form-hint">⚠️ Lý do khác</p>
              </div>

              <div className="form-group">
                <label>
                  Lý do{" "}
                  {actionType === "activate"
                    ? "kích hoạt"
                    : actionType === "suspend"
                      ? "tạm khóa"
                      : "chặn"}{" "}
                  <span className="optional">(Tùy chọn)</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder={`Ví dụ: ${
                    actionType === "activate"
                      ? "Người dùng đã hoàn tất thủ tục xác minh"
                      : actionType === "suspend"
                        ? "Tạm khóa để kiểm tra thông tin, yêu cầu xác minh bổ sung..."
                        : "Vi phạm nghiêm trọng chính sách, spam, lừa đảo..."
                  }`}
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows={4}
                  maxLength={500}
                />
                <p className="char-count">{actionReason.length}/500 ký tự</p>
              </div>

              {actionType === "ban" && (
                <div className="warning-box">
                  <FaUserSlash />
                  <p>
                    <strong>Lưu ý:</strong> Tài khoản sẽ bị chặn vĩnh viễn và không thể đăng nhập.
                    Người dùng sẽ nhận được thông báo về lý do bị chặn.
                  </p>
                </div>
              )}
              {actionType === "suspend" && (
                <div className="warning-box warning-suspend">
                  <FaUserClock />
                  <p>
                    <strong>Lưu ý:</strong> Tài khoản sẽ bị tạm khóa và không thể đăng nhập cho đến
                    khi được kích hoạt lại.
                  </p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowConfirmDialog(false)}>
                Hủy
              </button>
              <button
                className={`btn ${actionType === "activate" ? "btn-success" : "btn-danger"}`}
                onClick={confirmAction}
                disabled={!actionReason.trim()}
              >
                {actionType === "activate" ? "Xác nhận kích hoạt" : "Xác nhận vô hiệu hóa"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-users-page-new {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
          color: #1f2937;
        }

        .dark .page-header h1 {
          color: #f1f5f9;
        }

        .page-header p {
          margin: 4px 0 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #0ea5e9;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-btn:hover {
          background: #f8fafc;
          border-color: #0ea5e9;
        }

        .dark .refresh-btn {
          background: #1e293b;
          border-color: #334155;
          color: #38bdf8;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
          border: 1px solid #e2e8f0;
        }

        .dark .stat-card {
          background: #1e293b;
          border-color: #334155;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          flex-shrink: 0;
        }

        .stat-icon svg {
          color: white;
        }

        .stat-icon-blue {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }

        .stat-icon-green {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
        }

        .stat-icon-purple {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
        }

        .stat-content {
          flex: 1;
        }

        .stat-content h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 500;
          color: #64748b;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
          line-height: 1;
          margin: 0 0 8px 0;
        }

        .dark .stat-value {
          color: #f1f5f9;
        }

        .stat-detail {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        /* Toolbar */
        .toolbar {
          background: #ffffff;
          border-radius: 16px;
          padding: 16px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(148, 163, 184, 0.08);
          border: 1px solid #e2e8f0;
        }

        .dark .toolbar {
          background: #1e293b;
          border-color: #334155;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tab:hover {
          background: #f1f5f9;
          color: #0ea5e9;
        }

        .tab.active {
          background: #0ea5e9;
          color: white;
          border-color: #0ea5e9;
        }

        .dark .tab {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }

        .dark .tab:hover {
          background: #1e293b;
          color: #38bdf8;
        }

        .dark .tab.active {
          background: #0284c7;
          border-color: #0284c7;
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .tab.active .badge {
          background: rgba(255, 255, 255, 0.3);
        }

        .search-box {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .search-box input:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .dark .search-box input {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }

        /* Users List */
        .users-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          display: grid;
          grid-template-columns: 40px 48px 1fr auto auto;
          gap: 16px;
          align-items: center;
          transition: all 0.2s;
        }

        .user-card:hover {
          box-shadow: 0 4px 12px rgba(148, 163, 184, 0.12);
          transform: translateY(-2px);
        }

        .dark .user-card {
          background: #1e293b;
          border-color: #334155;
        }

        .user-number {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .dark .user-number {
          background: #0f172a;
          color: #94a3b8;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 18px;
        }

        .user-info-wrapper {
          display: grid;
          grid-template-columns: 250px auto;
          gap: 16px;
          align-items: center;
          min-width: 0;
        }

        .user-info {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-header {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-info h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .dark .user-info h3 {
          color: #f1f5f9;
        }

        .user-id {
          font-size: 12px;
          color: #94a3b8;
          font-weight: 500;
        }

        .user-email {
          margin: 0;
          font-size: 13px;
          color: #64748b;
        }

        .user-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .role-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          letter-spacing: 0.3px;
          text-transform: uppercase;
        }

        .role-customer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
        }

        .role-host {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #ffffff;
        }

        .dark .role-customer {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #ffffff;
        }

        .dark .role-host {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #ffffff;
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-active {
          background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
          color: #15803d;
          border: 1px solid #86efac;
        }

        .status-suspended {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          color: #a16207;
          border: 1px solid #fcd34d;
        }

        .status-banned {
          background: linear-gradient(135deg, #ffe4e6 0%, #fecdd3 100%);
          color: #be123c;
          border: 1px solid #fda4af;
        }

        .status-pending {
          background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
          color: #4338ca;
          border: 1px solid #a5b4fc;
        }

        .dark .status-active {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .dark .status-suspended {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }

        .dark .status-banned {
          background: rgba(244, 63, 94, 0.2);
          color: #fda4af;
          border: 1px solid rgba(244, 63, 94, 0.3);
        }

        .dark .status-pending {
          background: rgba(99, 102, 241, 0.2);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .user-actions {
          display: flex;
          gap: 12px;
          align-items: center;
          position: relative;
        }

        /* Status Switch Container */
        .status-switch-container {
          display: flex;
          gap: 2px;
          background: #f1f5f9;
          padding: 3px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        .dark .status-switch-container {
          background: #1e293b;
          border-color: #334155;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .status-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent !important;
          color: #94a3b8 !important;
          position: relative;
        }

        .dark .status-btn {
          background: transparent !important;
          color: #64748b !important;
        }

        .status-btn:hover:not(.selected) {
          transform: translateY(-2px);
          background: rgba(203, 213, 225, 0.5) !important;
          color: #64748b !important;
        }

        .dark .status-btn:hover:not(.selected) {
          background: rgba(71, 85, 105, 0.5) !important;
          color: #94a3b8 !important;
        }

        /* CHỈ nút có .selected mới có màu */
        .status-btn.status-active.selected {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4), 0 0 0 3px rgba(16, 185, 129, 0.1);
          transform: translateY(-1px) scale(1.02);
        }

        .status-btn.status-suspend.selected {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%) !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4), 0 0 0 3px rgba(245, 158, 11, 0.1);
          transform: translateY(-1px) scale(1.02);
        }

        .status-btn.status-ban.selected {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4), 0 0 0 3px rgba(239, 68, 68, 0.1);
          transform: translateY(-1px) scale(1.02);
        }

        .status-btn:active {
          transform: translateY(0) scale(0.98);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
        }



        /* Modal Styles */
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
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          max-width: 600px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-small {
          max-width: 500px;
        }

        .dark .modal-content {
          background: #1e293b;
        }

        .modal-header {
          padding: 20px 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dark .modal-header {
          border-color: #334155;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dark .modal-header h2 {
          color: #f1f5f9;
        }

        .close-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .close-btn:hover {
          background: #e2e8f0;
          color: #1f2937;
        }

        .dark .close-btn {
          background: #0f172a;
          color: #94a3b8;
        }

        .modal-body {
          padding: 24px;
        }

        /* Form */
        .confirm-message {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: #1f2937;
        }

        .dark .confirm-message {
          color: #f1f5f9;
        }

        .confirm-note {
          margin: 0 0 20px 0;
          font-size: 13px;
          color: #64748b;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .dark .form-group label {
          color: #f1f5f9;
        }

        .required {
          color: #ef4444;
        }

        .form-select,
        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s;
        }

        .form-select:focus,
        .form-textarea:focus {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
        }

        .dark .form-select,
        .dark .form-textarea {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }

        .form-hint {
          margin: 8px 0 0 0;
          font-size: 12px;
          color: #f59e0b;
        }

        .char-count {
          margin: 8px 0 0 0;
          font-size: 12px;
          color: #94a3b8;
          text-align: right;
        }

        .warning-box {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: #fee2e2;
          border: 1px solid #ef4444;
          border-radius: 8px;
          margin-top: 16px;
        }

        .warning-box.warning-suspend {
          background: #fef3c7;
          border: 1px solid #fbbf24;
        }

        .dark .warning-box {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .dark .warning-box.warning-suspend {
          background: rgba(251, 191, 36, 0.1);
          border-color: rgba(251, 191, 36, 0.3);
        }

        .warning-box svg,
        .warning-box span {
          color: #ef4444;
          font-size: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warning-box.warning-suspend span {
          color: #f59e0b;
        }

        .warning-box p {
          margin: 0;
          font-size: 13px;
          color: #991b1b;
        }

        .warning-box.warning-suspend p {
          color: #78350f;
        }

        .dark .warning-box p {
          color: #fca5a5;
        }

        .dark .warning-box.warning-suspend p {
          color: #fcd34d;
        }

        .modal-footer {
          padding: 16px 24px;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .dark .modal-footer {
          border-color: #334155;
        }

        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-secondary {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        .dark .btn-secondary {
          background: #0f172a;
          color: #94a3b8;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #059669;
        }

        .btn-success:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .btn-danger:disabled {
          background: #d1d5db;
          cursor: not-allowed;
        }

        /* Loading & Empty State */
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          background: white;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .dark .loading-state,
        .dark .empty-state {
          background: #1e293b;
          border-color: #334155;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #e2e8f0;
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-state p,
        .empty-state p {
          margin: 16px 0 0 0;
          color: #64748b;
        }

        .empty-icon {
          font-size: 64px;
          color: #cbd5e1;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #1f2937;
          font-size: 20px;
        }

        .dark .empty-state h3 {
          color: #f1f5f9;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .user-card {
            grid-template-columns: 40px 48px 1fr;
            gap: 12px;
          }

          .user-role,
          .user-status,
          .user-actions {
            grid-column: 3 / 4;
          }

          .user-role {
            margin-top: 8px;
          }

          .user-actions {
            margin-top: 12px;
            justify-self: start;
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tabs {
            flex-direction: column;
          }

          .tab {
            justify-content: space-between;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminUsersPage;
