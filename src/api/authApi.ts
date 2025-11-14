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
  const response = await axios.get("/api/v1/user/my-profile");
  // Backend returns full User entity: { id, name, email, phone, passwd, createdAt, updatedAt, status, isDeleted }
  return { data: response.data };
};

// ===========================
// 🔹 REAL API - UPDATE PROFILE (NOT IMPLEMENTED IN BACKEND YET)
// ===========================
export const updateProfile = async (data: {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
}) => {
  // TODO: Backend needs to implement this endpoint
  // const response = await axios.put("/users/me", data);
  // return { data: response.data };
  throw new Error("Update profile endpoint not yet implemented in backend");
};

// ===========================
// 🔹 REAL API - CHANGE PASSWORD (NOT IMPLEMENTED IN BACKEND YET)
// ===========================
export const changePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  // TODO: Backend needs to implement this endpoint
  // const response = await axios.put("/auth/v1/change-password", data);
  // return { data: response.data };
  throw new Error("Change password endpoint not yet implemented in backend");
};

// ===========================
// 🔹 REAL API - LOGOUT
// ===========================
export const logoutSimple = async (refreshToken?: string) => {
  // Backend expects refreshToken as query param
  const token = refreshToken || localStorage.getItem("refresh_token");
  const response = await axios.post("/auth/v1/logout", null, {
    params: { refreshToken: token }
  });
  localStorage.removeItem("id_token");
  localStorage.removeItem("refresh_token");
  return { data: response.data };
};
