import { useEffect, useState } from "react";
import { showAlert } from "@/utils/showAlert";

interface ChatSession {
  id: number;
  guestName: string;
  hostName: string;
  homestayName: string;
  messageCount: number;
  lastMessageAt: string;
  flagged: boolean;
}

interface ChatMonitorMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: "guest" | "host";
  message: string;
  timestamp: string;
  flagged: boolean;
}

const AdminChatMonitorPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMonitorMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadSessions = async () => {
    setLoading(true);
    try {
      // TODO: Integrate with chat monitor API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const mockSessions: ChatSession[] = [
        {
          id: 1,
          guestName: "Nguyen Van A",
          hostName: "Tran Van B",
          homestayName: "Mountain View",
          messageCount: 15,
          lastMessageAt: "2025-11-05T10:30:00Z",
          flagged: false,
        },
        {
          id: 2,
          guestName: "Le Thi C",
          hostName: "Pham Van D",
          homestayName: "Beach Villa",
          messageCount: 8,
          lastMessageAt: "2025-11-04T18:45:00Z",
          flagged: true,
        },
      ];
      setSessions(mockSessions);
    } catch (error) {
      showAlert("Unable to load chat sessions", "danger");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (sessionId: number) => {
    try {
      // TODO: Integrate with messages API
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockMessages: ChatMonitorMessage[] = [
        {
          id: 1,
          senderId: 101,
          senderName: "Nguyen Van A",
          senderRole: "guest",
          message: "Is this available for next weekend?",
          timestamp: "2025-11-05T09:00:00Z",
          flagged: false,
        },
        {
          id: 2,
          senderId: 201,
          senderName: "Tran Van B",
          senderRole: "host",
          message: "Yes, it's available. Please book through the system.",
          timestamp: "2025-11-05T09:15:00Z",
          flagged: false,
        },
      ];
      setMessages(mockMessages);
      setSelectedSession(sessionId);
    } catch (error) {
      showAlert("Unable to load messages", "danger");
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleFlagMessage = async (messageId: number) => {
    setActionLoading(true);
    try {
      // TODO: Integrate with flag message API
      await new Promise((resolve) => setTimeout(resolve, 500));
      setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, flagged: !msg.flagged } : msg)));
      showAlert("Message flagged for review", "success");
    } catch (error) {
      showAlert("Failed to flag message", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleWarnUser = async (userId: number, userName: string) => {
    if (typeof window !== "undefined" && !window.confirm(`Send warning to ${userName}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      // TODO: Integrate with warn user API
      await new Promise((resolve) => setTimeout(resolve, 500));
      showAlert(`Warning sent to ${userName}`, "success");
    } catch (error) {
      showAlert("Failed to send warning", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const handleLockAccount = async (userId: number, userName: string) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(`Lock account for ${userName}? This will prevent them from accessing the system.`)
    ) {
      return;
    }

    setActionLoading(true);
    try {
      // TODO: Integrate with lock account API
      await new Promise((resolve) => setTimeout(resolve, 500));
      showAlert(`Account locked: ${userName}`, "success");
    } catch (error) {
      showAlert("Failed to lock account", "danger");
    } finally {
      setActionLoading(false);
    }
  };

  const flaggedCount = sessions.filter((s) => s.flagged).length;
  const selectedSessionData = sessions.find((s) => s.id === selectedSession);

  return (
    <div className="container-fluid">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3 mb-4">
        <div>
          <h1 className="h3 mb-2">Chat Monitoring</h1>
          <p className="text-muted mb-0">Monitor conversations between guests and hosts for policy compliance.</p>
        </div>
        <div className="text-end">
          <div className="fw-semibold">Flagged conversations</div>
          <div className="h4 mb-0 text-danger">{flaggedCount}</div>
        </div>
      </div>

      <div className="row g-0 border rounded overflow-hidden" style={{ height: "600px" }}>
        {/* Session List */}
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
            ) : sessions.length === 0 ? (
              <div className="text-center text-muted py-5">No chat sessions</div>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  className={`p-3 border-bottom cursor-pointer ${
                    selectedSession === session.id ? "bg-primary-subtle" : "bg-white"
                  }`}
                  onClick={() => loadMessages(session.id)}
                  role="button"
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="fw-semibold">{session.homestayName}</div>
                    {session.flagged && <span className="badge bg-danger">Flagged</span>}
                  </div>
                  <div className="text-muted small">
                    Guest: {session.guestName} ↔ Host: {session.hostName}
                  </div>
                  <div className="text-muted small">
                    {session.messageCount} messages • {new Date(session.lastMessageAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message View */}
        <div className="col-md-8 d-flex flex-column bg-white">
          {!selectedSession ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Select a conversation to monitor
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-3 border-bottom bg-light">
                <div className="fw-semibold">{selectedSessionData?.homestayName}</div>
                <div className="text-muted small">
                  {selectedSessionData?.guestName} ↔ {selectedSessionData?.hostName}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-grow-1 overflow-auto p-3" style={{ height: 0 }}>
                {messages.map((msg) => (
                  <div key={msg.id} className="mb-3">
                    <div className={`p-3 rounded ${msg.flagged ? "border border-danger" : "bg-light"}`}>
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <span className="fw-semibold">{msg.senderName}</span>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis ms-2">
                            {msg.senderRole}
                          </span>
                        </div>
                        <button
                          className={`btn btn-sm ${msg.flagged ? "btn-danger" : "btn-outline-secondary"}`}
                          disabled={actionLoading}
                          onClick={() => handleFlagMessage(msg.id)}
                          type="button"
                        >
                          {msg.flagged ? "Unflag" : "Flag"}
                        </button>
                      </div>
                      <div>{msg.message}</div>
                      <div className="text-muted small mt-2">{new Date(msg.timestamp).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="p-3 border-top bg-light">
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    disabled={actionLoading}
                    onClick={() =>
                      handleWarnUser(
                        selectedSessionData?.id || 0,
                        `${selectedSessionData?.guestName} & ${selectedSessionData?.hostName}`
                      )
                    }
                    type="button"
                  >
                    Send Warning
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={actionLoading}
                    onClick={() => handleLockAccount(selectedSessionData?.id || 0, selectedSessionData?.guestName || "")}
                    type="button"
                  >
                    Lock Guest Account
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    disabled={actionLoading}
                    onClick={() => handleLockAccount(selectedSessionData?.id || 0, selectedSessionData?.hostName || "")}
                    type="button"
                  >
                    Lock Host Account
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="alert alert-info mt-4 mb-0">
        <h6 className="alert-heading">Monitoring Guidelines</h6>
        <p className="mb-2">
          <strong>Flag messages that contain:</strong>
        </p>
        <ul className="mb-0">
          <li>Inappropriate language or harassment</li>
          <li>Attempts to conduct transactions outside the platform</li>
          <li>Spam or promotional content</li>
          <li>Sharing of personal contact information (phone, email, social media)</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminChatMonitorPage;
