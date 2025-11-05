import type { ReviewPayload, ReviewReplyPayload } from "@/types/review";
import { sendRequest } from "@/utils/sendRequest";

export const createReview = (payload: ReviewPayload) =>
  sendRequest("/reviews", {
    method: "POST",
    payload,
  });

export const replyReview = (reviewId: number, payload: ReviewReplyPayload) =>
  sendRequest(`/reviews/${reviewId}/reply`, {
    method: "POST",
    payload,
  });
