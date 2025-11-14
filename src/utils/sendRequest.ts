// import type { AxiosRequestConfig, Method } from "axios";
// import axios from "axios";
// import { trackPromise } from "react-promise-tracker";
// import { ERROR_STATUS } from "../types/request";
// import { showAlert } from "./showAlert";

// interface RequestOptions {
//   payload?: object | FormData;
//   thunkApi?: { rejectWithValue: (value: unknown) => unknown };
//   method: Method;
//   defineAlert?: boolean;
//   timeout?: number;
//   dataMap?: (data: unknown) => unknown;
//   headers?: AxiosRequestConfig["headers"];
// }

// export const sendRequest = async (url: string, options?: Partial<RequestOptions>) => {
//   const method = options?.method || "GET";
//   const config: AxiosRequestConfig = { method: method, url: url };

//   if (options?.payload) {
//     if (method.toUpperCase() === "GET") {
//       config["params"] = options.payload;
//     } else {
//       config["data"] = options.payload;
//     }
//   }

//   if (options?.timeout) {
//     config["timeout"] = options.timeout;
//   }

//   if (options?.headers) {
//     config["headers"] = options.headers;
//   }

//   const request = axios(config)
//     .then((res) => {
//       return options?.dataMap ? options.dataMap(res.data) : res.data;
//     })
//     .catch((error) => {
//       if (!options?.defineAlert) {
//         if (axios.isAxiosError(error)) {
//           if (error.code === "ERR_NETWORK") {
//             showAlert("Network error.", "danger");
//           } else {
//             const statusCode = error.response?.status;
//             if (statusCode === axios.HttpStatusCode.Forbidden) {
//               showAlert("Permission denied.", "warning");
//             } else if (
//               statusCode &&
//               Object.prototype.hasOwnProperty.call(ERROR_STATUS, statusCode)
//             ) {
//               showAlert(ERROR_STATUS[statusCode], "danger");
//             } else if (error.response?.data.detail || error.message) {
//               showAlert(error.response?.data.detail || error.message, "danger", {
//                 dismiss: { duration: 5000 },
//               });
//             } else {
//               showAlert("Send request failed.", "danger");
//             }
//           }
//         } else {
//           showAlert("Send request failed.", "danger");
//         }
//       }
//       return (
//         options?.thunkApi && options.thunkApi.rejectWithValue(error.response?.data || error.message)
//       );
//     });

//   return trackPromise(request);
// };

import type { AxiosRequestConfig, Method } from "axios";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { ERROR_STATUS } from "../types/request";
import { showAlert } from "./showAlert";

interface RequestOptions {
  payload?: object | FormData;
  thunkApi?: { rejectWithValue: (value: unknown) => unknown };
  method: Method;
  defineAlert?: boolean;
  timeout?: number;
  dataMap?: (data: unknown) => unknown;
  headers?: AxiosRequestConfig["headers"];
}

interface BackendErrorResponse {
  success: boolean;
  message: string;
  data: null;
}

/**
 * Parse backend error response and extract message
 * Backend returns: { success: false, message: "Error message", data: null }
 */
const parseBackendError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      return "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      return "Request timeout. Vui lòng thử lại.";
    }

    // Parse backend error response
    const responseData = error.response?.data as BackendErrorResponse | undefined;
    
    if (responseData && typeof responseData === "object") {
      // Extract message from backend standardized error response
      if ("message" in responseData && responseData.message) {
        return responseData.message;
      }
      
      // Fallback to detail field if exists (for legacy responses)
      if ("detail" in responseData && (responseData as any).detail) {
        return (responseData as any).detail;
      }
    }

    // Handle HTTP status codes
    const statusCode = error.response?.status;
    if (statusCode === axios.HttpStatusCode.Forbidden) {
      return "Bạn không có quyền thực hiện thao tác này.";
    }
    if (statusCode === axios.HttpStatusCode.Unauthorized) {
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    }
    if (statusCode === axios.HttpStatusCode.NotFound) {
      return "Không tìm thấy tài nguyên yêu cầu.";
    }
    if (statusCode === axios.HttpStatusCode.BadRequest) {
      return "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
    }
    if (statusCode === axios.HttpStatusCode.InternalServerError) {
      return "Lỗi server. Vui lòng thử lại sau.";
    }
    
    // Check ERROR_STATUS mapping
    if (statusCode && Object.prototype.hasOwnProperty.call(ERROR_STATUS, statusCode)) {
      return ERROR_STATUS[statusCode];
    }

    // Fallback to axios error message
    if (error.message) {
      return error.message;
    }
  }

  // Handle non-axios errors
  if (error instanceof Error) {
    return error.message;
  }

  return "Có lỗi xảy ra. Vui lòng thử lại.";
};

export const sendRequest = async (url: string, options?: Partial<RequestOptions>) => {
  const method = options?.method || "GET";

  // Sử dụng url trực tiếp - Vite proxy sẽ xử lý việc chuyển tiếp request
  const config: AxiosRequestConfig = { method, url };

  // Payload cho GET và POST/PUT/DELETE
  if (options?.payload) {
    if (method.toUpperCase() === "GET") {
      config.params = options.payload;
    } else {
      config.data = options.payload;
    }
  }

  // Timeout nếu có
  if (options?.timeout) config.timeout = options.timeout;

  // Headers tùy chọn
  if (options?.headers) config.headers = options.headers;

  // Thực thi request có tracking và xử lý alert
  const request = axios(config)
    .then((res) => {
      return options?.dataMap ? options.dataMap(res.data) : res.data;
    })
    .catch((error) => {
      // Parse error message from backend
      const errorMessage = parseBackendError(error);

      // Show alert if not disabled
      if (!options?.defineAlert) {
        showAlert(errorMessage, "danger", {
          dismiss: { duration: 5000 },
        });
      }

      // Create error object with clear message for API consumers
      const errorToThrow = new Error(errorMessage);
      (errorToThrow as any).originalError = error;
      (errorToThrow as any).statusCode = axios.isAxiosError(error) ? error.response?.status : undefined;

      // Handle Redux Toolkit thunk rejection
      if (options?.thunkApi) {
        return options.thunkApi.rejectWithValue({
          message: errorMessage,
          statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
          originalError: error.response?.data || error.message,
        });
      }

      // ✅ Giữ nguyên logic rejectWithValue nếu dùng trong Redux Toolkit
      // return (
      //   options?.thunkApi &&
      //   options.thunkApi.rejectWithValue(error.response?.data || error.message)
      // );
      throw error;
    });

  return trackPromise(request);
};
