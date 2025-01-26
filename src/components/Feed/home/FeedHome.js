import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Image, Row, Col, Container } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';

const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  console.log(posts)
  const userId = useSelector((state) => state.user.user._id);
  const token=useSelector((state) => state.user.token);  

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/all-posts/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
      }
    )
      .then(response => {
        setPosts(Array.isArray(response.data.posts) ? response.data.posts : []);
      })
      .catch(error => {
        toast.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div>
  <ToastContainer />
  <Container className="mt-4">
    <Row>
      {posts.map(post => (
        <Col key={post._id} sm={12} md={12} lg={12} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Image src={`http://localhost:3001/${post.userId.profile_picture}`} roundedCircle width={40} height={40} />
                <span className="ms-2">{post.userId.username}</span>
              </div>
              <span>{post.communityId ? post.communityId.name : 'General'}</span>
            </Card.Header>
            <Card.Body>
              <Image src={`http://localhost:3001/${post.media[0]}`} alt="Post Image" fluid className="w-100 mb-3" />
              <p>{post.description}</p>
              <div className="d-flex justify-content-between">
                <Button variant="outline-primary" className="me-2">
                  Like
                </Button>
                <Button variant="outline-secondary">
                  Comment
                </Button>
              </div>
            </Card.Body>
            <Card.Footer className="text-muted">
              {post.likes.length} Likes | {post.comment_count} Comments
            </Card.Footer>
          </Card>

          {/* Comments Section */}
          {post.comments && post.comments.length > 0 && (
            <div className="mt-2">
              {post.comments.map(comment => (
                <div key={comment._id} className="d-flex mb-2">
                  <Image src={comment.user_id.profilePicture} roundedCircle width={30} height={30} />
                  <div className="ms-2">
                    <strong>{comment.user_id.username}</strong>
                    <p>{comment.comment}</p>
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
