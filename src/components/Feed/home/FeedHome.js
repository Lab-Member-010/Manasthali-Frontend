import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Image, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  const userId = useSelector((state) => state?.user?.user?._id); 
  const token = useSelector((state) => state?.user?.token);
  console.log(posts)
  const userId = useSelector((state) => state.user.user._id);
  const token=useSelector((state) => state.user.token);  

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
                    {/* Safeguard for null/undefined userId or profile_picture */}
                    <Image
                      src={`http://localhost:3001/${post?.userId?.profile_picture || "default-profile.jpg"}`}
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
                      src={`http://localhost:3001/${post.media[0]}`}
                      alt="Post Image"
                      fluid
                      className="w-100 mb-3"
                    />
                  )}
                  <p>{post?.description || "No description available"}</p>
                  <div className="d-flex justify-content-between">
                    <Button variant="outline-primary" className="me-2">
                      Like
                    </Button>
                    <Button variant="outline-secondary">Comment</Button>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {post?.likes?.length || 0} Likes | {post?.comment_count || 0} Comments
                </Card.Footer>
              </Card>

              {/* Comments Section */}
              {Array.isArray(post?.comments) && post.comments.length > 0 && (
                <div className="mt-2">
                  {post.comments.map((comment) => (
                    <div key={comment?._id} className="d-flex mb-2">
                      {/* Safeguard for null/undefined user_id or profilePicture */}
                      <Image
                        src={comment?.user_id?.profilePicture || "default-profile.jpg"}
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
