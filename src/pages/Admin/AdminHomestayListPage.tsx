import { useEffect, useState } from "react";
import { fetchPendingHomestayRequests } from "@/api/adminApi";
import type { AdminHomestayRequest } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";
import { FaHome, FaSearch, FaFilter } from "react-icons/fa";

const AdminHomestayListPage = () => {
  const [homestays, setHomestays] = useState<AdminHomestayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    loadHomestays();
  }, []);

  const loadHomestays = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call to get all homestays
      const data = await fetchPendingHomestayRequests();
      setHomestays(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách homestay", "danger");
    } finally {
      setLoading(false);
    }
  };

  const filteredHomestays = homestays.filter((h) => {
    const matchSearch = h.homestayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || h.type === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="admin-homestay-list-page">
      <div className="page-header">
        <h1>Danh sách Homestay</h1>
        <p>Quản lý toàn bộ homestay trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="filter-section">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm homestay..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${statusFilter === "ALL" ? "active" : ""}`}
            onClick={() => setStatusFilter("ALL")}
          >
            <FaFilter /> Tất cả
          </button>
          <button
            className={`filter-btn ${statusFilter === "ACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("ACTIVE")}
          >
            Đang hoạt động
          </button>
          <button
            className={`filter-btn ${statusFilter === "INACTIVE" ? "active" : ""}`}
            onClick={() => setStatusFilter("INACTIVE")}
          >
            Ngừng hoạt động
          </button>
        </div>
      </div>

      {/* Homestay List */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : filteredHomestays.length === 0 ? (
        <div className="empty-state">
          <FaHome className="empty-icon" />
          <h3>Không có homestay nào</h3>
          <p>Không tìm thấy homestay phù hợp với bộ lọc</p>
        </div>
      ) : (
        <div className="homestay-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên Homestay</th>
                <th>Chủ nhà</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredHomestays.map((homestay) => (
                <tr key={homestay.id}>
                  <td>#{homestay.id}</td>
                  <td className="homestay-name">{homestay.homestayName}</td>
                  <td>{homestay.ownerName}</td>
                  <td>N/A</td>
                  <td>
                    <span className={`status-badge ${homestay.type.toLowerCase()}`}>
                      {homestay.type === "CREATE" ? "Mới" : "Cập nhật"}
                    </span>
                  </td>
                  <td>
                    {homestay.submittedAt
                      ? new Date(homestay.submittedAt).toLocaleDateString("vi-VN")
                      : "N/A"}
                  </td>
                  <td>
                    <button className="action-btn view">Xem chi tiết</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-homestay-list-page {
          max-width: 1400px;
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

        .filter-section {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .search-box {
          flex: 1;
          min-width: 300px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          color: #6b7280;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 14px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
        }

        .filter-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
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

        .homestay-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #f9fafb;
        }

        th {
          padding: 16px;
          text-align: left;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        td {
          padding: 16px;
          font-size: 14px;
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
        }

        tbody tr:hover {
          background: #f9fafb;
        }

        .homestay-name {
          font-weight: 600;
          color: #1f2937;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.create {
          background: #dbeafe;
          color: #1e40af;
        }

        .status-badge.update {
          background: #fef3c7;
          color: #92400e;
        }

        .action-btn {
          padding: 6px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn.view {
          background: #eff6ff;
          color: #1e40af;
        }

        .action-btn.view:hover {
          background: #dbeafe;
        }

        /* Dark Mode */
        .dark .page-header h1,
        .dark .empty-state h3,
        .dark .homestay-name {
          color: #f1f5f9;
        }

        .dark .page-header p,
        .dark .empty-state p,
        .dark td {
          color: #94a3b8;
        }

        .dark .search-box,
        .dark .filter-btn,
        .dark .loading,
        .dark .empty-state,
        .dark .homestay-table {
          background: #1e293b;
          border-color: #334155;
        }

        .dark thead {
          background: #0f172a;
        }

        .dark th {
          color: #cbd5e1;
          border-bottom-color: #334155;
        }

        .dark tbody tr:hover {
          background: #0f172a;
        }

        .dark td {
          border-bottom-color: #334155;
        }
      `}</style>
    </div>
  );
};

export default AdminHomestayListPage;
