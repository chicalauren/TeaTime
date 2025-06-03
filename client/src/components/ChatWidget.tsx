import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_MY_THREADS, GET_THREAD_WITH } from "../utils/queries";
import { SEND_MESSAGE, MARK_THREAD_AS_READ } from "../utils/mutations";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threadsData, refetch: refetchThreads } = useQuery(GET_MY_THREADS, { skip: !open });
  const { data: threadData, refetch: refetchThread } = useQuery(GET_THREAD_WITH, {
    variables: { userId: activeUserId },
    skip: !activeUserId,
  });
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [markAsRead] = useMutation(MARK_THREAD_AS_READ);

  useEffect(() => {
    if (threadData?.messageThreadWith?._id) {
      markAsRead({ variables: { threadId: threadData.messageThreadWith._id } });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threadData]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeUserId) return;
    await sendMessage({ variables: { toUserId: activeUserId, content: message } });
    setMessage("");
    refetchThread();
    refetchThreads();
  };

  // UI
  return (
    <div>
      {/* Floating Button */}
      <div
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          style={{
            background: "#72a85a",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            fontSize: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
          aria-label="Open chat"
        >
          💬
        </button>
      </div>

      {/* Chat Popup */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 340,
            maxHeight: 480,
            background: "#fff",
            border: "1px solid #72a85a",
            borderRadius: 12,
            boxShadow: "0 2px 16px rgba(0,0,0,0.2)",
            zIndex: 1001,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #eee",
              background: "#72a85a",
              color: "#fff",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontWeight: 600 }}>Direct Messages</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          {/* Thread List or Chat */}
          {!activeUserId ? (
            <div style={{ overflowY: "auto", flex: 1 }}>
              {threadsData?.myMessageThreads?.length === 0 ? (
                <p style={{ padding: 16, color: "#888" }}>No conversations yet.</p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {threadsData?.myMessageThreads.map((thread: any) => {
                    const me = localStorage.getItem("userId");
                    const other = thread.participants.find((p: any) => p._id !== me);
                    const lastMsg = thread.messages[thread.messages.length - 1];
                    return (
                      <li
                        key={thread._id}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          background: "#fff",
                        }}
                        onClick={() => setActiveUserId(other._id)}
                      >
                        <div style={{ fontWeight: 600 }}>{other.username}</div>
                        <div style={{ fontSize: "0.9em", color: "#888" }}>
                          {lastMsg ? `${lastMsg.sender.username}: ${lastMsg.content}` : "No messages yet."}
                        </div>
                        <div style={{ fontSize: "0.8em", color: "#aaa" }}>
                          {lastMsg ? new Date(Number(lastMsg.timestamp)).toLocaleString() : ""}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              {/* Chat Header */}
              <div
                style={{
                  padding: "8px 16px",
                  borderBottom: "1px solid #eee",
                  background: "#f6fff6",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span>
                  {
                    threadData?.messageThreadWith?.participants.find(
                      (p: any) => p._id !== localStorage.getItem("userId")
                    )?.username
                  }
                </span>
                <button
                  onClick={() => setActiveUserId(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#1976d2",
                    fontSize: 18,
                    cursor: "pointer",
                  }}
                  aria-label="Back to threads"
                >
                  ←
                </button>
              </div>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 12,
                  background: "#f9f9f9",
                }}
              >
                {threadData?.messageThreadWith?.messages.length === 0 ? (
                  <p style={{ color: "#888" }}>No messages yet.</p>
                ) : (
                  threadData?.messageThreadWith?.messages.map((msg: any) => (
                    <div
                      key={msg._id}
                      style={{
                        textAlign:
                          msg.sender._id === localStorage.getItem("userId")
                            ? "right"
                            : "left",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          background:
                            msg.sender._id === localStorage.getItem("userId")
                              ? "#72a85a"
                              : "#e0e0e0",
                          color:
                            msg.sender._id === localStorage.getItem("userId")
                              ? "#fff"
                              : "#333",
                          borderRadius: 12,
                          padding: "6px 12px",
                          maxWidth: "70%",
                          wordBreak: "break-word",
                        }}
                      >
                        {msg.content}
                      </span>
                      <div style={{ fontSize: "0.8em", color: "#888" }}>
                        {new Date(Number(msg.timestamp)).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              {/* Input */}
              <form
                onSubmit={handleSend}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "8px 12px",
                  borderTop: "1px solid #eee",
                  background: "#fff",
                }}
              >
                <input
                  type="text"
                  className="form-control"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{ minWidth: 60 }}
                >
                  Send
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatWidget;