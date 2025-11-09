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
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary sticky-top">
      <div className="container-fluid">
        <NavLink className="navbar-brand text-decoration-none" to="/" title="Go to home page">
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
          title="Toggle navigation menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
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
                  <NavLink className="dropdown-item bg-transparent" to="/homestays" end title="Browse all available homestays">
                    All Homestays
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item bg-transparent" to="/homestays/mine" title="View homestays you own">
                    My Homestays
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item bg-transparent" to="/homestays/new" title="List a new homestay">
                    Add Homestay
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/bookings" end title="Manage your current bookings">
                Bookings
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/bookings/history" title="View your booking history">
                History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/payments" title="View and manage payments">
                Payments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/reviews" title="Read and write reviews">
                Reviews
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/complaints" title="Submit and track complaints">
                Complaints
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/support" title="Get help and support">
                Support
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={navLinkClass} to="/profile" title="View and edit your profile">
                Profile
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Host management tools"
              >
                Host
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink to="/host/bookings" title="Manage guest bookings for your homestays">
                    Manage Bookings
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/host/revenue" title="View your revenue and earnings">
                    Revenue Report
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/host/chat" title="Chat with your guests">
                    Guest Messages
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Administrator tools and settings"
              >
                Admin
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink to="/admin" end title="View admin dashboard and overview">
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/homestays" title="Approve or reject homestay listings">
                    Homestay Approval
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/chat-monitor" title="Monitor chat conversations">
                    Chat Monitor
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/admin/statistics" title="View system usage statistics">
                    System Statistics
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link" onClick={handleLogout} type="button" title="Sign out of your account">
                Logout
              </button>
            </li>
            <li className="nav-item d-flex align-items-center ms-lg-3 mt-2 mt-lg-0">
              <button
                className="btn btn-sm btn-outline-light border-0"
                onClick={handleToggleTheme}
                type="button"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <g fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" strokeLinejoin="round"/>
                      <path strokeLinecap="round" d="M20 12h1M3 12h1m8 8v1m0-18v1m5.657 13.657l.707.707M5.636 5.636l.707.707m0 11.314l-.707.707M18.364 5.636l-.707.707"/>
                    </g>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 0 0 8.997-9.252a7 7 0 0 1-10.371-8.643A9 9 0 0 0 12 21"/>
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
