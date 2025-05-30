import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GET_TEAS } from "../utils/queries";
import { DELETE_TEA } from "../utils/mutations";
import CustomButton from "../components/CustomButton";
import FavoriteButton from "../components/FavoriteButton";
import { GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";

function Dashboard() {
  const { loading, error, data } = useQuery(GET_TEAS);
  const { data: userData } = useQuery(GET_ME);
  const [addToFavorites] = useMutation(ADD_TEA_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_TEA_FROM_FAVORITES);
  const userFavorites =
    userData?.me?.favorites?.map((fav: any) => fav._id) || [];

  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  if (loading) return <p>Loading teas...</p>;
  if (error) return <p>Error loading teas: {error.message}</p>;

  const teas = data?.teas || [];
  const teaTypes = Array.from(new Set(teas.map((tea: any) => tea.type))).sort();

  const handleDeleteTea = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tea?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTea({ variables: { id } });
    } catch (err) {
      console.error("Failed to delete tea", err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setSortOption("newest");
  };

  const filteredTeas = teas.filter((tea: any) => {
    const matchesSearch =
      tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tea.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType
      ? tea.type.toLowerCase() === filterType.toLowerCase()
      : true;

    return matchesSearch && matchesType;
  });

  const sortedTeas = [...filteredTeas].sort((a: any, b: any) => {
    if (sortOption === "az") {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === "za") {
      return b.name.localeCompare(a.name);
    }
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🍵 Welcome to Your Tea Time Dashboard!</h1>

      {/* Top Controls */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "20px",
        }}
      >
        {/* ➕ Add Tea Button */}
        <Link to="/add-tea">
          <CustomButton>➕ Add New Tea</CustomButton>
        </Link>

        {/* 🔍 Search Box */}
        <input
          type="text"
          placeholder="Search teas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        />

        {/* 🔽 Filter Type Dropdown */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="">All Types</option>
          {teaTypes.map((type, index) => (
            <option key={index} value={type as string}>
              {String(type)}
            </option>
          ))}
        </select>

        {/* 🔽 Sort Dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="newest">Newest</option>
          <option value="az">Name A-Z</option>
          <option value="za">Name Z-A</option>
        </select>

        {/* 🧹 Clear Filters Button */}
        <CustomButton onClick={handleClearFilters}>
          🧹 Clear Filters
        </CustomButton>
      </div>

      {/* Tea List */}
      {filteredTeas.length === 0 ? (
        <div
          style={{
            padding: "4rem",
            textAlign: "center",
            color: "#555",
          }}
        >
          <div style={{ fontSize: "4rem" }}>🍵</div>
          <h2 style={{ marginTop: "1rem" }}>No Teas Found</h2>
          <p style={{ marginTop: "0.5rem" }}>
            Try adjusting your search or clearing filters.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {sortedTeas.map((tea: any) => (
            <div
              key={tea._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "1rem",
                width: "250px",
                backgroundColor: "#fafafa",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {/* 🖼 Thumbnail */}
              {tea.imageUrl ? (
                <img
                  src={tea.imageUrl}
                  alt={tea.name}
                  style={{
                    width: "150px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    backgroundColor: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    marginBottom: "1rem",
                    color: "#999",
                    fontSize: "14px",
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1531980838447-354c51364546?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Placeholder"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              )}

              <h3 style={{ color: "black" }}>{tea.name}</h3>
              <p style={{ color: "black" }}>
                <strong>Brand:</strong> {tea.brand}
              </p>
              <p style={{ color: "black" }}>
                <strong>Type:</strong> {tea.type}
              </p>

              {/* Buttons */}
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Link to={`/teas/${tea._id}`}>
                  <button>🔎 View Details</button>
                </Link>

                <Link to={`/edit-tea/${tea._id}`}>
                  <button>✏️ Edit</button>
                </Link>
                <FavoriteButton
                  teaId={tea._id}
                  initialFavorite={userFavorites.includes(tea._id)}
                  addToFavorites={(id) =>
                    addToFavorites({ variables: { teaId: id } })
                  }
                  removeFromFavorites={(id) =>
                    removeFromFavorites({ variables: { teaId: id } })
                  }
                />

                <button
                  style={{ backgroundColor: "red", color: "white" }}
                  onClick={() => handleDeleteTea(tea._id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
