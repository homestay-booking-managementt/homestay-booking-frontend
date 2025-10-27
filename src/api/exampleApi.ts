// Example API service
import { sendRequest } from "@/utils/sendRequest";

export const exampleApi = {
  // GET request example
  getItems: async () => {
    return sendRequest("/items", { method: "GET" });
  },

  // GET request with params
  getItemById: async (id: number) => {
    return sendRequest(`/items/${id}`, { method: "GET" });
  },

  // POST request example
  createItem: async (data: Record<string, unknown>) => {
    return sendRequest("/items", {
      method: "POST",
      payload: data,
    });
  },

  // PUT request example
  updateItem: async (id: number, data: Record<string, unknown>) => {
    return sendRequest(`/items/${id}`, {
      method: "PUT",
      payload: data,
    });
  },

  // DELETE request example
  deleteItem: async (id: number) => {
    return sendRequest(`/items/${id}`, {
      method: "DELETE",
    });
  },
};
