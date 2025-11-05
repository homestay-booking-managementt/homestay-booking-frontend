import type {
  PaymentInitPayload,
  PaymentInitResponse,
  PaymentStatusResponse,
} from "@/types/payment";
import { sendRequest } from "@/utils/sendRequest";

export const initPayment = (payload: PaymentInitPayload) =>
  sendRequest("/payments", {
    method: "POST",
    payload,
  }) as Promise<PaymentInitResponse>;

export const pollPaymentStatus = (paymentId: string) =>
  sendRequest(`/payments/${paymentId}`, {
    method: "GET",
  }) as Promise<PaymentStatusResponse>;
