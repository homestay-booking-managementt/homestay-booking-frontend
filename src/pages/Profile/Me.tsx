import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { getProfileSimple, updateProfile, changePassword } from "@/api/authApi";
import { uploadHomestayImage } from "@/api/uploadApi";

// Types - Matching backend User entity from /api/v1/user/my-profile
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  status: 0 | 1 | 2 | 3; // 0:chưa kích hoạt,1:hoạt động,2:tạm khóa,3:bị chặn
  createdAt?: string;
  updatedAt?: string | null;
  // Note: Backend User entity doesn't include roles directly, we'll get it from Redux/auth state
  roles?: string[];
  // These fields don't exist in backend User entity yet
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
}

interface SessionItem {
  id: string;
  device: string;
  browser: string;
  ip: string;
  created_at: string;
  last_seen: string;
  this_device?: boolean;
}

export default function MePage() {
  const navigate = useNavigate();
  const auth = useAppSelector((s) => (s as any)?.auth) || { user: null };

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"overview" | "security" | "sessions" | "history">("overview");
  const [sessions, setSessions] = useState<SessionItem[]>([
    {
      id: "sess_1",
      device: "MacBook Pro 14",
      browser: "Safari 17",
      ip: "113.22.10.6",
      created_at: "2025-02-10T10:10:00Z",
      last_seen: new Date().toISOString(),
      this_device: true,
    },
  ]);

  const [history, setHistory] = useState<Array<{ id: string; when: string; text: string }>>([]);

  // Gọi API getProfileSimple()
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProfileSimple();
        if (res?.data) {
          const p = res.data;
          // Backend returns User entity: { id, name, email, phone, passwd, createdAt, updatedAt, status, isDeleted }
          // Get roles from Redux auth state (stored during login)
          const userRoles = auth?.user?.roles || ["CUSTOMER"];

          const newProfile: UserProfile = {
            id: p.id ?? 0,
            name: p.name ?? "Unknown User",
            email: p.email ?? "",
            phone: p.phone ?? null,
            status: p.status ?? 1,
            createdAt: p.createdAt ?? new Date().toISOString(),
            updatedAt: p.updatedAt ?? null,
            roles: userRoles,
            // These fields don't exist in backend yet
            avatar_url: null,
            bio: null,
            location: null,
          };
          setProfile(newProfile);

          // Add creation event to history
          setHistory([
            { id: "h1", when: newProfile.createdAt || new Date().toISOString(), text: "Tạo tài khoản" },
          ]);
        }
      } catch (err: any) {
        const status = err?.response?.status ?? 0;
        if (status === 401) {
          navigate("/401");
        } else {
          setError("Không thể tải thông tin hồ sơ. Vui lòng thử lại.");
        }
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate, auth?.user?.roles]);

  // Helpers
  const roleBadge = useMemo(() => {
    if (!profile) return { label: "Loading...", className: "badge rounded-pill bg-secondary" };
    // Backend returns roles array like ["CUSTOMER"] or ["HOST"]
    const primaryRole = profile.roles?.[0]?.toUpperCase() || "CUSTOMER";
    const map: Record<string, { label: string; className: string }> = {
      CUSTOMER: { label: "Khách du lịch", className: "badge rounded-pill bg-info" },
      HOST: { label: "Chủ homestay", className: "badge rounded-pill bg-primary" },
    };
    return map[primaryRole] || map.CUSTOMER;
  }, [profile]);

  const statusChip = useMemo(() => {
    if (!profile) return { text: "Loading...", cls: "badge text-bg-secondary" };
    const m: any = {
      0: { text: "Chưa kích hoạt", cls: "badge text-bg-secondary" },
      1: { text: "Đang hoạt động", cls: "badge text-bg-success" },
      2: { text: "Tạm khóa", cls: "badge text-bg-warning" },
      3: { text: "Bị chặn", cls: "badge text-bg-danger" },
    };
    return m[profile.status ?? 1];
  }, [profile]);

  // Edit form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatar_url: "",
  });

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        location: profile.location || "",
        avatar_url: profile.avatar_url || "",
      });
    }
  }, [profile]);

  const saveProfile = async () => {
    if (!profile) return;
    setBusy(true);
    setError(null);
    try {
      await updateProfile(form);
      setProfile(p => p ? { ...p, ...form } : null);
      setHistory(h => [{ id: crypto.randomUUID(), when: new Date().toISOString(), text: "Cập nhật hồ sơ" }, ...h]);
      setEditing(false);
    } catch (err: any) {
      setError(err.message || "Tính năng cập nhật hồ sơ chưa được triển khai trên backend. Vui lòng liên hệ admin để thêm endpoint.");
    } finally {
      setBusy(false);
    }
  };

  const revokeSession = async (id: string) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    setSessions(s => s.filter(x => x.id !== id));
    setBusy(false);
  };

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Mật khẩu mới không khớp!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setHistory(h => [{ id: crypto.randomUUID(), when: new Date().toISOString(), text: "Đổi mật khẩu" }, ...h]);
      setChangingPass(false);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message || "Tính năng đổi mật khẩu chưa được triển khai trên backend. Vui lòng liên hệ admin để thêm endpoint.");
    } finally {
      setBusy(false);
    }
  };

  // Handle file upload
  const handleAvatarUpload = async (file: File) => {
    setBusy(true);
    setError(null);
    try {
      const url = await uploadHomestayImage(file);
      setForm(f => ({ ...f, avatar_url: url }));
    } catch (err: any) {
      setError("Không thể tải ảnh lên. Vui lòng thử lại.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page position-relative min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page position-relative min-vh-100 d-flex align-items-center justify-content-center">
        <div className="alert alert-danger">
          {error || "Không thể tải thông tin hồ sơ."}
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page position-relative min-vh-100 overflow-hidden">
      {/* Error Banner */}
      {error && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3 z-3" style={{ maxWidth: "500px" }}>
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)} />
          </div>
        </div>
      )}

      {/* Cover */}
      <div className="cover position-relative">
        <div className="cover-bg" />
        <div className="cover-overlay" />
        <div className="container position-relative z-1 py-5 d-flex align-items-end" style={{ minHeight: 260 }}>
          <div className="d-flex align-items-end gap-3 flex-wrap">
            <div className="avatar-wrap position-relative">
              <img src={profile.avatar_url || "https://placehold.co/160x160"} className="rounded-4 shadow avatar" alt="avatar" />
              <button className="btn btn-light btn-sm rounded-3 position-absolute bottom-0 end-0 shadow" onClick={() => setEditing(true)}>
                <i className="bi bi-camera" />
              </button>
            </div>
            <div className="text-white">
              <h1 className="h3 fw-bold mb-1 text-shadow">{profile.name}</h1>
              <div className="d-flex flex-wrap align-items-center gap-2">
                <span className={roleBadge.className}>{roleBadge.label}</span>
                <span className={statusChip.cls}>{statusChip.text}</span>
                {profile.location && (
                  <span className="badge rounded-pill bg-light text-dark"><i className="bi bi-geo-alt me-1" />{profile.location}</span>
                )}
              </div>
              <div className="small opacity-75 mt-2">
                Tham gia từ {new Date(profile.createdAt || new Date().toISOString()).toLocaleDateString()}
              </div>
            </div>
            <div className="ms-auto d-flex flex-wrap gap-2">
              <button className="btn btn-outline-light" onClick={() => setEditing(true)}>
                <i className="bi bi-pencil-square me-1" /> Chỉnh sửa
              </button>
              <button className="btn btn-light text-primary" onClick={() => setChangingPass(true)}>
                <i className="bi bi-shield-lock me-1" /> Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4 py-md-5">
        <div className="row g-4">
          {/* Left column: About */}
          <div className="col-12 col-lg-4">
            <div className="card glass border-0 shadow">
              <div className="card-body p-4">
                <h5 className="card-title d-flex align-items-center gap-2"><i className="bi bi-person-lines-fill" /> Thông tin</h5>
                <div className="mt-3 vstack gap-3">
                  <div>
                    <div className="text-uppercase text-muted small">Email</div>
                    <div className="fw-medium">{profile.email}</div>
                  </div>
                  <div>
                    <div className="text-uppercase text-muted small">Số điện thoại</div>
                    <div className="fw-medium">{profile.phone || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card glass border-0 shadow mt-3">
              <div className="card-body p-4">
                <h6 className="text-uppercase text-muted small mb-3">Huy hiệu</h6>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge rounded-pill bg-primary-subtle text-primary"><i className="bi bi-sun me-1" /> Early Bird</span>
                  <span className="badge rounded-pill bg-info-subtle text-info"><i className="bi bi-compass me-1" /> Sea Lover</span>
                  <span className="badge rounded-pill bg-warning-subtle text-warning"><i className="bi bi-lightning me-1" /> Fast Booker</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Tabs */}
          <div className="col-12 col-lg-8">
            <ul className="nav nav-pills mb-3 bg-body-tertiary rounded-3 p-1" role="tablist">
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')}><i className="bi bi-card-checklist me-1" />Tổng quan</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${tab === 'security' ? 'active' : ''}`} onClick={() => setTab('security')}><i className="bi bi-shield-lock me-1" />Bảo mật</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${tab === 'sessions' ? 'active' : ''}`} onClick={() => setTab('sessions')}><i className="bi bi-laptop me-1" />Phiên đăng nhập</button>
              </li>
              <li className="nav-item" role="presentation">
                <button className={`nav-link ${tab === 'history' ? 'active' : ''}`} onClick={() => setTab('history')}><i className="bi bi-clock-history me-1" />Lịch sử</button>
              </li>
            </ul>

            {tab === 'overview' && (
              <div className="card glass border-0 shadow">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Hoạt động gần đây</h5>
                  <div className="timeline">
                    {history.map(h => (
                      <div className="timeline-item" key={h.id}>
                        <div className="dot" />
                        <div>
                          <div className="fw-medium">{h.text}</div>
                          <div className="text-muted small">{new Date(h.when).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'security' && (
              <div className="card glass border-0 shadow">
                <div className="card-body p-4 vstack gap-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-medium">Xác thực 2 lớp (2FA)</div>
                      <div className="text-muted small">Bảo vệ tài khoản với mã OTP hoặc ứng dụng Authenticator.</div>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" id="twofa" checked={twoFA} onChange={() => setTwoFA(v => !v)} />
                      <label className="form-check-label" htmlFor="twofa">{twoFA ? 'Bật' : 'Tắt'}</label>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div className="fw-medium">Mật khẩu</div>
                      <div className="text-muted small">Đổi mật khẩu định kỳ để an toàn hơn.</div>
                    </div>
                    <button className="btn btn-outline-primary" onClick={() => setChangingPass(true)}>
                      <i className="bi bi-key me-1" /> Đổi mật khẩu
                    </button>
                  </div>
                </div>
              </div>
            )}

            {tab === 'sessions' && (
              <div className="card glass border-0 shadow">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Thiết bị & phiên đăng nhập</h5>
                    <button className="btn btn-outline-danger btn-sm" disabled={busy} onClick={async () => { setBusy(true); await new Promise(r => setTimeout(r, 600)); setSessions(s => s.filter(x => x.this_device)); setBusy(false); }}>
                      <i className="bi bi-box-arrow-right me-1" /> Đăng xuất tất cả
                    </button>
                  </div>
                  <div className="list-group">
                    {sessions.map(s => (
                      <div key={s.id} className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center gap-3">
                          <div className="device-icon rounded-3"><i className="bi bi-laptop" /></div>
                          <div>
                            <div className="fw-medium">
                              {s.device} • {s.browser} {s.this_device && <span className="badge text-bg-success ms-2">This device</span>}
                            </div>
                            <div className="text-muted small">IP {s.ip} • Mở {new Date(s.created_at).toLocaleString()} • Gần nhất {new Date(s.last_seen).toLocaleString()}</div>
                          </div>
                        </div>
                        <button className="btn btn-outline-secondary btn-sm" disabled={busy || s.this_device} onClick={() => revokeSession(s.id)}>
                          <i className="bi bi-x-lg" /> Thu hồi
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'history' && (
              <div className="card glass border-0 shadow">
                <div className="card-body p-4">
                  <h5 className="card-title mb-3">Lịch sử thay đổi</h5>
                  <ul className="list-unstyled vstack gap-3">
                    {history.map(h => (
                      <li key={h.id} className="d-flex align-items-start gap-3">
                        <span className="badge rounded-pill bg-primary-subtle text-primary"><i className="bi bi-pencil-square me-1" />Profile</span>
                        <div>
                          <div className="fw-medium">{h.text}</div>
                          <div className="text-muted small">{new Date(h.when).toLocaleString()}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editing && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-pencil-square me-2" />Chỉnh sửa hồ sơ</h5>
                <button type="button" className="btn-close" onClick={() => setEditing(false)} />
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Họ & tên</label>
                    <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Số điện thoại</label>
                    <input className="form-control" value={form.phone || ""} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Địa điểm</label>
                    <input className="form-control" value={form.location || ""} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Giới thiệu</label>
                    <textarea className="form-control" rows={3} value={form.bio || ""} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Ảnh đại diện</label>
                    <div className="d-flex align-items-center gap-3">
                      {form.avatar_url && (
                        <img
                          src={form.avatar_url}
                          alt="preview"
                          className="rounded-circle shadow"
                          style={{ width: 80, height: 80, objectFit: "cover" }}
                        />
                      )}
                      <div className="vstack gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          className="form-control"
                          disabled={busy}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleAvatarUpload(file);
                            }
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Hoặc dán link ảnh (Unsplash/Pexels)"
                          disabled={busy}
                          value={form.avatar_url || ""}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, avatar_url: e.target.value }))
                          }
                        />
                      </div>
                    </div>
                  </div>

                </div>
                <div className="modal-footer">
                  <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>Hủy</button>
                  <button className="btn btn-primary" disabled={busy} onClick={saveProfile}>
                    {busy && <span className="spinner-border spinner-border-sm me-2" />}
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {changingPass && (
        <div className="modal fade show d-block" tabIndex={-1} role="dialog" aria-modal="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title"><i className="bi bi-key me-2" />Đổi mật khẩu</h5>
                <button type="button" className="btn-close" onClick={() => { setChangingPass(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }} />
              </div>
              <div className="modal-body vstack gap-3">
                <div>
                  <label className="form-label">Mật khẩu hiện tại</label>
                  <input
                    className="form-control"
                    type="password"
                    disabled={busy}
                    value={passwordForm.currentPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Mật khẩu mới</label>
                  <input
                    className="form-control"
                    type="password"
                    disabled={busy}
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    className="form-control"
                    type="password"
                    disabled={busy}
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm(f => ({ ...f, confirmPassword: e.target.value }))}
                  />
                </div>
                <div className="form-text">Gợi ý: dùng mật khẩu dài & duy nhất. 🤫</div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => { setChangingPass(false); setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" }); }}>Hủy</button>
                <button className="btn btn-primary" disabled={busy} onClick={handleChangePassword}>
                  {busy && <span className="spinner-border spinner-border-sm me-2" />}
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page styles */}
      <style>{`
        .cover { min-height: 240px; }
        .cover-bg { 
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop');
          position:absolute; inset:0; background-size: cover; background-position: center; filter: saturate(1.05) contrast(1.05);
        }
        .cover-overlay { position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.6)); }
        .avatar { width: 96px; height: 96px; object-fit: cover; }
        .text-shadow { text-shadow: 0 2px 8px rgba(0,0,0,.25); }
        .glass { background: rgba(255,255,255,0.78); backdrop-filter: blur(10px); }
        .timeline { position: relative; }
        .timeline::before { content:""; position:absolute; left:12px; top:0; bottom:0; width:2px; background: rgba(13,110,253,.25); }
        .timeline-item { position:relative; padding-left: 36px; margin-bottom: 16px; }
        .timeline-item .dot { position:absolute; left:6px; top:4px; width:12px; height:12px; border-radius:50%; background: linear-gradient(135deg,#0d6efd,#0dcaf0); box-shadow: 0 0 0 4px rgba(13,110,253,.15); }
        .device-icon { width: 40px; height: 40px; display:grid; place-items:center; background: rgba(13,110,253,.1); color:#0d6efd; }
        .modal.show { background: rgba(0,0,0,0.5); }
      `}</style>
    </div>
  );
}
