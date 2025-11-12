import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus, fetchUserStatusHistory } from "@/api/adminApi";
import type { AdminUser, UserStatusHistory } from "@/types/admin";
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
  FaHistory,
  FaInfoCircle,
  FaFilter,
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
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState<UserStatusHistory[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 8;

  // Status filter state
  const [statusFilter, setStatusFilter] = useState<"ALL" | 0 | 1 | 2 | 3>("ALL");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      console.log("🟢 [AdminUsersPage] Calling fetchUsers...");
      const data = await fetchUsers();
      console.log("🟢 [AdminUsersPage] Received data:", data);
      console.log("🟢 [AdminUsersPage] Is array?", Array.isArray(data));
      setUsers(Array.isArray(data) ? data : []);
      console.log("🟢 [AdminUsersPage] Users set, length:", Array.isArray(data) ? data.length : 0);
    } catch (error) {
      console.error("🔴 [AdminUsersPage] Error loading users:", error);
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

  const handleViewHistory = async (user: AdminUser) => {
    setSelectedUser(user);
    setShowHistoryModal(true);
    setHistoryLoading(true);
    try {
      const history = await fetchUserStatusHistory(user.id);
      setStatusHistory(history);
    } catch (error) {
      showAlert("Không thể tải lịch sử trạng thái", "danger");
      setStatusHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewDetail = (user: AdminUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const closeHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedUser(null);
    setStatusHistory([]);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedUser(null);
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
    const matchesStatusFilter = statusFilter === "ALL" || user.status === statusFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toString().includes(searchQuery);
    return matchesFilter && matchesStatusFilter && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery, statusFilter]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showRange = 2; // Số trang hiển thị xung quanh trang hiện tại

    if (totalPages <= 7) {
      // Nếu tổng số trang <= 7, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      // Tính toán range xung quanh trang hiện tại
      const startPage = Math.max(2, currentPage - showRange);
      const endPage = Math.min(totalPages - 1, currentPage + showRange);

      // Thêm "..." nếu có khoảng cách
      if (startPage > 2) {
        pages.push('...');
      }

      // Thêm các trang xung quanh trang hiện tại
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Thêm "..." nếu có khoảng cách
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Luôn hiển thị trang cuối
      pages.push(totalPages);
    }

    return pages;
  };

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

        <div className="search-and-filter-wrapper">
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Tìm kiếm theo tên, email hoặc ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button 
                className="clear-search-btn" 
                type="button"
                onClick={() => setSearchQuery("")}
                title="Xóa tìm kiếm"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <div className="status-filter-container">
            <button 
              className={`status-filter-btn ${showStatusDropdown ? 'active' : ''}`}
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              title="Lọc theo trạng thái"
            >
              <FaFilter />
              <span>Trạng thái</span>
              {statusFilter !== "ALL" && <span className="filter-badge"></span>}
            </button>

            {showStatusDropdown && (
              <div className="status-dropdown">
                <button
                  className={`dropdown-item ${statusFilter === "ALL" ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter("ALL");
                    setShowStatusDropdown(false);
                  }}
                >
                  <FaUsers />
                  Tất cả
                </button>
                <button
                  className={`dropdown-item ${statusFilter === 1 ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter(1);
                    setShowStatusDropdown(false);
                  }}
                >
                  <FaCheck />
                  Hoạt động
                </button>
                <button
                  className={`dropdown-item ${statusFilter === 2 ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter(2);
                    setShowStatusDropdown(false);
                  }}
                >
                  <FaUserClock />
                  Tạm khóa
                </button>
                <button
                  className={`dropdown-item ${statusFilter === 3 ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter(3);
                    setShowStatusDropdown(false);
                  }}
                >
                  <FaUserSlash />
                  Bị chặn
                </button>
                <button
                  className={`dropdown-item ${statusFilter === 0 ? "active" : ""}`}
                  onClick={() => {
                    setStatusFilter(0);
                    setShowStatusDropdown(false);
                  }}
                >
                  <FaUserClock />
                  Chờ duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="search-results-info">
          <FaSearch />
          <span>
            Tìm thấy <strong>{filteredUsers.length}</strong> kết quả cho "{searchQuery}"
          </span>
          {filteredUsers.length > 0 && (
            <span className="result-detail">
              (Hiển thị {Math.min(filteredUsers.length, usersPerPage)} / {filteredUsers.length} trên trang này)
            </span>
          )}
        </div>
      )}

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
        <>
        <div className="users-list">
          {currentUsers.map((user, index) => {
            const userRole = user.roles?.[0] || user.role || "CUSTOMER";
            const globalIndex = indexOfFirstUser + index + 1;

            return (
              <div key={user.id} className="user-card">
                <div className="user-number">{globalIndex}</div>

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
                  <div className="divider-vertical"></div>
                  <div className="action-buttons-group">
                    <button
                      className="action-icon-btn history-btn"
                      onClick={() => handleViewHistory(user)}
                      title="Lịch sử trạng thái"
                    >
                      <FaHistory />
                      <span className="btn-tooltip">Lịch sử</span>
                    </button>
                    <button
                      className="action-icon-btn detail-btn"
                      onClick={() => handleViewDetail(user)}
                      title="Thông tin chi tiết"
                    >
                      <FaInfoCircle />
                      <span className="btn-tooltip">Chi tiết</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-container">
            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              « Trước
            </button>
            
            <div className="pagination-numbers">
              {getPageNumbers().map((pageNum, index) => (
                pageNum === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNum}
                    className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => handlePageChange(pageNum as number)}
                  >
                    {pageNum}
                  </button>
                )
              ))}
            </div>

            <button 
              className="pagination-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sau »
            </button>

            {/* <div className="pagination-info">
              Trang {currentPage} / {totalPages} (Tổng: {filteredUsers.length} người dùng)
            </div> */}
          </div>
        )}
        </>
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

      {/* History Modal */}
      {showHistoryModal && selectedUser && (
        <div className="modal-overlay" onClick={closeHistoryModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaHistory /> Lịch sử trạng thái
              </h2>
              <button className="close-btn" onClick={closeHistoryModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="user-summary">
                <div className="user-avatar-large">{selectedUser.name.charAt(0).toUpperCase()}</div>
                <div>
                  <h3>{selectedUser.name}</h3>
                  <p className="user-email">{selectedUser.email}</p>
                  <span className="user-id">ID: {selectedUser.id}</span>
                </div>
              </div>

              {historyLoading ? (
                <div className="loading-state-inline">
                  <div className="spinner-small" />
                  <p>Đang tải lịch sử...</p>
                </div>
              ) : statusHistory.length === 0 ? (
                <div className="empty-state-inline">
                  <FaHistory className="empty-icon-small" />
                  <p>Chưa có lịch sử thay đổi trạng thái</p>
                </div>
              ) : (
                <div className="history-timeline">
                  {statusHistory.map((item, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-marker" />
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <span
                            className={`status-badge-small status-${
                              item.newStatus === 1
                                ? "active"
                                : item.newStatus === 2
                                  ? "suspended"
                                  : "banned"
                            }`}
                          >
                            {item.newStatus === 1
                              ? "Hoạt động"
                              : item.newStatus === 2
                                ? "Tạm khóa"
                                : "Bị chặn"}
                          </span>
                          <span className="timeline-date">
                            {new Date(item.changedAt).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        {item.reason && (
                          <p className="timeline-reason">
                            <strong>Lý do:</strong> {item.reason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeHistoryModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={closeDetailModal}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaInfoCircle /> Thông tin chi tiết
              </h2>
              <button className="close-btn" onClick={closeDetailModal}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="user-summary-card">
                <div className="user-avatar-large">{selectedUser.name.charAt(0).toUpperCase()}</div>
                <div className="user-summary-info">
                  <h3>{selectedUser.name}</h3>
                  <p className="user-email">{selectedUser.email}</p>
                  <div className="user-meta">
                    <span className="user-id">ID: {selectedUser.id}</span>
                    <span className="user-id-divider">•</span>
                    <span
                      className={`status-badge-inline status-${
                        selectedUser.status === 1
                          ? "active"
                          : selectedUser.status === 2
                            ? "suspended"
                            : "banned"
                      }`}
                    >
                      {selectedUser.status === 1
                        ? "Hoạt động"
                        : selectedUser.status === 2
                          ? "Tạm khóa"
                          : "Bị chặn"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-sections-grid">
                <div className="detail-card">
                  <h4>📋 Thông tin cơ bản</h4>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="detail-label">Tên đăng nhập</span>
                      <span className="detail-value">{selectedUser.username || "N/A"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{selectedUser.email}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Số điện thoại</span>
                      <span className="detail-value">{selectedUser.phone || "Chưa cập nhật"}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Vai trò</span>
                      <span
                        className={`role-badge role-${(selectedUser.roles?.[0] || selectedUser.role || "CUSTOMER").toLowerCase()}`}
                      >
                        {selectedUser.roles?.[0] || selectedUser.role || "CUSTOMER"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-card">
                  <h4>📅 Thời gian</h4>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="detail-label">Ngày tạo</span>
                      <span className="detail-value">
                        {selectedUser.createdAt
                          ? new Date(selectedUser.createdAt).toLocaleString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Cập nhật lần cuối</span>
                      <span className="detail-value">
                        {selectedUser.updatedAt
                          ? new Date(selectedUser.updatedAt).toLocaleString("vi-VN")
                          : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-card detail-card-full">
                  <h4>👤 Thông tin bổ sung</h4>
                  <div className="detail-list">
                    <div className="detail-row">
                      <span className="detail-label">Địa chỉ</span>
                      <span className="detail-value">
                        {selectedUser.address || "Chưa cập nhật"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Ngày sinh</span>
                      <span className="detail-value">
                        {selectedUser.dateOfBirth
                          ? new Date(selectedUser.dateOfBirth).toLocaleDateString("vi-VN")
                          : "Chưa cập nhật"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeDetailModal}>
                Đóng
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

        .search-and-filter-wrapper {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .search-container {
          display: flex;
          position: relative;
          flex: 1;
          max-width: 400px;
          align-items: center;
        }

        .search-input {
          width: 100%;
          padding: 12px 50px 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.3s ease;
          background: white;
          color: #1f2937;
          font-weight: 500;
        }

        .search-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .search-input:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .search-input:focus {
          border-color: #0ea5e9;
          background: white;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .search-btn {
          position: absolute;
          right: 4px;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #64748b;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .search-btn:hover {
          background: rgba(14, 165, 233, 0.1);
          color: #0ea5e9;
        }

        .search-btn:active {
          background: rgba(14, 165, 233, 0.2);
          transform: translateY(-50%) scale(0.95);
        }

        .dark .search-input {
          background: #0f172a;
          border-color: #334155;
          color: #f1f5f9;
        }

        .dark .search-input::placeholder {
          color: #64748b;
        }

        .dark .search-input:hover {
          border-color: #475569;
          background: #1e293b;
        }

        .dark .search-input:focus {
          border-color: #0ea5e9;
          background: #0f172a;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.15);
        }

        .dark .search-btn {
          color: #64748b;
        }

        .dark .search-btn:hover {
          background: rgba(14, 165, 233, 0.15);
          color: #38bdf8;
        }

        .dark .search-btn:active {
          background: rgba(14, 165, 233, 0.25);
        }

        .clear-search-btn {
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          border: none;
          border-radius: 6px;
          color: #64748b;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-search-btn:hover {
          background: #fee2e2;
          color: #ef4444;
        }

        .clear-search-btn:active {
          transform: translateY(-50%) scale(0.9);
        }

        .dark .clear-search-btn {
          background: #334155;
          color: #94a3b8;
        }

        .dark .clear-search-btn:hover {
          background: #7f1d1d;
          color: #fca5a5;
        }

        /* Status Filter */
        .status-filter-container {
          position: relative;
        }

        .status-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
          position: relative;
        }

        .status-filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.3);
        }

        .status-filter-btn.active {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }

        .status-filter-btn svg {
          font-size: 14px;
        }

        .filter-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .dark .status-filter-btn {
          background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
        }

        .dark .status-filter-btn:hover {
          box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
        }

        .status-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease;
        }

        .dark .status-dropdown {
          background: #1e293b;
          border-color: #334155;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px 16px;
          background: transparent;
          border: none;
          text-align: left;
          font-size: 14px;
          color: #475569;
          cursor: pointer;
          transition: all 0.2s;
        }

        .dropdown-item:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .dropdown-item.active {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          color: #1e40af;
          font-weight: 600;
        }

        .dropdown-item svg {
          font-size: 14px;
          opacity: 0.7;
        }

        .dropdown-item.active svg {
          opacity: 1;
          color: #3b82f6;
        }

        .dark .dropdown-item {
          color: #cbd5e1;
        }

        .dark .dropdown-item:hover {
          background: #334155;
          color: #f1f5f9;
        }

        .dark .dropdown-item.active {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          color: #dbeafe;
        }

        /* Search Results Info */
        .search-results-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border: 1px solid #bfdbfe;
          border-radius: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #1e40af;
          animation: slideDown 0.3s ease;
        }

        .search-results-info svg {
          font-size: 16px;
          color: #3b82f6;
        }

        .search-results-info strong {
          font-weight: 700;
          color: #1e3a8a;
        }

        .search-results-info .result-detail {
          margin-left: 8px;
          color: #64748b;
          font-size: 13px;
        }

        .dark .search-results-info {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
          border-color: #3b82f6;
          color: #bfdbfe;
        }

        .dark .search-results-info svg {
          color: #60a5fa;
        }

        .dark .search-results-info strong {
          color: #dbeafe;
        }

        .dark .search-results-info .result-detail {
          color: #94a3b8;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
          gap: 10px;
          align-items: center;
          position: relative;
          padding: 4px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 14px;
          border: 1px solid #e2e8f0;
        }

        .dark .user-actions {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          border-color: #334155;
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
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 transparent;
        }

        .modal-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content::-webkit-scrollbar-track {
          background: transparent;
          margin: 16px 0;
        }

        .modal-content::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .modal-content::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .dark .modal-content::-webkit-scrollbar-thumb {
          background: #475569;
        }

        .dark .modal-content::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        .dark .modal-content {
          scrollbar-color: #475569 transparent;
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

        /* Divider Vertical */
        .divider-vertical {
          width: 1px;
          height: 32px;
          background: linear-gradient(180deg, transparent 0%, #e2e8f0 20%, #e2e8f0 80%, transparent 100%);
          margin: 0 8px;
        }

        .dark .divider-vertical {
          background: linear-gradient(180deg, transparent 0%, #334155 20%, #334155 80%, transparent 100%);
        }

        /* Action Icon Buttons */
        .action-buttons-group {
          display: flex;
          gap: 6px;
          align-items: center;
        }

        .action-icon-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-icon-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, transparent 0%, rgba(255, 255, 255, 0.2) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .action-icon-btn:hover::before {
          opacity: 1;
        }

        .dark .action-icon-btn {
          background: #0f172a;
          border-color: #334155;
          color: #94a3b8;
        }

        .action-icon-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        }

        .action-icon-btn:active {
          transform: translateY(0) scale(0.98);
          transition: all 0.1s;
        }

        .history-btn {
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          color: #0369a1;
          border-color: #bae6fd;
        }

        .history-btn:hover {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          border-color: #0ea5e9;
          box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
        }

        .detail-btn {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
          color: #7c3aed;
          border-color: #e9d5ff;
        }

        .detail-btn:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-color: #8b5cf6;
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        .dark .history-btn {
          background: linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(14, 165, 233, 0.1) 100%);
          color: #38bdf8;
          border-color: rgba(14, 165, 233, 0.3);
        }

        .dark .history-btn:hover {
          background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
          color: white;
          border-color: #0ea5e9;
        }

        .dark .detail-btn {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #a78bfa;
          border-color: rgba(139, 92, 246, 0.3);
        }

        .dark .detail-btn:hover {
          background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
          color: white;
          border-color: #8b5cf6;
        }

        /* Button Tooltip */
        .btn-tooltip {
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          background: rgba(0, 0, 0, 0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 10;
          letter-spacing: 0.3px;
        }

        .btn-tooltip::before {
          content: "";
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(0, 0, 0, 0.9);
        }

        .action-icon-btn:hover .btn-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .dark .btn-tooltip {
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(51, 65, 85, 0.8);
        }

        .dark .btn-tooltip::before {
          border-bottom-color: rgba(15, 23, 42, 0.95);
        }

        /* Modal Large */
        .modal-large {
          max-width: 900px;
        }

        /* User Summary Card in Modal */
        .user-summary-card {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
          position: relative;
          overflow: hidden;
        }

        .user-summary-card::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 200px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          filter: blur(40px);
        }

        .dark .user-summary-card {
          background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .user-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: white;
          color: #667eea;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 32px;
          flex-shrink: 0;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          border: 4px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }

        .dark .user-avatar-large {
          background: #0f172a;
          color: #a78bfa;
          border-color: rgba(167, 139, 250, 0.3);
        }

        .user-summary-info {
          flex: 1;
          position: relative;
          z-index: 1;
        }

        .user-summary-card h3 {
          margin: 0 0 6px 0;
          font-size: 22px;
          font-weight: 700;
          color: white;
        }

        .user-summary-card .user-email {
          margin: 0 0 8px 0;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.85);
        }

        .user-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .user-summary-card .user-id {
          font-size: 12px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.75);
        }

        .user-id-divider {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 700;
        }

        .status-badge-inline {
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge-inline.status-active {
          background: rgba(16, 185, 129, 0.2);
          color: #6ee7b7;
          border: 1px solid rgba(110, 231, 183, 0.5);
        }

        .status-badge-inline.status-suspended {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
          border: 1px solid rgba(252, 211, 77, 0.5);
        }

        .status-badge-inline.status-banned {
          background: rgba(239, 68, 68, 0.2);
          color: #fca5a5;
          border: 1px solid rgba(252, 165, 165, 0.5);
        }

        /* History Timeline */
        .history-timeline {
          position: relative;
          padding-left: 32px;
          margin-top: 24px;
        }

        .history-timeline::before {
          content: "";
          position: absolute;
          left: 11px;
          top: 12px;
          bottom: 12px;
          width: 2px;
          background: linear-gradient(180deg, #e2e8f0 0%, transparent 100%);
        }

        .dark .history-timeline::before {
          background: linear-gradient(180deg, #334155 0%, transparent 100%);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 24px;
        }

        .timeline-item:last-child {
          margin-bottom: 0;
        }

        .timeline-marker {
          position: absolute;
          left: -26px;
          top: 8px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #0ea5e9;
          border: 3px solid #ffffff;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
        }

        .dark .timeline-marker {
          border-color: #1e293b;
          box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.2);
        }

        .timeline-content {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
        }

        .dark .timeline-content {
          background: #0f172a;
          border-color: #334155;
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .timeline-date {
          font-size: 12px;
          color: #94a3b8;
        }

        .timeline-reason,
        .timeline-admin {
          margin: 8px 0 0 0;
          font-size: 13px;
          color: #64748b;
        }

        .dark .timeline-reason,
        .dark .timeline-admin {
          color: #94a3b8;
        }

        .status-badge-small {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge-small.status-active {
          background: #dcfce7;
          color: #15803d;
        }

        .status-badge-small.status-suspended {
          background: #fef3c7;
          color: #a16207;
        }

        .status-badge-small.status-banned {
          background: #ffe4e6;
          color: #be123c;
        }

        .dark .status-badge-small.status-active {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
        }

        .dark .status-badge-small.status-suspended {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
        }

        .dark .status-badge-small.status-banned {
          background: rgba(244, 63, 94, 0.2);
          color: #fda4af;
        }

        /* Loading & Empty State Inline */
        .loading-state-inline,
        .empty-state-inline {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          margin-top: 24px;
        }

        .spinner-small {
          width: 32px;
          height: 32px;
          border: 3px solid #e2e8f0;
          border-top-color: #0ea5e9;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .loading-state-inline p,
        .empty-state-inline p {
          margin: 12px 0 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .empty-icon-small {
          font-size: 48px;
          color: #cbd5e1;
          margin-bottom: 12px;
        }

        /* Detail Sections Grid */
        .detail-sections-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .detail-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
        }

        .detail-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .dark .detail-card {
          background: #0f172a;
          border-color: #334155;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .dark .detail-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        .detail-card-full {
          grid-column: 1 / -1;
        }

        .detail-card h4 {
          margin: 0 0 16px 0;
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
          padding-bottom: 12px;
          border-bottom: 2px solid #f1f5f9;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dark .detail-card h4 {
          color: #f1f5f9;
          border-bottom-color: #334155;
        }

        .detail-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
          gap: 16px;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .dark .detail-row {
          border-bottom-color: #1e293b;
        }

        .detail-label {
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          flex-shrink: 0;
        }

        .dark .detail-label {
          color: #94a3b8;
        }

        .detail-value {
          font-size: 14px;
          color: #1f2937;
          font-weight: 600;
          text-align: right;
        }

        .dark .detail-value {
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

          .detail-sections-grid {
            grid-template-columns: 1fr;
          }

          .detail-card-full {
            grid-column: 1;
          }
        }

        /* Pagination Styles */
        .pagination-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 24px;
          padding: 20px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          flex-wrap: wrap;
        }

        .dark .pagination-container {
          background: #1e293b;
          border-color: #334155;
        }

        .pagination-btn {
          padding: 8px 16px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .pagination-btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
          opacity: 0.5;
        }

        .dark .pagination-btn:disabled {
          background: #475569;
        }

        .pagination-numbers {
          display: flex;
          gap: 6px;
        }

        .pagination-number {
          min-width: 36px;
          height: 36px;
          padding: 0 12px;
          background: #f1f5f9;
          color: #475569;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .pagination-number:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .pagination-number.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #3b82f6;
        }

        .pagination-ellipsis {
          min-width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-weight: 600;
          font-size: 16px;
          user-select: none;
        }

        .dark .pagination-ellipsis {
          color: #64748b;
        }

        .dark .pagination-number {
          background: #334155;
          color: #cbd5e1;
          border-color: #475569;
        }

        .dark .pagination-number:hover {
          background: #475569;
        }

        .dark .pagination-number.active {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border-color: #3b82f6;
        }

        .pagination-info {
          padding: 8px 16px;
          background: #f8fafc;
          border-radius: 8px;
          color: #64748b;
          font-size: 13px;
          font-weight: 500;
        }

        .dark .pagination-info {
          background: #0f172a;
          color: #94a3b8;
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

          .pagination-container {
            padding: 16px;
            gap: 8px;
          }

          .pagination-numbers {
            order: 3;
            width: 100%;
            justify-content: center;
          }

          .pagination-info {
            order: 4;
            width: 100%;
            text-align: center;
          }

          .pagination-number {
            min-width: 32px;
            height: 32px;
            padding: 0 8px;
            font-size: 13px;
          }

          .pagination-ellipsis {
            min-width: 28px;
            height: 32px;
            font-size: 14px;
          }

          .pagination-btn {
            padding: 6px 12px;
            font-size: 13px;
          }

          .modal-large {
            max-width: calc(100vw - 32px);
            margin: 16px;
          }

          .user-summary-card {
            flex-direction: column;
            text-align: center;
            padding: 20px;
          }

          .user-summary-info {
            width: 100%;
          }

          .user-meta {
            justify-content: center;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }

          .detail-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminUsersPage;
