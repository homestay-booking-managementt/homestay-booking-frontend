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
      document.body.classList.toggle("theme-dark", isDarkMode);
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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Project
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <NavLink
                className={navDropdownToggleClass}
                to="/homestays"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Homestays
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/homestays">
                    All Homestays
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/homestays/mine">
                    My Homestays
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/homestays/new">
                    Add Homestay
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/bookings">
                Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/bookings/history">
                History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/payments">
                Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/reviews">
                Reviews
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/complaints">
                Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/support">
                Support
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/profile">
                Profile
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className={navDropdownToggleClass}
                to="/host/bookings"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Host
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/host/bookings">
                    Manage Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/host/revenue">
                    Revenue Report
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/host/chat">
                    Guest Messages
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className={navDropdownToggleClass}
                to="/admin"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Admin
              </NavLink>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/admin">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/homestays">
                    Homestay Approval
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/chat-monitor">
                    Chat Monitor
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/statistics">
                    System Statistics
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout} type="button">
                Logout
              </button>
            </li>
            <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
              <button
                className="btn btn-sm btn-outline-light"
                onClick={handleToggleTheme}
                type="button"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
