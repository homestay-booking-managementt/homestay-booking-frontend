import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginRequest } from "./authSlice";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading} = useAppSelector((state) => state.auth);

  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // reset lỗi cũ

    const result = await dispatch(loginRequest({ identifier, password }));

    if (loginRequest.fulfilled.match(result)) {
      // Điều hướng dựa trên role
      const user = result.payload.user;
      const roles = user?.roles || [];
      
      if (roles.includes("ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("HOST")) {
        navigate("/host");
      } else {
        navigate("/homestays");
      }
    }
    else if (loginRequest.rejected.match(result)) {
      const message = (result.payload as any)?.message;
      setError(message || "Đăng nhập thất bại. Vui lòng thử lại sau.");
    }
  };


  return (
    <div className="login-page position-relative min-vh-100 overflow-hidden">
      <div className="bg-wrapper position-absolute top-0 start-0 w-100 h-100" aria-hidden />
      <div className="overlay position-absolute top-0 start-0 w-100 h-100" aria-hidden />
      <div className="orb orb-1 position-absolute" aria-hidden />
      <div className="orb orb-2 position-absolute" aria-hidden />
      <div className="plane position-absolute" aria-hidden>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12l19-8-6 8 6 8-19-8z" fill="currentColor" />
        </svg>
      </div>

      <div className="container position-relative z-1 d-flex align-items-center justify-content-center min-vh-100 px-3">
        <div className="col-12 col-sm-11 col-md-10 col-lg-8 col-xl-7">
          <div className="card glass shadow-lg border-0">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <div className="icon-hero d-inline-flex align-items-center justify-content-center rounded-4 text-white shadow-sm mb-2">
                  <i className="bi bi-airplane" />
                </div>
                <h2 className="fw-bold mb-1 text-white text-gradient">Welcome back</h2>
                <p className="text-white-50 mb-0">Đăng nhập để bắt đầu hành trình mới ✈️</p>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="row g-4 align-items-start">
                  <div className="col-12 col-md-7">
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label text-white">Tên đăng nhập</label>
                      <input
                        id="username"
                        type="text"
                        className="form-control form-control-lg bg-white bg-opacity-75 border-0"
                        placeholder="Tên người dùng hoặc email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-white">Mật khẩu</label>
                      <div className="input-group input-group-lg">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className="form-control bg-white bg-opacity-75 border-0"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="btn btn-outline-light bg-white bg-opacity-25 border-0"
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          disabled={loading}
                        >
                          <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                        </button>
                      </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="remember" disabled={loading} />
                        <label className="form-check-label text-white-75" htmlFor="remember">
                          Ghi nhớ tôi
                        </label>
                      </div>
                      <a href="#" className="link-light link-underline-opacity-50" onClick={(e) => e.preventDefault()}>
                        Quên mật khẩu?
                      </a>
                    </div>
                    <button type="submit" className="btn btn-gradient btn-lg w-100 d-inline-flex align-items-center justify-content-center mb-3" disabled={loading}>
                      {loading && <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />}
                      {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                    <p className="text-center text-white-75 mb-0">
                      Bạn chưa có tài khoản? <Link to="/register" className="link-light link-underline-opacity-50">Đăng ký</Link>
                    </p>
                  </div>

                  <div className="col-md-1 d-none d-md-flex justify-content-center">
                    <div className="vr text-white opacity-50" style={{ minHeight: '100%' }} />
                  </div>

                  <div className="col-12 col-md-4">
                    <p className="text-white-50 small text-center text-md-start mb-3">Hoặc tiếp tục bằng</p>
                    <div className="d-grid gap-2">
                      <button type="button" className="btn btn-light btn-lg bg-opacity-75 d-flex align-items-center justify-content-center" disabled={loading}>
                        <i className="bi bi-google me-2" /> Google
                      </button>
                      <button type="button" className="btn btn-light btn-lg bg-opacity-75 d-flex align-items-center justify-content-center" disabled={loading}>
                        <i className="bi bi-facebook me-2" /> Facebook
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-center mt-4 mb-0 text-white-50 small">
                  Khi đăng nhập, bạn đồng ý với <a className="link-light link-underline-opacity-50" href="#">Điều khoản</a> & <a className="link-light link-underline-opacity-50" href="#">Chính sách</a>.
                </p>
              </form>
            </div>
          </div>
          <div className="text-center mt-3 text-white-75 small d-flex align-items-center justify-content-center gap-2">
            <span className="line" />Mã nguồn mở - Nhóm 15 <span className="line" />
          </div>
        </div>
      </div>

      <style>{`
        .bg-wrapper { 
          background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop');
          background-size: cover; background-position: center; filter: saturate(1.05) contrast(1.05);
        }
        .overlay { background: linear-gradient(180deg, rgba(0,0,0,.55), rgba(255, 255, 255, 0.16)); }
        .glass { background: rgba(255,255,255,0.12); backdrop-filter: blur(16px); border-radius: 1.25rem; }
        .icon-hero { width: 3rem; height: 3rem; background: linear-gradient(135deg,#0d6efd,#0dcaf0); }
        .text-gradient { background: linear-gradient(90deg,#0d6efd,#0dcaf0,#6ea8fe); -webkit-background-clip: text; background-clip: text; color: transparent; }
        .btn-gradient { background-image: linear-gradient(90deg,#0d6efd,#0dcaf0); border: 0; color: #fff; box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.02); }
        .btn-gradient:hover { filter: brightness(1.05); }
        .line { display:inline-block; width: 48px; height: 1px; background-color: rgba(255,255,255,0.5); }
        .plane { top: 20%; left: -10%; color: rgba(255,255,255,.85); animation: fly 16s linear infinite; }
        @keyframes fly { 0% { transform: translateX(0) rotate(-10deg); opacity:0; } 5% { opacity:1; } 95% { opacity:1; } 100% { transform: translateX(130vw) rotate(5deg); opacity:0; } }
        .orb { width: 22rem; height: 22rem; border-radius: 999px; filter: blur(42px); opacity: .55; }
        .orb-1 { right: -6rem; top: -6rem; background: radial-gradient(circle at 30% 30%, rgba(13,110,253,.7), rgba(13,202,240,.6)); animation: float1 10s ease-in-out infinite; }
        .orb-2 { left: -8rem; bottom: -8rem; background: radial-gradient(circle at 70% 70%, rgba(13,202,240,.8), rgba(108,200,255,.6)); animation: float2 12s ease-in-out infinite; }
        @keyframes float1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
        @keyframes float2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-16px); } }
        .text-white-75 { color: rgba(255,255,255,.85) !important; }
        .vr { width:2px; background: rgba(255,255,255,.4); }
      `}</style>
    </div>
  );
}