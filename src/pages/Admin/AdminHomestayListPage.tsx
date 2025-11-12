import { useEffect, useState } from "react";
import { fetchAllHomestaysForAdmin, updateHomestayStatus, fetchHomestayDetail, fetchHomestayStatusHistory } from "@/api/adminApi";
import type { Homestay, HomestayStatusHistory } from "@/types/homestay";
import { showAlert } from "@/utils/showAlert";
import { FaHome, FaSearch, FaFilter, FaTimes, FaCheck, FaBan, FaClock, FaUsers, FaHistory } from "react-icons/fa";

const AdminHomestayListPage = () => {
  const [homestays, setHomestays] = useState<Homestay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | "ALL">("ALL");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  
  // Detail modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedHomestay, setSelectedHomestay] = useState<Homestay | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // History modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [statusHistory, setStatusHistory] = useState<HomestayStatusHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyHomestayId, setHistoryHomestayId] = useState<number | null>(null);

  // Confirm modal for status change
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    homestay: Homestay | null;
    newStatus: number;
  }>({ homestay: null, newStatus: 0 });
  const [statusChangeReason, setStatusChangeReason] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const homestaysPerPage = 8;

  useEffect(() => {
    loadHomestays();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".status-filter-container")) {
        setShowStatusDropdown(false);
      }
    };

    if (showStatusDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStatusDropdown]);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      const data = await fetchAllHomestaysForAdmin();
      setHomestays(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách homestay", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filteredHomestays = homestays.filter((h) => {
    // Search by name, id, address, city
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      !searchTerm ||
      h.name.toLowerCase().includes(searchLower) ||
      h.id.toString().includes(searchLower) ||
      (h.address && h.address.toLowerCase().includes(searchLower)) ||
      (h.city && h.city.toLowerCase().includes(searchLower)) ||
      (h.host?.name && h.host.name.toLowerCase().includes(searchLower)) ||
      (h.host?.email && h.host.email.toLowerCase().includes(searchLower));

    // Filter by status (homestay.status is number)
    const matchesStatusFilter =
      statusFilter === "ALL" || (typeof h.status === "number" && h.status === statusFilter);

    return matchesSearch && matchesStatusFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHomestays.length / homestaysPerPage);
  const indexOfLastHomestay = currentPage * homestaysPerPage;
  const indexOfFirstHomestay = indexOfLastHomestay - homestaysPerPage;
  const currentHomestays = filteredHomestays.slice(indexOfFirstHomestay, indexOfLastHomestay);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const getStatusText = (status?: number) => {
    if (status === 1) return "Hoạt động";
    if (status === 2) return "Đang chờ duyệt";
    if (status === 3) return "Bị khóa";
    if (status === 0) return "Không hoạt động";
    return "Không xác định";
  };

  const getStatusClass = (status?: number) => {
    if (status === 1) return "active";
    if (status === 2) return "pending";
    if (status === 3) return "banned";
    if (status === 0) return "inactive";
    return "unknown";
  };

  const handleStatusChange = (homestay: Homestay, newStatus: number) => {
    if (homestay.status === newStatus) return;
    
    // Mở modal xác nhận
    setConfirmData({ homestay, newStatus });
    setStatusChangeReason("");
    setShowConfirmModal(true);
  };

  const handleConfirmStatusChange = async () => {
    const { homestay, newStatus } = confirmData;
    if (!homestay) return;

    setIsUpdatingStatus(true);
    
    try {
      const statusText = getStatusText(newStatus);
      console.log("🔴 [Status Change] Updating homestay:", homestay.id, "to status:", newStatus, "reason:", statusChangeReason);
      
      const response = await updateHomestayStatus(homestay.id, newStatus, statusChangeReason || undefined);
      console.log("🔴 [Status Change] Response:", response);
      
      showAlert(`Đã cập nhật trạng thái homestay ${homestay.name} thành ${statusText}`, "success");
      
      // Đóng modal và reset
      setShowConfirmModal(false);
      setConfirmData({ homestay: null, newStatus: 0 });
      setStatusChangeReason("");
      
      // Reload data
      console.log("🔴 [Status Change] Reloading homestays...");
      await loadHomestays();
      console.log("🔴 [Status Change] Reload complete");
    } catch (error: any) {
      console.error("🔴 [Status Change] Error:", error);
      showAlert(error?.message || "Không thể cập nhật trạng thái homestay", "danger");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCancelStatusChange = () => {
    setShowConfirmModal(false);
    setConfirmData({ homestay: null, newStatus: 0 });
    setStatusChangeReason("");
  };

  const handleViewDetail = async (homestay: Homestay) => {
    setShowDetailModal(true);
    setSelectedHomestay(homestay);
    setLoadingDetail(true);
    
    try {
      const detail = await fetchHomestayDetail(homestay.id);
      setSelectedHomestay(detail);
    } catch (error: any) {
      console.error("Error fetching homestay detail:", error);
      showAlert(
        error?.message || "Không thể tải thông tin chi tiết homestay",
        "danger"
      );
    } finally {
      setLoadingDetail(false);
    }
  };
  
  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedHomestay(null);
  };

  const handleViewHistory = async (homestayId: number) => {
    setHistoryHomestayId(homestayId);
    setShowHistoryModal(true);
    setLoadingHistory(true);
    
    try {
      const history = await fetchHomestayStatusHistory(homestayId);
      setStatusHistory(history);
    } catch (error: any) {
      console.error("Error fetching homestay history:", error);
      showAlert(
        error?.message || "Không thể tải lịch sử trạng thái homestay",
        "danger"
      );
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setStatusHistory([]);
    setHistoryHomestayId(null);
  };

  return (
    <div className="admin-homestay-list-page">
      <div className="page-header">
        <h1>Danh sách Homestay</h1>
        <p>Quản lý toàn bộ homestay trong hệ thống ({homestays.length} homestay)</p>
      </div>

      {/* Search and Status Filter */}
      <div className="search-and-filter-wrapper">
        <div className="search-box">
          <FaSearch className="search-icon-inline" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, ID, địa chỉ, chủ nhà..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm("")} title="Xóa tìm kiếm">
              <FaTimes />
            </button>
          )}
        </div>

        <div className="status-filter-container">
          <button
            className={`status-filter-btn ${statusFilter !== "ALL" ? "active" : ""}`}
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <FaFilter />
            Trạng thái
            {statusFilter !== "ALL" && <span className="filter-badge">{getStatusText(statusFilter as number)}</span>}
          </button>

          {showStatusDropdown && (
            <div className="status-dropdown">
              <button className={statusFilter === "ALL" ? "active" : ""} onClick={() => { setStatusFilter("ALL"); setShowStatusDropdown(false); }}>
                <FaUsers /> Tất cả
              </button>
              <button className={statusFilter === 1 ? "active" : ""} onClick={() => { setStatusFilter(1); setShowStatusDropdown(false); }}>
                <FaCheck /> Hoạt động
              </button>
              <button className={statusFilter === 2 ? "active" : ""} onClick={() => { setStatusFilter(2); setShowStatusDropdown(false); }}>
                <FaClock /> Đang chờ duyệt
              </button>
              <button className={statusFilter === 3 ? "active" : ""} onClick={() => { setStatusFilter(3); setShowStatusDropdown(false); }}>
                <FaBan /> Bị khóa
              </button>
              <button className={statusFilter === 0 ? "active" : ""} onClick={() => { setStatusFilter(0); setShowStatusDropdown(false); }}>
                <FaTimes /> Không hoạt động
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="search-results-info">
          Tìm thấy <strong>{filteredHomestays.length}</strong> homestay với từ khóa "<strong>{searchTerm}</strong>"
        </div>
      )}

      {/* Homestay List */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : filteredHomestays.length === 0 ? (
        <div className="empty-state">
          <FaHome className="empty-icon" />
          <h3>Không có homestay nào</h3>
          <p>{searchTerm ? "Không tìm thấy homestay phù hợp với từ khóa tìm kiếm" : "Không có homestay trong hệ thống"}</p>
        </div>
      ) : (
        <>
          <div className="homestays-grid">
            {currentHomestays.map((homestay, index) => {
              const globalIndex = indexOfFirstHomestay + index + 1;
              return (
                <div key={homestay.id} className="homestay-card">
                  <div className="card-number">{globalIndex}</div>
                  
                  <div className="card-header">
                    <div className="avatar-circle">
                      {homestay.name ? homestay.name.charAt(0).toUpperCase() : "H"}
                    </div>
                    <div className="homestay-info">
                      <div className="homestay-name-row">
                        <h3 className="homestay-name">{homestay.name || "N/A"}</h3>
                        <span className="homestay-id">ID: {homestay.id}</span>
                      </div>
                      <p className="homestay-host">{homestay.host?.name || "N/A"}</p>
                    </div>
                    <div className="homestay-status">
                      <span className={`status-badge ${getStatusClass(typeof homestay.status === "number" ? homestay.status : undefined)}`}>
                        {getStatusText(typeof homestay.status === "number" ? homestay.status : undefined)}
                      </span>
                    </div>
                    <div className="homestay-actions">
                      <div className="status-switch-container">
                        <button
                          className={`status-btn status-active ${homestay.status === 1 ? "selected" : ""}`}
                          onClick={() => handleStatusChange(homestay, 1)}
                          title="Hoạt động"
                        >
                          <FaCheck />
                        </button>
                        <button
                          className={`status-btn status-pending ${homestay.status === 2 ? "selected" : ""}`}
                          onClick={() => handleStatusChange(homestay, 2)}
                          title="Chờ duyệt"
                        >
                          <FaClock />
                        </button>
                        <button
                          className={`status-btn status-ban ${homestay.status === 3 ? "selected" : ""}`}
                          onClick={() => handleStatusChange(homestay, 3)}
                          title="Bị khóa"
                        >
                          <FaBan />
                        </button>
                      </div>
                      <div className="divider-vertical"></div>
                      <div className="action-buttons-group">
                        <button
                          className="action-icon-btn detail-btn"
                          onClick={() => handleViewDetail(homestay)}
                          title="Thông tin chi tiết"
                        >
                          <FaHome />
                          <span className="btn-tooltip">Chi tiết</span>
                        </button>
                        <button
                          className="action-icon-btn history-btn"
                          onClick={() => handleViewHistory(homestay.id)}
                          title="Lịch sử trạng thái"
                        >
                          <FaHistory />
                          <span className="btn-tooltip">Lịch sử</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Hiển thị {indexOfFirstHomestay + 1} - {Math.min(indexOfLastHomestay, filteredHomestays.length)} trong tổng số {filteredHomestays.length} homestay
              </div>
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>

                {getPageNumbers().map((page, index) =>
                  typeof page === "number" ? (
                    <button
                      key={index}
                      className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ) : (
                    <span key={index} className="pagination-ellipsis">
                      {page}
                    </span>
                  )
                )}

                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Status Change Modal */}
      {showConfirmModal && confirmData.homestay && (
        <div className="modal-overlay" onClick={handleCancelStatusChange}>
          <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Xác nhận thay đổi trạng thái</h2>
              <button className="modal-close-btn" onClick={handleCancelStatusChange}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="confirm-message">
                <p>
                  Bạn có chắc muốn đổi trạng thái homestay <strong>"{confirmData.homestay.name}"</strong> thành{" "}
                  <strong className={getStatusClass(confirmData.newStatus)}>
                    {getStatusText(confirmData.newStatus)}
                  </strong>?
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="statusChangeReason">Lý do thay đổi (không bắt buộc):</label>
                <textarea
                  id="statusChangeReason"
                  className="form-textarea"
                  rows={4}
                  placeholder="Nhập lý do thay đổi trạng thái..."
                  value={statusChangeReason}
                  onChange={(e) => setStatusChangeReason(e.target.value)}
                  disabled={isUpdatingStatus}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary" 
                onClick={handleCancelStatusChange}
                disabled={isUpdatingStatus}
              >
                Hủy
              </button>
              <button 
                className="btn-primary" 
                onClick={handleConfirmStatusChange}
                disabled={isUpdatingStatus}
              >
                {isUpdatingStatus ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay" onClick={handleCloseHistoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lịch sử trạng thái</h2>
              <button className="modal-close-btn" onClick={handleCloseHistoryModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {loadingHistory ? (
                <div className="loading-detail">Đang tải lịch sử...</div>
              ) : statusHistory.length === 0 ? (
                <div className="history-no-data">
                  <FaHistory style={{ fontSize: 48, marginBottom: 16, color: "#d1d5db" }} />
                  <p>Chưa có lịch sử thay đổi trạng thái</p>
                </div>
              ) : (
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Trạng thái cũ</th>
                      <th>Trạng thái mới</th>
                      <th>Người thay đổi</th>
                      <th>Lý do</th>
                    </tr>
                  </thead>
                  <tbody>
                    {statusHistory.map((item, index) => (
                      <tr key={index}>
                        <td>{new Date(item.changedAt).toLocaleString("vi-VN")}</td>
                        <td>
                          <span className={`history-status-badge ${getStatusClass(item.oldStatus)}`}>
                            {getStatusText(item.oldStatus)}
                          </span>
                        </td>
                        <td>
                          <span className={`history-status-badge ${getStatusClass(item.newStatus)}`}>
                            {getStatusText(item.newStatus)}
                          </span>
                        </td>
                        <td>
                          {item.changedByName ? (
                            <div>
                              <div style={{ fontWeight: 600 }}>{item.changedByName}</div>
                              <div style={{ fontSize: 12, color: "#6b7280" }}>{item.changedByEmail}</div>
                            </div>
                          ) : (
                            <span style={{ color: "#9ca3af" }}>Hệ thống</span>
                          )}
                        </td>
                        <td>{item.reason || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseHistoryModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedHomestay && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chi tiết Homestay</h2>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              {loadingDetail ? (
                <div className="loading-detail">Đang tải...</div>
              ) : (
                <div className="detail-grid">
                  <div className="detail-row">
                    <label>ID:</label>
                    <span>{selectedHomestay.id}</span>
                  </div>
                  <div className="detail-row">
                    <label>Tên homestay:</label>
                    <span>{selectedHomestay.name}</span>
                  </div>
                  <div className="detail-row">
                    <label>Địa chỉ:</label>
                    <span>{selectedHomestay.address}</span>
                  </div>
                  <div className="detail-row">
                    <label>Thành phố:</label>
                    <span>{selectedHomestay.city || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <label>Giá cơ bản:</label>
                    <span>{(selectedHomestay.basePrice || selectedHomestay.base_price || 0).toLocaleString("vi-VN")} VNĐ/đêm</span>
                  </div>
                  <div className="detail-row">
                    <label>Sức chứa:</label>
                    <span>{selectedHomestay.capacity} người</span>
                  </div>
                  <div className="detail-row">
                    <label>Số phòng:</label>
                    <span>{selectedHomestay.numRooms || selectedHomestay.num_rooms || "N/A"}</span>
                  </div>
                  <div className="detail-row">
                    <label>Đánh giá:</label>
                    <span>{selectedHomestay.rating ? `${selectedHomestay.rating}/5` : "Chưa có"}</span>
                  </div>
                  <div className="detail-row">
                    <label>Trạng thái:</label>
                    <span className={`status-badge ${getStatusClass(selectedHomestay.status)}`}>
                      {getStatusText(selectedHomestay.status)}
                    </span>
                  </div>
                  {selectedHomestay.host && (
                    <>
                      <div className="detail-row">
                        <label>Chủ nhà:</label>
                        <span>{selectedHomestay.host.name}</span>
                      </div>
                      <div className="detail-row">
                        <label>Email chủ nhà:</label>
                        <span>{selectedHomestay.host.email || "N/A"}</span>
                      </div>
                    </>
                  )}
                  {selectedHomestay.description && (
                    <div className="detail-row full-width">
                      <label>Mô tả:</label>
                      <p className="description-text">{selectedHomestay.description}</p>
                    </div>
                  )}
                  {selectedHomestay.amenities && selectedHomestay.amenities.length > 0 && (
                    <div className="detail-row full-width">
                      <label>Tiện nghi:</label>
                      <div className="amenities-list">
                        {selectedHomestay.amenities.map((amenity, index) => (
                          <span key={index} className="amenity-tag">{amenity}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCloseModal}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .admin-homestay-list-page {
          max-width: 1600px;
          padding: 24px;
        }

        .page-header {
          margin-bottom: 24px;
        }

        .page-header h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .page-header p {
          margin: 0;
          color: #6b7280;
          font-size: 16px;
        }

        /* Search and Filter Wrapper */
        .search-and-filter-wrapper {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 350px;
          position: relative;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .search-box:focus-within {
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .search-icon-inline {
          color: #9ca3af;
          font-size: 16px;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
          color: #1f2937;
          padding-left: 0;
        }

        .search-box input::placeholder {
          color: #9ca3af;
        }

        .clear-search-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          padding: 0;
          background: #f3f4f6;
          border: none;
          border-radius: 50%;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-search-btn:hover {
          background: #e5e7eb;
          color: #374151;
        }

        /* Status Filter Dropdown */
        .status-filter-container {
          position: relative;
        }

        .status-filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .status-filter-btn:hover {
          border-color: #8b5cf6;
          background: #f9fafb;
        }

        .status-filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .filter-badge {
          display: inline-block;
          padding: 2px 8px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 200px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          z-index: 100;
          overflow: hidden;
          animation: dropdownSlideIn 0.2s ease-out;
        }

        @keyframes dropdownSlideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .status-dropdown button {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 12px 16px;
          background: white;
          border: none;
          text-align: left;
          font-size: 14px;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .status-dropdown button:hover {
          background: #f9fafb;
        }

        .status-dropdown button.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          font-weight: 600;
        }

        .status-dropdown button svg {
          font-size: 14px;
        }

        /* Search Results Info */
        .search-results-info {
          padding: 12px 16px;
          background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%);
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #4c1d95;
        }

        .search-results-info strong {
          color: #5b21b6;
          font-weight: 700;
        }

        .loading {
          text-align: center;
          padding: 60px;
          color: #6b7280;
          background: white;
          border-radius: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 80px 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          color: #9ca3af;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .empty-state p {
          margin: 0;
          color: #6b7280;
        }

        /* Homestay List */
        .homestays-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .homestay-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
        }

        .homestay-card:hover {
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
          border-color: #8b5cf6;
          transform: translateX(4px);
        }

        .homestay-card:hover .card-number {
          transform: scale(1.1);
        }

        .card-number {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .card-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 0;
          padding-left: 50px;
          position: relative;
        }

        .avatar-circle {
          width: 52px;
          height: 52px;
          min-width: 52px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 22px;
          font-weight: 700;
          text-transform: uppercase;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .homestay-info {
          flex: 1;
          min-width: 0;
        }

        .homestay-name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .homestay-name {
          font-size: 17px;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .homestay-id {
          font-size: 12px;
          color: #6b7280;
          font-weight: 500;
        }

        .homestay-host {
          font-size: 13px;
          color: #6b7280;
          margin: 0;
        }

        .role-badge {
          display: flex;
          align-items: center;
          margin-left: auto;
        }

        .homestay-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
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

        .status-btn.status-pending.selected {
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

        /* Divider Vertical */
        .divider-vertical {
          width: 1px;
          height: 40px;
          background: linear-gradient(180deg, transparent 0%, #cbd5e1 20%, #cbd5e1 80%, transparent 100%);
          margin: 0 4px;
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

        .btn-tooltip {
          position: absolute;
          bottom: -32px;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 500;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.2s;
          z-index: 10;
        }

        .btn-tooltip::before {
          content: "";
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 4px solid transparent;
          border-right: 4px solid transparent;
          border-bottom: 4px solid #1f2937;
        }

        .action-icon-btn:hover .btn-tooltip {
          opacity: 1;
          bottom: -36px;
        }

        /* Status Badges */
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-badge.banned {
          background: #fee2e2;
          color: #991b1b;
        }

        .status-badge.inactive {
          background: #f3f4f6;
          color: #6b7280;
        }

        .status-badge.unknown {
          background: #e5e7eb;
          color: #4b5563;
        }

        /* Action Buttons */
        .action-btn {
          padding: 7px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .action-btn.view:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        /* Pagination */
        .pagination-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 24px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          flex-wrap: wrap;
          gap: 16px;
        }

        .pagination-info {
          font-size: 14px;
          color: #6b7280;
        }

        .pagination {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .pagination-btn {
          padding: 8px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          border-color: #8b5cf6;
          background: #f9fafb;
        }

        .pagination-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-ellipsis {
          padding: 8px 12px;
          color: #9ca3af;
          font-weight: 500;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .empty-state h3,
        .dark .homestay-name {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .empty-state p,
        .dark .info-label {
          color: #94a3b8;
        }

        .dark .search-box,
        .dark .status-filter-btn,
        .dark .status-dropdown,
        .dark .loading,
        .dark .empty-state,
        .dark .homestay-card,
        .dark .pagination-container {
          background: #1e293b;
          border-color: #334155;
        }

        .dark .homestay-card:hover {
          background: #1e293b;
          border-color: #8b5cf6;
          box-shadow: 0 8px 24px rgba(139, 92, 246, 0.3);
        }

        .dark .card-header {
          border-bottom-color: #334155;
        }

        .dark .card-actions {
          border-top-color: #334155;
        }

        .dark .info-row {
          border-bottom-color: #334155;
        }

        .dark .homestay-host {
          color: #94a3b8;
        }

        .dark .homestay-id {
          background: #334155;
          color: #cbd5e1;
        }

        .dark .info-value {
          color: #f1f5f9;
        }

        .dark .search-box input {
          color: #f1f5f9;
        }

        .dark .search-box input::placeholder {
          color: #64748b;
        }

        .dark .status-dropdown button {
          background: #1e293b;
          color: #cbd5e1;
        }

        .dark .status-dropdown button:hover {
          background: #0f172a;
        }

        .dark .search-results-info {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #cbd5e1;
        }

        .dark .search-results-info strong {
          color: #e0e7ff;
        }

        .dark .action-icon-btn {
          background: #1e293b;
          border-color: #334155;
          color: #94a3b8;
        }

        .dark .action-icon-btn:hover {
          background: #0f172a;
          border-color: #8b5cf6;
          color: #8b5cf6;
        }

        .dark .pagination-btn {
          background: #1e293b;
          border-color: #334155;
          color: #cbd5e1;
        }

        .dark .pagination-btn:hover:not(:disabled) {
          background: #0f172a;
          border-color: #8b5cf6;
        }

        .dark .pagination-info {
          color: #94a3b8;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .card-actions {
            flex-wrap: wrap;
          }

          .action-icon-btn {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 768px) {
          .search-and-filter-wrapper {
            flex-direction: column;
          }

          .search-box {
            min-width: 100%;
          }

          .card-header {
            flex-wrap: wrap;
            padding-left: 20px;
          }

          .card-number {
            position: static;
            margin-bottom: 12px;
          }

          .role-badge {
            width: 100%;
            margin-left: 0;
            margin-top: 8px;
          }

          .card-actions {
            width: 100%;
            margin-left: 0;
            margin-top: 12px;
            justify-content: center;
          }

          .homestay-name {
            font-size: 16px;
          }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .modal-content {
          background: white;
          border-radius: 16px;
          width: 90%;
          max-width: 800px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease-out;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .dark .modal-content {
          background: #1e293b;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 2px solid #e5e7eb;
          background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
        }

        .dark .modal-header {
          border-bottom-color: #334155;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        }

        .modal-header h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #1f2937;
        }

        .dark .modal-header h2 {
          color: #f1f5f9;
        }

        .modal-close-btn {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          border: none;
          background: white;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
        }

        .modal-close-btn:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        .dark .modal-close-btn {
          background: #0f172a;
          color: #94a3b8;
        }

        .dark .modal-close-btn:hover {
          background: #334155;
          color: #f1f5f9;
        }

        .modal-body {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
        }

        .loading-detail {
          text-align: center;
          padding: 40px;
          color: #6b7280;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .detail-row {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .detail-row.full-width {
          grid-column: 1 / -1;
        }

        .detail-row label {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .detail-row span {
          font-size: 15px;
          color: #1f2937;
          font-weight: 500;
        }

        .dark .detail-row label {
          color: #94a3b8;
        }

        .dark .detail-row span {
          color: #f1f5f9;
        }

        .description-text {
          margin: 0;
          font-size: 14px;
          color: #374151;
          line-height: 1.6;
        }

        .dark .description-text {
          color: #cbd5e1;
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .amenity-tag {
          display: inline-block;
          padding: 6px 12px;
          background: linear-gradient(135deg, #e0e7ff 0%, #ddd6fe 100%);
          color: #5b21b6;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
        }

        .dark .amenity-tag {
          background: linear-gradient(135deg, #312e81 0%, #4c1d95 100%);
          color: #e0e7ff;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 2px solid #e5e7eb;
          background: #f9fafb;
        }

        .dark .modal-footer {
          border-top-color: #334155;
          background: #0f172a;
        }

        .btn-secondary {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .dark .btn-secondary {
          background: #334155;
          color: #cbd5e1;
        }

        .dark .btn-secondary:hover {
          background: #475569;
        }

        .btn-primary {
          padding: 10px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Confirm Modal */
        .confirm-modal {
          max-width: 500px;
        }

        .confirm-message {
          margin-bottom: 20px;
          padding: 16px;
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          border-radius: 4px;
        }

        .confirm-message p {
          margin: 0;
          line-height: 1.6;
          color: #1e40af;
        }

        .dark .confirm-message {
          background: #1e3a5f;
          border-left-color: #60a5fa;
        }

        .dark .confirm-message p {
          color: #93c5fd;
        }

        .form-group {
          margin-bottom: 16px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          font-size: 14px;
          color: #374151;
        }

        .dark .form-group label {
          color: #cbd5e1;
        }

        .form-textarea {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .form-textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-textarea:disabled {
          background: #f3f4f6;
          cursor: not-allowed;
        }

        .dark .form-textarea {
          background: #1e293b;
          border-color: #334155;
          color: #cbd5e1;
        }

        .dark .form-textarea:focus {
          border-color: #818cf8;
        }

        .dark .form-textarea:disabled {
          background: #0f172a;
        }

        @media (max-width: 768px) {
          .modal-content {
            width: 95%;
            max-height: 95vh;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        /* History Modal */
        .history-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
          color: white;
        }

        .history-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(139, 92, 246, 0.3);
        }

        .history-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin-top: 16px;
          overflow: hidden;
          border-radius: 8px;
        }

        .history-table thead {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .history-table th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }

        .history-table tbody tr {
          background: white;
          transition: background 0.2s;
        }

        .history-table tbody tr:nth-child(even) {
          background: #f9fafb;
        }

        .history-table tbody tr:hover {
          background: #f3f4f6;
        }

        .history-table td {
          padding: 12px 16px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }

        .history-status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .history-no-data {
          text-align: center;
          padding: 32px;
          color: #9ca3af;
        }

        .dark .history-table tbody tr {
          background: #1e293b;
        }

        .dark .history-table tbody tr:nth-child(even) {
          background: #0f172a;
        }

        .dark .history-table tbody tr:hover {
          background: #334155;
        }

        .dark .history-table td {
          border-bottom-color: #334155;
        }
      `}</style>
    </div>
  );
};

export default AdminHomestayListPage;
