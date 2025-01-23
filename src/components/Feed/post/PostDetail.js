import React, { useEffect, useState } from "react";
import axios from "axios";

const PostDetail = ({ match }) => {
  const { id } = match.params;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setPost(response.data.postbyId);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post details:", error);
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/posts/${id}/comments`, { text: comment });
      setComment("");
      alert("Comment added successfully");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <p>Loading post details...</p>;

  return (
    <div>
      <h1>Post Details</h1>
      <p>{post.description}</p>
      {post.media.map((url, index) => (
        <img key={index} src={url} alt={`Post ${index}`} style={{ width: "200px" }} />
      ))}
      <p>Likes: {post.likes.length}</p>
      <form onSubmit={handleCommentSubmit}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostDetail;