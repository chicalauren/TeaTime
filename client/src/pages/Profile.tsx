import { useQuery, useMutation } from "@apollo/client";
import { GET_ME, RECOMMEND_TEAS } from "../utils/queries";
import {
  UPDATE_USER,
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import { useState, useEffect, ChangeEvent } from "react";
import FavoriteButton from "../components/FavoriteButton";

interface Tea {
  _id: string;
  name: string;
  type: string;
  brand?: string;
  tags?: string[];
  imageUrl?: string;
}

function Profile() {
  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
    refetch,
  } = useQuery(GET_ME);

  const [updateUser] = useMutation(UPDATE_USER);
  const [addToFavoritesMutation] = useMutation(ADD_TEA_TO_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });
  const [removeFromFavoritesMutation] = useMutation(REMOVE_TEA_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });

  const user = userData?.me;
  const favoriteTeas: Tea[] = user?.favoriteTeas ?? [];

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
    new Set(favoriteTeas.flatMap((tea) => tea.tags || []))
  );

  const {
    data: recData,
    loading: loadingRecs,
    error: errorRecs,
  } = useQuery(RECOMMEND_TEAS, {
    variables: { tags: allTags },
  });

  const handleAddToFavorites = async (teaId: string) => {
    try {
      await addToFavoritesMutation({ variables: { teaId } });
      await refetch();
    } catch (e) {
      console.error("Error adding to favorites:", e);
    }
  };

  const handleRemoveFromFavorites = async (teaId: string) => {
    try {
      await removeFromFavoritesMutation({ variables: { teaId } });
      await refetch();
    } catch (e) {
      console.error("Error removing from favorites:", e);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        variables: { bio, favoriteTeaSource },
      });
      await refetch();
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  const handleProfileImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsignedProfilePictures");
    formData.append("folder", "user_profile_pictures"); 

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dcaivdnrk/image/upload", 
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      const imageUrl = data.secure_url;

      await updateUser({
        variables: { profileImage: imageUrl },
      });

      await refetch();
    } catch (err) {
      console.error("Error uploading profile image:", err);
    }
  };

  function TeaCardWithFavorite({ tea }: { tea: Tea }) {
    const isFavorite = favoriteTeas.some((favTea) => favTea._id === tea._id);

    return (
      <div className="card shadow-sm h-100 position-relative">
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
          {tea.tags && (
            <p className="small text-muted">{tea.tags.join(", ")}</p>
          )}
          <div className="d-flex justify-content-end">
            <FavoriteButton
              teaId={tea._id}
              initialFavorite={isFavorite}
              addToFavorites={handleAddToFavorites}
              removeFromFavorites={handleRemoveFromFavorites}
            />
          </div>
        </div>
      </div>
    );
  }

  if (loadingUser) return <p>Loading profile...</p>;
  if (errorUser) return <p>Error loading profile: {errorUser.message}</p>;
  if (!user) return <p>User not found.</p>;

  return (
    <div
      className="d-flex flex-column align-items-center min-vh-100 py-5"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      {/* Overlay */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      {/* 🔹 Profile Info Card */}
      <div
        className="card shadow w-100 mb-5"
        style={{ maxWidth: "500px", zIndex: 1 }}
      >
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
            <strong>Email:</strong> {user.email}
          </p>

          <input
            type="file"
            accept="image/*"
            className="form-control mt-3"
            onChange={handleProfileImageChange}
          />

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
      <div className="w-100 mb-5" style={{ maxWidth: "1000px", zIndex: 1 }}>
        <div className="card bg-light mb-4 shadow-sm">
          <div className="card-body text-center">
            <h2 className="fw-bold mb-0 text-dark">❤️ Favorite Teas</h2>
          </div>
        </div>

        {favoriteTeas.length === 0 ? (
          <p className="text-center text-muted">
            You haven't saved any teas yet.
          </p>
        ) : (
          <>
            <div className="row g-3 d-flex justify-content-center">
              {favoriteTeas.slice(0, 3).map((tea) => (
                <div key={tea._id} className="col-md-4 col-sm-6">
                  <TeaCardWithFavorite tea={tea} />
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
      <div className="w-100" style={{ maxWidth: "1000px", zIndex: 1 }}>
        <div className="card bg-light mb-4 shadow-sm">
          <div className="card-body text-center">
            <h2 className="fw-bold mb-0 text-dark">🍃 Recommended Teas</h2>
          </div>
        </div>

        {loadingRecs ? (
          <p className="text-center">Loading recommendations...</p>
        ) : errorRecs ? (
          <p className="text-center text-danger">Error: {errorRecs.message}</p>
        ) : recData?.recommendTeas?.length > 0 ? (
          <div className="row g-3 d-flex justify-content-center">
            {recData.recommendTeas.map((tea: Tea) => (
              <div key={tea._id} className="col-md-4 col-sm-6">
                <TeaCardWithFavorite tea={tea} />
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
