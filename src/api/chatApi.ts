import type {
  ChatFeedbackPayload,
  ChatMessagePayload,
  ChatMessageResponse,
  ChatSessionResponse,
  FaqItem,
} from "@/types/chat";
import { sendRequest } from "@/utils/sendRequest";

export const fetchFaqs = () =>
  sendRequest("/chat/faq", {
    method: "GET",
  }) as Promise<FaqItem[]>;

export const startChatSession = () =>
  sendRequest("/chat/session", {
    method: "POST",
  }) as Promise<ChatSessionResponse>;

export const sendChatMessage = (sessionId: number, payload: ChatMessagePayload) =>
  sendRequest(`/chat/session/${sessionId}/messages`, {
    method: "POST",
    payload,
  }) as Promise<ChatMessageResponse>;

export const sendChatFeedback = (messageId: number, payload: ChatFeedbackPayload) =>
  sendRequest(`/chat/messages/${messageId}/feedback`, {
    method: "POST",
    payload,
  });
