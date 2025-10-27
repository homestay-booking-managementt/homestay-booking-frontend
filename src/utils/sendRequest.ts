import type { AxiosRequestConfig, Method } from "axios";
import axios from "axios";
import { trackPromise } from "react-promise-tracker";
import { ERROR_STATUS } from "../types/request";
import { showAlert } from "./showAlert";

interface RequestOptions {
  payload?: object;
  thunkApi?: { rejectWithValue: (value: unknown) => unknown };
  method: Method;
  defineAlert?: boolean;
  timeout?: number;
  dataMap?: (data: unknown) => unknown;
}

export const sendRequest = async (url: string, options?: Partial<RequestOptions>) => {
  const method = options?.method || "GET";
  const config: AxiosRequestConfig = { method: method, url: url };

  if (options?.payload) {
    if (method.toUpperCase() === "GET") {
      config["params"] = options.payload;
    } else {
      config["data"] = options.payload;
    }
  }

  if (options?.timeout) {
    config["timeout"] = options.timeout;
  }

  const request = axios(config)
    .then((res) => {
      return options?.dataMap ? options.dataMap(res.data) : res.data;
    })
    .catch((error) => {
      if (!options?.defineAlert) {
        if (axios.isAxiosError(error)) {
          if (error.code === "ERR_NETWORK") {
            showAlert("Network error.", "danger");
          } else {
            const statusCode = error.response?.status;
            if (statusCode === axios.HttpStatusCode.Forbidden) {
              showAlert("Permission denied.", "warning");
            } else if (
              statusCode &&
              Object.prototype.hasOwnProperty.call(ERROR_STATUS, statusCode)
            ) {
              showAlert(ERROR_STATUS[statusCode], "danger");
            } else if (error.response?.data.detail || error.message) {
              showAlert(error.response?.data.detail || error.message, "danger", {
                dismiss: { duration: 5000 },
              });
            } else {
              showAlert("Send request failed.", "danger");
            }
          }
        } else {
          showAlert("Send request failed.", "danger");
        }
      }
      return (
        options?.thunkApi && options.thunkApi.rejectWithValue(error.response?.data || error.message)
      );
    });

  return trackPromise(request);
};
