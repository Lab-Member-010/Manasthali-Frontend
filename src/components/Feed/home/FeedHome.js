
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Image, Row, Col, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { BiSolidCommentDetail } from "react-icons/bi";
const FeedHome = () => {
  const [posts, setPosts] = useState([]);
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
          { comment: newComment,userId },
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
    <Container className="mt-4 feed-container">
      <ToastContainer />
      <Row>
        {posts.map((post) => (
          <Col key={post._id} sm={12} className="mb-4">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <Image src={post?.userId?.profile_picture || "default-profile.jpg"} roundedCircle width={40} height={40} />
                <span>{post?.userId?.username || "Unknown User"}</span>
              </Card.Header>
              <Card.Body>
                {post.media?.[0] && <Image src={post.media[0]} alt="Post" fluid className="w-100 mb-2" />}
                <p>{post.description}</p>
                <div className="d-flex align-items-center">
                  <Button variant="link" className="p-0 me-2" onClick={() => handleLike(post)}>
                    {post.likes.includes(userId) ? <AiFillHeart size={24} color="red" /> : <AiOutlineHeart size={24} color="black" />}
                  </Button>
                  <span>{post.likes.length} Likes</span>
                  
                  <Button
                      variant="link"
                      className="p-0 ms-3"
                      onClick={() => handleCommentToggle(post._id)}
                    >
                      {activeCommentPost === post._id ? (
                        <BiSolidCommentDetail size={26} color="blue" />
                      ) : (
                        <AiOutlineComment size={26} color="black" />
                      )}
                    </Button>
                  <span>{post.comments.length} Comments</span>
                </div>
                {activeCommentPost === post._id && (
                  <div className="mt-3">
                    <Form.Control value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
                    <Button className="mt-2" onClick={() => handleCommentSubmit(post._id)}>Submit</Button>
                    <div className="mt-3">
                      {post.comments.map((comment, index) => (
                        <div key={index} className="d-flex align-items-start mb-2">
                          <Image src={comment?.user_id?.profile_picture || "default-profile.jpg"} roundedCircle width={30} height={30} />
                          <div className="ms-2">
                            <strong>{comment?.user_id?.username || "Anonymous"}</strong>
                            <p className="mb-1">{comment.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
export default FeedHome;

 