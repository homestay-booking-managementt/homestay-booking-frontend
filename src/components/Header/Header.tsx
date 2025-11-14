import { useAppDispatch } from "@/app/hooks";
import { logout } from "@/auth/authSlice";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const dispatch = useAppDispatch();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return localStorage.getItem("theme") === "dark";
  });

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/login";
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      const htmlElement = document.documentElement;
      htmlElement.setAttribute("data-bs-theme", isDarkMode ? "dark" : "light");
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? " active" : ""}`;

  const navDropdownToggleClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link dropdown-toggle${isActive ? " active" : ""}`;

  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container-fluid">
        <NavLink
          className="navbar-brand fw-bold text-primary text-decoration-none"
          to="/"
          title="Go to home page"
        >
          Homestay Booking
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          title="Toggle navigation menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {/* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle fw-medium"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Homestay management options"
              >
                Homestays
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink
                    className="nav-link dropdown-toggle fw-medium"
                    to="/homestays"
                    end
                    title="Browse all available homestays"
                  >
                    <i className="bi bi-grid me-2"></i>Homestay
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/homestays/mine"
                    title="View homestays you own"
                  >
                    <i className="bi bi-house-heart me-2"></i>My Homestays
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className="dropdown-item"
                    to="/homestays/new"
                    title="List a new homestay"
                  >
                    <i className="bi bi-plus-circle me-2"></i>Add Homestay
                  </NavLink>
                </li>
              </ul>
            </li> */}
            <li className="nav-item">
                  <NavLink
                    className={navLinkClass}
                    to="/homestays"
                    end
                    title="Browse all available homestays"
                  >
                    <i className="bi bi-grid me-2"></i>Trang chủ
                  </NavLink>
                </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                to="/bookings"
                end
                title="Manage your current bookings"
              >
                Đặt phòng
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={navLinkClass}
                to="/bookings/history"
                title="View your booking history"
              >
                Lịch sử
              </NavLink>
            </li>
            
            
            
           
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/support" title="Get help and support">
                Hỗ trợ
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/profile" title="View and edit your profile">
                Hồ sơ
              </NavLink>
            </li>
            
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-danger fw-medium"
                onClick={handleLogout}
                type="button"
                title="Sign out of your account"
              >
                Đăng xuất
              </button>
            </li>
            {/* <li className="nav-item ms-lg-2">
              <button
                className="btn btn-outline-secondary btn-sm rounded-pill"
                onClick={handleToggleTheme}
                type="button"
                title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="4" strokeLinejoin="round" />
                    <path
                      strokeLinecap="round"
                      d="M20 12h1M3 12h1m8 8v1m0-18v1m5.657 13.657l.707.707M5.636 5.636l.707.707m0 11.314l-.707.707M18.364 5.636l-.707.707"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21a9 9 0 0 0 8.997-9.252a7 7 0 0 1-10.371-8.643A9 9 0 0 0 12 21"
                    />
                  </svg>
                )}
              </button>
            </li> */}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
