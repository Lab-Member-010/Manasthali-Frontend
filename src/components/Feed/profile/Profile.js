
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
 
import "./Profile.css";
import axios from "axios";

const Profile = ({ user, loading, updateProfilePicture }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupUsers, setPopupUsers] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showPosts, setShowPosts] = useState(false); // Added state for post visibility

  // Get token from Redux store
  const token = useSelector((state) => state.user.token);

  // Fetch users data when popup is opened, token, or popupType changes
  useEffect(() => {
    if (showPopup && token) {
      fetchUsersData(popupType, token);
    }
  }, [showPopup, popupType, token]);

  const fetchUsersData = async (type, token) => {
    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      const endpoint =
        type === "followers"
          ? `http://localhost:3001/users/${user._id}/followers`
          : `http://localhost:3001/users/${user._id}/following`;

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the Authorization header
        },
      });

      setPopupUsers(response.data[type] || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handlePopup = (type) => {
    setPopupType(type);
    const users = type === "followers" ? user.followers : user.following;
    setPopupUsers(users || []);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
    setPopupUsers([]);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePic(file);
    }
  };

  const handleProfilePicUpload = async () => {
    if (!newProfilePic) return;

    const formData = new FormData();
    formData.append("profile_picture", newProfilePic);

    setUpdating(true);

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${user._id}/updateProfilePicture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      updateProfilePicture(response.data.user);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture", error);
      alert("Error updating profile picture. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Handle loading and no user case AFTER hooks
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  // Toggle posts visibility
  const togglePosts = () => {
    setShowPosts((prev) => !prev);
  };

  return (

<div className="ProfileContainer">
  <div className="profileHeader">
    {/* Profile Image */}
    <div className="profileImage">
      <img
        src={user.profile_picture ? user.profile_picture : './default_profile.jpg'}
        alt={user.username}
      />
    </div>

        {/* Profile Information (Name, Bio, Followers, Following, etc.) */}
        <div className="profileInfo">
          <div className="usernameAndPosts">
            <h2 className="userName">{user.username}</h2>
          </div>
          <p className="userBio">{user.bio}</p>
          <div className="followersFollowing">
            <span onClick={() => handlePopup("followers")}>
              {user.followers?.length || 0} Followers
            </span>
            <span onClick={() => handlePopup("following")}>
              {user.following?.length || 0} Following
            </span>
            <span onClick={togglePosts}>
              {user.posts ? user.posts.length : 0} Posts
            </span>
          </div>
        </div>
      </div>
      {/* Popup for Followers/Following */}
      {showPopup && (
        <div className="popup">
          <div className="popupContent">
            <h3>{popupType === "followers" ? "Followers" : "Following"}</h3>
            <ul>
              {popupUsers.length > 0 ? (
                popupUsers.map((user, index) => (
                  <li key={index}>
                    <div className="userDetails">
                       {/* Link to user profile page */}
                 <img
                    src={user.profile_picture ? user.profile_picture : './default_profile.jpg'}
                    alt={user.username}
                  />
                  <span>{user.username}</span>
                
                    </div>
                  </li>
                ))
              ) : (
                <li>No users to display</li>
              )}
            </ul>
            <button onClick={closePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Show Posts */}
      {showPosts && (
        <div className="postsSection">
          <h3>Posts</h3>
          <ul>
            {user.posts && user.posts.length > 0 ? (
              user.posts.map((post, index) => (
                <li key={index}>
                  <p>{post.content}</p>
                  <img
                    src={post.image ? `http://localhost:3001/${post.image}` : './default_post.jpg'}
                    alt="Post"
                  />
                </li>
              ))
            ) : (
              <li>No posts to display</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Profile;
