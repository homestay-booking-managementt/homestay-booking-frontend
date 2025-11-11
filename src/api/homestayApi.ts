import type { Homestay, HomestayFilters, HomestayPayload } from "@/types/homestay";
import { sendRequest } from "@/utils/sendRequest";

export const fetchHomestays = (filters?: HomestayFilters) =>
  sendRequest("/homestays", {
    method: "GET",
    payload: filters,
  });

export const fetchHomestayById = (homestayId: number) =>
  sendRequest(`/homestays/${homestayId}`, {
    method: "GET",
  }) as Promise<Homestay>;

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
  sendRequest("/homestays/mine", {
    method: "GET",
  }) as Promise<Homestay[]>;
