import { useMutation, useQuery } from "@apollo/client";
import { GET_TEA, GET_TEAS, GET_ME } from "../utils/queries";
import { UPDATE_TEA, ADD_TEA_TO_FAVORITES, REMOVE_TEA_FROM_FAVORITES } from "../utils/mutations";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Select from "react-select";
import FavoriteButton from "../components/FavoriteButton";

//TOOD: the tags label is black 



function EditTeaForm() {
  const params = useParams();
  const id = params.id ?? "";
  const navigate = useNavigate();
  const { data: userData } = useQuery(GET_ME);
  const [addToFavorites] = useMutation(ADD_TEA_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_TEA_FROM_FAVORITES);
  const userFavorites = userData?.me?.favorites?.map((fav: any) => fav._id) || [];

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [tastingNotes, setTastingNotes] = useState("");
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);
  const [rating, setRating] = useState<number | "">("");
  const [favorite, setFavorite] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const teaTypes = [
    "Black", "Green", "White", "Oolong", "Pu-erh", "Herbal",
    "Rooibos", "Mate", "Yellow", "Chai", "Blooming", "Blend"
  ];

  const tagOptions = [
    { value: "afternoon-relaxation", label: "afternoon-relaxation" },
    { value: "afternoon-sip", label: "afternoon-sip" },
    { value: "alertness", label: "alertness" },
    { value: "breakfast", label: "breakfast" },
    { value: "calm", label: "calm" },
    { value: "calmness", label: "calmness" },
    { value: "caffeine-free-energy", label: "caffeine-free-energy" },
    { value: "casual-sip", label: "casual-sip" },
    { value: "celebration", label: "celebration" },
    { value: "comfort", label: "comfort" },
    { value: "daily-use", label: "daily-use" },
    { value: "daily-wellness", label: "daily-wellness" },
    { value: "dessert-substitute", label: "dessert-substitute" },
    { value: "digestion", label: "digestion" },
    { value: "easy-sipping", label: "easy-sipping" },
    { value: "elegance", label: "elegance" },
    { value: "evening-drink", label: "evening-drink" },
    { value: "evening-wind-down", label: "evening-wind-down" },
    { value: "focus", label: "focus" },
    { value: "focus-and-energy", label: "focus-and-energy" },
    { value: "gentle-afternoons", label: "gentle-afternoons" },
    { value: "gentle-wake-up", label: "gentle-wake-up" },
    { value: "hydration", label: "hydration" },
    { value: "immune-support", label: "immune-support" },
    { value: "indulgence", label: "indulgence" },
    { value: "invigoration", label: "invigoration" },
    { value: "late-evening", label: "late-evening" },
    { value: "light-refreshment", label: "light-refreshment" },
    { value: "meditation", label: "meditation" },
    { value: "mindfulness", label: "mindfulness" },
    { value: "morning-wake-up", label: "morning-wake-up" },
    { value: "nausea", label: "nausea" },
    { value: "quiet-moments", label: "quiet-moments" },
    { value: "reflection", label: "reflection" },
    { value: "refreshment", label: "refreshment" },
    { value: "relaxation", label: "relaxation" },
    { value: "serenity", label: "serenity" },
    { value: "skin-health", label: "skin-health" },
    { value: "sleep-aid", label: "sleep-aid" },
    { value: "special-occasions", label: "special-occasions" },
    { value: "spice-and-warmth", label: "spice-and-warmth" },
    { value: "strong-start", label: "strong-start" },
    { value: "stress-balance", label: "stress-balance" },
    { value: "stress-relief", label: "stress-relief" },
    { value: "uplift", label: "uplift" },
  ];

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

      const uploadUrl = process.env.REACT_APP_CLOUDINARY_UPLOAD_URL
      const response = await axios.post(
        `${uploadUrl}`,
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

  const { data, loading, error } = useQuery(GET_TEA, { variables: { id } });
  const [updateTea] = useMutation(UPDATE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const tea = data?.tea;

  useEffect(() => {
    if (tea) {
      setName(tea.name);
      setBrand(tea.brand);
      setType(tea.type);
      setRating(tea.rating ?? "");
      setFavorite(tea.favorite || false);
      setTastingNotes(tea.tastingNotes ?? "");
      setTags((tea.tags ?? []).map((tag: string) => ({ value: tag, label: tag })));
      if (tea.imageUrl) setImagePreview(tea.imageUrl);
    }
  }, [tea]);

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
          imageUrl: uploadedImageUrl ?? imagePreview,
          tastingNotes,
          tags: tags.map((tag) => tag.value),
          rating: rating === "" ? null : rating,
          favorite,
        },
      });
      toast.success("Tea updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Update failed", error);
      toast.error("Update failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{
      backgroundImage: 'url("/your-image.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }}>
      <div style={{
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
      }} />

      <div className="card shadow w-100" style={{ maxWidth: "600px", zIndex: 1 }}>
        <div className="d-flex flex-column justify-content-center text-white p-4" style={{ backgroundColor: "#222", borderRadius: "0.5rem" }}>
          <h1 className="card-title text-center mb-4">Edit Tea 🍵</h1>
          <form onSubmit={handleSubmit} className="d-flex flex-column gap-3 text-white">
            <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" className="form-control" placeholder="Brand (optional)" value={brand} onChange={(e) => setBrand(e.target.value)} />
            <select className="form-select" value={type} onChange={(e) => setType(e.target.value)} required>
              <option value="">Select Tea Type</option>
              {teaTypes.map((teaType) => (
                <option key={teaType} value={teaType}>{teaType}</option>
              ))}
            </select>
            <textarea className="form-control" placeholder="Tasting Notes" value={tastingNotes} onChange={(e) => setTastingNotes(e.target.value)} />
            <div className="text-dark">
              <label htmlFor="tag-select" className="form-label">Tags</label>
              <Select
                inputId="tag-select"
                isMulti
                options={tagOptions}
                value={tags}
                onChange={(selected) => setTags(selected as { value: string; label: string }[])}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select or type tags..."
              />
            </div>
            <div>
              <label htmlFor="rating" className="form-label">Rating (1–5 Stars)</label>
              <select id="rating" className="form-select" value={rating} onChange={(e) => setRating(e.target.value === "" ? "" : Number(e.target.value))} required>
                <option value="">Select Rating</option>
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>{"⭐".repeat(num)}</option>
                ))}
              </select>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span>Mark as Favorite:</span>
              <FavoriteButton
                teaId={tea._id}
                initialFavorite={userFavorites.includes(tea._id)}
                addToFavorites={(id) => addToFavorites({ variables: { teaId: id } })}
                removeFromFavorites={(id) =>
                  removeFromFavorites({ variables: { teaId: id } })
                }
              />
            </div>

            <div>
                <label htmlFor="imageUpload" className="form-label">
                  Upload a photo of your tea (optional)
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small className="text-white-50">Accepted formats: JPG, PNG, GIF</small>
              </div>
            {imagePreview && (
              <div className="text-center">
                <p><strong>Image Preview:</strong></p>
                <img src={imagePreview} alt="Selected" className="img-fluid rounded" style={{ maxHeight: "250px" }} />
              </div>
            )}
            {uploading && <p className="text-primary">Uploading image, please wait...</p>}
            <button type="submit" className="btn btn-light w-100" disabled={uploading || !name || !type || rating === ""}>
              {uploading ? (
                <div className="spinner-border spinner-border-sm" role="status">
                  <span className="visually-hidden">Uploading...</span>
                </div>
              ) : (
                "✅ Update Tea"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditTeaForm;
