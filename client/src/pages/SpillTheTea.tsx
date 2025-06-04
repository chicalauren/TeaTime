import { useQuery, useMutation } from "@apollo/client";
import { GET_SPILL_POSTS, GET_ME_WITH_FRIENDS } from "../utils/queries";
import { Link } from "react-router-dom";
import {
  ADD_SPILL_POST,
  ADD_COMMENT,
  LIKE_SPILL_POST,
  DELETE_COMMENT,
  DELETE_SPILL_POST,
  REACT_TO_COMMENT,
} from "../utils/mutations";
import { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
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
    <div className="d-flex align-items-center gap-2 mt-2">
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
          <div className="position-absolute bg-white border rounded shadow-sm p-2 d-flex gap-2 z-3">
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
            >
              {emoji} {count}
            </button>
          </OverlayTrigger>
        );
      })}
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

  const [addSpillPost] = useMutation(ADD_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [addComment] = useMutation(ADD_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [likeSpillPost] = useMutation(LIKE_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [deleteComment] = useMutation(DELETE_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [deleteSpillPost] = useMutation(DELETE_SPILL_POST, { refetchQueries: [{ query: GET_SPILL_POSTS }] });
  const [reactToComment] = useMutation(REACT_TO_COMMENT, { refetchQueries: [{ query: GET_SPILL_POSTS }] });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
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
      className="text-light min-vh-100"
      style={{
        backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/tea-background.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        width: "100%",
      }}
    >

      <div className="container py-4">
        <h1 className="mb-2">🫖 Spill the Tea</h1>
        <p className="text-light">Share your favorite teas, brewing tips, and more! 🍵🗣</p>

        <div className="mb-4">
          <OverlayTrigger overlay={<Tooltip>View public posts</Tooltip>}>
            <button
              className={`btn me-2 ${feedType === "public" ? "btn-success" : "btn-outline-light"}`}
              onClick={() => setFeedType("public")}
            >
              Public Feed
            </button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>View friends' posts</Tooltip>}>
            <button
              className={`btn ${feedType === "friends" ? "btn-success" : "btn-outline-light"}`}
              onClick={() => setFeedType("friends")}
            >
              Friends Feed
            </button>
          </OverlayTrigger>
        </div>

        <form onSubmit={handlePostSubmit} className="mb-5">
          <div className="mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Title of your post"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>
          <OverlayTrigger overlay={<Tooltip>Submit your spill</Tooltip>}>
            <button type="submit" className="btn btn-success">
              Post Spill
            </button>
          </OverlayTrigger>
        </form>

        {filteredPosts.length === 0 ? (
          <p className="text-light">
            {feedType === "friends" ? "No posts from your friends yet." : "No posts yet."}
          </p>
        ) : (
          filteredPosts.map((post: any) => {
            const hasUserLiked = post.likedBy?.includes(currentUserId);

            return (
              <div key={post._id} className="card shadow-sm mb-4 border-success">
                <div className="card-body bg-light">
                  {post.createdByUsername === currentUsername && (
                    <OverlayTrigger overlay={<Tooltip>Delete this post</Tooltip>}>
                      <button
                        onClick={async () => {
                          if (window.confirm("Delete this spill?")) {
                            await deleteSpillPost({ variables: { spillPostId: post._id } });
                          }
                        }}
                        className="btn btn-danger btn-sm float-end"
                        aria-label="Delete post"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </OverlayTrigger>
                  )}

                  <h5 className="card-title text-success fw-bold">{post.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    by {post.createdByUsername === currentUsername ? post.createdByUsername : (
                      <Link to={`/user/${post.createdByUsername}`}>{post.createdByUsername}</Link>
                    )}
                  </h6>
                  <p className="card-text text-dark">{post.content}</p>
                  <small className="text-muted">
                    Posted on {new Date(Number(post.createdAt)).toLocaleString()}
                  </small>

                  <div className="mt-3">
                    <OverlayTrigger overlay={<Tooltip>Like this post</Tooltip>}>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          if (!hasUserLiked) {
                            likeSpillPost({ variables: { spillPostId: post._id } });
                          }
                        }}
                        disabled={hasUserLiked}
                        aria-label="Like post"
                      >
                        ❤️ {post.likes || 0} {hasUserLiked ? "Liked" : "Like"}
                      </button>
                    </OverlayTrigger>
                  </div>

                  <div className="mt-4">
                    <h6 className="text-success">Comments:</h6>
                    {post.comments?.map((comment: any) => (
                      <div key={comment._id} className="card mb-2 bg-white border-info">
                        <div className="card-body py-2 px-3">
                          <p className="fw-bold mb-1">
                            {comment.createdByUsername === currentUsername ? (
                              comment.createdByUsername
                            ) : (
                              <Link to={`/user/${comment.createdByUsername}`}>
                                {comment.createdByUsername}
                                {isFriend(comment.createdByUsername) && (
                                  <span className="text-success"> (Friend)</span>
                                )}
                              </Link>
                            )}
                          </p>
                          <p className="mb-1">{comment.content}</p>
                          <small className="text-muted">
                            {new Date(Number(comment.createdAt)).toLocaleString()}
                          </small>
                          <CommentReactions
                            comment={comment}
                            postId={post._id}
                            currentUsername={currentUsername}
                            reactToComment={reactToComment}
                          />
                          {comment.createdByUsername === currentUsername && (
                            <button
                              onClick={() =>
                                deleteComment({
                                  variables: {
                                    spillPostId: post._id,
                                    commentId: comment._id,
                                  },
                                })
                              }
                              className="btn btn-danger btn-sm mt-2"
                              aria-label="Delete Comment"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {commentingOn === post._id ? (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          await addComment({
                            variables: {
                              spillPostId: post._id,
                              content: commentContent,
                            },
                          });
                          setCommentContent("");
                          setCommentingOn(null);
                        }}
                        className="mt-3"
                      >
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Write a comment..."
                          value={commentContent}
                          onChange={(e) => setCommentContent(e.target.value)}
                          required
                        />
                        <button type="submit" className="btn btn-primary btn-sm">
                          Post Comment
                        </button>
                      </form>
                    ) : (
                      <button
                        onClick={() => setCommentingOn(post._id)}
                        className="btn btn-outline-primary btn-sm mt-3"
                      >
                        🗣 Add Comment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SpillTheTea;
