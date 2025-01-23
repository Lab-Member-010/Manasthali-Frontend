import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const Post = () => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const userId=useSelector((store)=>store.user.user._id)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    Array.from(media).forEach((file) => formData.append("media", file));

    try {
      await axios.post("http://localhost:3001/posts/posts", {userId,formData}, { // Updated the URL to /posts
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully");
      setDescription("");
      setMedia([]);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
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
  );
};

export default Post;
