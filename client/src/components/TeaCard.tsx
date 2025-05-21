import { useMutation } from '@apollo/client';
import { DELETE_TEA } from '../utils/mutations';
import { GET_TEAS } from '../utils/queries';
import { useNavigate } from 'react-router-dom';

function TeaCard({ tea }: { tea: any }) {
  const navigate = useNavigate();
  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }], // Refresh after delete
  });

  const handleDelete = async () => {
    if (confirm(`Delete ${tea.name}?`)) {
      await deleteTea({ variables: { id: tea._id } });
    }
  };

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '10px',
      padding: '1rem',
      width: '250px',
      position: 'relative',
      backgroundColor: tea.favorite ? '#ffe8e8' : 'white', // ❤️ Favorite Highlight
    }}>
      {tea.favorite && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          color: 'red',
          fontWeight: 'bold',
        }}>
          ❤️ Favorite
        </div>
      )}

      <h3>{tea.name}</h3>
      <p><strong>Brand:</strong> {tea.brand || "n/a"}</p>
      <p><strong>Type:</strong> {tea.type}</p>

      {/* ⭐ Show Stars */}
      <p>
        {Array(tea.rating).fill('⭐').map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </p>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
        {/* ✏️ Edit Button */}
        <button onClick={() => navigate(`/edittea/${tea._id}`)}>Edit</button>

        {/* 🗑️ Delete Button */}
        <button onClick={handleDelete} style={{ color: 'red' }}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default TeaCard;
