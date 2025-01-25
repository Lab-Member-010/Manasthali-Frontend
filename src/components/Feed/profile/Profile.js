// import React from "react";
// import "./Profile.css";

// const Profile = ({ user, loading }) => {

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!user) {
//         return <div>User not found</div>;
//     }

//     return (
//         <div className="ProfileContainer">
//             {/* Profile Image */}
//             <div className="profileImage">
//                 <img src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : './default_profile.jpg'} alt={user.username} />
//             </div>

//             {/* Username */}
//             <h2 className="userName">{user.username}</h2>

//             {/* Followers/Following */}
//             <div className="followersFollowing">
//                 <span>Followers: {user.followers.length}</span>
//                 <span>Following: {user.following.length}</span>
//             </div>

//             {/* Personality Type */}
//             <div className="personalityType">
//                 <span>Personality Type: {user.personality_type}</span>
//             </div>
//         </div>
//     );
// };

// export default Profile;
 

import React, { useState } from "react";
import "./Profile.css";

const Profile = ({ user, loading }) => {
const [showPopup,setShowPopup]=useState(false)
const[popupType,setPopupType]=useState("")
const[popupUsers,setPopupUsers]=useState([])
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found</div>;
    }
     const handlePopup = (type) => {
            setPopupType(type);
            const users = type === "followers" ? user.followers : user.following;
            console.log("Popup Users:", users);  
            setPopupUsers(users);
            setShowPopup(true);
        };
const closePopup=()=>{
    setShowPopup(false);
    setPopupType("");
    setPopupUsers([]);
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
                <span onClick={()=>handlePopup("followers")}>Followers: {user.followers.length}</span>
                <span onClick={()=>handlePopup("following")}>Following: {user.following.length}</span>
            </div>

            {/* Personality Type */}
            <div className="personalityType">
                <span>Personality Type: {user.personality_type}</span>
            </div>
            {showPopup &&(
                <div className="popup">
               <div className="popupContent">
               <h3>{popupType==="followers"? "Followers":"Following"}</h3>
              <ul>
                {popupUsers.map((user,index)=>(
                    <li key={index}>
             <div className="userDetails">
         <img  
         src={
            user.profile_picture
            ? `http://localhost:3001/${user.profile_picture}`
        : "./default_profile.jpg" 
        }
        alt={user.username}
          />
          <span>{user.username}</span>
             </div>
                    </li>
                ))}
              </ul>
              <button onClick={closePopup} >close</button>
               </div>
                </div>
            )}
        </div>
    );
};

export default Profile;



 