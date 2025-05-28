import { useMutation } from "@apollo/client";
import {
  DELETE_TEA,
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import { GET_TEAS } from "../utils/queries";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function TeaCard({ tea }: { tea: any }) {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(!!tea.favorite || false);

  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [addToFavorites] = useMutation(ADD_TEA_TO_FAVORITES, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [removeFromFavorites] = useMutation(REMOVE_TEA_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const handleDelete = async () => {
    if (confirm(`Delete ${tea.name}?`)) {
      await deleteTea({ variables: { id: tea._id } });
    }
  };

  const handleToggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites({ variables: { teaId: tea._id } });
      } else {
        await addToFavorites({ variables: { teaId: tea._id } });
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  useEffect(() => {
    setIsFavorite(tea.favorite || false);
  }, [tea.favorite]);

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
      {/* Favorite Heart Button */}
      <button
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "24px",
          color: isFavorite ? "red" : "#ccc",
          userSelect: "none",
        }}
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>

      <h3>{tea.name}</h3>
      <p>
        <strong>Brand:</strong> {tea.brand || "n/a"}
      </p>
      <p>
        <strong>Type:</strong> {tea.type}
      </p>

      <p>
        {Array(tea.rating)
          .fill("⭐")
          .map((star, index) => (
            <span key={index}>{star}</span>
          ))}
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
