import type { Complaint, ComplaintPayload } from "@/types/complaint";
import { sendRequest } from "@/utils/sendRequest";

export const createComplaint = (payload: ComplaintPayload) =>
  sendRequest("/complaints", {
    method: "POST",
    payload,
  });

export const fetchMyComplaints = () =>
  sendRequest("/complaints/mine", {
    method: "GET",
  }) as Promise<Complaint[]>;
