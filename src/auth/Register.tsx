import { useState, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerSimple /*, registerWithRoleId */ } from "@/api/authApi";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    roleType: "customer" as "customer" | "host",
  });
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // validate đơn giản
    if (!form.name || !form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ Họ tên, Email và Mật khẩu.");
      return;
    }
    if (form.password.length < 6) {
      setError("Mật khẩu phải từ 6 ký tự trở lên.");
      return;
    }
    if (confirmPass !== form.password) {
      setError("Xác nhận mật khẩu không khớp.");
      return;
    }

    setLoading(true);
    try {
      const res = await registerSimple(form);

      if (res.status === 200 || res.status === 201) {
        if (form.roleType === "host") {
          setSuccess("Đăng ký thành công! Tài khoản Host đang chờ admin phê duyệt. Bạn sẽ nhận được thông báo qua email.");
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setSuccess("Đăng ký thành công! Đang chuyển đến trang đăng nhập...");
          setTimeout(() => navigate("/login"), 2000);
        }
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (err?.response?.status === 409
          ? "Email đã tồn tại."
          : "Đăng ký thất bại. Vui lòng thử lại.");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page position-relative min-vh-100 overflow-hidden">
      <div className="bg-wrapper position-absolute top-0 start-0 w-100 h-100" aria-hidden />
      <div className="overlay position-absolute top-0 start-0 w-100 h-100" aria-hidden />

      <div className="container position-relative z-1 d-flex align-items-center justify-content-center min-vh-100 px-3">
        <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
          <div className="card glass shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1 text-white text-gradient">Tạo tài khoản</h2>
                <p className="text-white-50 mb-0">Đăng ký để bắt đầu trải nghiệm homestay ✨</p>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="row g-4">
                  <div className="col-12 col-md-7">
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label text-white">Họ tên</label>
                      <input
                        id="name"
                        type="text"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="Nguyễn Văn A"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label text-white">Email</label>
                      <input
                        id="email"
                        type="email"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="phone" className="form-label text-white">Số điện thoại (tuỳ chọn)</label>
                      <input
                        id="phone"
                        type="tel"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="09xx xxx xxx"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="passwd" className="form-label text-white">Mật khẩu</label>
                      <input
                        id="passwd"
                        type="password"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="confirm" className="form-label text-white">Xác nhận mật khẩu</label>
                      <input
                        id="confirm"
                        type="password"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="••••••••"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>

                    <div className="mb-4">
                      <span className="form-label d-block text-white mb-2">Vai trò</span>
                      <div className="d-flex gap-4">
                        <label className="text-white-75">
                          <input
                            type="radio"
                            name="roleType"
                            value="customer"
                            checked={form.roleType === "customer"}
                            onChange={() => setForm({ ...form, roleType: "customer" })}
                            disabled={loading}
                          />{" "}
                          Khách hàng (kích hoạt ngay)
                        </label>
                        <label className="text-white-75">
                          <input
                            type="radio"
                            name="roleType"
                            value="host"
                            checked={form.roleType === "host"}
                            onChange={() => setForm({ ...form, roleType: "host" })}
                            disabled={loading}
                          />{" "}
                          Chủ homestay (cần duyệt)
                        </label>
                      </div>
                      <small className="text-white-50 d-block mt-2">
                        {form.roleType === "host" && "⚠️ Tài khoản Host cần được admin phê duyệt trước khi sử dụng."}
                      </small>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient btn-lg w-100"
                      disabled={loading}
                    >
                      {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>

                    <p className="text-center text-white-75 mt-3 mb-0">
                      Đã có tài khoản?{" "}
                      <Link to="/login" className="link-light link-underline-opacity-50">
                        Đăng nhập
                      </Link>
                    </p>
                  </div>

                  <div className="col-md-1 d-none d-md-flex justify-content-center">
                    <div className="vr text-white opacity-50" style={{ minHeight: "100%" }} />
                  </div>

                  <div className="col-12 col-md-4 d-flex align-items-center">
                    <p className="text-white-50 small mb-0">
                      <strong>Lưu ý:</strong> Admin không đăng ký tại đây.<br />
                      Tài khoản mới có thể ở trạng thái <strong>0: chưa kích hoạt</strong> hoặc <strong>1: hoạt động</strong> tuỳ backend. <br />
                      Email phải <strong>unique</strong>.
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-3 text-white-75 small d-flex align-items-center justify-content-center gap-2">
            <span className="line" /> Mã nguồn mở - Nhóm 15 <span className="line" />
          </div>
        </div>
      </div>

      <style>{`
        .bg-wrapper { 
          background-image: url('https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1920&auto=format&fit=crop');
          background-size: cover; background-position: center; filter: saturate(1.05) contrast(1.05);
        }
        .overlay { background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(255, 255, 255, 0.16)); }
        .glass { background: rgba(255,255,255,0.12); backdrop-filter: blur(16px); border-radius: 1.25rem; }
        .text-gradient { background: linear-gradient(90deg,#0d6efd,#0dcaf0,#6ea8fe); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .btn-gradient { background-image: linear-gradient(90deg,#0d6efd,#0dcaf0); border: 0; color: #fff; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.02); }
        .btn-gradient:hover { filter: brightness(1.05); }
        .line { display:inline-block; width: 48px; height: 1px; background-color: rgba(255,255,255,0.5); }
        .text-white-75 { color: rgba(255,255,255,.85) !important; }
        .vr { width:2px; background: rgba(255,255,255,.4); }
      `}</style>
    </div>
  );
}
