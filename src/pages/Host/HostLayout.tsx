import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/app/hooks";
import {
  FaHome,
  FaCalendarCheck,
  FaDollarSign,
  FaMoneyCheckAlt,
  FaComments,
  FaCog,
  FaTachometerAlt,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaMoon,
  FaSun,
  FaCheckCircle,
  FaInfoCircle,
  FaExclamationTriangle,
} from "react-icons/fa";
import "@/styles/dark-theme.css";

const HostLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("host-dark-mode");
    return saved ? JSON.parse(saved) : false;
  });
  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      path: "/host/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
    },
    {
      path: "/host/homestays",
      icon: <FaHome />,
      label: "Homestay",
    },
    {
      path: "/host/booking-requests",
      icon: <FaCalendarCheck />,
      label: "Đặt phòng",
    },
    {
      path: "/host/revenue",
      icon: <FaDollarSign />,
      label: "Doanh thu",
    },
    {
      path: "/host/payments",
      icon: <FaMoneyCheckAlt />,
      label: "Thanh toán",
    },
    {
      path: "/host/chat",
      icon: <FaComments />,
      label: "Tin nhắn",
    },
    {
      path: "/host/settings",
      icon: <FaCog />,
      label: "Cài đặt",
    },
  ];

  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Đặt phòng mới",
      message: "Bạn có 1 yêu cầu đặt phòng mới từ Nguyễn Văn A",
      time: "5 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "info",
      title: "Thanh toán thành công",
      message: "Đã nhận thanh toán 2,500,000 VNĐ cho booking #12345",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Homestay cần cập nhật",
      message: "Homestay 'Villa Seaview' cần cập nhật thông tin",
      time: "3 giờ trước",
      read: true,
    },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
    setShowNotifications(false);
  };

  // Apply dark mode to body on mount and when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("host-dark-mode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <FaCheckCircle style={{ color: "#10b981" }} />;
      case "warning":
        return <FaExclamationTriangle style={{ color: "#f59e0b" }} />;
      case "info":
      default:
        return <FaInfoCircle style={{ color: "#3b82f6" }} />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <style>{`
        .host-layout {
          display: flex;
          height: 100vh;
          background: #f5f7fa;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* Sidebar */
        .host-sidebar {
          width: 260px;
          background: linear-gradient(180deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%);
          border-right: 1px solid rgba(16, 185, 129, 0.15);
          display: flex;
          flex-direction: column;
          height: 100vh;
          position: sticky;
          top: 0;
          overflow-y: auto;
          box-shadow: 2px 0 15px rgba(16, 185, 129, 0.08);
        }

        .host-logo {
          display: flex;
          flex-direction: column;
          padding: 20px;
          border-bottom: 1px solid rgba(16, 185, 129, 0.15);
        }

        .host-logo h1 {
          margin: 0 0 4px 0;
          font-size: 20px;
          font-weight: 700;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .host-logo p {
          margin: 0;
          font-size: 12px;
          color: #64748b;
        }

        .host-nav {
          flex: 1;
          padding: 16px 0;
        }

        .host-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #334155;
          text-decoration: none;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          font-size: 14px;
          font-weight: 500;
        }

        .host-nav-item:hover {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
          border-left-color: #10b981;
        }

        .host-nav-item.active {
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
          color: #10b981;
          border-left-color: #10b981;
          font-weight: 600;
        }

        .host-nav-icon {
          font-size: 18px;
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Main Content */
        .host-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Header */
        .host-header {
          height: 70px;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .host-header-left h1 {
          margin: 0;
          font-size: 22px;
          font-weight: 600;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .host-header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .host-header-btn {
          position: relative;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 18px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .host-header-btn:hover {
          background: rgba(16, 185, 129, 0.08);
          color: #10b981;
        }

        .host-notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 5px;
          border-radius: 10px;
          min-width: 16px;
          text-align: center;
        }

        .host-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: rgba(16, 185, 129, 0.08);
          border-radius: 8px;
          color: #334155;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .host-user:hover {
          background: rgba(16, 185, 129, 0.15);
        }

        .host-user svg {
          color: #10b981;
        }

        /* Dropdown styles */
        .host-dropdown {
          position: relative;
        }

        .host-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 320px;
          z-index: 1000;
          overflow: hidden;
          animation: slideDown 0.2s ease;
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

        .host-dropdown-header {
          padding: 16px;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .host-dropdown-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
        }

        .host-dropdown-clear {
          background: transparent;
          border: none;
          color: #10b981;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .host-dropdown-clear:hover {
          background: rgba(16, 185, 129, 0.1);
        }

        .host-dropdown-list {
          max-height: 400px;
          overflow-y: auto;
        }

        .host-notification-item {
          display: flex;
          gap: 12px;
          padding: 14px 16px;
          border-bottom: 1px solid #f3f4f6;
          cursor: pointer;
          transition: all 0.2s;
          background: white;
        }

        .host-notification-item:hover {
          background: #f9fafb;
        }

        .host-notification-item.unread {
          background: #f0fdf4;
        }

        .host-notification-item.unread:hover {
          background: #dcfce7;
        }

        .host-notification-icon {
          font-size: 20px;
          margin-top: 2px;
        }

        .host-notification-content {
          flex: 1;
        }

        .host-notification-title {
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 4px 0;
        }

        .host-notification-message {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 4px 0;
          line-height: 1.4;
        }

        .host-notification-time {
          font-size: 12px;
          color: #9ca3af;
        }

        .host-dropdown-empty {
          padding: 40px 20px;
          text-align: center;
          color: #9ca3af;
        }

        .host-dropdown-empty svg {
          font-size: 48px;
          margin-bottom: 12px;
          opacity: 0.3;
        }

        /* User menu dropdown */
        .host-user-menu {
          min-width: 200px;
        }

        .host-user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          color: #374151;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border: none;
          background: white;
          width: 100%;
          text-align: left;
          font-size: 14px;
        }

        .host-user-menu-item:hover {
          background: #f9fafb;
          color: #10b981;
        }

        .host-user-menu-item svg {
          font-size: 16px;
          color: #6b7280;
        }

        .host-user-menu-item:hover svg {
          color: #10b981;
        }

        .host-user-menu-divider {
          height: 1px;
          background: #e5e7eb;
          margin: 4px 0;
        }

        /* Content */
        .host-content {
          flex: 1;
          overflow-y: auto;
          padding: 24px 32px;
        }
      `}</style>

      <div className="host-layout">
        {/* Sidebar */}
        <aside className="host-sidebar">
          <div className="host-logo">
            <h1>Host Platform</h1>
            <p>Quản lý đặt phòng homestay</p>
          </div>

          <nav className="host-nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`host-nav-item ${location.pathname === item.path ? "active" : ""}`}
              >
                <span className="host-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="host-main">
          {/* Header */}
          <header className="host-header">
            <div className="host-header-left">
              <h1>
                {menuItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h1>
            </div>
            <div className="host-header-right">
              {/* Dark/Light Mode Toggle */}
              <button className="host-header-btn" onClick={toggleDarkMode} title="Chuyển đổi chế độ">
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>

              {/* Notifications Dropdown */}
              <div className="host-dropdown" ref={notificationRef}>
                <button className="host-header-btn" onClick={toggleNotifications} title="Thông báo">
                  <FaBell />
                  {unreadCount > 0 && <span className="host-notification-badge">{unreadCount}</span>}
                </button>

                {showNotifications && (
                  <div className="host-dropdown-menu">
                    <div className="host-dropdown-header">
                      <h3>Thông báo</h3>
                      <button className="host-dropdown-clear">Đánh dấu đã đọc</button>
                    </div>
                    <div className="host-dropdown-list">
                      {notifications.length === 0 ? (
                        <div className="host-dropdown-empty">
                          <FaBell />
                          <p>Không có thông báo mới</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`host-notification-item ${!notification.read ? "unread" : ""}`}
                          >
                            <div className="host-notification-icon">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="host-notification-content">
                              <p className="host-notification-title">{notification.title}</p>
                              <p className="host-notification-message">{notification.message}</p>
                              <p className="host-notification-time">{notification.time}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div className="host-dropdown" ref={userMenuRef}>
                <div className="host-user" onClick={toggleUserMenu}>
                  <FaUser />
                  <span>{currentUser?.userName || "Host User"}</span>
                </div>

                {showUserMenu && (
                  <div className="host-dropdown-menu host-user-menu">
                    <button
                      className="host-user-menu-item"
                      onClick={() => {
                        navigate("/host/settings");
                        setShowUserMenu(false);
                      }}
                    >
                      <FaCog />
                      <span>Cài đặt</span>
                    </button>
                    <div className="host-user-menu-divider" />
                    <button className="host-user-menu-item" onClick={handleLogout}>
                      <FaSignOutAlt />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div className="host-content">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default HostLayout;
