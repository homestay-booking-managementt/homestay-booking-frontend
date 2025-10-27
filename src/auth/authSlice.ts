import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { removeTokens } from "../utils/removeTokens";
import { mockLogin } from "../utils/mockAuth";

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

        if (tokenDecode && Object.prototype.hasOwnProperty.call(tokenDecode, "user_id")) {
            userId = tokenDecode["user_id"] as number;
            userName = tokenDecode["user_name"] as string;
            roleId = tokenDecode["role_id"] as number;
            isAdmin = (tokenDecode["is_admin"] as boolean) || false;
            isActive = (tokenDecode["is_active"] as boolean) || false;
        } else {
            areTokensValid = false;
        }
    } catch (error) {
        areTokensValid = false;
    }
}

// Verify if refresh token has been expired
if (refreshToken) {
    try {
        const tokenDecode: Record<string, unknown> = jwtDecode(refreshToken);
        if (tokenDecode && Object.prototype.hasOwnProperty.call(tokenDecode, "exp")) {
            const expirationTime = (tokenDecode["exp"] as number) * 1000;
            if (expirationTime < new Date().getTime()) {
                areTokensValid = false;
            }
        }
    } catch (error) {
        areTokensValid = false;
    }
}

if (!areTokensValid) {
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

// Async thunk for login
export const loginRequest = createAsyncThunk(
    "auth/login",
    async (credentials: { username: string; password: string }, thunkApi) => {
        // MOCK MODE: Use mock authentication instead of real API
        // Comment out the line below and uncomment the sendRequest line to use real API
        return mockLogin(credentials.username, credentials.password);

        // REAL API MODE: Uncomment this to use your actual backend
        // return sendRequest('/auth/login', {
        //     method: 'POST',
        //     payload: credentials,
        //     thunkApi,
        // });
    }
);

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

            // Store permissions from API response
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
                if (action.payload?.idToken && action.payload?.refreshToken) {
                    state.isAuthenticated = true;
                    state.loading = false;
                    localStorage.setItem("id_token", action.payload.idToken);
                    localStorage.setItem("refresh_token", action.payload.refreshToken);
                    state.error = "";

                    // Update user info and permissions from login response
                    if (action.payload.user) {
                        state.currentUser.userId = action.payload.user.id;
                        state.currentUser.userName = action.payload.user.user_name;
                        state.currentUser.roleId = action.payload.user.role_id;
                        state.currentUser.isAdmin = action.payload.user.is_admin;
                        state.currentUser.isActive = action.payload.user.is_active;
                    }

                    // Store permissions
                    if (action.payload.role_permissions) {
                        state.permissions = action.payload.role_permissions;
                    }
                }
            })
            .addCase(loginRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Login failed";
            });
    },
});

export const { userLoggedIn, logout, updateUserInfo } = authSlice.actions;
