import { useMutation, useQuery } from "@apollo/client";
import { GET_TEA, GET_TEAS } from "../utils/queries";
import { UPDATE_TEA } from "../utils/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import FavoriteButton from "../components/FavoriteButton";
import { GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";

function EditTeaForm() {
  const params = useParams();
  const id = params.id ?? "";
  const navigate = useNavigate();
  const { data: userData } = useQuery(GET_ME);
  const [addToFavorites] = useMutation(ADD_TEA_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_TEA_FROM_FAVORITES);
  const userFavorites =
    userData?.me?.favorites?.map((fav: any) => fav._id) || [];

  // Image state and handlers inside component
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "tea_uploads");

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dcaivdnrk/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Image upload failed", error);
      toast.error("Image upload failed. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  // GraphQL query and mutation
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
      if (tea.imageUrl) setImagePreview(tea.imageUrl);
    }
  }, [tea]);

  // Early return for invalid or loading states
  if (!id) return <p>Invalid tea ID.</p>;
  if (loading) return <p>Loading tea details...</p>;
  if (error) return <p>Error loading tea.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload();

      await updateTea({
        variables: {
          teaId: id,
          name,
          brand,
          type,
          imageUrl: uploadedImageUrl ?? imagePreview, // use old preview if no new upload
          tags: [], // Add tags handling if needed
          rating: rating === "" ? null : rating,
          favorite,
        },
      });

      toast.success("Tea updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(
        "Image upload failed",
        error.response || error.message || error
      );
      toast.error("Image upload failed. Please try again.");
      return null;
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

        <input
          type="file"
          className="form-control"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview && (
          <div className="text-center">
            <p>
              <strong>Image Preview:</strong>
            </p>
            <img
              src={imagePreview}
              alt="Selected"
              className="img-fluid rounded"
              style={{ maxHeight: "250px" }}
            />
          </div>
        )}

        {uploading && (
          <p className="text-primary">Uploading image, please wait...</p>
        )}

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

        <FavoriteButton
          teaId={tea._id}
          initialFavorite={userFavorites.includes(tea._id)}
          addToFavorites={(id) => addToFavorites({ variables: { teaId: id } })}
          removeFromFavorites={(id) =>
            removeFromFavorites({ variables: { teaId: id } })
          }
        />

        <button type="submit">Update Tea</button>
      </form>
    </div>
  );
}

export default EditTeaForm;
