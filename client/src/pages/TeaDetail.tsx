import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TEA, GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import { useState, useEffect } from "react";
import FavoriteButton from "../components/FavoriteButton";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Eye, Pencil } from "react-bootstrap-icons";
import { motion } from "framer-motion";

//TODO: there's no delete button on the tea detail page, should there be one?

function TeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_TEA, { variables: { id } });

  const {
    data: userData,
    loading: userLoading,
    refetch: refetchUser,
  } = useQuery(GET_ME);

  const [addFavorite] = useMutation(ADD_TEA_TO_FAVORITES);
  const [removeFavorite] = useMutation(REMOVE_TEA_FROM_FAVORITES);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (userData && data?.tea) {
      const favorites = userData.me.favoriteTeas || [];
      setIsFavorite(favorites.some((fav: any) => fav._id === data.tea._id));
    }
  }, [userData, data]);

  if (loading || userLoading)
    return <p className="text-center text-muted">Loading tea details...</p>;
  if (error)
    return (
      <p className="text-center text-danger">
        Error loading tea: {error.message}
      </p>
    );

  const tea = data?.tea;
  if (!tea) return <p className="text-center text-muted">Tea not found!</p>;

  const addToFavorites = async (teaId: string) => {
    await addFavorite({ variables: { teaId } });
    await refetchUser();
  };

  const removeFromFavorites = async (teaId: string) => {
    await removeFavorite({ variables: { teaId } });
    await refetchUser();
  };

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-100 d-flex flex-column shadow-sm">
              <Card.Img
                variant="top"
                className="card-img-top"
                src={tea.imageUrl?.trim() !== "" ? tea.imageUrl : "/editTea.jpg"}
                onError={(e) => {
                  e.currentTarget.src = "/editTea.jpg";
                }}
                alt={tea.name}
                style={{ objectFit: "cover", height: "300px" }}
              />

              <Card.Body className="text-center flex-grow-0 p-3">
                <Card.Title className="fs-5 mb-1" title={tea.name}>
                  {tea.name}
                </Card.Title>
                <div className="text-muted mb-2">{tea.type}</div>

                {tea.brand && (
                  <Card.Text>
                    <strong>Brand:</strong> {tea.brand}
                  </Card.Text>
                )}
                {tea.tastingNotes && (
                  <Card.Text>
                    <strong>Tasting Notes:</strong> {tea.tastingNotes}
                  </Card.Text>
                )}
                {tea.tags?.length > 0 && (
                  <Card.Text>
                    <strong>Tags:</strong>{" "}
                    {tea.tags.map((tag: string, index: number) => (
                      <Badge key={index} bg="secondary" className="me-1">
                        {tag}
                      </Badge>
                    ))}
                  </Card.Text>
                )}
              </Card.Body>

              <Card.Footer className="d-flex justify-content-between align-items-center p-2">
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-edit-${tea._id}`}>Edit</Tooltip>
                  }
                >
                  <Link to={`/edit-tea/${tea._id}`}>
                    <Button variant="outline-primary" size="sm">
                      <Pencil />
                    </Button>
                  </Link>
                </OverlayTrigger>

                <FavoriteButton
                  teaId={tea._id}
                  initialFavorite={isFavorite}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  onFavoriteChange={setIsFavorite}
                />

                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip id={`tooltip-back-${tea._id}`}>Back</Tooltip>
                  }
                >
                  <Link to="/dashboard">
                    <Button variant="outline-secondary" size="sm">
                      <Eye />
                    </Button>
                  </Link>
                </OverlayTrigger>
              </Card.Footer>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default TeaDetail;
