import { useQuery, useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { GET_TEAS, GET_ME } from "../utils/queries";
import {
  DELETE_TEA,
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import FavoriteButton from "../components/FavoriteButton";
import CustomButton from "../components/CustomButton";

import {
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";



interface Tea {
  _id: string;
  name: string;
  brand: string;
  type: string;
  imageUrl?: string;
  createdAt: string;
  tags?: string[];
}

function Dashboard() {
  const { loading, error, data } = useQuery(GET_TEAS);
  const { data: userData } = useQuery(GET_ME);
  const [addToFavorites] = useMutation(ADD_TEA_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_TEA_FROM_FAVORITES);
  const [deleteTea] = useMutation(DELETE_TEA, {
    refetchQueries: [{ query: GET_TEAS }],
  });

  const userFavorites =
    userData?.me?.favorites?.map((fav: any) => fav._id) || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  if (loading) return <p>Loading teas...</p>;
  if (error) return <p>Error loading teas: {error.message}</p>;

  const teas: Tea[] = data?.teas || [];
  const teaTypes: string[] = Array.from(
    new Set(teas.map((tea) => tea.type))
  ).sort();

  const handleDeleteTea = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this tea?"
    );
    if (!confirmDelete) return;

    try {
      await deleteTea({ variables: { id } });
    } catch (err) {
      console.error("Failed to delete tea", err);
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterType("");
    setSortOption("newest");
  };

  const filteredTeas = teas.filter((tea) => {
    const matchesSearch =
      tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tea.tags?.some((tag: string) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType = filterType
      ? tea.type.toLowerCase() === filterType.toLowerCase()
      : true;

    return matchesSearch && matchesType;
  });

  const sortedTeas = [...filteredTeas].sort((a, b) => {
    if (sortOption === "az") return a.name.localeCompare(b.name);
    if (sortOption === "za") return b.name.localeCompare(a.name);
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>

        <h1 className="text-center mb-4">🍵 Welcome to Your Tea Time Dashboard!</h1>

        <div className="d-flex flex-wrap gap-3 mb-4 justify-content-center text-center">
          <Link to="/add-tea">
            <CustomButton>➕ Add New Tea</CustomButton>
          </Link>

          <InputGroup style={{ maxWidth: "300px" }}>
            <Form.Control
              type="text"
              placeholder="Search teas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Form.Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option value="">All Types</option>
            {teaTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </Form.Select>

          <Form.Select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            style={{ maxWidth: "200px" }}
          >
            <option value="newest">Newest</option>
            <option value="az">Name A-Z</option>
            <option value="za">Name Z-A</option>
          </Form.Select>

          <CustomButton onClick={handleClearFilters}>🧹 Clear Filters</CustomButton>
        </div>

        {sortedTeas.length === 0 ? (
          <div className="text-center text-muted py-5">
            <div style={{ fontSize: "4rem" }}>🍵</div>
            <h2>No Teas Found</h2>
            <p>Try adjusting your search or clearing filters.</p>
          </div>
        ) : (
          <Row xs={1} sm={2} md={2} lg={3} className="g-5 px-3">
            {sortedTeas.map((tea) => (
              <Col key={tea._id} className="mb-5 px-3">
                <Card className="h-100 d-flex flex-column shadow-sm">
                  <Card.Img
                    variant="top"
                    className="card-img-top"
                    src={
                      tea.imageUrl && tea.imageUrl.trim() !== ""
                        ? tea.imageUrl
                        : "/editTea.jpg"
                    }
                    onError={(e) => {
                      e.currentTarget.src = "/editTea.jpg";
                    }}
                    alt={tea.name}
                    style={{ objectFit: "cover", height: "250px" }}
                  />

                  <Card.Body className="text-center flex-grow-0 p-2">
                    <Card.Title
                      className="fs-6 text-truncate mb-0"
                      title={tea.name}
                    >
                      {tea.name}
                    </Card.Title>
                    <div className="text-muted small">{tea.type}</div>
                  </Card.Body>

                  <Card.Footer className="d-flex justify-content-between align-items-center p-2">
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-view-${tea._id}`}>View Details</Tooltip>}
                    >
                      <Link to={`/teas/${tea._id}`}>
                        <Button variant="outline-secondary" size="sm" aria-label="View Details">
                          <Eye />
                        </Button>
                      </Link>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-edit-${tea._id}`}>Edit</Tooltip>}
                    >
                      <Link to={`/edit-tea/${tea._id}`}>
                        <Button variant="outline-primary" size="sm" aria-label="Edit">
                          <Pencil />
                        </Button>
                      </Link>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-favorite-${tea._id}`}>Favorite</Tooltip>}
                    >
                      <span>
                        <FavoriteButton
                          teaId={tea._id}
                          initialFavorite={userFavorites.includes(tea._id)}
                          addToFavorites={(id) =>
                            addToFavorites({ variables: { teaId: id } })
                          }
                          removeFromFavorites={(id) =>
                            removeFromFavorites({ variables: { teaId: id } })
                          }
                        />
                      </span>
                    </OverlayTrigger>  

                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id={`tooltip-delete-${tea._id}`}>Delete</Tooltip>}
                    >
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteTea(tea._id)}
                        aria-label="Delete"
                      >
                        <Trash />
                      </Button>
                    </OverlayTrigger>
                  </Card.Footer>
                </Card>

              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
