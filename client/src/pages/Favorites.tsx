// src/pages/Favorites.tsx
import { useQuery } from "@apollo/client";
import { GET_ME } from "../utils/queries";

function Favorites() {
  const { loading, error, data } = useQuery(GET_ME);
  const user = data?.me;
  const favoriteTeas = user?.favoriteTeas ?? [];

  if (loading) return <p className="text-center mt-5">Loading favorites...</p>;
  if (error)
    return (
      <p className="text-center text-danger mt-5">Error: {error.message}</p>
    );
  if (!user) return <p className="text-center mt-5">User not found.</p>;

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Your Favorite Teas ❤️</h1>

      {favoriteTeas.length === 0 ? (
        <p className="text-center text-muted">No favorites yet.</p>
      ) : (
        <div className="row g-4">
          {favoriteTeas.map((tea: any) => (
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
      )}
    </div>
  );
}

export default Favorites;
