import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_TEA } from '../utils/mutations';
import { useNavigate } from 'react-router-dom';

function AddTeaForm() {
  const [formState, setFormState] = useState({
    name: '',
    brand: '',
    type: '',
    imageUrl: '',
    tastingNotes: '',
    tags: '',
  });

  const navigate = useNavigate();
  const [addTea, { error }] = useMutation(ADD_TEA);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addTea({
        variables: {
          name: formState.name,
          brand: formState.brand,
          type: formState.type,
          imageUrl: formState.imageUrl,
          tastingNotes: formState.tastingNotes,
          tags: formState.tags.split(',').map((tag) => tag.trim()),
        },
      });
      navigate('/teas');
    } catch (err) {
      console.error('Error adding tea:', err);
    }
  };

  return (
    <div>
      <h1>➕ Add a New Tea</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Tea Name"
          value={formState.name}
          onChange={handleChange}
          required
        />
        <input
          name="brand"
          placeholder="Brand"
          value={formState.brand}
          onChange={handleChange}
          required
        />
        <input
          name="type"
          placeholder="Type (Black, Green, Herbal)"
          value={formState.type}
          onChange={handleChange}
          required
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={formState.imageUrl}
          onChange={handleChange}
        />
        <textarea
          name="tastingNotes"
          placeholder="Tasting Notes"
          value={formState.tastingNotes}
          onChange={handleChange}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated: floral, fruity, etc)"
          value={formState.tags}
          onChange={handleChange}
        />

        <button type="submit">Add Tea</button>
      </form>
      {error && <p style={{ color: 'red' }}>Error adding tea: {error.message}</p>}
    </div>
  );
}

export default AddTeaForm;
