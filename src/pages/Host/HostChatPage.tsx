import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: "host" | "guest";
  message: string;
  timestamp: string;
}

interface ChatConversation {
  id: number;
  guestId: number;
  guestName: string;
  guestAvatar?: string;
  homestayName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

const HostChatPage = () => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with chat conversations API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockConversations: ChatConversation[] = [
        {
          id: 1,
          guestId: 101,
          guestName: "Nguyen Van A",
          homestayName: "Cozy Mountain Retreat",
          lastMessage: "Is breakfast included?",
          lastMessageTime: "2025-11-05T10:30:00Z",
          unreadCount: 2,
        },
        {
          id: 2,
          guestId: 102,
          guestName: "Tran Thi B",
          homestayName: "Beachfront Villa",
          lastMessage: "Thank you for confirming!",
          lastMessageTime: "2025-11-04T18:45:00Z",
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
    } catch (error) {
      showAlert("Unable to load conversations", "danger");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      // TODO: Integrate with chat messages API
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockMessages: ChatMessage[] = [
        {
          id: 1,
          senderId: 101,
          senderName: "Nguyen Van A",
          senderRole: "guest",
          message: "Hi, I'm interested in booking your homestay.",
          timestamp: "2025-11-05T09:00:00Z",
        },
        {
          id: 2,
          senderId: 1,
          senderName: "You",
          senderRole: "host",
          message: "Hello! Thank you for your interest. How can I help you?",
          timestamp: "2025-11-05T09:15:00Z",
        },
        {
          id: 3,
          senderId: 101,
          senderName: "Nguyen Van A",
          senderRole: "guest",
          message: "Is breakfast included?",
          timestamp: "2025-11-05T10:30:00Z",
        },
      ];
      setMessages(mockMessages);
      setSelectedConversation(conversationId);
    } catch (error) {
      showAlert("Unable to load messages", "danger");
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!messageInput.trim() || !selectedConversation) {
      return;
    }

    setSending(true);
    try {
      // TODO: Integrate with send message API
      await new Promise((resolve) => setTimeout(resolve, 500));
      const newMessage: ChatMessage = {
        id: Date.now(),
        senderId: 1,
        senderName: "You",
        senderRole: "host",
        message: messageInput,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
      showAlert("Message sent", "success");
    } catch (error) {
      showAlert("Failed to send message", "danger");
    } finally {
      setSending(false);
    }
  };

  const selectedConvData = conversations.find((c) => c.id === selectedConversation);

  return (
    <div className="container-fluid">
      <div className="mb-4">
        <h1 className="h3 mb-2">Guest Messages</h1>
        <p className="text-muted mb-0">Respond to guest inquiries and booking questions.</p>
      </div>

      <div className="row g-0 border rounded overflow-hidden" style={{ height: "600px" }}>
        {/* Conversation List */}
        <div className="col-md-4 border-end bg-light">
          <div className="p-3 border-bottom bg-white">
            <input className="form-control" placeholder="Search conversations..." type="text" />
          </div>
          <div className="overflow-auto" style={{ height: "calc(600px - 60px)" }}>
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center text-muted py-5">No conversations yet</div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`p-3 border-bottom cursor-pointer ${
                    selectedConversation === conv.id ? "bg-primary-subtle" : "bg-white"
                  }`}
                  onClick={() => loadMessages(conv.id)}
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{conv.guestName}</div>
                      <div className="text-muted small">{conv.homestayName}</div>
                      <div className="text-muted small text-truncate">{conv.lastMessage}</div>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="badge bg-primary rounded-pill">{conv.unreadCount}</span>
                    )}
                  </div>
                  <div className="text-muted small mt-1">
                    {new Date(conv.lastMessageTime).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-md-8 d-flex flex-column bg-white">
          {!selectedConversation ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Select a conversation to start messaging
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-3 border-bottom bg-light">
                <div className="fw-semibold">{selectedConvData?.guestName}</div>
                <div className="text-muted small">{selectedConvData?.homestayName}</div>
              </div>

              {/* Messages */}
              <div className="flex-grow-1 overflow-auto p-3" style={{ height: 0 }}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 d-flex ${msg.senderRole === "host" ? "justify-content-end" : ""}`}
                  >
                    <div
                      className={`p-3 rounded ${
                        msg.senderRole === "host" ? "bg-primary text-white" : "bg-light"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      <div className="small fw-semibold mb-1">{msg.senderName}</div>
                      <div>{msg.message}</div>
                      <div className={`small mt-1 ${msg.senderRole === "host" ? "text-white-50" : "text-muted"}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-3 border-top">
                <form onSubmit={handleSendMessage}>
                  <div className="input-group">
                    <input
                      className="form-control"
                      placeholder="Type your message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                    />
                    <button className="btn btn-primary" disabled={sending} type="submit">
                      {sending ? "Sending..." : "Send"}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostChatPage;
