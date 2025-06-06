import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ME_WITH_FRIENDS, GET_THREAD_WITH, GET_MY_THREADS } from "../utils/queries";
import { SEND_MESSAGE, MARK_THREAD_AS_READ } from "../utils/mutations";

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Always fetch friends so the widget can show avatars even when closed
  const { data: meData } = useQuery(GET_ME_WITH_FRIENDS);
  const friends = meData?.me?.friends ?? [];
  const myUserId = meData?.me?._id;

  // Always fetch threads so unread status is always up-to-date
  const { data: threadsData, refetch: refetchThreads } = useQuery(GET_MY_THREADS, { 
    skip: !myUserId,
    pollInterval: 3000, 
  });

  // Only fetch thread data when a chat is open
  const { data: threadData, refetch: refetchThread } = useQuery(GET_THREAD_WITH, {
    variables: { userId: activeUserId },
    skip: !activeUserId,
    fetchPolicy: "network-only",
    pollInterval: activeUserId ? 3000 : undefined,
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);
  const [markAsRead] = useMutation(MARK_THREAD_AS_READ);

  const hasUnread = threadsData?.myMessageThreads?.some((thread: any) =>
    thread.messages.some(
      (msg: any) =>
        !msg.readBy.some((u: any) => u._id === myUserId) &&
        msg.sender._id !== myUserId
    )
  );

  const unreadByFriend: Record<string, boolean> = {};
  if (threadsData?.myMessageThreads) {
    threadsData.myMessageThreads.forEach((thread: any) => {
      const other = thread.participants.find((p: any) => p._id !== myUserId);
      if (!other) return;
      const hasUnreadMsg = thread.messages.some(
        (msg: any) =>
          !msg.readBy.some((u: any) => u._id === myUserId) &&
          msg.sender._id !== myUserId
      );
      if (hasUnreadMsg) unreadByFriend[other._id] = true;
    });
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeUserId) return;
    await sendMessage({
      variables: { toUserId: activeUserId, content: message }
    });
    setMessage("");
    await refetchThread();
    await refetchThreads();
  };

  useEffect(() => {
    if (threadData?.messageThreadWith?._id) {
      markAsRead({ variables: { threadId: threadData.messageThreadWith._id } }).then(() => {
        refetchThreads();
      });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // eslint-disable-next-line
  }, [threadData?.messageThreadWith?.messages.length]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setActiveUserId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    function handleLogout() {
      setOpen(false);
      setActiveUserId(null);
    }
    window.addEventListener("teatime-logout", handleLogout);
    return () => window.removeEventListener("teatime-logout", handleLogout);
  }, []);

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
            background: hasUnread ? "#d32f2f" : "#72a85a",
            color: "#fff",
            border: "none",
            borderRadius: "50%",
            width: 60,
            height: 60,
            fontSize: 32,
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            cursor: "pointer",
            position: "relative",
            animation: hasUnread ? "pulse 1s infinite" : "none",
            transition: "background 0.3s",
          }}
          aria-label="Open chat"
        >
          💬
          {hasUnread && (
            <span
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 18,
                height: 18,
                background: "#fff",
                color: "#d32f2f",
                borderRadius: "50%",
                border: "2px solid #d32f2f",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 13,
                boxShadow: "0 0 4px #d32f2f",
              }}
            >
              !
            </span>
          )}
        </button>
        {/* Pulse animation keyframes */}
        <style>
          {`
            @keyframes pulse {
              0% { box-shadow: 0 0 0 0 #d32f2f66; }
              70% { box-shadow: 0 0 0 10px #d32f2f00; }
              100% { box-shadow: 0 0 0 0 #d32f2f00; }
            }
          `}
        </style>
      </div>

      {/* Chat Popup */}
      {open && (
        <div
          ref={popupRef}
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
          {/* Chat Header with avatar */}
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
              gap: 10,
            }}
          >
            <span style={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 10 }}>
              {activeUserId ? (
                <>
                  <img
                    src={
                      friends.find((f: any) => f._id === activeUserId)?.profileImage ||
                      "/teacup.jpg"
                    }
                    alt="avatar"
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      objectFit: "cover",
                      marginRight: 6,
                      border: "2px solid #fff",
                    }}
                  />
                  {friends.find((f: any) => f._id === activeUserId)?.username || "Chat"}
                </>
              ) : (
                "Direct Messages"
              )}
            </span>
            <button
              onClick={() => {
                if (activeUserId) setActiveUserId(null);
                else setOpen(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}
              aria-label={activeUserId ? "Back to friends" : "Close chat"}
            >
              {activeUserId ? "←" : "×"}
            </button>
          </div>

          {/* Friend List or Chat */}
          {!activeUserId ? (
            <div style={{ overflowY: "auto", flex: 1 }}>
              {friends.length === 0 ? (
                <p style={{ padding: 16, color: "#888" }}>No friends to message.</p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {friends.map((friend: any) => {
                    const hasUnread = unreadByFriend[friend._id];
                    return (
                      <li
                        key={friend._id}
                        style={{
                          padding: "12px 16px",
                          borderBottom: "1px solid #eee",
                          cursor: "pointer",
                          background: hasUnread ? "#ffeaea" : "#fff",
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                        }}
                        onClick={() => setActiveUserId(friend._id)}
                      >
                        <img
                          src={friend.profileImage || "/teacup.jpg"}
                          alt={friend.username}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            objectFit: "cover",
                            marginRight: 8,
                          }}
                        />
                        <div style={{ fontWeight: 600, flex: 1 }}>{friend.username}</div>
                        {hasUnread && (
                          <span
                            style={{
                              color: "#d32f2f",
                              fontWeight: 900,
                              fontSize: 18,
                              marginLeft: 8,
                              verticalAlign: "middle",
                            }}
                            aria-label="Unread messages"
                            title="Unread messages"
                          >
                            !!!
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
              {/* Messages */}
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: 12,
                  background: "#f9f9f9",
                  minHeight: 0,
                }}
              >
                {threadData?.messageThreadWith?.messages.length === 0 ? (
                  <p style={{ color: "#888" }}>No messages yet.</p>
                ) : (
                  threadData?.messageThreadWith?.messages.map((msg: any) => {
                    const isMe = msg.sender._id === myUserId;
                    return (
                      <div
                        key={msg._id}
                        style={{
                          display: "flex",
                          justifyContent: isMe ? "flex-start" : "flex-end",
                          marginBottom: 8,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            background: isMe ? "#e0e0e0" : "#72a85a",
                            color: isMe ? "#333" : "#fff",
                            borderRadius: 12,
                            padding: "6px 12px",
                            maxWidth: "70%",
                            wordBreak: "break-word",
                            textAlign: "left",
                          }}
                        >
                          {msg.content}
                          <div
                            style={{
                              fontSize: "0.8em",
                              color: isMe ? "#888" : "#e0ffe0",
                              marginTop: 4,
                              textAlign: isMe ? "left" : "right",
                            }}
                          >
                            {new Date(Number(msg.timestamp)).toLocaleString()}
                          </div>
                        </span>
                      </div>
                    );
                  })
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