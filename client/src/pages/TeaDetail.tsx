import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TEA, GET_ME } from "../utils/queries";
import {
  ADD_TEA_TO_FAVORITES,
  REMOVE_TEA_FROM_FAVORITES,
} from "../utils/mutations";
import { useState, useEffect } from "react";
import FavoriteButton from "../components/FavoriteButton";
import { Container, Row, Col, Card, Badge } from "react-bootstrap";
import { motion } from "framer-motion";


function TeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_TEA, {
    variables: { id },
  });

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
    return <p className="text-center text-gray-500">Loading tea details...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        Error loading tea: {error.message}
      </p>
    );

  const tea = data?.tea;
  if (!tea) return <p className="text-center text-gray-500">Tea not found!</p>;

  // Wrappers to match FavoriteButton props
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
        <Col md={8}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <Card className="shadow-sm">
              {tea.imageUrl && (
                <Card.Img
                  variant="top"
                  src={tea.imageUrl}
                  alt={tea.name}
                  style={{ objectFit: 'cover', height: '300px' }}
                />
              )}
              <Card.Body>
                <Card.Title className="fs-2">{tea.name}</Card.Title>
                <Card.Text><strong>Brand:</strong> {tea.brand}</Card.Text>
                <Card.Text><strong>Type:</strong> {tea.type}</Card.Text>

                {tea.tastingNotes && (
                  <Card.Text><strong>Tasting Notes:</strong> {tea.tastingNotes}</Card.Text>
                )}

                {tea.tags?.length > 0 && (
                  <Card.Text>
                    <strong>Tags:</strong>{' '}
                    {tea.tags.map((tag: string, index: number) => (
                      <Badge key={index} bg="secondary" className="me-1">
                        {tag}
                      </Badge>
                    ))}
                  </Card.Text>
                )}
                  <FavoriteButton
                  teaId={tea._id}
                  initialFavorite={isFavorite}
                  addToFavorites={addToFavorites}
                  removeFromFavorites={removeFromFavorites}
                  onFavoriteChange={setIsFavorite}
                />
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default TeaDetail;
