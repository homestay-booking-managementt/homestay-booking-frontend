import type { Review, ReviewPayload, ReviewReplyPayload } from "@/types/review";
import { sendRequest } from "@/utils/sendRequest";

export const createReview = async (userId: number,payload: ReviewPayload) =>{
  const res = await sendRequest(`http://localhost:8084/api/v1/reviews?userId=${userId}`, {
    method: "POST",
    payload,
  });
  return res?.data;
}
  

export const replyReview = (reviewId: number, payload: ReviewReplyPayload) =>
  sendRequest(`/reviews/${reviewId}/reply`, {
    method: "POST",
    payload,
  });
export const fetchReviewsByHomestay = (homestayId: number) =>
  sendRequest(`http://localhost:8084/api/v1/reviews/homestay/${homestayId}`, {
    method: "GET",
  }) as Promise<Review[]>;