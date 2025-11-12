import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/auth/authSlice";
import {
  FaChartLine,
  FaUsers,
  FaHome,
  FaCalendarAlt,
  FaDollarSign,
  FaExclamationTriangle,
  FaCog,
  FaMoon,
  FaSun,
  FaSignOutAlt,
} from "react-icons/fa";
import "./AdminGlobalStyles.css";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Function to get initials from name
  const getInitials = (name?: string | null) => {
    if (!name) return "AD";
    const words = name.trim().split(" ");
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaChartLine /> },
    { path: "/admin/users", label: "Người dùng", icon: <FaUsers /> },
    { path: "/admin/homestays", label: "Homestay", icon: <FaHome /> },
    { path: "/admin/bookings", label: "Đặt phòng", icon: <FaCalendarAlt /> },
    { path: "/admin/revenue", label: "Doanh thu", icon: <FaDollarSign /> },
    { path: "/admin/complaints", label: "Khiếu nại", icon: <FaExclamationTriangle /> },
    { path: "/admin/settings", label: "Cài đặt", icon: <FaCog /> },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const isActive = (path: string) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`admin-layout ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">
          {/* <div className="logo-circle">BHM</div> */}
          <div className="logo-text">
            <h1>Booking Homestays</h1>
            <p>Quản lý đặt phòng homestay</p>
          </div>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {/* Header */}
        <header className="admin-header">
          <div className="header-left">
            {/* <h2>Homestay Booking Management</h2> */}
          </div>
          
          <div className="header-right">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              title={darkMode ? "Chế độ sáng" : "Chế độ tối"}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>

            <div className="user-menu">
              <button className="user-button" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="user-avatar">{getInitials(currentUser?.userName)}</div>
                <span className="user-name">{currentUser?.userName || "Admin"}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item" onClick={() => {
                    navigate("/admin/settings");
                    setShowUserMenu(false);
                  }}>
                    <FaCog style={{ marginRight: "8px" }} /> Cài đặt
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item" onClick={handleLogout}>
                    <FaSignOutAlt style={{ marginRight: "8px" }} /> Đăng xuất
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="admin-content">
          <Outlet />
        </div>
      </main>

      <style>{`
        .admin-layout {
          display: flex;
          height: 100vh;
          background: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .admin-layout.dark {
          background: #1a1a2e;
          color: #eee;
        }

        /* Sidebar */
        .admin-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #ffffff 0%, #f0f9ff 50%, #e0f7fa 100%);
          border-right: 1px solid rgba(99, 179, 237, 0.15);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          box-shadow: 2px 0 15px rgba(99, 179, 237, 0.08);
        }

        .dark .admin-sidebar {
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #1e3a5f 100%);
          border-right-color: rgba(99, 179, 237, 0.1);
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid rgba(99, 179, 237, 0.15);
          height: 50px;
        }

        .dark .admin-logo {
          border-bottom-color: rgba(99, 179, 237, 0.2);
        }

        .logo-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .logo-text h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1.2;
        }

        .dark .logo-text h1 {
          color: #fff;
          background: none;
          -webkit-text-fill-color: #fff;
        }

        .logo-text p {
          margin: 0;
          font-size: 11px;
          color: #64748b;
          line-height: 1.2;
        }

        .dark .logo-text p {
          color: #94a3b8;
        }

        .admin-nav {
          flex: 1;
          padding: 20px 0;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          margin: 4px 12px;
          border-radius: 10px;
          color: #475569;
          text-decoration: none;
          transition: all 0.3s;
          font-size: 14px;
        }

        .dark .nav-item {
          color: #cbd5e0;
        }

        .nav-item:hover {
          background: rgba(99, 179, 237, 0.1);
          color: #0ea5e9;
          transform: translateX(4px);
        }

        .dark .nav-item:hover {
          background: rgba(99, 179, 237, 0.15);
        }

        .nav-item.active {
          background: linear-gradient(135deg, rgba(99, 179, 237, 0.15) 0%, rgba(125, 211, 252, 0.15) 100%);
          color: #0284c7;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(99, 179, 237, 0.2);
          border-left: 3px solid #0ea5e9;
        }

        .dark .nav-item.active {
          color: #7dd3fc;
          border-left-color: #38bdf8;
        }

        .nav-icon {
          font-size: 18px;
          color: #64748b;
        }

        .nav-item:hover .nav-icon {
          color: #0ea5e9;
        }

        .nav-item.active .nav-icon {
          color: #0284c7;
        }

        .dark .nav-item.active .nav-icon {
          color: #7dd3fc;
        }

        .nav-chevron {
          display: flex;
          align-items: center;
          color: #64748b;
          transition: transform 0.2s;
        }

        .nav-item.active .nav-chevron {
          color: #0284c7;
        }

        .dark .nav-item.active .nav-chevron {
          color: #7dd3fc;
        }

        .nav-submenu {
          margin: 4px 0 8px 0;
          padding-left: 12px;
        }

        .nav-subitem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px 10px 32px;
          margin: 2px 12px;
          border-radius: 8px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 13px;
        }

        .dark .nav-subitem {
          color: #94a3b8;
        }

        .nav-subitem:hover {
          background: rgba(99, 179, 237, 0.08);
          color: #0ea5e9;
          transform: translateX(2px);
        }

        .dark .nav-subitem:hover {
          background: rgba(99, 179, 237, 0.1);
        }

        .nav-subitem.active {
          background: rgba(99, 179, 237, 0.12);
          color: #0284c7;
          font-weight: 500;
        }

        .dark .nav-subitem.active {
          background: rgba(99, 179, 237, 0.15);
          color: #7dd3fc;
        }

        .nav-subitem .nav-icon {
          font-size: 14px;
        }

        /* Main */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Header */
        .admin-header {
          background: #ffffff;
          padding: 8px 32px;
          box-shadow: 0 1px 3px rgba(99, 179, 237, 0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          border-bottom: 1px solid rgba(99, 179, 237, 0.1);
        }

        .dark .admin-header {
          background: #0f172a;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
          border-bottom-color: rgba(99, 179, 237, 0.2);
        }

        .header-left h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .dark .header-left h2 {
          background: linear-gradient(135deg, #38bdf8 0%, #22d3ee 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .theme-toggle {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
          color: #6b7280;
        }

        .theme-toggle:hover {
          background: #f7fafc;
        }

        .dark .theme-toggle:hover {
          background: #1e2a47;
        }

        .user-menu {
          position: relative;
        }

        .user-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .user-button:hover {
          background: #f7fafc;
        }

        .dark .user-button:hover {
          background: #1e2a47;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .user-name {
          font-weight: 500;
          color: #2d3748;
        }

        .dark .user-name {
          color: #fff;
        }

        .dropdown-arrow {
          font-size: 10px;
          color: #718096;
        }

        .user-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          min-width: 180px;
          overflow: hidden;
          z-index: 1000;
        }

        .dark .user-dropdown {
          background: #16213e;
        }

        .dropdown-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          color: #2d3748;
        }

        .dark .dropdown-item {
          color: #cbd5e0;
        }

        .dropdown-item:hover {
          background: #f7fafc;
        }

        .dark .dropdown-item:hover {
          background: #1e2a47;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
          margin: 4px 0;
        }

        .dark .dropdown-divider {
          background: #2d3748;
        }

        /* Content */
        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
          background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #f8fafc 100%);
          position: relative;
        }

        .admin-content::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.02) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }

        .dark .admin-content {
          background: #0a1929;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-sidebar {
            width: 70px;
          }

          .logo-text,
          .nav-label {
            display: none;
          }

          .admin-logo {
            justify-content: center;
            padding: 20px 10px;
          }

          .nav-item {
            justify-content: center;
            margin: 4px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
