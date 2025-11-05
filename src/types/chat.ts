export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface ChatSessionResponse {
  sessionId: number;
}

export interface ChatMessagePayload {
  message: string;
}

export interface ChatMessageResponse {
  id: number;
  message: string;
  sender: "user" | "bot" | "support";
  createdAt?: string;
}

export interface ChatFeedbackPayload {
  rating: number;
  comment?: string;
}
