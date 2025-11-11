import { FaCog, FaLock, FaEnvelope, FaBell } from "react-icons/fa";

const AdminSettingsPage = () => {
  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <h1>Cài đặt Hệ thống</h1>
        <p>Quản lý cấu hình và cài đặt của hệ thống</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <div className="setting-icon">
            <FaCog />
          </div>
          <h3>Cài đặt chung</h3>
          <p>Cấu hình các thiết lập cơ bản của hệ thống</p>
          <button className="setting-btn">Cấu hình</button>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <FaLock />
          </div>
          <h3>Bảo mật</h3>
          <p>Quản lý mật khẩu và quyền truy cập</p>
          <button className="setting-btn">Cấu hình</button>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <FaEnvelope />
          </div>
          <h3>Email</h3>
          <p>Cấu hình máy chủ email và template</p>
          <button className="setting-btn">Cấu hình</button>
        </div>

        <div className="setting-card">
          <div className="setting-icon">
            <FaBell />
          </div>
          <h3>Thông báo</h3>
          <p>Thiết lập thông báo và cảnh báo</p>
          <button className="setting-btn">Cấu hình</button>
        </div>
      </div>

      <style>{`
        .admin-settings-page {
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

        .settings-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
        }

        .setting-card {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .setting-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .setting-icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: #6b7280;
        }

        .setting-card h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
          color: #1f2937;
        }

        .setting-card p {
          margin: 0 0 20px 0;
          color: #6b7280;
          font-size: 14px;
        }

        .setting-btn {
          padding: 10px 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .setting-btn:hover {
          opacity: 0.9;
        }

        /* Dark Mode */
        .dark .page-header h1 {
          color: #f1f5f9;
        }

        .dark .page-header p {
          color: #94a3b8;
        }

        .dark .setting-card {
          background: #1e293b;
        }

        .dark .setting-card h3 {
          color: #f1f5f9;
        }

        .dark .setting-card p {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AdminSettingsPage;
