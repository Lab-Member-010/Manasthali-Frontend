import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ user, loading }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [popupType, setPopupType] = useState("");
    const [popupUsers, setPopupUsers] = useState([]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    const handlePopup = (type) => {
        setPopupType(type);
        const users = type === "followers" ? user.followers : user.following;

        // Log the users to check the data structure
        console.log("Popup Users:", users);
        
        if (Array.isArray(users) && users.length > 0) {
            setPopupUsers(users);
        } else {
            setPopupUsers([]); // Set an empty array if no users are found
        }

        setShowPopup(true);
    };
    
    const closePopup = () => {
        setShowPopup(false);
        setPopupType("");
        setPopupUsers([]);
    };

    return (
        <div className="ProfileContainer">
            {/* Profile Image */}
            <div className="profileImage">
                <img
                    src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : './default_profile.jpg'}
                    alt={user.username}
                />
            </div>

            {/* Username */}
            <h2 className="userName">{user.username}</h2>
            <center><p>{user.bio}</p></center>

            {/* Followers/Following */}
            <div className="followersFollowing">
                <span onClick={() => handlePopup("followers")}>Followers: {user.followers.length}</span>
                <span onClick={() => handlePopup("following")}>Following: {user.following.length}</span>
            </div>

            {/* Personality Type */}
            <div className="personalityType">
                <span>Personality Type: {user.personality_type}</span>
            </div>

            {/* Popup for Followers/Following */}
            {showPopup && (
                <div className="popup">
                    <div className="popupContent">
                        <h3>{popupType === "followers" ? "Followers" : "Following"}</h3>
                        <ul>
  {popupUsers.length > 0 ? (
    popupUsers.map((popupUser, index) => (
      <li key={index}>
        <div className="userDetails">
          <img
            src={
              popupUser.profile_picture
                ? `http://localhost:3001/${popupUser.profile_picture}`
                : "./default_profile.jpg"
            }
            alt={popupUser.username || "Unnamed User"}
          />
          <span>{popupUser.username || "Unnamed User"}</span>
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

 