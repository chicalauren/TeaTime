import { useQuery, useMutation } from "@apollo/client";
import { GET_SPILL_POSTS, GET_ME_WITH_FRIENDS } from "../utils/queries";
import { Link } from "react-router-dom";
import {
  ADD_SPILL_POST,
  ADD_COMMENT,
  LIKE_SPILL_POST,
  DELETE_COMMENT,
  DELETE_SPILL_POST,
  EDIT_SPILL_POST,
  EDIT_COMMENT,
  REACT_TO_COMMENT,
} from "../utils/mutations";
import { useState } from "react";
import { OverlayTrigger, Tooltip, Dropdown } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const emojiOptions = ["🌟", "☕️", "🍵", "🌼", "😍", "😂"];

function CommentReactions({ comment, postId, currentUsername, reactToComment }: any) {
  const [showPicker, setShowPicker] = useState(false);

  const userReacted = (emoji: string) => {
    const reaction = comment.reactions?.find((r: any) => r.emoji === emoji);
    return reaction ? reaction.users.includes(currentUsername) : false;
  };

  const emojiCount = (emoji: string) => {
    const reaction = comment.reactions?.find((r: any) => r.emoji === emoji);
    return reaction ? reaction.users.length : 0;
  };

  return (
    <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
      <div className="position-relative">
        <OverlayTrigger overlay={<Tooltip>React to comment</Tooltip>}>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowPicker((prev) => !prev)}
          >
            {showPicker ? "Pick Emoji" : "React"}
          </button>
        </OverlayTrigger>
        {showPicker && (
          <div
            className="reaction-picker-popover"
            style={{
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              padding: 8,
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              zIndex: 10,
              position: "absolute",
              top: "110%",
              left: 0,
              minWidth: 180,
              maxWidth: 260,
              overflowX: "auto",
            }}
          >
            {emojiOptions.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  reactToComment({
                    variables: {
                      spillPostId: postId,
                      commentId: comment._id,
                      emoji,
                    },
                  });
                  setShowPicker(false);
                }}
                className="btn btn-sm"
                style={{ fontSize: "22px" }}
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="d-flex gap-1 flex-wrap" style={{ maxWidth: "100%", overflowX: "hidden" }}>
        {emojiOptions.map((emoji) => {
          const count = emojiCount(emoji);
          const reacted = userReacted(emoji);
          if (count === 0) return null;
          return (
            <OverlayTrigger key={emoji} overlay={<Tooltip>{`React with ${emoji}`}</Tooltip>}>
              <button
                onClick={async () =>
                  await reactToComment({
                    variables: { spillPostId: postId, commentId: comment._id, emoji },
                  })
                }
                className={`btn btn-sm ${reacted ? "btn-warning" : "btn-outline-secondary"}`}
                aria-label={`React with ${emoji}`}
                style={{ minWidth: 48 }}
              >
                {emoji} {count}
              </button>
            </OverlayTrigger>
          );
        })}
      </div>
    </div>
  );
}

function SpillTheTea() {
  const currentUserId = localStorage.getItem("userId");
  const currentUsername = localStorage.getItem("username");

  const { loading, error, data } = useQuery(GET_SPILL_POSTS);
  const { data: meData } = useQuery(GET_ME_WITH_FRIENDS);
  const myFriends = meData?.me?.friends ?? [];
  const isFriend = (username: string) =>
    myFriends.some((f: any) => f.username === username);

  const showFriendLabel = (username: string) =>
    isFriend(username) ? <span className="text-success"> (Friend)</span> : null;

  const [addSpillPost] = useMutation(ADD_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [addComment] = useMutation(ADD_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [likeSpillPost] = useMutation(LIKE_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [editSpillPost] = useMutation(EDIT_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [editComment] = useMutation(EDIT_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [deleteComment] = useMutation(DELETE_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [deleteSpillPost] = useMutation(DELETE_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [reactToComment] = useMutation(REACT_TO_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editPostTitle, setEditPostTitle] = useState("");
  const [editPostContent, setEditPostContent] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");

  const [feedType, setFeedType] = useState<"public" | "friends">("public");

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
  const friendUsernames = myFriends.map((f: any) => f.username);
  const filteredPosts = feedType === "public"
    ? spillPosts
    : spillPosts.filter((post: any) => friendUsernames.includes(post.createdByUsername));

  return (
    <div
      className="position-relative min-vh-100"
      style={{
        backgroundImage: 'url("/your-image.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100%", // This is the key!
        minWidth: 0,
        maxWidth: "100%",
        overflowX: "hidden",
      }}
    >
      {/* White overlay */}
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.75)",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
        }}
      />

      <div className="container py-4" style={{ position: "relative", zIndex: 1 }}>
        <h2 className="text-dark mb-4">🫖 Spill the Tea</h2>
        <div className="mb-4">
          <OverlayTrigger overlay={<Tooltip>View public posts</Tooltip>}>
            <button className={`btn me-2 ${feedType === "public" ? "btn-success" : "btn-outline-dark"}`} onClick={() => setFeedType("public")}>Public Feed</button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>View friends' posts</Tooltip>}>
            <button className={`btn ${feedType === "friends" ? "btn-success" : "btn-outline-dark"}`} onClick={() => setFeedType("friends")}>Friends Feed</button>
          </OverlayTrigger>
        </div>

        <form onSubmit={handlePostSubmit} className="mb-5">
          <input className="form-control mb-2" placeholder="Title of your post" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea className="form-control mb-2" placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} required rows={3} />
          <button type="submit" className="btn btn-success">Post Spill</button>
        </form>

        {filteredPosts.map((post: any) => {
          const hasUserLiked = post.likedBy?.includes(currentUserId);

          return (
            <div key={post._id} className="card mb-4">
              <div className="card-body">
                {editingPostId === post._id ? (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      await editSpillPost({
                        variables: {
                          spillPostId: post._id,
                          title: editPostTitle,
                          content: editPostContent,
                        },
                      });
                      setEditingPostId(null);
                      setEditPostTitle("");
                      setEditPostContent("");
                    }}
                  >
                    <input
                      className="form-control mb-2"
                      value={editPostTitle}
                      onChange={(e) => setEditPostTitle(e.target.value)}
                      required
                    />
                    <textarea
                      className="form-control mb-2"
                      value={editPostContent}
                      onChange={(e) => setEditPostContent(e.target.value)}
                      required
                      rows={3}
                    />
                    <button type="submit" className="btn btn-success btn-sm me-2">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingPostId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h5 className="card-title mb-1">
                          {post.title}
                          <small className="text-muted d-block">
                            by{" "}
                            {post.createdByUsername === currentUsername ? (
                              <span>{post.createdByUsername}</span>
                            ) : (
                              <Link to={`/user/${post.createdByUsername}`}>
                                {post.createdByUsername}
                              </Link>
                            )}
                            {showFriendLabel(post.createdByUsername)}
                          </small>
                        </h5>
                      </div>
                      {post.createdByUsername === currentUsername && (
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="link"
                            bsPrefix="p-0 border-0 bg-transparent"
                            style={{ boxShadow: "none" }}
                            id={`dropdown-post-${post._id}`}
                            aria-label="More options"
                          >
                            <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.5rem", color: "#333" }}></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                setEditingPostId(post._id);
                                setEditPostTitle(post.title);
                                setEditPostContent(post.content);
                              }}
                            >
                              ✏️ Edit Post
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() => deleteSpillPost({ variables: { spillPostId: post._id } })}
                              className="text-danger"
                            >
                              🗑️ Delete Post
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                    <p className="card-text">{post.content}</p>
                  </>
                )}

                <div className="mt-2">
                  <button className="btn btn-outline-danger btn-sm" disabled={hasUserLiked} onClick={() => {
                    if (!hasUserLiked) likeSpillPost({ variables: { spillPostId: post._id } });
                  }}>❤️ {post.likes || 0} {hasUserLiked ? "Liked" : "Like"}</button>
                </div>

                <div className="mt-4">
                  <h6>Comments:</h6>
                  {post.comments?.map((comment: any) => (
                    <div key={comment._id} className="card mb-2">
                      <div className="card-body">
                        {editingCommentId === comment._id ? (
                          <form
                            onSubmit={async (e) => {
                              e.preventDefault();
                              await editComment({
                                variables: {
                                  spillPostId: post._id,
                                  commentId: comment._id,
                                  content: editCommentContent,
                                },
                              });
                              setEditingCommentId(null);
                              setEditCommentContent("");
                            }}
                          >
                            <input
                              className="form-control mb-2"
                              value={editCommentContent}
                              onChange={(e) => setEditCommentContent(e.target.value)}
                              required
                            />
                            <button type="submit" className="btn btn-success btn-sm me-2">
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={() => setEditingCommentId(null)}
                            >
                              Cancel
                            </button>
                          </form>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between align-items-start">
                              <p className="mb-1">
                                <strong>
                                  {comment.createdByUsername === currentUsername ? (
                                    <span>{comment.createdByUsername}</span>
                                  ) : (
                                    <Link to={`/user/${comment.createdByUsername}`}>
                                      {comment.createdByUsername}
                                    </Link>
                                  )}
                                </strong>
                                {showFriendLabel(comment.createdByUsername)}: {comment.content}
                              </p>
                              {comment.createdByUsername === currentUsername && (
                                <Dropdown align="end">
                                  <Dropdown.Toggle
                                    variant="link"
                                    bsPrefix="p-0 border-0 bg-transparent"
                                    style={{ boxShadow: "none" }}
                                    id={`dropdown-comment-${comment._id}`}
                                    aria-label="More options"
                                  >
                                    <i className="bi bi-three-dots-vertical" style={{ fontSize: "1.2rem", color: "#333" }}></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item
                                      onClick={() => {
                                        setEditingCommentId(comment._id);
                                        setEditCommentContent(comment.content);
                                      }}
                                    >
                                      ✏️ Edit Comment
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() => deleteComment({ variables: { spillPostId: post._id, commentId: comment._id } })}
                                      className="text-danger"
                                    >
                                      🗑️ Delete Comment
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              )}
                            </div>
                          </>
                        )}
                        <CommentReactions comment={comment} postId={post._id} currentUsername={currentUsername} reactToComment={reactToComment} />
                      </div>
                    </div>
                  ))}

                  {commentingOn === post._id ? (
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      await addComment({ variables: { spillPostId: post._id, content: commentContent } });
                      setCommentContent("");
                      setCommentingOn(null);
                    }}>
                      <input type="text" className="form-control mb-2" placeholder="Write a comment..." value={commentContent} onChange={(e) => setCommentContent(e.target.value)} required />
                      <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
                    </form>
                  ) : (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => setCommentingOn(post._id)}>🗣 Add Comment</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpillTheTea;