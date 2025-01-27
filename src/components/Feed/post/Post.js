import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Post = () => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({}); // Local state for each post's comments
  const userId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);

  const getAllPosts = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/all-posts/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPosts(response.data.posts);
    } catch (error) {
      toast.error("Error fetching posts");
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("userId", userId);
    Array.from(media).forEach((file) => formData.append("media", file));

    try {
      const response = await axios.post(
        "http://localhost:3001/posts/posts",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 201) {
        toast.success("Post created successfully");
        setDescription("");
        setMedia([]);
        getAllPosts();
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      toast.error("Error creating post");
    }
  };

  const handleLike = async (postId) => {
    try {
      const post = posts.find((post) => post._id === postId);
      const isLiked = post.likes.includes(userId);

      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/${isLiked ? "unlike" : "like"}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const updatedPosts = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: isLiked
                  ? p.likes.filter((id) => id !== userId)
                  : [...p.likes, userId],
              }
            : p
        );
        setPosts(updatedPosts);
      }
    } catch (error) {
      toast.error("Error liking/unliking the post");
    }
  };

  const handleComment = async (postId) => {
    const newComment = comments[postId]?.trim();
    if (!newComment) {
      toast.error("Please write a comment.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/post/${postId}/addcomment`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 201) {
        toast.success("Comment added successfully");
        setComments((prev) => ({ ...prev, [postId]: "" })); // Clear comment input
        getAllPosts();
      }
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  return (
    <div className="container d-flex flex-column">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <h1>Create Post</h1>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a description..."
        />
        <input
          type="file"
          multiple
          onChange={(e) => setMedia(e.target.files)}
        />
        <button type="submit">Create Post</button>
      </form>

      <div>
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h3>{post.userId.username}</h3>
            <p>{post.description}</p>
            {post.media &&
              post.media.map((file, index) => (
                <img key={index} src={file} alt="Post Media" />
              ))}

            <div>
              <button onClick={() => handleLike(post._id)}>
                {post.likes.includes(userId) ? "Unlike" : "Like"} (
                {post.likes.length})
              </button>
            </div>

            <div>
              <textarea
                value={comments[post._id] || ""}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [post._id]: e.target.value,
                  }))
                }
                placeholder="Add a comment"
              />
              <button onClick={() => handleComment(post._id)}>Comment</button>
            </div>

            <div>
              <h4>Comments ({post.comments.length || 0})</h4>
              {post.comments.map((comment) => (
                <div key={comment._id}>
                  <p>
                    {comment.user_id?.username || "Unknown"}: {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
