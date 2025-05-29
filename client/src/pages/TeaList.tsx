import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_TEAS } from '../utils/queries';



function TeaList() {
  const { loading, error, data } = useQuery(GET_TEAS);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  if (loading) return <p>Loading teas...</p>;
  if (error) return <p>Error loading teas: {error.message}</p>;

  const teas = data?.teas || [];

  const filteredTeas = teas.filter((tea: any) => {
    return (
      (selectedBrand ? tea.brand === selectedBrand : true) &&
      (selectedType ? tea.type === selectedType : true) &&
      (selectedTag ? tea.tags.includes(selectedTag) : true)
    );
  });

  const brands = Array.from(new Set(teas.map((tea: any) => tea.brand))) as string[];
  const types = Array.from(new Set(teas.map((tea: any) => tea.type))) as string[];
  const tags = Array.from(new Set(teas.flatMap((tea: any) => tea.tags || []))) as string[];

  return (
    <div>
      <h1>🍵 Browse Teas</h1>

      {/* Filters */}
      <div>
        <label>
          Brand:
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">All Brands</option>
            {brands.map((brand: string) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </label>

        <label>
          Type:
          <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
            <option value="">All Types</option>
            {types.map((type: string) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label>
          Tag:
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
            <option value="">All Tags</option>
            {tags.map((tag: string) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Tea List */}
      <div>
        {filteredTeas.map((tea: any) => (
          <div key={tea._id} style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
            {tea.imageUrl && <img src={tea.imageUrl} alt={tea.name} width="100" />}
            <h2>{tea.name}</h2>
            <p><strong>Brand:</strong> {tea.brand}</p>
            <p><strong>Type:</strong> {tea.type}</p>
            <p><strong>Tasting Notes:</strong> {tea.tastingNotes}</p>
            <p><strong>Tags:</strong> {tea.tags?.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeaList;
