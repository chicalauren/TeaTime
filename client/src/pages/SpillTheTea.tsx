import { useQuery, useMutation } from "@apollo/client";
import { GET_SPILL_POSTS } from "../utils/queries";
import {
  ADD_SPILL_POST,
  ADD_COMMENT,
  LIKE_SPILL_POST,
  DELETE_COMMENT,
  DELETE_SPILL_POST,
} from "../utils/mutations";
import { useState } from "react";
import {
  Card,
  Button,
  Form,
  Container,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Trash } from "react-bootstrap-icons";

function SpillTheTea() {
  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");

  const { loading, error, data } = useQuery(GET_SPILL_POSTS);

  const [addSpillPost] = useMutation(ADD_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [likeSpillPost] = useMutation(LIKE_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [deleteSpillPost] = useMutation(DELETE_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSpillPost({ variables: { title, content } });
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Failed to post spill", err);
    }
  };

  if (loading) return <p>Loading spills...</p>;
  if (error) return <p>Error loading spills: {error.message}</p>;

  const spillPosts = data?.spillPosts || [];

  return (
    <div
      className="d-flex align-items-start justify-content-center min-vh-100 py-4"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
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
      <Container style={{ position: "relative", zIndex: 1 }}>
        <h1 className="text-center mb-3">🫖 Spill the Tea</h1>
        <p className="text-center mb-4">Share your favorite teas, brewing tips, and more! 🍵🗣</p>

        {/* ➕ Post Form */}
        <Card className="mb-4 shadow">
          <Card.Body>
            <Form onSubmit={handlePostSubmit}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Title of your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  as="textarea"
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={4}
                />
              </Form.Group>
              <Button type="submit" variant="success">
                Post Spill
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {/* 🧵 Spill Posts */}
        {spillPosts.map((post: any) => {
          const hasUserLiked = post.likedBy?.includes(currentUserId);

          return (
            <Card key={post._id} className="mb-4 shadow-sm">
              <Card.Body>
                {post.createdByUsername === currentUsername && (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip id={`tooltip-delete-post-${post._id}`}>
                        Delete Post
                      </Tooltip>
                    }
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="float-end"
                      onClick={async () => {
                        if (window.confirm("Delete this spill?")) {
                          try {
                            await deleteSpillPost({
                              variables: { spillPostId: post._id },
                            });
                          } catch (err) {
                            console.error("Error deleting spill post:", err);
                          }
                        }
                      }}
                      aria-label="Delete Spill Post"
                    >
                      <Trash />
                    </Button>
                  </OverlayTrigger>
                )}

                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  by {post.createdByUsername || "Anonymous"}
                </Card.Subtitle>
                <Card.Text>{post.content}</Card.Text>
                <small className="text-muted">
                  Posted on{" "}
                  {new Date(Number(post.createdAt)).toLocaleString("en-US")}
                </small>

                {/* ❤️ Like Button */}
                <div className="mt-3">
                  <Button
                    variant="outline-danger"
                    size="sm"
                    disabled={hasUserLiked}
                    onClick={() =>
                      !hasUserLiked &&
                      likeSpillPost({
                        variables: { spillPostId: post._id },
                      })
                    }
                  >
                    ❤️ {post.likes || 0} {hasUserLiked ? "Liked" : "Like"}
                  </Button>
                </div>

                {/* 🗣 Comments */}
                <hr />
                <h6 className="fw-bold">Comments:</h6>
                {post.comments?.length ? (
                  post.comments.map((comment: any) => (
                    <Card className="mb-2" key={comment._id}>
                      <Card.Body className="py-2 px-3">
                        <strong>
                          {comment.createdByUsername || "Anonymous"}
                        </strong>
                        <p className="mb-1">{comment.content}</p>
                        <small className="text-muted">
                          {new Date(Number(comment.createdAt)).toLocaleString(
                            "en-US"
                          )}
                        </small>
                        {comment.createdByUsername === currentUsername && (
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip
                                id={`tooltip-delete-comment-${comment._id}`}
                              >
                                Delete Comment
                              </Tooltip>
                            }
                          >
                            <Button
                              variant="outline-danger"
                              size="sm"
                              className="float-end"
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this comment?"
                                  )
                                ) {
                                  await deleteComment({
                                    variables: {
                                      spillPostId: post._id,
                                      commentId: comment._id,
                                    },
                                  });
                                }
                              }}
                              aria-label="Delete Comment"
                            >
                              <Trash />
                            </Button>
                          </OverlayTrigger>
                        )}
                      </Card.Body>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted">
                    No comments yet. Be the first to spill! 🫖
                  </p>
                )}

                {/* ➕ Add Comment */}
                {commentingOn === post._id ? (
                  <Form
                    className="mt-3"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await addComment({
                          variables: {
                            spillPostId: post._id,
                            content: commentContent,
                          },
                        });
                        setCommentContent("");
                        setCommentingOn(null);
                      } catch (err) {
                        console.error("Failed to add comment:", err);
                      }
                    }}
                  >
                    <Form.Group className="mb-2">
                      <Form.Control
                        type="text"
                        placeholder="Write a comment..."
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Button type="submit" size="sm" variant="primary">
                      Post Comment
                    </Button>
                  </Form>
                ) : (
                  <Button
                    className="mt-3"
                    size="sm"
                    variant="secondary"
                    onClick={() => setCommentingOn(post._id)}
                  >
                    🗣 Add Comment
                  </Button>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </Container>
    </div>
  );
}

export default SpillTheTea;
