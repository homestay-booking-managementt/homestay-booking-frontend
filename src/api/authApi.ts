import axios from "@/axiosConfig";

// ===========================
// 🔹 REAL API - REGISTER
// ===========================
export const registerSimple = async (data: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  roleType: "customer" | "host";
}) => {
  const response = await axios.post("/auth/v1/register", {
    name: data.name,
    email: data.email,
    phone: data.phone,
    password: data.password,
    roleType: data.roleType,
  });

  return {
    status: response.status,
    data: {
      message: data.roleType === "host" 
        ? "Đăng ký thành công! Tài khoản Host đang chờ admin phê duyệt." 
        : "Đăng ký thành công!",
      user: response.data,
    },
  };
};

// ===========================
// 🔹 REAL API - LOGIN
// ===========================
export const loginSimple = async (data: {
  identifier: string; // email
  password: string;
}) => {
  const response = await axios.post("/auth/v1/login", {
    email: data.identifier,
    password: data.password,
  });

  const { accessToken, refreshToken, user } = response.data;

  // Lưu token vào localStorage
  localStorage.setItem("id_token", accessToken);
  localStorage.setItem("refresh_token", refreshToken);

  return {
    data: {
      idToken: accessToken,
      refreshToken: refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        status: user.status,
      },
    },
  };
};

// ===========================
// 🔹 REAL API - GET PROFILE
// ===========================
export const getProfileSimple = async () => {
  const response = await axios.get("/auth/v1/me");
  return { data: response.data };
};

// ===========================
// 🔹 REAL API - GET FULL PROFILE
// ===========================
export const getFullProfile = async () => {
  const response = await axios.get("/api/v1/user/my-profile");
  return { data: response.data };
};
