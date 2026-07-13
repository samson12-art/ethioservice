import { MessageCircle } from "lucide-react";

export default function MessagesPage({ messages, chatMessage, setChatMessage, sendMessage }) {
  return (
    <>
      <div className="panel">
        <div className="panel-title">
          <MessageCircle />
          <div>
            <h2>Messages</h2>
            <p className="muted">{messages.length} conversation(s)</p>
          </div>
        </div>
        {messages.length === 0 ? (
          <p className="muted" style={{ marginTop: "16px" }}>No messages yet. Book a service to start chatting.</p>
        ) : (
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((m) => (
                <div key={m._id} className="chat-bubble">
                  <strong>{m.senderId?.name || "User"}:</strong> {m.message}
                  <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
                </div>
              ))}
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
