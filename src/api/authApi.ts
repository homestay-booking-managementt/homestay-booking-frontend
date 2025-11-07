import axios from "@/axiosConfig";

// BẬT MOCK
const USE_MOCK = true;

// ===========================
// 🔹 MOCK REGISTER (frontend only)
// ===========================
export const registerSimple = async (data: {
  name: string;
  email: string;
  phone?: string;
  passwd: string;
  role_name: "customer" | "host";
}) => {
  console.log("🧩 Mock register used");
  await new Promise((res) => setTimeout(res, 600));

  // giả lập check trùng email
  if (data.email === "demo@example.com") {
    const err: any = new Error("Email đã tồn tại");
    err.response = { status: 409, data: { message: "Email đã tồn tại." } };
    throw err;
  }

  // tạo user giả lập
  const newUser = {
    id: Math.floor(Math.random() * 1000),
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    role_name: data.role_name,
    status: 1,
    joined_at: new Date().toISOString(),
  };

  // ✅ Lưu lại vào localStorage để login & Me dùng
  localStorage.setItem("mock_user", JSON.stringify(newUser));

  return {
    status: 201,
    data: {
      message: "Đăng ký thành công",
      user: newUser,
    },
  };
};

// ===========================
// 🔹 MOCK LOGIN (frontend only)
// ===========================
export const loginSimple = async (data: {
  identifier: string;
  password: string;
  role?: string;
}) => {
  console.log("🧩 Mock login used");
  await new Promise((res) => setTimeout(res, 600));

  const mockUser = localStorage.getItem("mock_user");
  const parsed = mockUser ? JSON.parse(mockUser) : null;

  // Cho phép đăng nhập bằng username/email (identifier)
  if (parsed && (parsed.email === data.identifier || parsed.name === data.identifier)) {
    const idToken = "MOCK_ID_TOKEN_123";
    const refreshToken = "MOCK_REFRESH_TOKEN_123";
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("refresh_token", refreshToken);
    return {
      data: {
        idToken,
        refreshToken,
        user: parsed,
      },
    };
  }

  // fallback user demo
  if (data.identifier === "demo" && data.password) {
    const idToken = "MOCK_ID_TOKEN_123";
    const refreshToken = "MOCK_REFRESH_TOKEN_123";
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("refresh_token", refreshToken);
    return {
      data: {
        idToken,
        refreshToken,
        user: {
          id: 1,
          name: "Traveler Demo",
          email: "demo@example.com",
          role_name: "customer",
          is_admin: false,
          is_active: true,
        },
      },
    };
  }

  const err: any = new Error("Sai thông tin đăng nhập");
  err.response = { status: 401, data: { message: "Sai thông tin đăng nhập" } };
  throw err;
};

// ===========================
// 🔹 MOCK PROFILE (frontend only)
// ===========================
export const getProfileSimple = async () => {
  console.log("🧩 Mock profile used");
  await new Promise((r) => setTimeout(r, 400));

  const token = localStorage.getItem("id_token");
  if (!token) {
    const err: any = new Error("Unauthorized");
    err.response = { status: 401 };
    throw err;
  }

  // ✅ Lấy user đã đăng ký / đăng nhập mock
  const mockUser = localStorage.getItem("mock_user");
  if (mockUser) {
    return { data: JSON.parse(mockUser) };
  }

  // fallback nếu chưa đăng ký
  return {
    data: {
      id: 1,
      name: "Traveler Demo",
      email: "demo@example.com",
      role_name: "customer",
      status: 1,
      joined_at: "2024-06-12T09:30:00Z",
    },
  };
};
