import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';

function Profile() {
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  const user = data?.me;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body text-center">
              <h1 className="card-title mb-4">👤 Profile</h1>
              <p><strong>Username:</strong> {user.username}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
