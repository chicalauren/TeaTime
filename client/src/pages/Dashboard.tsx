import { useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { GET_TEAS } from '../utils/queries';
import { DELETE_TEA } from '../utils/mutations';
//import CustomButton from '../components/CustomButton';

function Dashboard() {
  const { loading, error, data } = useQuery(GET_TEAS);
  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortOption, setSortOption] = useState('newest');

  if (loading) return <p>Loading teas...</p>;
  if (error) return <p>Error loading teas: {error.message}</p>;

  const teas = data?.teas || [];
    // 🔍 Log raw data and unique IDs
  console.log('Raw teas fetched:', teas);
  const teaIds = teas.map((t: any) => t._id);
  console.log('Tea IDs:', teaIds);
  

  const handleDeleteTea = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this tea?');
    if (!confirmDelete) return;

    try {
      await deleteTea({ variables: { id } });
    } catch (err) {
      console.error('Failed to delete tea', err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterType('');
    setSortOption('newest');
  };

  const filteredTeas = teas.filter((tea: any) => {
    const matchesSearch =
      tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tea.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = filterType ? tea.type.toLowerCase() === filterType.toLowerCase() : true;

    return matchesSearch && matchesType;
  });

  const sortedTeas = [...filteredTeas].sort((a: any, b: any) => {
    if (sortOption === 'az') {
      return a.name.localeCompare(b.name);
    }
    if (sortOption === 'za') {
      return b.name.localeCompare(a.name);
    }
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div className="container py-5 mt-5">
      <h1 className="mb-4 text-center">🍵Tea Time!</h1>

      {/* Controls */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-6">
          <Link to="/add-tea" className="btn btn-success w-100">
            ➕ Add New Tea
          </Link>
        </div>
        <div className="col-md-3 col-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search teas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-2 col-6">
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Green">Green</option>
            <option value="Black">Black</option>
            <option value="Oolong">Oolong</option>
            <option value="Herbal">Herbal</option>
            <option value="White">White</option>
          </select>
        </div>
        <div className="col-md-2 col-6">
          <select
            className="form-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="az">Name A-Z</option>
            <option value="za">Name Z-A</option>
          </select>
        </div>
        <div className="col-md-2 col-12">
          <button className="btn btn-outline-secondary w-100" onClick={handleClearFilters}>
            🧹 Clear Filters
          </button>
        </div>
      </div>

      {/* Tea Cards */}
      {sortedTeas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: '4rem' }}>🍵</div>
          <h2>No Teas Found</h2>
          <p>Try adjusting your search or clearing filters.</p>
        </div>
      ) : (
        <div className="row g-4">
          {sortedTeas.map((tea: any) => (
            <div className="col-md-4 col-sm-6" key={tea._id}>
              <div className="card h-100 shadow-sm">
                <div
                    className="card-img-overlay d-flex flex-column justify-content-end text-white"
                    style={{
                      backgroundImage: `url(${tea.imageUrl || ''})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '200px',
                      position: 'relative',
                    }}
                  >
                    <div
                      className="bg-dark bg-opacity-50 p-2 rounded"
                      style={{ backdropFilter: 'blur(3px)' }}
                    >
                      <h5 className="card-title">{tea.name}</h5>
                      <p className="card-text mb-1"><strong>Brand:</strong> {tea.brand || 'n/a'}</p>
                      <p className="card-text"><strong>Type:</strong> {tea.type}</p>
                    </div>
                  </div>

                <div className="card-footer d-flex justify-content-center gap-2">
                  <Link to={`/teas/${tea._id}`}>
                    <button className="btn btn-outline-primary btn-sm" title="View">
                      <i className="bi bi-eye"></i>
                    </button>
                  </Link>
                  <Link to={`/edit-tea/${tea._id}`}>
                    <button className="btn btn-outline-secondary btn-sm" title="Edit">
                      <i className="bi bi-pencil"></i>
                    </button>
                  </Link>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    title="Delete"
                    onClick={() => handleDeleteTea(tea._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
