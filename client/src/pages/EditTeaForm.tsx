import { useMutation, useQuery } from "@apollo/client";
import { GET_TEA, GET_TEAS } from "../utils/queries";
import { UPDATE_TEA } from "../utils/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";


function EditTeaForm() {
  const params = useParams();
  const id = params.id ?? "";
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(GET_TEA, { variables: { id } });
  const [updateTea] = useMutation(UPDATE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const tea = data?.tea;

  // Form state
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState<number | "">("");
  const [favorite, setFavorite] = useState(false);

  // Prefill form when tea loads
  useEffect(() => {
    if (tea) {
      setName(tea.name);
      setBrand(tea.brand);
      setType(tea.type);
      setRating(tea.rating ?? "");
      setFavorite(tea.favorite || false);
    }
  }, [tea]);

  // Early return cases
  if (!id) return <p>Invalid tea ID.</p>;
  if (loading) return <p>Loading tea details...</p>;
  if (error) return <p>Error loading tea.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateTea({
        variables: {
          teaId: id,
          name,
          brand,
          type,
          rating: rating === "" ? null : rating,
          favorite,
        },
      });

      toast.success("Tea updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update tea.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Edit Tea 🍵</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Type (Green, Black, etc)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <label>Rating (1-5 Stars)</label>
        <select
          value={rating}
          onChange={(e) =>
            setRating(e.target.value === "" ? "" : Number(e.target.value))
          }
          required
        >
          <option value="">Select Rating</option>
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {"⭐".repeat(num)}
            </option>
          ))}
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
          Mark as Favorite ❤️
        </label>

        <button type="submit">Update Tea</button>
      </form>
    </div>
  );
}

export default EditTeaForm;
