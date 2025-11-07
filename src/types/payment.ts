export type PaymentMethod =
  | "VNPAY"
  | "MOMO"
  | "CARD"
  | "TRANSFER"
  | "credit_card"
  | "bank_transfer"
  | "e_wallet";

export interface PaymentInitPayload {
  bookingId: number;
  method: PaymentMethod;
  returnUrl?: string;
}

export interface PaymentInitResponse {
  paymentId?: string;
  checkoutUrl?: string;
  paymentUrl?: string;
  data?: unknown;
  status?: string;
}

export interface PaymentStatusResponse {
  status?: string;
  lastUpdated?: string;
  raw?: unknown;
}
