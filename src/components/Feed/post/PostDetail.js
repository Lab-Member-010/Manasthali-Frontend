// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const PostDetail = ({ match }) => {
// //   const { id } = match.params;
// //   const [post, setPost] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [comment, setComment] = useState("");

// //   useEffect(() => {
// //     const fetchPost = async () => {
// //       try {
// //         const response = await axios.get(`/posts/${id}`);
// //         setPost(response.data.postbyId);
// //         setLoading(false);
// //       } catch (error) {
// //         console.error("Error fetching post details:", error);
// //         setLoading(false);
// //       }
// //     };
// //     fetchPost();
// //   }, [id]);

// //   const handleCommentSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await axios.post(`/posts/${id}/comments`, { text: comment });
// //       setComment("");
// //       alert("Comment added successfully");
// //     } catch (error) {
// //       console.error("Error adding comment:", error);
// //     }
// //   };

// //   if (loading) return <p>Loading post details...</p>;

// //   return (
// //     <div>
// //       <h1>Post Details</h1>
// //       <p>{post.description}</p>
// //       {post.media.map((url, index) => (
// //         <img key={index} src={url} alt={`Post ${index}`} style={{ width: "200px" }} />
// //       ))}
// //       <p>Likes: {post.likes.length}</p>
// //       <form onSubmit={handleCommentSubmit}>
// //         <input
// //           type="text"
// //           value={comment}
// //           onChange={(e) => setComment(e.target.value)}
// //           placeholder="Add a comment"
// //         />
// //         <button type="submit">Submit</button>
// //       </form>
// //     </div>
// //   );
// // };

// // export default PostDetail;

// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PostDetail = ({ match }) => {
//   const { id } = match.params;
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [comment, setComment] = useState("");
//   const [likesCount, setLikesCount] = useState(0);
//   const [comments, setComments] = useState([]);

//   useEffect(() => {
//     const fetchPost = async () => {
//       try {
//         const response = await axios.get(`/posts/${id}`);
//         const postData = response.data.postbyId;
//         setPost(postData);
//         setLikesCount(postData.likes.length);
//         setComments(postData.comments);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching post details:", error);
//         setLoading(false);
//       }
//     };
//     fetchPost();
//   }, [id]);

//   const handleLike = async () => {
//     try {
//       const response = await axios.post(`/posts/${id}/like`);
//       setLikesCount(response.data.likeCount);
//     } catch (error) {
//       console.error("Error liking the post:", error);
//     }
//   };

//   const handleCommentSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(`/posts/${id}/comments`, { text: comment });
//       setComments([...comments, response.data.comment]);
//       setComment("");
//     } catch (error) {
//       console.error("Error adding comment:", error);
//     }
//   };

//   if (loading) return <p>Loading post details...</p>;

//   return (
//     <div>
//       <h1>Post Details</h1>
//       <p>{post.description}</p>
//       {post.media.map((url, index) => (
//         <img key={index} src={url} alt={`Post ${index}`} style={{ width: "200px" }} />
//       ))}
//       <div>
//         <p>Likes: {likesCount}</p>
//         <button onClick={handleLike}>Like</button>
//       </div>
//       <form onSubmit={handleCommentSubmit}>
//         <input
//           type="text"
//           value={comment}
//           onChange={(e) => setComment(e.target.value)}
//           placeholder="Add a comment"
//         />
//         <button type="submit">Submit</button>
//       </form>
//       <h2>Comments</h2>
//       <ul>
//         {comments.map((c, index) => (
//           <li key={index}>{c.text}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PostDetail;
 