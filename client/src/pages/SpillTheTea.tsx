// ...imports remain unchanged
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
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const emojiOptions = ["🌟", "☕️", "🍵", "🌼", "😍", "😂"];

function CommentReactions({
  comment,
  postId,
  currentUsername,
  reactToComment,
}: any) {
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
          <OverlayTrigger
            key={emoji}
            overlay={<Tooltip>{`React with ${emoji}`}</Tooltip>}
          >
            <button
              onClick={async () =>
                await reactToComment({
                  variables: {
                    spillPostId: postId,
                    commentId: comment._id,
                    emoji,
                  },
                })
              }
              className={`btn btn-sm ${
                reacted ? "btn-warning" : "btn-outline-secondary"
              }`}
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

  // Apply isFriend usage to label comments from friends
  const showFriendLabel = (username: string) =>
    isFriend(username) ? <span className="text-success"> (Friend)</span> : null;

  const [addSpillPost] = useMutation(ADD_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [addComment] = useMutation(ADD_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [likeSpillPost] = useMutation(LIKE_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [editSpillPost] = useMutation(EDIT_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [editComment] = useMutation(EDIT_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [deleteComment] = useMutation(DELETE_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [deleteSpillPost] = useMutation(DELETE_SPILL_POST, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });
  const [reactToComment] = useMutation(REACT_TO_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });

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
  const filteredPosts =
    feedType === "public"
      ? spillPosts
      : spillPosts.filter((post: any) =>
          friendUsernames.includes(post.createdByUsername)
        );

  return (
    <div className="text-light min-vh-100">
      <div className="container py-4">
        <h2 className="text-light mb-4">🫖 Spill the Tea</h2>
        <div className="mb-4">
          <OverlayTrigger overlay={<Tooltip>View public posts</Tooltip>}>
            <button
              className={`btn me-2 ${
                feedType === "public" ? "btn-success" : "btn-outline-light"
              }`}
              onClick={() => setFeedType("public")}
            >
              Public Feed
            </button>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip>View friends' posts</Tooltip>}>
            <button
              className={`btn ${
                feedType === "friends" ? "btn-success" : "btn-outline-light"
              }`}
              onClick={() => setFeedType("friends")}
            >
              Friends Feed
            </button>
          </OverlayTrigger>
        </div>

        <form onSubmit={handlePostSubmit} className="mb-5">
          <input
            className="form-control mb-2"
            placeholder="Title of your post"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            className="form-control mb-2"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
          />
          <button type="submit" className="btn btn-success">
            Post Spill
          </button>
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
                    <button
                      type="submit"
                      className="btn btn-success btn-sm me-2"
                    >
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
                    <h5 className="card-title">
                      {post.title}
                      <small className="text-muted d-block">
                        by {post.createdByUsername}
                        {showFriendLabel(post.createdByUsername)}
                      </small>
                    </h5>
                    <p className="card-text">{post.content}</p>
                    {post.createdByUsername === currentUsername && (
                      <>
                        <button
                          className="btn btn-outline-warning btn-sm me-2"
                          onClick={() => {
                            setEditingPostId(post._id);
                            setEditPostTitle(post.title);
                            setEditPostContent(post.content);
                          }}
                        >
                          ✏️ Edit Post
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() =>
                            deleteSpillPost({
                              variables: { spillPostId: post._id },
                            })
                          }
                        >
                          🗑️ Delete Post
                        </button>
                        <h3 style={{ color: "#72a85a", fontWeight: "bold" }}>
                          {post.title}
                        </h3>
                        <p style={{ fontStyle: "italic", color: "#000000" }}>
                          by{" "}
                          {post.createdByUsername === currentUsername ? (
                            post.createdByUsername || "Anonymous"
                          ) : (
                            <Link to={`/user/${post.createdByUsername}`}>
                              {post.createdByUsername || "Anonymous"}
                            </Link>
                          )}
                        </p>
                      </>
                    )}
                  </>
                )}

                <div className="mt-2">
                  <button
                    className="btn btn-outline-danger btn-sm"
                    disabled={hasUserLiked}
                    onClick={() => {
                      if (!hasUserLiked)
                        likeSpillPost({ variables: { spillPostId: post._id } });
                    }}
                  >
                    ❤️ {post.likes || 0} {hasUserLiked ? "Liked" : "Like"}
                  </button>
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
                              onChange={(e) =>
                                setEditCommentContent(e.target.value)
                              }
                              required
                            />
                            <button
                              type="submit"
                              className="btn btn-success btn-sm me-2"
                            >
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
                            <p className="mb-1">
                              {comment.content}
                              {showFriendLabel(comment.createdByUsername)}
                            </p>
                            {comment.createdByUsername === currentUsername && (
                              <>
                                <button
                                  className="btn btn-outline-warning btn-sm me-2"
                                  onClick={() => {
                                    setEditingCommentId(comment._id);
                                    setEditCommentContent(comment.content);
                                  }}
                                >
                                  ✏️ Edit Comment
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    deleteComment({
                                      variables: {
                                        spillPostId: post._id,
                                        commentId: comment._id,
                                      },
                                    })
                                  }
                                >
                                  🗑️ Delete Comment
                                </button>
                              </>
                            )}
                          </>
                        )}
                        <CommentReactions
                          comment={comment}
                          postId={post._id}
                          currentUsername={currentUsername}
                          reactToComment={reactToComment}
                        />
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
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => setCommentingOn(post._id)}
                    >
                      🗣 Add Comment
                    </button>
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
