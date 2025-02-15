import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import styles from "./Post.module.css";

const Post = () => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const userId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("description", description);
    formData.append("userId", userId);
    console.log(formData)
    Array.from(media).forEach((file) => formData.append("media", file));

    try {
      const response = await axios.post(
        "https://manasthali-backend.onrender.com/posts/posts",
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
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      toast.error("Error creating post");
    }
  };

  return (
    <div className={`${styles.container} mt-5 border card`}>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <div>
          <center><h1 className="text-dark mb-3">Create Post</h1></center>
        </div>
        <div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a description..."
            className="form-control mb-3"
          />
        </div>
        <div>                   
          <input
            type="file"
            multiple
            onChange={(e) => setMedia(e.target.files)}
            className="form-control mb-3"
          />
        </div>
        <div>
          <button type="submit" className={`form-control mb-3 ${styles.createPost}`}>Create Post</button>
        </div>
      </form>
    </div>
  );
};

export default Post;
