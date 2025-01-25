import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Post = () => {

  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const userId = useSelector((state) => state.user.user._id);
  const token=useSelector((state) => state.user.token);

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
      console.log(response);
      
      if (response.status === 201) {
        toast.success("Post created successfully");
        setDescription("");
        setMedia([]);  
      } else {
        toast.error("error creating post");
      }
    } catch (error) {
      toast.error("Error creating post");
    }
  };

  return (<div className="container d-flex flex-column">
    <ToastContainer/>
    <form onSubmit={handleSubmit}>
      <h1 className="form-control">Create Post</h1>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Write a description..."
        className="form-control"
      />
      <input
        type="file"
        multiple
        onChange={(e) => setMedia(e.target.files)}
        className="form-control"
      />
      <button type="submit" className="form-control">Create Post</button>
    </form>
    </div>
  );
};

export default Post;  