import { useQuery, useMutation } from "@apollo/client";
import { GET_ME_WITH_FRIENDS } from "../utils/queries";
import {
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  REMOVE_FRIEND,
} from "../utils/mutations";

function Friends() {
  const { data, refetch } = useQuery(GET_ME_WITH_FRIENDS);
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, { onCompleted: refetch });
  const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST, { onCompleted: refetch });
  const [removeFriend] = useMutation(REMOVE_FRIEND, { onCompleted: refetch });

  const user = data?.me;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "2rem auto",
        fontFamily: "Segoe UI, Arial, sans-serif",
        background: "#f8fff5",
        borderRadius: 16,
        boxShadow: "0 2px 12px rgba(114,168,90,0.08)",
        padding: "2rem",
      }}
    >
      <h2
        style={{
          borderBottom: "2px solid #72a85a",
          paddingBottom: 8,
          marginBottom: 24,
          fontSize: 32,
          color: "#3b5c2e",
          letterSpacing: 1,
        }}
      >
        Friends
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(user?.friends ?? []).map((f: any) => (
          <li
            key={f._id}
            style={{
              marginBottom: 14,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              background: "#eafbe7",
              borderRadius: 8,
              padding: "10px 16px",
            }}
          >
            <span style={{ fontWeight: 600, flex: 1, color: "#2d4d1b" }}>{f.username}</span>
            <button
              style={{
                background: "#e57373",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "4px 16px",
                cursor: "pointer",
                marginLeft: 8,
                fontWeight: 500,
                fontSize: 16,
                transition: "background 0.2s",
              }}
              onClick={() => removeFriend({ variables: { userId: f._id } })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <h3
        style={{
          marginTop: 36,
          color: "#72a85a",
          fontSize: 26,
          borderBottom: "1px solid #cde7c1",
          paddingBottom: 6,
        }}
      >
        Friend Requests Received
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(user?.friendRequestsReceived ?? []).map((f: any) => (
          <li
            key={f._id}
            style={{
              marginBottom: 14,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              background: "#fffbe7",
              borderRadius: 8,
              padding: "10px 16px",
            }}
          >
            <span style={{ fontWeight: 600, flex: 1, color: "#7a5c00" }}>{f.username}</span>
            <button
              style={{
                background: "#72a85a",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "4px 16px",
                cursor: "pointer",
                marginLeft: 8,
                fontWeight: 500,
                fontSize: 16,
                transition: "background 0.2s",
              }}
              onClick={() => acceptRequest({ variables: { userId: f._id } })}
            >
              Accept
            </button>
            <button
              style={{
                background: "#f5b041",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                padding: "4px 16px",
                cursor: "pointer",
                marginLeft: 8,
                fontWeight: 500,
                fontSize: 16,
                transition: "background 0.2s",
              }}
              onClick={() => declineRequest({ variables: { userId: f._id } })}
            >
              Decline
            </button>
          </li>
        ))}
      </ul>
      <h3
        style={{
          marginTop: 36,
          color: "#72a85a",
          fontSize: 26,
          borderBottom: "1px solid #cde7c1",
          paddingBottom: 6,
        }}
      >
        Friend Requests Sent
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {(user?.friendRequestsSent ?? []).map((f: any) => (
          <li
            key={f._id}
            style={{
              marginBottom: 14,
              fontSize: 20,
              background: "#e7f3fb",
              borderRadius: 8,
              padding: "10px 16px",
              fontWeight: 600,
              color: "#1b3c5c",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ flex: 1 }}>{f.username}</span>
            <span
              style={{
                background: "#3498db",
                color: "#fff",
                borderRadius: 4,
                padding: "2px 10px",
                marginLeft: 8,
                fontSize: 15,
                fontWeight: 500,
              }}
            >
              Pending
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Friends;