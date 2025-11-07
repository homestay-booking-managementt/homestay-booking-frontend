import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { useNavigate } from "react-router-dom";
import { getProfileSimple } from "@/api/authApi"; 

// Types
interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role_name: "customer" | "host";
  status?: 0 | 1 | 2 | 3;
  avatar_url?: string | null;
  bio?: string | null;
  location?: string | null;
  joined_at?: string;
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
  const currentUser: UserProfile = auth?.user || {
    id: 1,
    name: "Traveler Demo",
    email: "traveler@example.com",
    phone: "+84 888 999 000",
    role_name: "customer",
    status: 1,
    avatar_url:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&fit=crop",
    bio: "Yêu homestay ven biển, săn bình minh và cà phê muối.",
    location: "Da Nang, Vietnam",
    joined_at: "2024-06-12T09:30:00Z",
  };

  const [profile, setProfile] = useState<UserProfile>(currentUser);
  const [editing, setEditing] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [busy, setBusy] = useState(false);
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
    {
      id: "sess_2",
      device: "iPhone 15 Pro",
      browser: "Mobile Safari",
      ip: "113.22.10.6",
      created_at: "2025-01-22T08:01:00Z",
      last_seen: "2025-10-30T21:10:00Z",
    },
  ]);

  const [history, setHistory] = useState<Array<{ id: string; when: string; text: string }>>([
    { id: "h1", when: "2025-09-04T07:30:00Z", text: "Đổi số điện thoại" },
    { id: "h2", when: "2025-07-11T14:10:00Z", text: "Cập nhật ảnh đại diện" },
    { id: "h3", when: "2025-06-12T09:30:00Z", text: "Tạo tài khoản" },
  ]);

  // Gọi API getProfileSimple()
  useEffect(() => {
    (async () => {
      try {
        const res = await getProfileSimple();
        if (res?.data) {
          const p = res.data;
          setProfile((prev) => ({
            ...prev,
            id: p.id ?? prev.id,
            name: p.name ?? p.user_name ?? prev.name,
            email: p.email ?? prev.email,
            phone: p.phone ?? prev.phone,
            role_name: p.role_name ?? prev.role_name,
            status: p.status ?? 1,
            avatar_url: p.avatar_url ?? prev.avatar_url,
            bio: p.bio ?? prev.bio,
            location: p.location ?? prev.location,
            joined_at: p.joined_at ?? prev.joined_at,
          }));
        }
      } catch (err: any) {
        const status = err?.response?.status ?? 0;
        if (status === 401) {
          navigate("/401");
        }
      }
    })();
  }, [navigate]);

  // Helpers
  const roleBadge = useMemo(() => {
    const map: Record<UserProfile["role_name"], { label: string; className: string }> = {
      customer: { label: "Khách du lịch", className: "badge rounded-pill bg-info" },
      host: { label: "Chủ homestay", className: "badge rounded-pill bg-primary" },
    };
    return map[profile.role_name];
  }, [profile.role_name]);

  const statusChip = useMemo(() => {
    const m: any = {
      0: { text: "Chưa kích hoạt", cls: "badge text-bg-secondary" },
      1: { text: "Đang hoạt động", cls: "badge text-bg-success" },
      2: { text: "Tạm khóa", cls: "badge text-bg-warning" },
      3: { text: "Bị chặn", cls: "badge text-bg-danger" },
    };
    return m[profile.status ?? 1];
  }, [profile.status]);

  // Edit form state
  const [form, setForm] = useState({
    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",
    bio: profile.bio || "",
    location: profile.location || "",
    avatar_url: profile.avatar_url || "",
  });

  useEffect(() => {
    setForm({
      name: profile.name || "",
      email: profile.email || "",
      phone: profile.phone || "",
      bio: profile.bio || "",
      location: profile.location || "",
      avatar_url: profile.avatar_url || "",
    });
  }, [profile]);

  const saveProfile = async () => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 700));
    setProfile(p => ({ ...p, ...form }));
    setHistory(h => [{ id: crypto.randomUUID(), when: new Date().toISOString(), text: "Cập nhật hồ sơ" }, ...h]);
    setBusy(false);
    setEditing(false);
  };

  const revokeSession = async (id: string) => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 500));
    setSessions(s => s.filter(x => x.id !== id));
    setBusy(false);
  };

  return (
    <div className="profile-page position-relative min-vh-100 overflow-hidden">
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
                Tham gia từ {new Date(profile.joined_at || new Date().toISOString()).toLocaleDateString()}
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
                  <div>
                    <div className="text-uppercase text-muted small">Giới thiệu</div>
                    <div>{profile.bio || "Chưa có mô tả."}</div>
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
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (ev) => {
                                setForm((f) => ({ ...f, avatar_url: ev.target?.result as string }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Hoặc dán link ảnh (Unsplash/Pexels)"
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
                    <button type="button" className="btn-close" onClick={() => setChangingPass(false)} />
                  </div>
                  <div className="modal-body vstack gap-3">
                    <div>
                      <label className="form-label">Mật khẩu hiện tại</label>
                      <input className="form-control" type="password" />
                    </div>
                    <div>
                      <label className="form-label">Mật khẩu mới</label>
                      <input className="form-control" type="password" />
                    </div>
                    <div>
                      <label className="form-label">Xác nhận mật khẩu mới</label>
                      <input className="form-control" type="password" />
                    </div>
                    <div className="form-text">Gợi ý: dùng mật khẩu dài & duy nhất. 🤫</div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-outline-secondary" onClick={() => setChangingPass(false)}>Hủy</button>
                    <button className="btn btn-primary" onClick={() => setChangingPass(false)}>Cập nhật</button>
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
      `}</style>
        </div>
      );
}
