import { useState } from "react";
import { FaPaperPlane, FaSearch, FaCircle, FaImage, FaSmile } from "react-icons/fa";
import { hostCommonStyles } from "./HostCommonStyles";

interface ChatMessage {
  id: number;
  senderId: number;
  senderName: string;
  senderRole: "host" | "guest";
  message: string;
  timestamp: string;
  isRead: boolean;
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
  isOnline: boolean;
}

// Mock data
const getMockConversations = (): ChatConversation[] => [
  {
    id: 1,
    guestId: 101,
    guestName: "Nguyễn Văn A",
    guestAvatar: undefined,
    homestayName: "Villa Đà Lạt",
    lastMessage: "Cho em hỏi buổi sáng có bữa ăn sáng miễn phí không ạ?",
    lastMessageTime: "2024-11-10T10:30:00",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: 2,
    guestId: 102,
    guestName: "Trần Thị B",
    guestAvatar: undefined,
    homestayName: "Homestay Hội An",
    lastMessage: "Cảm ơn anh nhiều nhé!",
    lastMessageTime: "2024-11-10T09:15:00",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 3,
    guestId: 103,
    guestName: "Lê Văn C",
    guestAvatar: undefined,
    homestayName: "Villa Đà Lạt",
    lastMessage: "Em muốn đặt thêm 1 đêm nữa được không ạ?",
    lastMessageTime: "2024-11-09T18:45:00",
    unreadCount: 1,
    isOnline: true,
  },
  {
    id: 4,
    guestId: 104,
    guestName: "Phạm Thị D",
    guestAvatar: undefined,
    homestayName: "Beach House Nha Trang",
    lastMessage: "Ok anh, em đã nhận được thông tin. Thanks!",
    lastMessageTime: "2024-11-09T14:20:00",
    unreadCount: 0,
    isOnline: false,
  },
  {
    id: 5,
    guestId: 105,
    guestName: "Hoàng Văn E",
    guestAvatar: undefined,
    homestayName: "Homestay Hội An",
    lastMessage: "Cho em xin địa chỉ homestay với ạ",
    lastMessageTime: "2024-11-09T11:30:00",
    unreadCount: 0,
    isOnline: false,
  },
];

const getMockMessages = (conversationId: number): ChatMessage[] => {
  const messagesByConversation: { [key: number]: ChatMessage[] } = {
    1: [
      {
        id: 1,
        senderId: 101,
        senderName: "Nguyễn Văn A",
        senderRole: "guest",
        message: "Xin chào anh, em muốn đặt phòng từ ngày 15-18/11 ạ",
        timestamp: "2024-11-10T09:00:00",
        isRead: true,
      },
      {
        id: 2,
        senderId: 1,
        senderName: "Host",
        senderRole: "host",
        message: "Chào em! Được ạ, phòng của anh còn trống thời gian đó. Em đặt cho mấy người?",
        timestamp: "2024-11-10T09:05:00",
        isRead: true,
      },
      {
        id: 3,
        senderId: 101,
        senderName: "Nguyễn Văn A",
        senderRole: "guest",
        message: "Em đặt cho 4 người ạ. Cho em hỏi villa có gồm bữa ăn sáng không ạ?",
        timestamp: "2024-11-10T09:10:00",
        isRead: true,
      },
      {
        id: 4,
        senderId: 1,
        senderName: "Host",
        senderRole: "host",
        message: "Có ạ, giá phòng đã bao gồm buffet sáng cho 4 người. Villa còn có bể bơi và BBQ nữa nhé!",
        timestamp: "2024-11-10T09:12:00",
        isRead: true,
      },
      {
        id: 5,
        senderId: 101,
        senderName: "Nguyễn Văn A",
        senderRole: "guest",
        message: "Cho em hỏi buổi sáng có bữa ăn sáng miễn phí không ạ?",
        timestamp: "2024-11-10T10:30:00",
        isRead: false,
      },
    ],
    2: [
      {
        id: 1,
        senderId: 102,
        senderName: "Trần Thị B",
        senderRole: "guest",
        message: "Anh ơi, em muốn check-in sớm được không ạ?",
        timestamp: "2024-11-10T08:00:00",
        isRead: true,
      },
      {
        id: 2,
        senderId: 1,
        senderName: "Host",
        senderRole: "host",
        message: "Được ạ em, anh sẽ sắp xếp cho em check-in từ 12h trưa nhé!",
        timestamp: "2024-11-10T08:30:00",
        isRead: true,
      },
      {
        id: 3,
        senderId: 102,
        senderName: "Trần Thị B",
        senderRole: "guest",
        message: "Cảm ơn anh nhiều nhé!",
        timestamp: "2024-11-10T09:15:00",
        isRead: true,
      },
    ],
    3: [
      {
        id: 1,
        senderId: 103,
        senderName: "Lê Văn C",
        senderRole: "guest",
        message: "Em muốn đặt thêm 1 đêm nữa được không ạ?",
        timestamp: "2024-11-09T18:45:00",
        isRead: false,
      },
    ],
  };

  return messagesByConversation[conversationId] || [];
};

const HostChatPage = () => {
  const [conversations] = useState<ChatConversation[]>(getMockConversations());
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    conversations[0]?.id || null
  );
  const [messages, setMessages] = useState<ChatMessage[]>(
    getMockMessages(conversations[0]?.id || 1)
  );
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConversation = conversations.find((c) => c.id === selectedConversation);

  const handleSelectConversation = (conversationId: number) => {
    setSelectedConversation(conversationId);
    setMessages(getMockMessages(conversationId));
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      senderId: 1,
      senderName: "Host",
      senderRole: "host",
      message: messageInput,
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    } else if (diffInHours < 48) {
      return "Hôm qua";
    } else {
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    }
  };

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.homestayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{hostCommonStyles}</style>
      <style>{`
        .chat-container {
          display: flex;
          height: calc(100vh - 140px);
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }

        /* Conversations List */
        .conversations-sidebar {
          width: 360px;
          border-right: 1px solid rgba(226, 232, 240, 0.8);
          display: flex;
          flex-direction: column;
          background: #fafafa;
        }

        .conversations-header {
          padding: 20px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .conversations-header h2 {
          margin: 0 0 16px 0;
          font-size: 20px;
          font-weight: 600;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .search-box {
          position: relative;
        }

        .search-box input {
          width: 100%;
          padding: 10px 12px 10px 40px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-box input:focus {
          outline: none;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .search-box svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 14px;
        }

        .conversations-list {
          flex: 1;
          overflow-y: auto;
        }

        .conversation-item {
          padding: 16px 20px;
          cursor: pointer;
          transition: all 0.2s;
          border-left: 3px solid transparent;
          background: #ffffff;
          border-bottom: 1px solid rgba(226, 232, 240, 0.5);
        }

        .conversation-item:hover {
          background: rgba(16, 185, 129, 0.05);
          border-left-color: #10b981;
        }

        .conversation-item.active {
          background: linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(20, 184, 166, 0.05) 100%);
          border-left-color: #10b981;
        }

        .conversation-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 8px;
        }

        .conversation-avatar {
          position: relative;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
          flex-shrink: 0;
        }

        .online-indicator {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
        }

        .conversation-info {
          flex: 1;
          min-width: 0;
        }

        .conversation-name {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .conversation-time {
          font-size: 12px;
          color: #94a3b8;
        }

        .conversation-preview {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .conversation-last-message {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .unread-badge {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 12px;
          min-width: 20px;
          text-align: center;
          flex-shrink: 0;
        }

        .homestay-tag {
          font-size: 11px;
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
          margin-top: 4px;
          display: inline-block;
        }

        /* Chat Area */
        .chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .chat-header {
          padding: 20px 24px;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .chat-header-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 18px;
        }

        .chat-header-details h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .chat-header-status {
          font-size: 13px;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .status-online {
          color: #10b981;
          font-weight: 500;
        }

        .status-offline {
          color: #94a3b8;
        }

        /* Messages Area */
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 24px;
          background: linear-gradient(to bottom, #f8fffe 0%, #ffffff 100%);
        }

        .message-group {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .message-group.host {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 14px;
          flex-shrink: 0;
        }

        .message-avatar.guest {
          background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
        }

        .message-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .message-group.host .message-content {
          align-items: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .message-group.guest .message-bubble {
          background: #f1f5f9;
          color: #1e293b;
          border-bottom-left-radius: 4px;
        }

        .message-group.host .message-bubble {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }

        .message-timestamp {
          font-size: 11px;
          color: #94a3b8;
          padding: 0 4px;
        }

        /* Input Area */
        .message-input-area {
          padding: 20px 24px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          background: #ffffff;
        }

        .input-wrapper {
          display: flex;
          gap: 12px;
          align-items: flex-end;
        }

        .input-actions {
          display: flex;
          gap: 8px;
        }

        .input-action-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 16px;
        }

        .input-action-btn:hover {
          background: rgba(16, 185, 129, 0.2);
        }

        .input-field {
          flex: 1;
          display: flex;
          align-items: center;
          background: #f8fafc;
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 12px;
          padding: 8px 16px;
          transition: all 0.2s;
        }

        .input-field:focus-within {
          background: #ffffff;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .input-field textarea {
          flex: 1;
          border: none;
          background: transparent;
          resize: none;
          font-size: 14px;
          line-height: 1.5;
          padding: 4px 0;
          max-height: 120px;
          font-family: inherit;
        }

        .input-field textarea:focus {
          outline: none;
        }

        .send-button {
          width: 40px;
          height: 40px;
          border: none;
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
          font-size: 16px;
        }

        .send-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .send-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px;
          color: #94a3b8;
        }

        .empty-state-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-state h3 {
          margin: 0 0 8px 0;
          color: #64748b;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        /* Scrollbar */
        .conversations-list::-webkit-scrollbar,
        .messages-area::-webkit-scrollbar {
          width: 6px;
        }

        .conversations-list::-webkit-scrollbar-track,
        .messages-area::-webkit-scrollbar-track {
          background: transparent;
        }

        .conversations-list::-webkit-scrollbar-thumb,
        .messages-area::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 3px;
        }

        .conversations-list::-webkit-scrollbar-thumb:hover,
        .messages-area::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }
      `}</style>

      <div className="host-page">
        <div className="chat-container">
          {/* Conversations Sidebar */}
          <div className="conversations-sidebar">
            <div className="conversations-header">
              <h2>Tin nhắn</h2>
              <div className="search-box">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Tìm kiếm cuộc trò chuyện..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

<<<<<<< HEAD
            <div className="conversations-list">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`conversation-item ${
                    selectedConversation === conversation.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectConversation(conversation.id)}
                >
                  <div className="conversation-header">
                    <div className="conversation-avatar">
                      {conversation.isOnline && <div className="online-indicator" />}
                      {conversation.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div className="conversation-info">
                      <div className="conversation-name">
                        <span>{conversation.guestName}</span>
                        <span className="conversation-time">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>
                      <div className="conversation-preview">
                        <span className="conversation-last-message">
                          {conversation.lastMessage}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">{conversation.unreadCount}</span>
                        )}
                      </div>
                      <span className="homestay-tag">{conversation.homestayName}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="chat-area">
            {currentConversation ? (
              <>
                <div className="chat-header">
                  <div className="chat-header-info">
                    <div className="chat-header-avatar">
                      {currentConversation.guestName.charAt(0).toUpperCase()}
                    </div>
                    <div className="chat-header-details">
                      <h3>{currentConversation.guestName}</h3>
                      <div className="chat-header-status">
                        <FaCircle style={{ fontSize: "8px" }} />
                        <span
                          className={
                            currentConversation.isOnline ? "status-online" : "status-offline"
                          }
                        >
                          {currentConversation.isOnline ? "Đang hoạt động" : "Offline"}
                        </span>
                        <span>•</span>
                        <span>{currentConversation.homestayName}</span>
=======
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
                      <div
                        className={`small mt-1 ${msg.senderRole === "host" ? "text-white-50" : "text-muted"}`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString()}
>>>>>>> 3b66415 (login, register, me)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="messages-area">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-group ${message.senderRole}`}
                    >
                      <div className={`message-avatar ${message.senderRole}`}>
                        {message.senderName.charAt(0).toUpperCase()}
                      </div>
                      <div className="message-content">
                        <div className="message-bubble">{message.message}</div>
                        <span className="message-timestamp">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="message-input-area">
                  <div className="input-wrapper">
                    <div className="input-actions">
                      <button className="input-action-btn" title="Đính kèm hình ảnh">
                        <FaImage />
                      </button>
                      <button className="input-action-btn" title="Thêm emoji">
                        <FaSmile />
                      </button>
                    </div>
                    <div className="input-field">
                      <textarea
                        placeholder="Nhập tin nhắn..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        rows={1}
                      />
                    </div>
                    <button
                      className="send-button"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                      title="Gửi tin nhắn"
                    >
                      <FaPaperPlane />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">💬</div>
                <h3>Chọn một cuộc trò chuyện</h3>
                <p>Chọn một cuộc trò chuyện từ danh sách để bắt đầu nhắn tin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HostChatPage;
