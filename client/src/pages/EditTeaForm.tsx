import { useMutation, useQuery } from "@apollo/client";
import { GET_TEA, GET_TEAS } from "../utils/queries";
import { UPDATE_TEA } from "../utils/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
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

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [rating, setRating] = useState<number | "">(""); // should never be null
  const [tags, setTags] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Prefill state from tea data once loaded
  useEffect(() => {
    if (tea) {
      setName(tea.name);
      setBrand(tea.brand);
      setType(tea.type);
      setRating(tea.rating ?? ""); // <-- fix: never let it be null
      setTags(tea.tags?.join(", ") || "");
      setFavorite(tea.favorite || false);
    }
  }, [tea]);

  // Early returns
  if (!id) return <p>Invalid tea ID.</p>;
  if (loading) return <p>Loading tea details...</p>;
  if (error) return <p>Error loading tea.</p>;

  const handleImageUpload = async () => {
    if (!imageFile) return tea?.imageUrl || ""; // keep old image if no new one
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "tea_uploads");

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dcaivdnrk/image/upload`,
      formData
    );

    return response.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const imageUrl = await handleImageUpload();

      await updateTea({
        variables: {
          updateTeaId: id,
          input: {
            name,
            brand,
            type,
            rating: rating === "" ? null : rating,
            tags: tags
              .split(",")
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0),
            favorite,
            imageUrl,
          },
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
return (
  <div className="container py-5 mt-5 d-flex justify-content-center" style={{ minHeight: '100vh' }}>
    <div className="card shadow w-100" style={{ maxWidth: '600px' }}>
      <div className="ratio ratio-1x1 rounded overflow-hidden">
        <div
          className="card-img-overlay d-flex flex-column justify-content-center text-white"
            style={{
              backgroundColor: '#222', // or try '#343a40' for Bootstrap's dark gray
              padding: '2rem',
              borderRadius: '0.5rem',
            }}

        >
        <h1 className="card-title text-center mb-4 text-white">Edit Tea 🍵</h1>

        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 text-white">

          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control"
            placeholder="Brand"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control"
            placeholder="Type (Green, Black, etc)"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />

          <input
            type="text"
            className="form-control"
            placeholder="Tags (comma separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
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
          <div>
            <label className="form-label">Rating (1–5 Stars)</label>
            <select
              className="form-select"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
              required
            >
              <option value="">Select Rating</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {'⭐'.repeat(num)}
                </option>
              ))}
            </select>
          </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
          Mark as Favorite ❤️
        </label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="favorite"
              checked={favorite}
              onChange={(e) => setFavorite(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="favorite">
              Mark as Favorite ❤️
            </label>
          </div>

          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <button type="submit" className="btn btn-light w-100">
            ✅ Update Tea
          </button>
        </form>
      </div>
    </div>
  </div>
  </div>
);


}

export default EditTeaForm;