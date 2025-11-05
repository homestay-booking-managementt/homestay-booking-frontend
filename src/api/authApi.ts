import type {
  ChangePasswordPayload,
  LoginPayload,
  LoginResponse,
  ProfileUpdatePayload,
  RegisterPayload,
} from "../types/auth";
import { sendRequest } from "../utils/sendRequest";

export const register = (payload: RegisterPayload) =>
  sendRequest("/auth/register", {
    method: "POST",
    payload,
  }) as Promise<LoginResponse>;

export const login = (payload: LoginPayload) =>
  sendRequest("/auth/login", {
    method: "POST",
    payload,
  }) as Promise<LoginResponse>;

export const changePassword = (payload: ChangePasswordPayload) =>
  sendRequest("/auth/change-password", {
    method: "POST",
    payload,
  });

export const updateProfile = (payload: ProfileUpdatePayload) => {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.email) formData.append("email", payload.email);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.avatar) formData.append("avatar", payload.avatar);

  return sendRequest("/auth/profile", {
    method: "PUT",
    payload: formData,
  });
};

export const deactivateAccount = () =>
  sendRequest("/auth/deactivate", {
    method: "POST",
  });

export const getProfile = () =>
  sendRequest("/auth/profile", {
    method: "GET",
  });
