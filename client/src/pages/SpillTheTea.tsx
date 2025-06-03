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

const emojiOptions = ["🌟", "☕️", "🍵", "🌼", "😍", "😂"];

function CommentReactions({
  comment,
  postId,
  currentUsername,
  reactToComment,
}: {
  comment: any;
  postId: string;
  currentUsername: string | null;
  reactToComment: any;
}) {
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
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
      {/* React Button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          style={{
            background: "#f0f0f0",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            padding: "4px 10px",
            fontWeight: 600,
          }}
        >
          {showPicker ? "Pick Emoji" : "React"}
        </button>
        {/* Emoji Picker Dropdown */}
        {showPicker && (
          <div
            style={{
              position: "absolute",
              top: "110%",
              left: 0,
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              zIndex: 10,
              padding: 6,
              display: "flex",
              gap: 6,
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
                style={{
                  fontSize: 22,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 2,
                }}
                aria-label={`React with ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Display selected emojis with counts */}
      {emojiOptions.map((emoji) => {
        const count = emojiCount(emoji);
        const reacted = userReacted(emoji);
        if (count === 0) return null;
        return (
          <button
            key={emoji}
            onClick={async () =>
              await reactToComment({
                variables: {
                  spillPostId: postId,
                  commentId: comment._id,
                  emoji,
                },
              })
            }
            style={{
              margin: "0 2px",
              background: reacted ? "#ffe082" : "#f0f0f0",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: reacted ? "bold" : "normal",
              fontSize: 18,
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 8px",
            }}
            aria-label={`React with ${emoji}`}
          >
            {emoji} <span style={{ marginLeft: 2 }}>{count}</span>
          </button>
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

  // Helper to check if a username is a friend
  const isFriend = (username: string) =>
    myFriends.some((f: any) => f.username === username);

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
  const [reactToComment] = useMutation(REACT_TO_COMMENT, {
    refetchQueries: [{ query: GET_SPILL_POSTS }],
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentingOn, setCommentingOn] = useState<string | null>(null);

  // Feed toggle state
  const [feedType, setFeedType] = useState<"public" | "friends">("public");

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addSpillPost({ variables: { title, content } });
      setTitle("");
      setContent("");
      console.log("post time,", new Date().toLocaleString());
    } catch (err) {
      console.error("Failed to post spill", err);
    }
  };

  if (loading) return <p>Loading spills...</p>;
  if (error) return <p>Error loading spills: {error.message}</p>;

  const spillPosts = data?.spillPosts || [];
  const friendUsernames = myFriends.map((f: any) => f.username);

  // Filter posts for feed type
  const filteredPosts =
    feedType === "public"
      ? spillPosts
      : spillPosts.filter((post: any) =>
          friendUsernames.includes(post.createdByUsername)
        );

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🫖 Spill the Tea</h1>
      <p>Share your favorite teas, brewing tips, and more! 🍵🗣</p>

      {/* Feed Toggle */}
      <div style={{ marginBottom: "1rem" }}>
        <button
          onClick={() => setFeedType("public")}
          style={{
            marginRight: 8,
            background: feedType === "public" ? "#72a85a" : "#e0e0e0",
            color: feedType === "public" ? "#fff" : "#333",
            border: "none",
            borderRadius: 4,
            padding: "6px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Public Feed
        </button>
        <button
          onClick={() => setFeedType("friends")}
          style={{
            background: feedType === "friends" ? "#72a85a" : "#e0e0e0",
            color: feedType === "friends" ? "#fff" : "#333",
            border: "none",
            borderRadius: 4,
            padding: "6px 18px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Friends Feed
        </button>
      </div>

      {/* ➕ Post a Spill Form */}
      <form
        onSubmit={handlePostSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          placeholder="Title of your post"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px", minHeight: "100px" }}
        />
        <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
          Post Spill
        </button>
      </form>

      {/* 🧵 Spill Posts */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {filteredPosts.length === 0 ? (
          <p style={{ color: "#888" }}>
            {feedType === "friends"
              ? "No posts from your friends yet."
              : "No posts yet."}
          </p>
        ) : (
          filteredPosts.map((post: any) => {
            const hasUserLiked = post.likedBy?.includes(currentUserId);

            return (
              <div
                key={post._id}
                style={{
                  border: "1px solid #72a85a",
                  borderRadius: "12px",
                  padding: "1rem",
                  backgroundColor: "#f0fff0",
                }}
              >
                {/* Delete button only if post is by current user */}
                {post.createdByUsername === currentUsername && (
                  <button
                    onClick={async () => {
                      const confirmed = window.confirm("Delete this spill?");
                      if (confirmed) {
                        try {
                          await deleteSpillPost({
                            variables: { spillPostId: post._id },
                          });
                        } catch (err) {
                          console.error("Error deleting spill post:", err);
                          alert("Failed to delete post.");
                        }
                      }
                    }}
                    style={{
                      backgroundColor: "#d32f2f",
                      color: "#fff",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      marginBottom: "0.5rem",
                      fontSize: "14px",
                      float: "right",
                    }}
                    aria-label="Delete Spill Post"
                  >
                    🗑 Delete Post
                  </button>
                )}

                <h3 style={{ color: "#72a85a", fontWeight: "bold" }}>
                  {post.title}
                </h3>
                <p style={{ fontStyle: "italic", color: "#000000" }}>
                  by {post.createdByUsername === currentUsername ? (
                    post.createdByUsername || "Anonymous"
                  ) : (
                    <Link to={`/user/${post.createdByUsername}`}>
                      {post.createdByUsername || "Anonymous"}
                    </Link>
                  )}
                </p>
                <p style={{ color: "#72a85a", fontWeight: "bold" }}>
                  {post.content}
                </p>
                <p style={{ fontSize: "0.8rem", color: "#777" }}>
                  Posted on{" "}
                  {new Date(Number(post.createdAt)).toLocaleString("en-US")}
                </p>

                {/* ❤️ Like Button */}
                <button
                  onClick={() => {
                    if (!hasUserLiked) {
                      likeSpillPost({ variables: { spillPostId: post._id } });
                    }
                  }}
                  disabled={hasUserLiked}
                  style={{
                    marginTop: "0.5rem",
                    padding: "5px 10px",
                    cursor: hasUserLiked ? "not-allowed" : "pointer",
                    opacity: hasUserLiked ? 0.6 : 1,
                  }}
                  aria-label={hasUserLiked ? "Unlike" : "Like"}
                >
                  ❤️ {post.likes || 0} {hasUserLiked ? "Unlike" : "Like"}
                </button>

                {/* 🗣 Comments Section */}
                <div style={{ marginTop: "1rem" }}>
                  <h4
                    style={{
                      marginBottom: "0.5rem",
                      color: "#72a85a",
                      fontWeight: "bold",
                    }}
                  >
                    Comments:
                  </h4>

                  {post.comments?.length > 0 ? (
                    post.comments.map((comment: any) => (
                      <div
                        key={comment._id}
                        style={{
                          backgroundColor: "#e0f7fa",
                          borderRadius: "12px",
                          padding: "10px",
                          marginBottom: "0.5rem",
                          maxWidth: "75%",
                          animation: "fadeIn 0.5s ease forwards",
                        }}
                      >
                        <p style={{ margin: 0, fontWeight: "bold" }}>
                          {comment.createdByUsername === currentUsername ? (
                            comment.createdByUsername || "Anonymous"
                          ) : (
                            <Link to={`/user/${comment.createdByUsername}`}>
                              {comment.createdByUsername || "Anonymous"}
                              {isFriend(comment.createdByUsername) && (
                                <span style={{ color: "#72a85a", fontWeight: 500 }}> (Friend) </span>
                              )}
                            </Link>
                          )}
                        </p>
                        <p style={{ margin: "5px 0" }}>{comment.content}</p>
                        <small style={{ color: "#777" }}>
                          {new Date(Number(comment.createdAt)).toLocaleString(
                            "en-US"
                          )}
                        </small>
                        {/* Emoji Reactions as React Button */}
                        <CommentReactions
                          comment={comment}
                          postId={post._id}
                          currentUsername={currentUsername}
                          reactToComment={reactToComment}
                        />
                        {/* Delete comment button */}
                        {comment.createdByUsername === currentUsername && (
                          <button
                            onClick={async () => {
                              const confirmed = window.confirm(
                                "Are you sure you want to delete this comment?"
                              );
                              if (confirmed) {
                                try {
                                  await deleteComment({
                                    variables: {
                                      spillPostId: post._id,
                                      commentId: comment._id,
                                    },
                                  });
                                } catch (err) {
                                  console.error("Error deleting comment:", err);
                                  alert("Failed to delete comment.");
                                }
                              }
                            }}
                            style={{
                              marginTop: "5px",
                              backgroundColor: "red",
                              color: "white",
                              border: "none",
                              padding: "5px 8px",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "12px",
                            }}
                            aria-label="Delete Comment"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: "0.9rem", color: "#777" }}>
                      No comments yet. Be the first to spill! 🫖
                    </p>
                  )}
                </div>

                {/* ➕ Add Comment Form */}
                {commentingOn === post._id ? (
                  <form
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
                    style={{
                      marginTop: "1rem",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.5rem",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      required
                      style={{ padding: "10px", fontSize: "16px" }}
                    />
                    <button type="submit" style={{ padding: "8px 12px" }}>
                      Post Comment
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setCommentingOn(post._id)}
                    style={{ marginTop: "1rem", padding: "5px 10px" }}
                  >
                    🗣 Add Comment
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default SpillTheTea;
