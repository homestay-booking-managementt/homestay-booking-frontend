import type { Homestay, HomestayFilters, HomestayPayload } from "@/types/homestay";
import { sendRequest } from "@/utils/sendRequest";

  export const fetchHomestays = async (filters?: HomestayFilters) => {
  const query = filters
    ? "?" +
      new URLSearchParams(
        Object.entries(filters).reduce((acc, [k, v]) => {
          if (v !== undefined && v !== null && v !== "") acc[k] = String(v);
          return acc;
        }, {} as Record<string, string>)
      ).toString()
    : "";

  const res = await sendRequest(`http://localhost:8082/api/homestays${query}`, {
    method: "GET",
  });
  return res?.data ?? [];
};

// export const fetchHomestayById = (homestayId: number) =>
//   sendRequest(`/homestays/${homestayId}`, {
//     method: "GET",
//   }) as Promise<Homestay>;
export const fetchHomestayById = async (homestayId: number): Promise<Homestay | undefined> => {
  const allHomestays = await fetchHomestays();
  const homestay = allHomestays.find((h) => h.id === homestayId);
  return homestay;
};

export const createHomestay = (payload: HomestayPayload) =>
  sendRequest("/homestays", {
    method: "POST",
    payload,
  });

export const updateHomestay = (homestayId: number, payload: HomestayPayload) =>
  sendRequest(`/homestays/${homestayId}`, {
    method: "PUT",
    payload,
  });

export const deleteHomestay = (homestayId: number) =>
  sendRequest(`/homestays/${homestayId}`, {
    method: "DELETE",
  });

export const fetchMyHomestays = () =>
  sendRequest("/api/v1/homestays/my-homestays", {
    method: "GET",
  }) as Promise<Homestay[]>;
