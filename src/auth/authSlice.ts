import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { removeTokens } from "../utils/removeTokens";
// DÙNG REAL API: import axios-layer trực tiếp
import { loginSimple } from "@/api/authApi"; // axios.post('/auth/login')

// Try to load user info from local storage
const idToken = localStorage.getItem("id_token");
const refreshToken = localStorage.getItem("refresh_token");
let userId: number | null = null;
let userName: string | null = null;
let roleId: number | null = null;
let isAdmin = false;
let isActive = false;

/** Are both `idToken` and `refreshToken` existing in local storage and valid? */
let areTokensValid = Boolean(idToken && refreshToken);

if (idToken) {
  try {
    const tokenDecode: Record<string, unknown> = jwtDecode(idToken);

    // Hỗ trợ nhiều format token từ backend khác nhau
    if (tokenDecode) {
      // Thử các field khác nhau cho userId
      userId = (tokenDecode["user_id"] || tokenDecode["id"] || tokenDecode["sub"]) as number | null;
      userName = (tokenDecode["user_name"] || tokenDecode["name"] || tokenDecode["username"]) as
        | string
        | null;
      roleId = tokenDecode["role_id"] as number | null;

      // Check admin role từ nhiều nguồn
      isAdmin =
        (tokenDecode["is_admin"] as boolean) ||
        (Array.isArray(tokenDecode["roles"]) &&
          (tokenDecode["roles"] as string[]).includes("ADMIN")) ||
        false;

      isActive = (tokenDecode["is_active"] as boolean) || tokenDecode["status"] === 1 || true; // Mặc định active nếu không có field này

      // Không set areTokensValid = false nếu thiếu field, vì token vẫn có thể hợp lệ
      // Chỉ kiểm tra token expired
      if (Object.prototype.hasOwnProperty.call(tokenDecode, "exp")) {
        const expirationTime = (tokenDecode["exp"] as number) * 1000;
        if (expirationTime < new Date().getTime()) {
          areTokensValid = false;
        }
      }
    }
  } catch (error) {
    console.error("❌ Error decoding id_token:", error);
    // Không xóa token ngay, vì có thể là lỗi decode nhưng token vẫn valid
    // Để backend API check và trả 401 nếu token không hợp lệ
    areTokensValid = true; // Vẫn cho phép tiếp tục, backend sẽ validate
  }
}

// Verify if refresh token has been expired
if (refreshToken && areTokensValid) {
  try {
    const tokenDecode: Record<string, unknown> = jwtDecode(refreshToken);
    if (tokenDecode && Object.prototype.hasOwnProperty.call(tokenDecode, "exp")) {
      const expirationTime = (tokenDecode["exp"] as number) * 1000;
      if (expirationTime < new Date().getTime()) {
        areTokensValid = false;
      }
    }
  } catch (error) {
    console.error("❌ Error decoding refresh_token:", error);
    // Không xóa token ngay, để backend xử lý
    areTokensValid = true;
  }
}

// Chỉ xóa token khi chắc chắn đã hết hạn hoặc không tồn tại
if (!areTokensValid) {
  console.warn("⚠️ Tokens are invalid or expired, clearing...");
  removeTokens(false);
}

export interface IUser {
  userId: number | null;
  userName: string | null;
  roleId: number | null;
  isAdmin: boolean;
  isActive: boolean;
}

export interface IPermission {
  can_access: boolean;
  must_check_owner: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  error: string;
  loading: boolean;
  currentUser: IUser;
  permissions?: Record<string, IPermission>;
}

const initialState: AuthState = {
  isAuthenticated: areTokensValid,
  error: "",
  loading: false,
  currentUser: {
    userId: userId,
    userName: userName,
    roleId: roleId,
    isAdmin: isAdmin,
    isActive: isActive,
  },
  permissions: undefined,
};

export const loginRequest = createAsyncThunk<
  { idToken: string; refreshToken?: string; user?: any },
  { identifier: string; password: string },
  { rejectValue: { status: number; message?: string } }
>("auth/login", async ({ identifier, password }, { rejectWithValue }) => {
  try {
    const res = await loginSimple({ identifier, password });
    const { idToken, refreshToken, user } = res.data;

    // Token đã được lưu trong loginSimple
    return { idToken, refreshToken, user };
  } catch (err: any) {
    return rejectWithValue({
      status: err?.response?.status ?? 0,
      message: err?.response?.data?.message || err.message || "Đăng nhập thất bại",
    });
  }
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.isAuthenticated = action.payload.is_active ? true : false;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.error = "";
      state.currentUser = {
        userId: null,
        userName: null,
        roleId: null,
        isAdmin: false,
        isActive: false,
      };
      state.permissions = undefined;
      removeTokens(false);
    },
    updateUserInfo: (state, action) => {
      state.currentUser.userId = action.payload.id;
      state.currentUser.userName = action.payload.user_name;
      state.currentUser.roleId = action.payload.role_id;
      state.currentUser.isAdmin = action.payload.is_admin;
      state.currentUser.isActive = action.payload.is_active;
      if (action.payload.role_permissions) {
        state.permissions = action.payload.role_permissions;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginRequest.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.error = "";

        // Lưu user & quyền nếu có
        if (action.payload.user) {
          state.currentUser.userId = action.payload.user.id ?? null;
          state.currentUser.userName = action.payload.user.name ?? null;

          // Xác định role từ roles array
          const roles = action.payload.user.roles || [];
          state.currentUser.isAdmin = roles.includes("ADMIN");
          state.currentUser.isActive = action.payload.user.status === 1;

          // Lưu roleId nếu cần (có thể dùng để phân biệt)
          if (roles.includes("ADMIN")) {
            state.currentUser.roleId = 1;
          } else if (roles.includes("HOST")) {
            state.currentUser.roleId = 2;
          } else if (roles.includes("CUSTOMER")) {
            state.currentUser.roleId = 3;
          }
        }
      })
      .addCase(loginRequest.rejected, (state, action) => {
        state.loading = false;
        // ưu tiên message từ rejectWithValue
        state.error = (action.payload as any)?.message || action.error.message || "Login failed";
      });
  },
});

export const { userLoggedIn, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
