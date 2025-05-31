import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_USER_BY_USERNAME, GET_ME_WITH_FRIENDS } from "../utils/queries";
import { SEND_FRIEND_REQUEST } from "../utils/mutations";
import { useMutation } from "@apollo/client";

function UserProfile() {
  const { username } = useParams();
  const { data: userData, loading, error } = useQuery(GET_USER_BY_USERNAME, { variables: { username } });
  const { data: meData } = useQuery(GET_ME_WITH_FRIENDS);
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST);

  const user = userData?.userByUsername;
  const me = meData?.me;

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;
  if (!user) return <p>User not found.</p>;

  const isMe = me && user._id === me._id;
  const isFriend = (me?.friends ?? []).some((f: any) => f._id === user._id);
  const requestSent = (me?.friendRequestsSent ?? []).some((f: any) => f._id === user._id);

  return (
    <div className="d-flex flex-column align-items-center min-vh-100 py-5 mt-5">
      <div className="card shadow w-100 mb-5" style={{ maxWidth: "500px" }}>
        <div className="ratio ratio-1x1">
          <img
            src="/teacup.jpg"
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
          {!isMe && !isFriend && !requestSent && (
            <button
              className="btn btn-outline-primary mt-3"
              onClick={() => sendRequest({ variables: { userId: user._id } })}
            >
              Send Friend Request
            </button>
          )}
          {!isMe && requestSent && <span>Friend request sent!</span>}
          {!isMe && isFriend && <span>You are friends!</span>}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;