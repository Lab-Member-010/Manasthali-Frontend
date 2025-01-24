import React from "react";
import "./Profile.css";

const Profile = ({ user, loading }) => {

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <div className="ProfileContainer">
            {/* Profile Image */}
            <div className="profileImage">
                <img src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : './default_profile.jpg'} alt={user.username} />
            </div>

            {/* Username */}
            <h2 className="userName">{user.username}</h2>

            {/* Followers/Following */}
            <div className="followersFollowing">
                <span>Followers: {user.followers.length}</span>
                <span>Following: {user.following.length}</span>
            </div>

            {/* Personality Type */}
            <div className="personalityType">
                <span>Personality Type: {user.personality_type}</span>
            </div>
        </div>
    );
};

export default Profile;
