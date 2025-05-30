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



function SpillTheTea() {
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
      //Testing Purposes
      console.log("post time,", new Date().toLocaleString());
    } catch (err) {
      console.error("Failed to post spill", err);
    }
  };

  if (loading) return <p>Loading spills...</p>;
  if (error) return <p>Error loading spills: {error.message}</p>;

  const spillPosts = data?.spillPosts || [];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🫖 Spill the Tea</h1>
      <p>Share your favorite teas, brewing tips, and more! 🍵🗣</p>

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
        {spillPosts.map((post: any) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              backgroundColor: "#fafafa", // TESTING: changed from #fafafa to #72a85a
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              transition: "transform 0.2s ease-in",
            }}
          >
            {/* ✅ Place the delete button here */}
            {post.createdByUsername === localStorage.getItem("username") && (
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
                  marginTop: "0.5rem",
                  fontSize: "14px",
                }}
              >
                🗑 Delete Post
              </button>
            )}
            <h3 style={{ color: "#72a85a", fontWeight: "bold" }}>
              {post.title}
            </h3>
            <p style={{ fontStyle: "italic", color: "#000000" }}>
              by {post.createdByUsername || "Anonymous"}
            </p>
            <p style={{ color: "#72a85a", fontWeight: "bold" }}>
              {post.content}
            </p>
            <p style={{ fontSize: "0.8rem", color: "#777" }}>
              Posted on {new Date(Number(post.createdAt)).toLocaleString('en-US')}
            </p>

            {/* ❤️ Like Button */}
            <button
              onClick={() => {
                console.log("Post liked:", post._id);
                console.log("Post likes:", post.likes);
                console.log("Post comments:", post.comments);
                console.log("Post createdByUsername:", post.createdByUsername);
                console.log("Post createdAt:", post.createdAt);
                console.log("Post content:", post.content);
                console.log("Post title:", post.title);
                likeSpillPost({ variables: { spillPostId: post._id } });
              }}
              style={{ marginTop: "0.5rem", padding: "5px 10px" }}
            >
              ❤️ {post.likes || 0} Likes
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
                      alignSelf: "flex-start",
                      maxWidth: "75%",
                      opacity: 1,
                      animation: "fadeIn 0.5s ease forwards",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {comment.createdByUsername || "Anonymous"}
                    </p>
                    <p style={{ margin: "5px 0" }}>{comment.content}</p>
                    <small style={{ color: "#777" }}>
                      {new Date(Number(comment.createdAt)).toLocaleString('en-US')}
                    </small>
                    {/* 🗑 Delete Button */}
                    {comment.createdByUsername ===
                      localStorage.getItem("username") && (
                      <button
                        onClick={async () => {
                          const confirmed = window.confirm(
                            "Are you sure you want to delete this comment?"
                          );
                          if (confirmed) {
                            try {
                              console.log("Deleting comment with", {
                                spillPostId: post._id,
                                commentId: comment._id,
                              });
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
                    console.log("Adding comment with variables:", {
                      spillPostId: post._id,
                      content: commentContent,
                    });
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
        ))}
      </div>
    </div>
  );
}

export default SpillTheTea;
