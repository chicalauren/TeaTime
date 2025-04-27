import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';

function Profile() {
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  const user = data?.me;

  return (
    <div>
      <h1>👤 Profile</h1>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>ID:</strong> {user._id}</p>
    </div>
  );
}

export default Profile;
