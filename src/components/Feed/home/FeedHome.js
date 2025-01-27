import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Image, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState(""); // State for the new comment
  const [commentForPost, setCommentForPost] = useState(null); // Store post id for comment
  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);

  useEffect(() => {
    if (userId && token) {
      axios
        .get(`http://localhost:3001/posts/all-posts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
        })
        .catch((error) => {
          const errorMsg = error.response?.data?.message || error.message || "Error fetching posts";
          toast.error(errorMsg);
        });
    }
  }, [userId, token]);

  const handleLike = (postId) => {
    const updatedPosts = posts.map((post) =>
      post._id === postId
        ? {
            ...post,
            likes: post.likes.includes(userId)
              ? post.likes.filter((id) => id !== userId)
              : [...post.likes, userId],
          }
        : post
    );
    setPosts(updatedPosts);
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3001/post/${postId}/addcomment`, // Ensure the endpoint is correct
          { text: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 201) {
          toast.success("Comment added successfully");
          setNewComment(""); // Clear the comment input field
          // Fetch the latest posts after adding the comment
          axios.get(`http://localhost:3001/posts/all-posts/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
          })
          .catch((error) => {
            toast.error("Error fetching posts");
          });
        }
      } catch (error) {
        toast.error("Error adding comment");
      }
    } else {
      toast.error("Please write a comment");
    }
  };

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
    <div>
      <ToastContainer />
      <Container className="mt-4">
        <Row>
          {posts.map((post) => (
            <Col key={post?._id} sm={12} md={12} lg={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <Image
                      src={post?.userId?.profile_picture || "default-profile.jpg"}
                      roundedCircle
                      width={40}
                      height={40}
                    />
                    <span className="ms-2">{post?.userId?.username || "Unknown User"}</span>
                  </div>
                  <span>{post?.communityId?.name || "General"}</span>
                </Card.Header>
                <Card.Body>
                  {post?.media?.[0] && (
                    <Image
                      src={post.media[0]}
                      alt="Post Image"
                      fluid
                      className="w-100 mb-3"
                    />
                  )}
                  <p>{post?.description || "No description available"}</p>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" className="me-2" onClick={() => handleLike(post._id)}>
                      {post.likes.includes(userId) ? "Unlike" : "Like"} ({post.likes.length})
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => setCommentForPost(post._id)} // Set the postId for the comment
                    >
                      Comment
                    </Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {post?.likes?.length || 0} Likes | {post?.comments?.length || 0} Comments
                </Card.Footer>
              </Card>

              {commentForPost === post._id && (
                <div className="mt-2">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    placeholder="Add a comment"
                  />
                  <button onClick={() => handleCommentSubmit(post._id)}>Submit Comment</button>
                </div>
              )}

              {post?.comments?.length > 0 && (
                <div className="mt-2">
                  {post.comments.map((comment) => (
                    <div key={comment?._id} className="d-flex mb-2">
                      <Image
                        src={comment?.user_id?.profile_picture || "default-profile.jpg"}
                        roundedCircle
                        width={30}
                        height={30}
                      />
                      <div className="ms-2">
                        <strong>{comment?.user_id?.username || "Anonymous"}</strong>
                        <p>{comment?.comment || ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
export default FeedHome;