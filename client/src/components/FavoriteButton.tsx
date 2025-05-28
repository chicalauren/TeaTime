import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  teaId: string;
  initialFavorite: boolean;
  onFavoriteChange?: (isFav: boolean) => void;
  addToFavorites: (teaId: string) => Promise<any>;
  removeFromFavorites: (teaId: string) => Promise<any>;
}

export default function FavoriteButton({
  teaId,
  initialFavorite,
  onFavoriteChange,
  addToFavorites,
  removeFromFavorites,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(teaId);
        setIsFavorite(false);
        onFavoriteChange?.(false);
        setToastMessage("Removed from favorites");
      } else {
        await addToFavorites(teaId);
        setIsFavorite(true);
        onFavoriteChange?.(true);
        setToastMessage("Added to favorites");
      }
    } catch (error) {
      console.error("Failed to toggle favorite", error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggleFavorite}
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        style={{
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

      {toastMessage && (
        <div
          style={{
            position: "absolute",
            top: "-35px",
            right: "0",
            backgroundColor: "#333",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "0.9rem",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
            zIndex: 10,
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
