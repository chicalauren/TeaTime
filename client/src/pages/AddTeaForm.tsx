import { useMutation } from "@apollo/client";
import { ADD_TEA } from "../utils/mutations";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Confetti from "react-confetti";
import { motion } from "framer-motion";
// adding notes because the form needs an update and it's being rude!
function AddTeaForm() {
  const navigate = useNavigate();
  const [addTea] = useMutation(ADD_TEA);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [type, setType] = useState("");
  const [tastingNotes, setTastingNotes] = useState("");
  const [tags, setTags] = useState("");
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successFadeIn, setSuccessFadeIn] = useState(false);
  const teaTypes = [
    "Black",
    "Green",
    "White",
    "Oolong",
    "Pu-erh",
    "Herbal",
    "Rooibos",
    "Mate",
    "Yellow",
    "Chai",
    "Blooming",
    "Blend",
  ];

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const imageUrl = await handleImageUpload();

      await addTea({
        variables: {
          name,
          brand,
          type,
          imageUrl,
          tastingNotes,
          tags: tags.split(",").map((tag) => tag.trim()),
          rating,
          favorite,
        },
      });

      toast.success("Tea Added Successfully! 🎉");
      setShowConfetti(true);
      setSuccessFadeIn(true);

      setName("");
      setBrand("");
      setType("");
      setTastingNotes("");
      setTags("");
      setRating(0);
      setFavorite(false);
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    } catch (err) {
      console.error("Failed to add tea", err);
      toast.error("Failed to add tea. Please try again.");
    }
  };

  return (
    <div className="container py-5 mt-5 d-flex justify-content-center">
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {successFadeIn && (
        <motion.div
          className="position-absolute top-0 start-50 translate-middle-x mt-3 p-3 rounded shadow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            background: "#e0ffe0",
            fontWeight: "bold",
            color: "#006400",
          }}
        >
          🎉 Your tea was added!
        </motion.div>
      )}

      <div className="card shadow w-100" style={{ maxWidth: "600px" }}>
        <div className="rounded">
          <div
            className="d-flex flex-column justify-content-center text-white"
            style={{
              backgroundColor: "#222",
              padding: "2rem",
              borderRadius: "0.5rem",
            }}
          >
            <h1 className="card-title text-center mb-4 text-white">
              Add New Tea 🍵
            </h1>

            <form
              onSubmit={handleSubmit}
              className="d-flex flex-column gap-3 text-white"
            >
              <input
                ref={nameInputRef}
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

              <select
                className="form-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                <option value="">Select Tea Type</option>
                {teaTypes.map((teaType) => (
                  <option key={teaType} value={teaType}>
                    {teaType}
                  </option>
                ))}
              </select>

              <textarea
                className="form-control"
                placeholder="Tasting Notes"
                value={tastingNotes}
                onChange={(e) => setTastingNotes(e.target.value)}
              />

              <input
                type="text"
                className="form-control"
                placeholder="Tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />

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
                      {"⭐".repeat(num)}
                    </option>
                  ))}
                </select>
              </div>

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

              <button
                type="submit"
                className="btn btn-light w-100"
                disabled={uploading || !name || !brand || !type || rating === 0}
              >
                {uploading ? (
                  <div
                    className="spinner-border spinner-border-sm"
                    role="status"
                  >
                    <span className="visually-hidden">Uploading...</span>
                  </div>
                ) : (
                  "➕ Add Tea"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeaForm;
