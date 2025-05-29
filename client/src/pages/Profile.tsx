import { useQuery, useMutation } from "@apollo/client";
import { GET_ME, RECOMMEND_TEAS } from "../utils/queries";
import { UPDATE_USER } from "../utils/mutations";
import { useState, useEffect } from "react";

function Profile() {
  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
    refetch,
  } = useQuery(GET_ME);
  const [updateUser] = useMutation(UPDATE_USER);
  console.log("User from GET_ME:", userData?.me);

  const user = userData?.me;
  const favoriteTeas = user?.favoriteTeas ?? [];

  const [bio, setBio] = useState("");
  const [favoriteTeaSource, setFavoriteTeaSource] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setBio(user.bio ?? "");
      setFavoriteTeaSource(user.favoriteTeaSource ?? "");
    }
  }, [user]);

  const allTags = Array.from(
    new Set(favoriteTeas.flatMap((tea: any) => tea.tags || []))
  );

  console.log("Tags to send:", allTags);

  const {
    data: recData,
    loading: loadingRecs,
    error: errorRecs,
  } = useQuery(RECOMMEND_TEAS, {
    variables: { tags: allTags },
  });

  if (loadingUser) return <p>Loading profile...</p>;
  if (errorUser) return <p>Error loading profile: {errorUser.message}</p>;
  if (!user) return <p>User not found.</p>;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSave triggered");
    console.log("Saving profile with:", { bio, favoriteTeaSource });

    try {
      const { data } = await updateUser({
        variables: { bio, favoriteTeaSource },
      });

      console.log("UpdateUser mutation response:", data);

      await refetch();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };
  return (
    <div className="d-flex flex-column align-items-center min-vh-100 py-5 mt-5">
      {/* 🔹 Profile Info Card */}
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
            <strong>Email:</strong> {user.email}
          </p>

          {!isEditing ? (
            <>
              <p className="mt-4">
                <strong>Bio:</strong> {bio || "No bio yet."}
              </p>
              <p>
                <strong>Favorite Tea Source:</strong>{" "}
                {favoriteTeaSource || "Not listed."}
              </p>
              <button
                className="btn btn-outline-primary mt-3"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </>
          ) : (
            <form onSubmit={handleSave} className="text-start mt-4">
              <div className="mb-3">
                <label htmlFor="bio" className="form-label">
                  <strong>Bio/About Me</strong>
                </label>
                <textarea
                  id="bio"
                  className="form-control"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="teaSource" className="form-label">
                  <strong>Favorite Tea Source</strong>
                </label>
                <input
                  id="teaSource"
                  className="form-control"
                  value={favoriteTeaSource}
                  onChange={(e) => setFavoriteTeaSource(e.target.value)}
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ❤️ Favorite Teas */}
      <div className="w-100 mb-5" style={{ maxWidth: "1000px" }}>
        <h2 className="text-center mb-4">Favorite Teas ❤️</h2>
        {favoriteTeas.length === 0 ? (
          <p className="text-center text-muted">
            You haven't saved any teas yet.
          </p>
        ) : (
          <>
            <div className="row g-3">
              {favoriteTeas.slice(0, 3).map((tea: any) => (
                <div key={tea._id} className="col-md-4 col-sm-6">
                  <div className="card shadow-sm h-100">
                    <div
                      className="ratio ratio-1x1 rounded-top overflow-hidden"
                      style={{
                        backgroundImage: `url(${
                          tea.imageUrl || "/default-tea.jpg"
                        })`,
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {favoriteTeas.length > 3 && (
              <div className="text-center mt-3">
                <a href="/favorites" className="btn btn-outline-secondary">
                  View All Favorites
                </a>
              </div>
            )}
          </>
        )}
      </div>

      {/* 🍃 Recommended Teas */}
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        <h2 className="text-center mb-4">Recommended Teas 🍃</h2>
        {loadingRecs ? (
          <p className="text-center">Loading recommendations...</p>
        ) : errorRecs ? (
          <p className="text-center text-danger">Error: {errorRecs.message}</p>
        ) : recData?.recommendTeas?.length > 0 ? (
          <div className="row g-3">
            {recData.recommendTeas.map((tea: any) => (
              <div key={tea._id} className="col-md-4 col-sm-6">
                <div className="card shadow-sm h-100">
                  <div
                    className="ratio ratio-1x1 rounded-top overflow-hidden"
                    style={{
                      backgroundImage: `url(${
                        tea.imageUrl || "/default-tea.jpg"
                      })`,
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
        ) : (
          <p className="text-center text-muted">
            No recommendations available yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default Profile;
