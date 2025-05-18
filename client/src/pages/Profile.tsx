import { useQuery } from '@apollo/client';
import { GET_ME } from '../utils/queries';

function Profile() {
  const { loading, error, data } = useQuery(GET_ME);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;

  const user = data?.me;
  if (!user) return <p>User not found.</p>;

  return (
    <div className="d-flex justify-content-center align-items-start min-vh-100 py-5 mt-5">
      <div className="card shadow w-100" style={{ maxWidth: '500px' }}>
        
        <div className="ratio ratio-1x1">
          <img 
            src="/teacup.jpg" 
            alt="User profile"
            className="img-fluid object-fit-cover rounded-top"
          />
        </div>


        <div className="card-body text-center">
          <h1 className="card-title mb-4">{user.username}</h1>
          
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
