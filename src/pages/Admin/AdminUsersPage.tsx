import { useEffect, useState } from "react";
import { fetchUsers, updateUserStatus } from "@/api/adminApi";
import type { AdminUser } from "@/types/admin";
import { showAlert } from "@/utils/showAlert";

const AdminUsersPage = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "CUSTOMER" | "HOST" | "ADMIN">("ALL");

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers(filter === "ALL" ? undefined : filter);
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Không thể tải danh sách người dùng", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: number, currentStatus: 0 | 1) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      await updateUserStatus(userId, { status: newStatus as 0 | 1 });
      showAlert("Cập nhật trạng thái thành công", "success");
      loadUsers();
    } catch (error) {
      showAlert("Không thể cập nhật trạng thái", "danger");
    }
  };

  const filteredUsers = users;

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <h1>Quản lý Người dùng</h1>
        <p>Quản lý thông tin và trạng thái người dùng trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <button
            className={`filter-btn ${filter === "ALL" ? "active" : ""}`}
            onClick={() => setFilter("ALL")}
          >
            Tất cả
          </button>
          <button
            className={`filter-btn ${filter === "CUSTOMER" ? "active" : ""}`}
            onClick={() => setFilter("CUSTOMER")}
          >
            Khách hàng
          </button>
          <button
            className={`filter-btn ${filter === "HOST" ? "active" : ""}`}
            onClick={() => setFilter("HOST")}
          >
            Chủ nhà
          </button>
          <button
            className={`filter-btn ${filter === "ADMIN" ? "active" : ""}`}
            onClick={() => setFilter("ADMIN")}
          >
            Admin
          </button>
        </div>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="loading">Đang tải...</div>
      ) : (
        <div className="table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role.toLowerCase()}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.status === 1 ? "active" : "inactive"}`}>
                      {user.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`action-btn ${user.status === 1 ? "deactivate" : "activate"}`}
                      onClick={() => handleToggleStatus(user.id, user.status)}
                    >
                      {user.status === 1 ? "Vô hiệu hóa" : "Kích hoạt"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .admin-users-page {
          max-width: 1400px;
        }

        .page-header {
          margin-bottom: 32px;
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

        .filter-bar {
          background: white;
          padding: 20px;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .filter-group {
          display: flex;
          gap: 12px;
        }

        .filter-btn {
          padding: 10px 20px;
          border: 1px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          cursor: pointer;
          transition: all 0.2s;
        }

        .filter-btn:hover {
          background: #f9fafb;
          border-color: #d1d5db;
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
        }

        .table-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: #f9fafb;
        }

        .users-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .users-table td {
          padding: 16px 20px;
          border-top: 1px solid #f3f4f6;
          font-size: 14px;
          color: #1f2937;
        }

        .users-table tbody tr:hover {
          background: #f9fafb;
        }

        .role-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .role-customer {
          background: #dbeafe;
          color: #1e40af;
        }

        .role-host {
          background: #fef3c7;
          color: #92400e;
        }

        .role-admin {
          background: #fce7f3;
          color: #9f1239;
        }

        .status-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status-badge.active {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.inactive {
          background: #fee2e2;
          color: #991b1b;
        }

        .action-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .action-btn.activate {
          background: #10b981;
          color: white;
        }

        .action-btn.activate:hover {
          background: #059669;
        }

        .action-btn.deactivate {
          background: #ef4444;
          color: white;
        }

        .action-btn.deactivate:hover {
          background: #dc2626;
        }

        /* Dark Mode */
        .dark .page-header h1 {
          color: #f1f5f9;
        }

        .dark .page-header p {
          color: #94a3b8;
        }

        .dark .filter-bar,
        .dark .table-container {
          background: #1e293b;
        }

        .dark .filter-btn {
          background: #0f172a;
          color: #cbd5e0;
          border-color: #334155;
        }

        .dark .filter-btn:hover {
          background: #1e293b;
        }

        .dark .users-table thead {
          background: #0f172a;
        }

        .dark .users-table th {
          color: #94a3b8;
        }

        .dark .users-table td {
          color: #e2e8f0;
          border-top-color: #334155;
        }

        .dark .users-table tbody tr:hover {
          background: #0f172a;
        }
      `}</style>
    </div>
  );
};

export default AdminUsersPage;
