import { useState, useEffect } from "react";
import { FaSave, FaBell, FaLock, FaUser } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";
import { showAlert } from "@/utils/showAlert";
import { getFullProfile } from "@/api/authApi";

const HostSettingsPage = () => {
  const [settings, setSettings] = useState({
    // Profile settings
    displayName: "",
    email: "",
    phone: "",

    // Notification settings
    emailNotifications: true,
    smsNotifications: false,
    bookingAlerts: true,
    paymentAlerts: true,

    // Security settings
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getFullProfile();
        const profile = response.data;

        setSettings(prev => ({
          ...prev,
          displayName: profile.name || "",
          email: profile.email || "",
          phone: profile.phone || "",
        }));
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        showAlert("Không thể tải thông tin hồ sơ", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = () => {
    showAlert("Cài đặt đã được lưu thành công", "success");
  };

  if (loading) {
    return (
      <>
        <style>{hostCommonStyles}</style>
        <div className="host-page">
          <div className="page-header">
            <h1>Cài đặt</h1>
            <p>Đang tải thông tin...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{hostCommonStyles}</style>
      <div className="host-page">
        <div className="page-header">
          <h1>Cài đặt</h1>
          <p>Quản lý thông tin cá nhân và tùy chỉnh hệ thống</p>
        </div>

        {/* Profile Settings */}
        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">
              <FaUser /> Thông tin cá nhân
            </h3>
          </div>
          <div className="form-group">
            <label className="form-label">Tên hiển thị</label>
            <input
              className="form-control"
              type="text"
              value={settings.displayName}
              onChange={(e) =>
                setSettings({ ...settings, displayName: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={settings.email}
              onChange={(e) =>
                setSettings({ ...settings, email: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label className="form-label">Số điện thoại</label>
            <input
              className="form-control"
              type="tel"
              value={settings.phone}
              onChange={(e) =>
                setSettings({ ...settings, phone: e.target.value })
              }
            />
          </div>
        </div>

        {/* Notification Settings */}
        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">
              <FaBell /> Thông báo
            </h3>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    emailNotifications: e.target.checked,
                  })
                }
              />
              <span>Nhận thông báo qua Email</span>
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) =>
                  setSettings({ ...settings, smsNotifications: e.target.checked })
                }
              />
              <span>Nhận thông báo qua SMS</span>
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.bookingAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, bookingAlerts: e.target.checked })
                }
              />
              <span>Thông báo đặt phòng mới</span>
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.paymentAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, paymentAlerts: e.target.checked })
                }
              />
              <span>Thông báo thanh toán</span>
            </label>
          </div>
        </div>

        {/* Security Settings */}
        <div className="host-card">
          <div className="card-header">
            <h3 className="card-title">
              <FaLock /> Bảo mật
            </h3>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={(e) =>
                  setSettings({ ...settings, twoFactorAuth: e.target.checked })
                }
              />
              <span>Bật xác thực hai yếu tố (2FA)</span>
            </label>
          </div>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={settings.loginAlerts}
                onChange={(e) =>
                  setSettings({ ...settings, loginAlerts: e.target.checked })
                }
              />
              <span>Thông báo khi đăng nhập từ thiết bị mới</span>
            </label>
          </div>
          <div className="form-group">
            <button className="btn-secondary">Đổi mật khẩu</button>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button className="btn-secondary">Hủy</button>
          <button className="btn-primary" onClick={handleSave}>
            <FaSave /> Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  );
};

export default HostSettingsPage;
