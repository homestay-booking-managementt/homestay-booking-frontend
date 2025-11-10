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
  FaChevronDown,
  FaChevronUp,
  FaList,
  FaClock,
  FaEdit
} from "react-icons/fa";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHomestayMenu, setShowHomestayMenu] = useState(false);

  const menuItems = [
    { path: "/admin", label: "Dashboard", icon: <FaChartLine /> },
    { path: "/admin/users", label: "Người dùng", icon: <FaUsers /> },
    { 
      path: "/admin/homestays", 
      label: "Homestay", 
      icon: <FaHome />,
      submenu: [
        { path: "/admin/homestays", label: "Danh sách", icon: <FaList /> },
        { path: "/admin/homestays/pending", label: "Chờ duyệt", icon: <FaClock /> },
        { path: "/admin/homestays/update-requests", label: "Yêu cầu cập nhật", icon: <FaEdit /> },
      ]
    },
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
            <div key={item.path}>
              {item.submenu ? (
                <>
                  <div
                    className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                    onClick={() => setShowHomestayMenu(!showHomestayMenu)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-chevron" style={{ marginLeft: "auto", fontSize: "12px" }}>
                      {showHomestayMenu ? <FaChevronUp /> : <FaChevronDown />}
                    </span>
                  </div>
                  {showHomestayMenu && (
                    <div className="nav-submenu">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`nav-subitem ${location.pathname === subItem.path ? "active" : ""}`}
                        >
                          <span className="nav-icon">{subItem.icon}</span>
                          <span className="nav-label">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? "active" : ""}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </Link>
              )}
            </div>
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
                <div className="user-avatar">AD</div>
                <span className="user-name">{currentUser?.userName || "Admin"}</span>
                <span className="dropdown-arrow">▼</span>
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <div className="dropdown-item" onClick={() => navigate("/profile")}>
                    <FaUsers style={{ marginRight: "8px" }} /> Hồ sơ
                  </div>
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
          width: 280px;
          background: #fff;
          box-shadow: 2px 0 10px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .dark .admin-sidebar {
          background: #16213e;
        }

        .admin-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          border-bottom: 1px solid #e8ecef;
          height: 50px;
        }

        .dark .admin-logo {
          border-bottom-color: #2d3a52;
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
        }

        .logo-text h1 {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          line-height: 1.2;
        }

        .dark .logo-text h1 {
          color: #fff;
        }

        .logo-text p {
          margin: 0;
          font-size: 11px;
          color: #718096;
          line-height: 1.2;
        }

        .dark .logo-text p {
          color: #a0aec0;
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
          border-radius: 8px;
          color: #4a5568;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 14px;
        }

        .dark .nav-item {
          color: #cbd5e0;
        }

        .nav-item:hover {
          background: #f7fafc;
          color: #667eea;
        }

        .dark .nav-item:hover {
          background: #1e2a47;
        }

        .nav-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .nav-icon {
          font-size: 18px;
          color: #6b7280;
        }

        .nav-item.active .nav-icon {
          color: white;
        }

        .nav-chevron {
          display: flex;
          align-items: center;
          color: #6b7280;
          transition: transform 0.2s;
        }

        .nav-item.active .nav-chevron {
          color: white;
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
          color: #4a5568;
          text-decoration: none;
          transition: all 0.2s;
          font-size: 13px;
        }

        .dark .nav-subitem {
          color: #cbd5e0;
        }

        .nav-subitem:hover {
          background: #f7fafc;
          color: #667eea;
        }

        .dark .nav-subitem:hover {
          background: #1e2a47;
        }

        .nav-subitem.active {
          background: #eef2ff;
          color: #667eea;
          font-weight: 500;
        }

        .dark .nav-subitem.active {
          background: #1e2a47;
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
          background: #fff;
          padding: 8px 32px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
        }

        .dark .admin-header {
          background: #16213e;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .header-left h2 {
          margin: 0;
          font-size: 20px;
          font-weight: 600;
          color: #2d3748;
        }

        .dark .header-left h2 {
          color: #fff;
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

        /* Content */
        .admin-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
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
