import { useQuery, useMutation } from "@apollo/client";
import { GET_ME_WITH_FRIENDS } from "../utils/queries";
import {
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  REMOVE_FRIEND,
} from "../utils/mutations";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";

function Friends() {
  const { data, refetch } = useQuery(GET_ME_WITH_FRIENDS);
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, { onCompleted: refetch });
  const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST, { onCompleted: refetch });
  const [removeFriend] = useMutation(REMOVE_FRIEND, { onCompleted: refetch });

  const user = data?.me;

  return (
    <div
      className="position-relative min-vh-100 py-5 d-flex justify-content-center align-items-start"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      />

      <Container style={{ zIndex: 1, maxWidth: "800px" }}>
        <Card className="shadow mb-4">
          <Card.Body>
            <h2 className="fw-bold text-center mb-4">Friends</h2>
            <Row className="gy-2">
              {(user?.friends ?? []).map((f: any) => (
                <Col key={f._id} xs={12}>
                  <Card className="bg-light d-flex flex-row justify-content-between align-items-center p-2">
                    <div className="fw-semibold text-dark">
                      <Link to={`/user/${f.username}`} className="friend-link">
                        {f.username}
                      </Link>
                    </div>
                    <OverlayTrigger overlay={<Tooltip id={`remove-${f._id}`}>Remove Friend</Tooltip>}>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFriend({ variables: { userId: f._id } })}
                      >
                        Remove
                      </Button>
                    </OverlayTrigger>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow mb-4">
          <Card.Body>
            <h3 className="fw-bold text-center text-success mb-4">Friend Requests Received</h3>
            <Row className="gy-2">
              {(user?.friendRequestsReceived ?? []).map((f: any) => (
                <Col key={f._id} xs={12}>
                  <Card className="bg-warning-subtle d-flex flex-row justify-content-between align-items-center p-2">
                    <div className="fw-semibold text-dark">{f.username}</div>
                    <div>
                      <OverlayTrigger overlay={<Tooltip id={`accept-${f._id}`}>Accept</Tooltip>}>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => acceptRequest({ variables: { userId: f._id } })}
                        >
                          Accept
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger overlay={<Tooltip id={`decline-${f._id}`}>Decline</Tooltip>}>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => declineRequest({ variables: { userId: f._id } })}
                        >
                          Decline
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>

        <Card className="shadow">
          <Card.Body>
            <h3 className="fw-bold text-center text-primary mb-4">Friend Requests Sent</h3>
            <Row className="gy-2">
              {(user?.friendRequestsSent ?? []).map((f: any) => (
                <Col key={f._id} xs={12}>
                  <Card className="bg-info-subtle d-flex flex-row justify-content-between align-items-center p-2">
                    <div className="fw-semibold text-dark">{f.username}</div>
                    <span className="badge bg-primary">Pending</span>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default Friends;