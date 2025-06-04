import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER_BY_USERNAME, GET_ME_WITH_FRIENDS } from "../utils/queries";
import { SEND_FRIEND_REQUEST } from "../utils/mutations";
import { useEffect } from "react";

function UserProfile() {
  const { username } = useParams();
  const {
    data: userData,
    loading,
    error,
    refetch: refetchUser,
  } = useQuery(GET_USER_BY_USERNAME, { variables: { username } });
  const { data: meData, refetch: refetchMe } = useQuery(GET_ME_WITH_FRIENDS);

  // Refetch GET_ME_WITH_FRIENDS after sending a request so UI updates immediately
  const [sendRequest, { loading: sending }] = useMutation(SEND_FRIEND_REQUEST, {
    refetchQueries: [{ query: GET_ME_WITH_FRIENDS }],
  });

  const user = userData?.userByUsername;
  const me = meData?.me;

  // Refetch user data when the username param changes (e.g., after profile update)
  useEffect(() => {
    refetchUser();
    refetchMe();
  }, [username]);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;
  if (!user) return <p>User not found.</p>;

  const isMe = me && user._id === me._id;
  const isFriend = (me?.friends ?? []).some((f: any) => f._id === user._id);
  const requestSent = (me?.friendRequestsSent ?? []).some((f: any) => f._id === user._id);

  const favoriteTeas = user.favoriteTeas ?? [];

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 py-5 mt-5">
      <div className="card shadow w-100 mb-5" style={{ maxWidth: "500px" }}>
        <div className="ratio ratio-1x1">
          <img
            src={user.profileImage || "/teacup.jpg"}
            alt="User profile"
            className="img-fluid object-fit-cover rounded-top"
          />
        </div>
        <div className="card-body text-center">
          <h1 className="card-title mb-4">{user.username}</h1>
          <p>
            <strong>Email:</strong> {isMe ? user.email : "Hidden"}
          </p>
          <p className="mt-4">
            <strong>Bio:</strong> {user.bio || "No bio yet."}
          </p>
          <p>
            <strong>Favorite Tea Source:</strong>{" "}
            {user.favoriteTeaSource || "Not listed."}
          </p>
          {!isMe && !isFriend && (
            <button
              className="btn btn-outline-primary mt-3"
              onClick={async () => {
                await sendRequest({ variables: { userId: user._id } });
                await refetchMe();
              }}
              disabled={requestSent || sending}
              style={
                requestSent || sending
                  ? { opacity: 0.6, pointerEvents: "none", cursor: "not-allowed" }
                  : {}
              }
            >
              {requestSent ? "Friend Request Sent" : sending ? "Sending..." : "Send Friend Request"}
            </button>
          )}
          {!isMe && isFriend && (
            <span
              style={{
                display: "inline-block",
                marginTop: "12px",
                padding: "6px 18px",
                background: "linear-gradient(90deg, #a8e063 0%, #56ab2f 100%)",
                color: "#fff",
                borderRadius: "20px",
                fontWeight: 600,
                fontSize: "1.1rem",
                letterSpacing: "0.5px",
                boxShadow: "0 2px 8px rgba(86,171,47,0.08)",
              }}
            >
              <span role="img" aria-label="friends" style={{ marginRight: 6 }}>🤝</span>
              You are friends!
            </span>
          )}
        </div>
      </div>

      {/* Favorite Teas Section */}
      <div className="w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h2 className="text-center mb-4">
          {isMe ? "Your Favorite Teas ❤️" : `${user.username}'s Favorite Teas ❤️`}
        </h2>
        {favoriteTeas.length === 0 ? (
          <p className="text-center text-muted">
            {isMe ? "You haven't saved any teas yet." : "No favorites yet."}
          </p>
        ) : (
          <div className="row g-4">
            {favoriteTeas.map((tea: any) => (
              <div key={tea._id} className="col-md-4 col-sm-6">
                <div className="card shadow-sm h-100">
                  <div
                    className="ratio ratio-1x1 rounded-top overflow-hidden"
                    style={{
                      backgroundImage: `url(${tea.imageUrl || "/default-tea.jpg"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div className="card-body">
                    <h5 className="card-title">{tea.name}</h5>
                    <p className="card-text">
                      <strong>Type:</strong> {tea.type}
                      <br />
                      <strong>Brand:</strong> {tea.brand || "N/A"}
                    </p>
                    <p className="small text-muted">{tea.tags?.join(", ")}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;