import { fetchFaqs, sendChatFeedback, sendChatMessage, startChatSession } from "@/api/chatApi";
import type { ChatFeedbackPayload, ChatMessageResponse, FaqItem } from "@/types/chat";
import { showAlert } from "@/utils/showAlert";
import { useEffect, useState } from "react";

interface ChatMessage extends ChatMessageResponse {
  local?: boolean;
}

const SupportCenterPage = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);

  const [feedbackForm, setFeedbackForm] = useState({
    messageId: "",
    rating: "5",
    comment: "",
  });
  const [sendingFeedback, setSendingFeedback] = useState(false);

  const loadFaqs = async () => {
    setLoadingFaqs(true);
    try {
      const data = await fetchFaqs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (error) {
      showAlert("Unable to load FAQs", "danger");
    } finally {
      setLoadingFaqs(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleStartSession = async () => {
    try {
      const data = await startChatSession();
      setSessionId(data.sessionId);
      setMessages([]);
      showAlert("Support session started", "success");
    } catch (error) {
      showAlert("Unable to start support session", "danger");
    }
  };

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!sessionId) {
      showAlert("Start a session first", "warning");
      return;
    }

    const trimmedMessage = chatInput.trim();
    if (!trimmedMessage) {
      return;
    }

    const optimisticMessage: ChatMessage = {
      id: Date.now(),
      message: trimmedMessage,
      sender: "user",
      local: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setChatInput("");
    setSendingMessage(true);
    try {
      const response = await sendChatMessage(sessionId, { message: trimmedMessage });
      setMessages((prev) => [...prev, response]);
    } catch (error) {
      showAlert("Unable to send message", "danger");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSendFeedback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageId = Number(feedbackForm.messageId);
    if (Number.isNaN(messageId)) {
      showAlert("Message ID must be numeric", "warning");
      return;
    }

    const payload: ChatFeedbackPayload = {
      rating: Number(feedbackForm.rating),
      comment: feedbackForm.comment || undefined,
    };

    setSendingFeedback(true);
    try {
      await sendChatFeedback(messageId, payload);
      showAlert("Feedback sent", "success");
      setFeedbackForm({ messageId: "", rating: "5", comment: "" });
    } catch (error) {
      showAlert("Unable to send feedback", "danger");
    } finally {
      setSendingFeedback(false);
    }
  };

  return (
    <div className="container">
      <div className="mb-4">
        <h1 className="h3 mb-2">Support center</h1>
        <p className="text-muted mb-0">Browse quick answers or chat with support.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Frequently asked questions</h5>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  disabled={loadingFaqs}
                  onClick={loadFaqs}
                  type="button"
                >
                  {loadingFaqs ? "Refreshing..." : "Refresh"}
                </button>
              </div>
              {loadingFaqs ? (
                <div className="text-center py-4">Loading...</div>
              ) : faqs.length === 0 ? (
                <div className="alert alert-info mb-0">No FAQs yet.</div>
              ) : (
                <div className="accordion" id="support-faq">
                  {faqs.map((faq) => (
                    <div className="accordion-item" key={faq.id}>
                      <h2 className="accordion-header" id={`faq-heading-${faq.id}`}>
                        <button
                          aria-controls={`faq-collapse-${faq.id}`}
                          className="accordion-button collapsed"
                          data-bs-target={`#faq-collapse-${faq.id}`}
                          data-bs-toggle="collapse"
                          type="button"
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div
                        aria-labelledby={`faq-heading-${faq.id}`}
                        className="accordion-collapse collapse"
                        data-bs-parent="#support-faq"
                        id={`faq-collapse-${faq.id}`}
                      >
                        <div className="accordion-body">{faq.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card shadow-sm h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Live support</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleStartSession}
                  type="button"
                >
                  {sessionId ? "Restart session" : "Start session"}
                </button>
              </div>
              <div
                className="border rounded p-3 flex-grow-1 mb-3 overflow-auto"
                style={{ maxHeight: 320 }}
              >
                {sessionId === null ? (
                  <div className="text-muted">Start a session to begin messaging support.</div>
                ) : messages.length === 0 ? (
                  <div className="text-muted">Say hi to start the conversation.</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {messages.map((message) => (
                      <li className="mb-3" key={message.id}>
                        <div className="small text-muted text-uppercase">{message.sender}</div>
                        <div>{message.message}</div>
                        {message.createdAt ? (
                          <div className="small text-muted">{message.createdAt}</div>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <form className="mt-auto" onSubmit={handleSendMessage}>
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Type a message"
                    value={chatInput}
                    onChange={(event) => setChatInput(event.target.value)}
                  />
                  <button className="btn btn-primary" disabled={sendingMessage} type="submit">
                    {sendingMessage ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">Conversation feedback</h5>
          <form className="row g-3" onSubmit={handleSendFeedback}>
            <div className="col-md-4">
              <label className="form-label" htmlFor="feedback-messageId">
                Message ID
              </label>
              <input
                className="form-control"
                id="feedback-messageId"
                name="messageId"
                type="number"
                min={1}
                value={feedbackForm.messageId}
                onChange={(event) =>
                  setFeedbackForm((prev) => ({ ...prev, messageId: event.target.value }))
                }
                required
              />
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="feedback-rating">
                Rating
              </label>
              <select
                className="form-select"
                id="feedback-rating"
                name="rating"
                value={feedbackForm.rating}
                onChange={(event) =>
                  setFeedbackForm((prev) => ({ ...prev, rating: event.target.value }))
                }
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label" htmlFor="feedback-comment">
                Comment
              </label>
              <input
                className="form-control"
                id="feedback-comment"
                name="comment"
                value={feedbackForm.comment}
                onChange={(event) =>
                  setFeedbackForm((prev) => ({ ...prev, comment: event.target.value }))
                }
                placeholder="Optional"
              />
            </div>
            <div className="col-12 text-end">
              <button className="btn btn-outline-primary" disabled={sendingFeedback} type="submit">
                {sendingFeedback ? "Sending..." : "Send feedback"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportCenterPage;
