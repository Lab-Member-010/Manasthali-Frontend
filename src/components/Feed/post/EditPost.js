import React, { useState, useEffect } from "react";
import axios from "axios";

const EditPost = ({ match }) => {
  const { id } = match.params;
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/posts/${id}`);
        setDescription(response.data.postbyId.description);
        setMedia(response.data.postbyId.media);
      } catch (error) {
        console.error("Error fetching post for edit:", error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = { description };

    try {
      await axios.put(`/posts/${id}`, updatedData);
      alert("Post updated successfully");
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Post</h1>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Edit description..."
      />
      <button type="submit">Update Post</button>
    </form>
  );
};

export default EditPost;