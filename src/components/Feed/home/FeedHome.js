import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BiSolidCommentDetail } from "react-icons/bi";
import { RiSendPlaneFill } from "react-icons/ri";
import styles from "./FeedHome.module.css";

const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  console.log(posts)
  const [newComment, setNewComment] = useState("");
  const [activeCommentPost, setActiveCommentPost] = useState(null);

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);
  useEffect(() => {
    if (userId && token) {
      axios
        .get(`http://localhost:3001/posts/all-posts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const fetchedPosts = response.data.posts || [];


          const likedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
          const updatedPosts = fetchedPosts.map((post) => {
            const likedPost = likedPosts.find((lp) => lp.id === post._id);
            return likedPost ? { ...post, likes: likedPost.likes } : post;
          });

          setPosts(updatedPosts);
        })
        .catch((error) => toast.error(error.response?.data?.message || "Error fetching posts"));
    }
  }, [userId, token]);
  const handleLike = async (post) => {
    try {
      const likeAction = post.likes.includes(userId) ? "unlike" : "like";


      const updatedPosts = posts.map((p) =>
        p._id === post._id
          ? {
            ...p,
            likes: likeAction === "like" ? [...p.likes, userId] : p.likes.filter((id) => id !== userId),
          }
          : p
      );
      setPosts(updatedPosts);

      localStorage.setItem("likedPosts", JSON.stringify(updatedPosts.map((p) => ({ id: p._id, likes: p.likes }))));


      await axios.post(`http://localhost:3001/posts/posts/${post._id}/${likeAction}`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (error) {
      toast.error("Error updating like status");
    }
  };


  const handleCommentToggle = (postId) => {
    console.log(postId)
    setActiveCommentPost(activeCommentPost === postId ? null : postId);
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        await axios.post(
          `http://localhost:3001/comments/addComment/${postId}`,
          { comment: newComment, userId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Comment added successfully");
        setNewComment("");

        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === postId ? { ...p, comments: [...p.comments, { user_id: { username: "You" }, comment: newComment }] } : p
          )
        );
      } catch (error) {
        toast.error("Error adding comment");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center feedContainer">
      <ToastContainer />
      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-12 mb-4">
            <div className="postCard card">
              <div className={styles.cardHeader}>
                <img src={post?.userId?.profile_picture || "default-profile.jpg"} alt="Profile" className={styles.roundedProfile}/>
                <span className="userName">{post?.userId?.username || "Unknown User"}</span>
              </div>
              <div className="card-body cardBody">
                <p className={styles.postDescription}>{post.description}</p>
                {post.media?.[0] && <img src={post.media[0]} alt="Post" className="postImage" />}
                <div className=" likeCommentShareButton d-flex align-items-center">
                  <button className={styles.likeButton} onClick={() => handleLike(post)}>
                    {post.likes.includes(userId) ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="black" />}
                  </button>
                  <span>{post.likes.length} Likes</span>
                  <button
                    className={styles.commentButton}
                    onClick={() => handleCommentToggle(post._id)}
                  >
                    {activeCommentPost === post._id ? (
                      <BiSolidCommentDetail size={26} color="blue" />
                    ) : (
                      <AiOutlineComment size={26} color="black" />
                    )}
                  </button>
                  <span>{post.comments.length} Comments</span>
                  <button className={styles.shareButton} style={{ background: "none", border: "none", padding: 0 }}>
                      <RiSendPlaneFill size={24} color="black" />
                  </button>
                  <span>Share</span>
                </div>
                  <div className={styles.commentTextbox}>
                    <input
                      type="text"
                      className={styles.commentTextField}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                    />
                    <span><button className={styles.commentPostButton} onClick={() => handleCommentSubmit(post._id)}>Post</button></span>
                  </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

  );
};
export default FeedHome;
























 