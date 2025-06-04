import { useMutation } from "@apollo/client";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
  DELETE_TEA,
} from "../utils/mutations";
import { GET_TEAS } from "../utils/queries";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";
import { useState } from "react";

function TeaCard({
  tea,
  isFavorite = false, // fallback to false
}: {
  tea: any;
  isFavorite?: boolean;
}) {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");

  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [addToFavoritesMutation] = useMutation(ADD_TEA_TO_FAVORITES, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [removeFromFavoritesMutation] = useMutation(REMOVE_TEA_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const handleDelete = async () => {
    if (confirm(`Delete ${tea.name}?`)) {
      await deleteTea({ variables: { id: tea._id } });
    }
  };

  const addToFavorites = async (teaId: string) => {
    await addToFavoritesMutation({ variables: { teaId } });
  };

  const removeFromFavorites = async (teaId: string) => {
    await removeFromFavoritesMutation({ variables: { teaId } });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "1rem",
        width: "250px",
        position: "relative",
        backgroundColor: isFavorite ? "#ffe8e8" : "white",
      }}
    >
      {/* Toast Message */}
      {toastMessage && (
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "10px",
            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "0.85rem",
            zIndex: 10,
          }}
        >
          {toastMessage}
        </div>
      )}

      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <FavoriteButton
          teaId={tea._id}
          initialFavorite={isFavorite}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
          onFavoriteChange={(isFav) =>
            showToast(isFav ? "Added to favorites" : "Removed from favorites")
          }
        />
      </div>

      <h3>{tea.name}</h3>
      <p>
        <strong>Brand:</strong> {tea.brand || "n/a"}
      </p>
      <p>
        <strong>Type:</strong> {tea.type}
      </p>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <button onClick={() => navigate(`/edittea/${tea._id}`)}>Edit</button>
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TeaCard;
