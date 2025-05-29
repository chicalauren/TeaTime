import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_TEA } from '../utils/queries';
import { Card, Spinner, Alert, Container, Row, Col, Badge } from 'react-bootstrap';
import { motion } from 'framer-motion';

function TeaDetail() {
  const { id } = useParams<{ id: string }>();
  const { loading, error, data } = useQuery(GET_TEA, {
    variables: { id },
  });

  if (loading) return <Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>;
  if (error) return <Alert variant="danger">Error loading tea: {error.message}</Alert>;

  const tea = data?.tea;

  if (!tea) return <Alert variant="warning">Tea not found!</Alert>;

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
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}

export default TeaDetail;
