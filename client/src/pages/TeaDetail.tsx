//TODO: styling

import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TEA } from '../utils/queries';

function TeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_TEA, {
    variables: { id },
  });

  if (loading) return <p>Loading tea details...</p>;
  if (error) return <p>Error loading tea: {error.message}</p>;

  const tea = data?.tea;

  if (!tea) return <p>Tea not found!</p>;

  return (
    <div>
      <h1>{tea.name}</h1>
      <p><strong>Brand:</strong> {tea.brand}</p>
      <p><strong>Type:</strong> {tea.type}</p>
      {tea.imageUrl && <img src={tea.imageUrl} alt={tea.name} style={{ width: '200px', marginTop: '10px' }} />}
      {tea.tastingNotes && <p><strong>Tasting Notes:</strong> {tea.tastingNotes}</p>}
      {tea.tags?.length > 0 && (
        <p><strong>Tags:</strong> {tea.tags.join(', ')}</p>
      )}
    </div>
  );
}

export default TeaDetail;
