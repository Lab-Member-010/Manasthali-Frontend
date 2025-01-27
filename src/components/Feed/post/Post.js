// import React, { useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { ToastContainer, toast } from "react-toastify";

// const Post = () => {

//   const [description, setDescription] = useState("");
//   const [media, setMedia] = useState([]);
//   const userId = useSelector((state) => state.user.user._id);
//   const token=useSelector((state) => state.user.token);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("description", description); 
//     formData.append("userId", userId);
//     Array.from(media).forEach((file) => formData.append("media", file)); 

//     try {
//       const response = await axios.post(
//         "http://localhost:3001/posts/posts",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       console.log(response);
      
//       if (response.status === 201) {
//         toast.success("Post created successfully");
//         setDescription("");
//         setMedia([]);  
//       } else {
//         toast.error("error creating post");
//       }
//     } catch (error) {
//       toast.error("Error creating post");
//     }
//   };

//   return (<div className="container d-flex flex-column">
//     <ToastContainer/>
//     <form onSubmit={handleSubmit}>
//       <h1 className="form-control">Create Post</h1>
//       <textarea
//         value={description}
//         onChange={(e) => setDescription(e.target.value)}
//         placeholder="Write a description..."
//         className="form-control"
//       />
//       <input
//         type="file"
//         multiple
//         onChange={(e) => setMedia(e.target.files)}
//         className="form-control"
//       />
//       <button type="submit" className="form-control">Create Post</button>
//     </form>
//     </div>
//   );
// };

// export default Post;  
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

const Post = () => {
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const userId = useSelector((state) => state.user.user._id);
  const token = useSelector((state) => state.user.token);

  // Fetch all posts initially
  const getAllPosts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/all-posts/" + userId, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.posts);
    } catch (error) {
      toast.error("Error fetching posts");
    }
  };

  useEffect(() => {
    getAllPosts(); // Fetch posts when component mounts
  }, []);

  // Create a new post
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
        getAllPosts(); // Refresh posts after new post creation
      } else {
        toast.error("Error creating post");
      }
    } catch (error) {
      toast.error("Error creating post");
    }
  };

  // Like a post
  const handleLike = async (postId) => {
    try {
      // Check if the post is already liked by the user
      const post = posts.find(post => post._id === postId);
      const isLiked = post.likes.includes(userId);

      // Prepare API call based on the like status
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/${isLiked ? "unlike" : "like"}`,
        { userId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        getAllPosts(); // Refresh posts to get updated like count
      }
    } catch (error) {
      toast.error("Error liking/unliking the post");
    }
  };

  // Add a comment to a post
  const handleComment = async (postId) => {
    try {
      const response = await axios.post(
        `http://localhost:3001/post/${postId}/addcomment`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        toast.success("Comment added successfully");
        setNewComment(""); // Clear the comment field
        getAllPosts(); // Refresh posts to get updated comment count
      }
    } catch (error) {
      toast.error("Error adding comment");
    }
  };

  return (
    <div className="container d-flex flex-column">
      <ToastContainer />
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
        <button type="submit" className="form-control">
          Create Post
        </button>
      </form>

      <div>
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="post">
            <h3>{post.userId.username}</h3>
            <p>{post.description}</p>
            {post.media && post.media.map((file, index) => <img key={index} src={file} alt="Post Media" />)}

            {/* Display Like Count and Like Button */}
            <div>
              <button
                onClick={() => handleLike(post._id)}
              >
                {post.likes.includes(userId) ? "Unlike" : "Like"} ({post.likes.length || 0})
              </button>
            </div>

            {/* Display Comment Count */}
            <div>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className="form-control"
              />
              <button onClick={() => handleComment(post._id)}>Comment</button>
            </div>

            {/* Display Comments */}
            <div>
              <h4>Comments ({post.comments.length || 0})</h4>
              {post.comments.map((comment) => (
                <div key={comment._id}>
                  <p>{comment.user_id.username}: {comment.comment}</p>
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
