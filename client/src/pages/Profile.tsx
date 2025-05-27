import { useQuery, useMutation } from '@apollo/client';
import { GET_ME } from '../utils/queries';
import { UPDATE_USER } from '../utils/mutations';
import { useState } from 'react';
//import { useEffect } from 'react';

function Profile() {
  const { loading, error, data, refetch } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);

  const user = data?.me;

  // Local state for form inputs
  const [bio, setBio] = useState(user?.bio || '');
  const [favoriteTeaSource, setFavoriteTeaSource] = useState(user?.favoriteTeaSource || '');
  const [isEditing, setIsEditing] = useState(false);

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error loading profile: {error.message}</p>;
  if (!user) return <p>User not found.</p>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("🟡 Submitting:", { bio, favoriteTeaSource }); 

    try {
      const { data } = await updateUser({
        variables: {
          bio,
          favoriteTeaSource,
        },
      });

      console.log("✅ Server returned:", data); 
      await refetch();
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Error updating profile:", err);
    }
  };

  // useEffect(() => {
  //   if (user) {
  //     setBio(user.bio || '');
  //     setFavoriteTeaSource(user.favoriteTeaSource || '');
  //   }
  // }, [user]);


  

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

          {!isEditing ? (
            <>
              <p className="mt-4"><strong>Bio:</strong> {user.bio || 'No bio yet.'}</p>
              <p><strong>Favorite Tea Source:</strong> {user.favoriteTeaSource || 'Not listed.'}</p>
              <button 
                className="btn btn-outline-primary mt-3" 
                onClick={() => setIsEditing(true)}
                data-testid="edit-profile-button"
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="text-start mt-4" data-testid="edit-profile-form">
              <div className="mb-3">
                <label htmlFor="bio" className="form-label"><strong>Bio/About Me</strong></label>
                <textarea
                  id="bio"
                  className="form-control"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  data-testid="bio-input"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="teaSource" className="form-label"><strong>Favorite Tea Source</strong></label>
                <input
                  id="teaSource"
                  className="form-control"
                  value={favoriteTeaSource}
                  onChange={(e) => setFavoriteTeaSource(e.target.value)}
                  data-testid="tea-source-input"
                />
              </div>

              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary" data-testid="save-profile-button">
                  Save
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setIsEditing(false)}
                  data-testid="cancel-edit-button"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
