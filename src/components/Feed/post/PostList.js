// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PostList= () => {
//   const [posts, setPosts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get("http://localhost:3001/post"); // Adjust endpoint as needed
//         setPosts(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching posts:", error);
//         setLoading(false);
//       }
//     };
//     fetchPosts();
//   }, []);

//   if (loading) return <p>Loading posts...</p>;

//   return (
//     <div>
//       <h1>All Posts</h1>
//       <ul>
//         {posts.map((post) => (
//           <li key={post._id}>
//             <p>{post.description}</p>
//             <img src={post.media[0]} alt="Post" style={{ width: "100px" }} />
//             <a href={`/post/${post._id}`}>View Details</a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PostList;

 