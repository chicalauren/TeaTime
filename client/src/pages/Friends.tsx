import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_ME_WITH_FRIENDS, SEARCH_USERS } from "../utils/queries";
import {
  ACCEPT_FRIEND_REQUEST,
  DECLINE_FRIEND_REQUEST,
  REMOVE_FRIEND,
  SEND_FRIEND_REQUEST,
} from "../utils/mutations";
import {
  Container,
  Card,
  Button,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useState } from "react";

function Friends() {
  const { data, refetch } = useQuery(GET_ME_WITH_FRIENDS);
  const [acceptRequest] = useMutation(ACCEPT_FRIEND_REQUEST, { onCompleted: refetch });
  const [declineRequest] = useMutation(DECLINE_FRIEND_REQUEST, { onCompleted: refetch });
  const [removeFriend] = useMutation(REMOVE_FRIEND, { onCompleted: refetch });
  const [sendRequest] = useMutation(SEND_FRIEND_REQUEST, { onCompleted: refetch });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUsers, { data: searchData, loading: searchLoading, error: searchError }] = useLazyQuery(SEARCH_USERS);

  // Live search as user types
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      searchUsers({ variables: { username: value.trim() } });
    }
  };

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

      <Container style={{ zIndex: 1, maxWidth: "1200px" }}>
        <Row>
          {/* Friends and requests */}
          <Col md={8} xs={12}>
            <Card className="shadow mb-4">
              <Card.Body>
                <h2 className="fw-bold text-center mb-4">Friends</h2>
                <Row className="gy-2">
                  {(user?.friends ?? []).map((f: any) => (
                    <Col key={f._id} xs={12}>
                      <Card className="bg-light d-flex flex-row justify-content-between align-items-center p-2">
                        <div className="fw-semibold text-dark">{f.username}</div>
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
          </Col>

          {/* Search bar and results */}
          <Col md={4} xs={12} className="mt-4 mt-md-0">
            <Card className="shadow">
              <Card.Body>
                <h4 className="fw-bold mb-3">Find Users</h4>
                <Form
                  onSubmit={e => {
                    e.preventDefault();
                    if (searchTerm.trim()) searchUsers({ variables: { username: searchTerm.trim() } });
                  }}
                >
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by username"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <Button type="submit" variant="primary" disabled={searchLoading}>
                      Search
                    </Button>
                  </InputGroup>
                </Form>
                <div className="mt-3">
                  {searchLoading && <div>Searching...</div>}
                  {searchError && <div className="text-danger">Error: {searchError.message}</div>}
                  {searchData?.searchUsers?.length === 0 && <div>No users found.</div>}
                  {searchData?.searchUsers?.map((u: any) => (
                    <Card key={u._id} className="mb-2">
                      <Card.Body className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <img
                            src={u.profileImage || "/teacup.jpg"}
                            alt={u.username}
                            style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", marginRight: 12 }}
                          />
                          <span>{u.username}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => sendRequest({ variables: { userId: u._id } })}
                        >
                          Add Friend
                        </Button>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Friends;