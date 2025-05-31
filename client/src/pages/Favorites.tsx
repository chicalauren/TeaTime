import { useQuery, useMutation } from "@apollo/client";
import { GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import FavoriteButton from "../components/FavoriteButton";
import { Link } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  //Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Pencil } from "react-bootstrap-icons";

//TODO: When I go from favorites to edit tea, it's somehow unfavoriting the tea.


function Favorites() {
  const { loading, error, data } = useQuery(GET_ME, {
    fetchPolicy: "network-only",
  });

  const user = data?.me;
  const favoriteTeas = user?.favoriteTeas ?? [];

  const sortedFavorites = [...favoriteTeas].sort(
    (a, b) => (b.rating || 0) - (a.rating || 0)
  );

  const [addToFavoritesMutation] = useMutation(ADD_TEA_TO_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });

  const [removeFromFavoritesMutation] = useMutation(REMOVE_TEA_FROM_FAVORITES, {
    refetchQueries: [{ query: GET_ME }],
  });

  const handleAddToFavorites = async (teaId: string) => {
    try {
      await addToFavoritesMutation({ variables: { teaId } });
    } catch (e) {
      console.error("Error adding to favorites:", e);
    }
  };

  const handleRemoveFromFavorites = async (teaId: string) => {
    try {
      await removeFromFavoritesMutation({ variables: { teaId } });
    } catch (e) {
      console.error("Error removing from favorites:", e);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading favorites...</p>;
  if (error) return <p className="text-center text-danger mt-5">Error: {error.message}</p>;
  if (!user) return <p className="text-center mt-5">User not found.</p>;

  return (
    <div
      className="d-flex justify-content-center align-items-start min-vh-100"
      style={{
        backgroundImage: 'url("/profile-bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        paddingTop: "4rem",
        paddingBottom: "4rem",
      }}
    >
      {/* White overlay */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        <Card className="bg-light text-center mb-5 shadow-sm">
          <Card.Body>
            <h2 className="display-6 text-dark">Your Favorite Teas ❤️</h2>
          </Card.Body>
        </Card>

        {favoriteTeas.length === 0 ? (
          <p className="text-center text-muted">No favorites yet.</p>
        ) : (
          <Row xs={1} sm={2} md={2} lg={3} className="g-4 px-3 justify-content-center">
            {sortedFavorites.map((tea: any) => (
              <Col key={tea._id}>
                <Card className="h-100 d-flex flex-column shadow-sm">
                  <Card.Img
                    variant="top"
                    src={tea.imageUrl?.trim() || "/editTea.jpg"}
                    onError={(e) => {
                      e.currentTarget.src = "/editTea.jpg";
                    }}
                    alt={tea.name}
                    style={{ objectFit: "cover", height: "250px" }}
                  />

                  <Card.Body className="text-center flex-grow-0 p-2">
                    <Card.Title className="fs-6 text-truncate mb-0" title={tea.name}>
                      {tea.name}
                    </Card.Title>
                    <div className="text-muted small">{tea.type}</div>
                  </Card.Body>

                  <Card.Footer className="d-flex justify-content-between align-items-center p-2">
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

                    <FavoriteButton
                      teaId={tea._id}
                      initialFavorite={true}
                      addToFavorites={handleAddToFavorites}
                      removeFromFavorites={handleRemoveFromFavorites}
                    />
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Favorites;
