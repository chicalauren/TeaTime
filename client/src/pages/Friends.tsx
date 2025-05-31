import { useQuery, useMutation } from "@apollo/client";
import { GET_ME_WITH_FRIENDS } from "../utils/queries";
import {
  SEND_FRIEND_REQUEST,
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  REMOVE_FRIEND,
} from "../utils/mutations";

function Friends() {
  const { data, refetch } = useQuery(GET_ME_WITH_FRIENDS);
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST, { onCompleted: refetch });
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, { onCompleted: refetch });
  const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST, { onCompleted: refetch });
  const [removeFriend] = useMutation(REMOVE_FRIEND, { onCompleted: refetch });

  const user = data?.me;

  return (
    <div>
      <h2>Friends</h2>
      <ul>
        {(user?.friends ?? []).map((f: any) => (
            <li key={f._id}>
            {f.username}
            <button onClick={() => removeFriend({ variables: { userId: f._id } })}>Remove</button>
            </li>
        ))}
        </ul>
      <h3>Friend Requests Received</h3>
      <ul>
        {user?.friendRequestsReceived ?? [] .map((f: any) => (
          <li key={f._id}>
            {f.username}
            <button onClick={() => acceptRequest({ variables: { userId: f._id } })}>Accept</button>
            <button onClick={() => declineRequest({ variables: { userId: f._id } })}>Decline</button>
          </li>
        ))}
      </ul>
      <h3>Friend Requests Sent</h3>
      <ul>
        {user?.friendRequestsSent ?? [].map((f: any) => (
          <li key={f._id}>{f.username} (pending)</li>
        ))}
      </ul>
      {/* Add a search or user list to send requests */}
    </div>
  );
}

export default Friends;