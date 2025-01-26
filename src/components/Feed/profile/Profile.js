import React, { useState } from "react";
import "./Profile.css";
import axios from "axios";

const Profile = ({ user, loading, updateProfilePicture }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupUsers, setPopupUsers] = useState([]);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updating, setUpdating] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

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
      // Once the profile is updated, update the profile in parent component
      updateProfilePicture(response.data.user);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture", error);
      alert("Error updating profile picture. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  return (
<div className="ProfileContainer">
  <div className="profileHeader">
    {/* Profile Image */}
    <div className="profileImage">
      <img
        src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : './default_profile.jpg'}
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
        <span onClick={() => handlePopup("followers")}>{user.followers.length} Followers</span>
        <span onClick={() => handlePopup("following")}>{user.following.length} Following</span>
        <span>{user.posts ? user.posts.length : 0} Posts</span>
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
                  <img
                    src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : './default_profile.jpg'}
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
</div>

  );
};

export default Profile;

 