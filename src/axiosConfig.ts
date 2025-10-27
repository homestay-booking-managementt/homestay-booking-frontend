import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { removeTokens } from "./utils/removeTokens";
import { mockRefreshToken } from "./utils/mockAuth";

type RefreshTokenRequestFunction = () => Promise<void | { idToken: string; refreshToken: string }>;
let refreshTokenRequest: Promise<void | { idToken: string; refreshToken: string }> | null = null;

// Inject id_token for authorization
const handleAxiosRequest = async (config: InternalAxiosRequestConfig) => {
    if (config.url === "/auth/refresh") {
        // Refresh token
        const refresh_token = localStorage.getItem("refresh_token");
        config.headers.set("Authorization", "Bearer " + refresh_token);
    } else {
        const urlArray = config.url?.split("/");
        const id_token = localStorage.getItem("id_token");
        if (urlArray && urlArray[urlArray.length - 1] !== "auth") {
            config.headers.set("Authorization", "Bearer " + id_token);
        }
    }

    // Set the timeout from the config if provided
    if (config.timeout) {
        axios.defaults.timeout = config.timeout;
    }

    return config;
};

/** Handle axios response errors and refresh token if needed */
export const handleAxiosResponseError = async (error: unknown) => {
    const errorObj = error as {
        config?: InternalAxiosRequestConfig;
        response?: { status: number };
    };
    const originalRequest = errorObj.config;

    if (
        errorObj.response &&
        errorObj.response.status === axios.HttpStatusCode.Unauthorized &&
        originalRequest &&
        !originalRequest.url?.includes("auth")
    ) {
        refreshTokenRequest = refreshTokenRequest ? refreshTokenRequest : refreshToken();
        const res = await refreshTokenRequest;

        if (res?.refreshToken && res?.idToken) {
            refreshTokenRequest = null;
            axios.defaults.headers.common["Authorization"] = `Bearer ${res?.idToken}`;
            originalRequest.headers["Authorization"] = `Bearer ${res?.idToken}`;
            return trackPromise(axios(originalRequest));
        } else {
            return;
        }
    }

    return Promise.reject(error);
};

export const refreshToken: RefreshTokenRequestFunction = async () => {
    try {
        // MOCK MODE: Use mock refresh token
        // Comment out the mockRefreshToken line and uncomment axios call to use real API
        const response = await mockRefreshToken();
        if (response?.idToken && response?.refreshToken) {
            refreshTokenRequest = null;
            localStorage.setItem("id_token", response.idToken);
            localStorage.setItem("refresh_token", response.refreshToken);
            return {
                idToken: response.idToken,
                refreshToken: response.refreshToken,
            };
        }

        // REAL API MODE: Uncomment this to use your actual backend
        // return trackPromise(
        //     axios({ method: "POST", url: url }).then((response) => {
        //         if (response?.data?.idToken && response?.data?.refreshToken) {
        //             refreshTokenRequest = null;
        //             localStorage.setItem('id_token', response.data.idToken);
        //             localStorage.setItem('refresh_token', response.data.refreshToken);
        //             return {
        //                 idToken: response.data.idToken,
        //                 refreshToken: response.data.refreshToken,
        //             };
        //         }
        //     }).catch(async error => {
        //         removeTokens();
        //     })
        // );
    } catch (error) {
        removeTokens();
    }
    return;
};

// Set backend url
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_URL;

// Set default request timeout
axios.defaults.timeout = 30000; // ms

// Inject id_token for authorization
axios.interceptors.request.use(handleAxiosRequest, (error) => Promise.reject(error));

// Refresh token if id token is expired
axios.interceptors.response.use((res) => res, handleAxiosResponseError);
