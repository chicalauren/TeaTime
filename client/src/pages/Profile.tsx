// src/pages/Profile.tsx
import { useQuery } from "@apollo/client";
import { GET_ME, RECOMMEND_TEAS } from "../utils/queries";

function Profile() {
  const {
    loading: loadingUser,
    error: errorUser,
    data: userData,
  } = useQuery(GET_ME);

  const user = userData?.me;
  const favoriteTeas = user?.favoriteTeas ?? [];

  const allTags = Array.from(
    new Set(favoriteTeas.flatMap((tea: any) => tea.tags || []))
  );

  const {
    data: recData,
    loading: loadingRecs,
    error: errorRecs,
  } = useQuery(RECOMMEND_TEAS, {
    variables: { tags: allTags },
    skip: allTags.length === 0,
  });

  if (loadingUser) return <p>Loading profile...</p>;
  if (errorUser) return <p>Error loading profile: {errorUser.message}</p>;
  if (!user) return <p>User not found.</p>;

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
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>

      {/* 🌟 Favorite Teas */}
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
