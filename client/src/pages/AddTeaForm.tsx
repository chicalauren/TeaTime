//TODO: styling

import { useMutation } from '@apollo/client';
import { ADD_TEA } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import { motion } from 'framer-motion';

function AddTeaForm() {
  const navigate = useNavigate();
  const [addTea] = useMutation(ADD_TEA);

  const nameInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [tastingNotes, setTastingNotes] = useState('');
  const [tags, setTags] = useState('');
  const [rating, setRating] = useState(0);
  const [favorite, setFavorite] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successFadeIn, setSuccessFadeIn] = useState(false);

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
      formData.append('file', imageFile);
      formData.append('upload_preset', 'tea_uploads');

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dcaivdnrk/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error('Image upload failed', error);
      toast.error('Image upload failed. Please try again.');
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
          tags: tags.split(',').map((tag) => tag.trim()),
          rating,
          favorite,
        },
      });

      toast.success('Tea Added Successfully! 🎉');
      setShowConfetti(true);
      setSuccessFadeIn(true);

      // Clear form
      setName('');
      setBrand('');
      setType('');
      setTastingNotes('');
      setTags('');
      setRating(0);
      setFavorite(false);
      setImageFile(null);
      setImagePreview(null);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2500);

    } catch (err) {
      console.error('Failed to add tea', err);
      toast.error('Failed to add tea. Please try again.');
    }
  };

  return (
    <div style={{ padding: '2rem', position: 'relative' }}>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {successFadeIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#e0ffe0',
            padding: '1rem 2rem',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            fontWeight: 'bold',
            fontSize: '1.3rem',
            color: '#006400',
          }}
        >
          🎉 Your tea was added!
        </motion.div>
      )}

      <h1>Add New Tea 🍵</h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          ref={nameInputRef}
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

        <textarea
          placeholder="Tasting Notes"
          value={tastingNotes}
          onChange={(e) => setTastingNotes(e.target.value)}
        />


        <input
          type="text"
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <label>Rating (1-5 Stars)</label>
        <select
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

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
          Mark as Favorite ❤️
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />

        {imagePreview ? (
          <div style={{ marginTop: '1rem' }}>
            <p><strong>Image Preview:</strong></p>
            <img
              src={imagePreview}
              alt="Selected"
              style={{ width: '250px', height: 'auto', borderRadius: '8px', marginTop: '10px' }}
            />
          </div>
        ) : (
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>No image selected yet 📷</p>
        )}

        {uploading && (
          <p style={{ color: 'blue' }}>Uploading image, please wait...</p>
        )}

        <button
          type="submit"
          disabled={uploading || !name || !brand || !type || rating === 0}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {uploading ? (
            <div
              style={{
                width: '20px',
                height: '20px',
                border: '3px solid #fff',
                borderTop: '3px solid blue',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
              }}
            />
          ) : (
            'Add Tea'
          )}
        </button>
      </form>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default AddTeaForm;
