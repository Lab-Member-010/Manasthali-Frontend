 
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Image, Row, Col, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { BiSolidCommentDetail } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


const FeedHome = () => {
  const [posts, setPosts] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentForPost, setCommentForPost] = useState(null);
  const [activeCommentPost, setActiveCommentPost] = useState(null); // Track active post for comment

  const userId = useSelector((state) => state?.user?.user?._id);
  const token = useSelector((state) => state?.user?.token);
  const navigate = useNavigate();
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
          const errorMsg =
            error.response?.data?.message || error.message || "Error fetching posts";
          toast.error(errorMsg);
        });
    }
  }, [userId, token]);

  const handleLike = async (post) => {
    try {
      const likeAction = post.likes.includes(userId) ? "unlike" : "like";

      setPosts((prevPosts) =>
        prevPosts.map((currentPost) =>
          currentPost._id === post._id
            ? {
                ...currentPost,
                likes:
                  likeAction === "like"
                    ? [...currentPost.likes, userId]
                    : currentPost.likes.filter((id) => id !== userId),
              }
            : currentPost
        )
      );

      const response = await axios.post(
        `http://localhost:3001/posts/posts/${post._id}/${likeAction}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status !== 200) {
        throw new Error("Failed to update like status");
      }
    } catch (error) {
      setPosts((prevPosts) =>
        prevPosts.map((currentPost) =>
          currentPost._id === post._id
            ? {
                ...currentPost,
                likes: post.likes.includes(userId)
                  ? post.likes.filter((id) => id !== userId)
                  : [...post.likes, userId],
              }
            : currentPost
        )
      );
      toast.error("Error updating like status");
    }
  };

  // const handleCommentClick = (postId) => {
  //   setActiveCommentPost(activeCommentPost === postId ? null : postId);
  // };
  const handleCommentClick = (postId) => {
    navigate(`/posts/${postId}/comments`); // कमेंट पेज पर भेजेगा
  };

  const handleCommentSubmit = async (postId) => {
    if (newComment.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3001/posts/posts/${postId}/addcomment`,
          { text: newComment },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
          toast.success("Comment added successfully");
          setNewComment("");
          setCommentForPost(null);

          const updatedPostsResponse = await axios.get(
            `http://localhost:3001/posts/all-posts/${userId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPosts(updatedPostsResponse.data.posts);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Error adding comment");
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
            <Col key={post?._id} sm={12} md={12} lg={12} className="bottomsUp">
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
                  <div className="d-flex align-items-center">
                    {/* Like Icon */}
                    <Button variant="link" className="p-0 me-2" onClick={() => handleLike(post)}>
                      {post.likes.includes(userId) ? (
                        <AiFillHeart size={26} color="red" />
                      ) : (
                        <AiOutlineHeart size={26} color="black" />
                      )}
                    </Button>
                    <span className="me-3">{post.likes.length} Likes</span>

                    {/* Comment Icon */}
                    <Button
                      variant="link"
                      className="p-0 me-2"
                      onClick={() => handleCommentClick(post._id)}
                    >
                      {activeCommentPost === post._id ? (
                        <BiSolidCommentDetail size={26} color="blue" />
                      ) : (
                        <AiOutlineComment size={26} color="black" />
                      )}
                    </Button>
                    <span>{post.comments.length} Comments</span>
                  </div>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {activeCommentPost === post._id && (
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
                            <strong
                              className={comment?.user_id?._id === userId ? "comment-author" : ""}
                            >
                              {comment?.user_id?.username || "Anonymous"}
                            </strong>
                            <p>{comment?.comment || ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};
export default FeedHome;


 