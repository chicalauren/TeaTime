import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import FavoriteButton from "../components/FavoriteButton"; // Adjust path as needed

function Favorites() {
  const { loading, error, data } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
  });
  const user = data?.me;
  const favoriteTeas = user?.favoriteTeas ?? [];
  console.log("Favorite teas:", favoriteTeas);
  const sortedFavorites = [...favoriteTeas].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  // Add mutations for favorites
  const [addToFavoritesMutation] = useMutation(ADD_TEA_TO_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });
  const [removeFromFavoritesMutation] = useMutation(REMOVE_TEA_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });

  const handleAddToFavorites = async (teaId: string) => {
    try {
      await addToFavoritesMutation({ variables: { teaId } });
    } catch (e) {
      console.error("Error adding to favorites:", e);
    }
  };

  const handleRemoveFromFavorites = async (teaId: string) => {
    try {
      await removeFromFavoritesMutation({ variables: { teaId } });
    } catch (e) {
      console.error("Error removing from favorites:", e);
    }
  };

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
          {sortedFavorites.map((tea: any) => (
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
                <div className="card-body d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{tea.name}</h5>
                  <FavoriteButton
                    teaId={tea._id}
                    initialFavorite={true}
                    addToFavorites={handleAddToFavorites}
                    removeFromFavorites={handleRemoveFromFavorites}
                  />
                </div>
                <div className="card-body pt-0">
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
