// import defaultImage from "../../../images/default_profile.jpg";
// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import styles from "./Profile.module.css";

// const Profile = ({ user, loading, updateProfilePicture }) => {
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState("");
//   const [popupUsers, setPopupUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null); // Selected user state
//   const [newProfilePic, setNewProfilePic] = useState(null);
//   const [updating, setUpdating] = useState(false);
//   const [showPosts, setShowPosts] = useState(false);

//   const token = useSelector((state) => state.user.token);

//   useEffect(() => {
//     if (showPopup && token) {
//       fetchUsersData(popupType, token);
//     }
//   }, [showPopup, popupType, token]);

//   const fetchUsersData = async (type, token) => {
//     try {
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const endpoint =
//         type === "followers"
//           ? `http://localhost:3001/users/${user._id}/followers`
//           : `http://localhost:3001/users/${user._id}/following`;

//       const response = await axios.get(endpoint, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       setPopupUsers(response.data[type] || []);
//     } catch (error) {
//       console.error("Error fetching users:", error);
//     }
//   };

//   const handlePopup = (type) => {
//     setPopupType(type);
//     const users = type === "followers" ? user.followers : user.following;
//     setPopupUsers(users || []);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setPopupType("");
//     setPopupUsers([]);
//     setSelectedUser(null); // Close selected user details
//   };

//   const handleUserClick = (user) => {
//     setSelectedUser(user); // Set the clicked user
//     setShowPopup(false); // Close popup when user is selected
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setNewProfilePic(file);
//     }
//   };

//   const handleProfilePicUpload = async () => {
//     if (!newProfilePic) return;

//     const formData = new FormData();
//     formData.append("profile_picture", newProfilePic);

//     setUpdating(true);

//     try {
//       const response = await axios.put(
//         `http://localhost:3001/users/${user._id}/updateProfilePicture`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       updateProfilePicture(response.data.user);
//       alert("Profile picture updated successfully!");
//     } catch (error) {
//       console.error("Error updating profile picture", error);
//       alert("Error updating profile picture. Please try again.");
//     } finally {
//       setUpdating(false);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (!user) {
//     return <div>User not found</div>;
//   }

//   const togglePosts = () => {
//     setShowPosts((prev) => !prev);
//   };

//   return (
//     <div className={styles.ProfileContainer}>
//       {selectedUser ? (
//         // Display selected user details
//         <>
//           <div className={styles.profileHeader}>
//             <div className={styles.profileImage}>
//               <img
//                 src={
//                   selectedUser.profile_picture
//                     ? selectedUser.profile_picture
//                     : "./default_profile.jpg"
//                 }
//                 alt={selectedUser.username}
//               />
//             </div>
//             <div className={styles.profileInfo}>
//               <div className={styles.usernameAndPosts}>
//                 <h2 className={styles.userName}>{selectedUser.username}</h2>
//               </div>
//               <p className={styles.userBio}>{selectedUser.bio || "No bio available"}</p>
//               <div className={styles.followersFollowing}>
//                 <p>Followers: {selectedUser.followers?.length || 0}</p>
//                 <p>Following: {selectedUser.following?.length || 0}</p>
//               </div>
//             </div>
//           </div>
//           <button onClick={() => setSelectedUser(null)}>Back</button>
//         </>
//       ) : (
//         // Main profile display
//         <>
//           <div className={styles.profileHeader}>
//             <div className={styles.profileImage}>
//               <img
//                 src={
//                   user.profile_picture
//                     ? user.profile_picture
//                     : "./default_profile.jpg"
//                 }
//                 alt={user.username}
//               />
//             </div>
//             <div className={styles.profileInfo}>
//               <div className={styles.AuthorizationusernameAndPosts}>
//                 <h2 className={styles.userName}>{user.username}</h2>
//               </div>
//               <p className={styles.userBio}>{user.bio}</p>
//               <div className={styles.followersFollowing}>
//                 <span onClick={() => handlePopup("followers")}>
//                   {user.followers?.length || 0} Followers
//                 </span>
//                 <span onClick={() => handlePopup("following")}>
//                   {user.following?.length || 0} Following
//                 </span>
//                 <span onClick={togglePosts}>
//                   {user.posts ? user.posts.length : 0} Posts
//                 </span>
//               </div>
//             </div>
//           </div>

//           {showPopup && (
//             <div className={styles.popup}>
//               <div className={styles.popupContent}>
//                 <h3>{popupType === "followers" ? "Followers" : "Following"}</h3>
//                 <ul>
//                   {popupUsers.length > 0 ? (
//                     popupUsers.map((user, index) => (
//                       <li key={index} onClick={() => handleUserClick(user)}>
//                         <div className={styles.userDetails}>
//                           <img
//                             src={
//                               user.profile_picture
//                                 ? user.profile_picture
//                                 : defaultImage
//                             }
//                             alt={user.username}
//                             className={styles.toggleProfilePhoto}
//                           />
//                           <span>{user.username}</span>
//                         </div>
//                       </li>
//                     ))
//                   ) : (
//                     <li>No users to display</li>
//                   )}
//                 </ul>
//                 <button onClick={closePopup}>Close</button>
//               </div>
//             </div>
//           )}

//           {showPosts && (
//             <div className={styles.postsSection}>
//               <h3>Posts</h3>
//               <ul>
//                 {user.posts && user.posts.length > 0 ? (
//                   user.posts.map((post, index) => (
//                     <li key={index}>
//                       <p>{post.content}</p>
//                       <img
//                         src={
//                           post.image
//                             ? `http://localhost:3001/${post.image}`
//                             : "./default_post.jpg"
//                         }
//                         alt="Post"
//                       />
//                     </li>
//                   ))
//                 ) : (
//                   <li>No posts to display</li>
//                 )}
//               </ul>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// };

// export default Profile;
import defaultImage from "../../../images/default_profile.jpg";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import styles from "./Profile.module.css";

const Profile = ({ user, loading, updateProfilePicture }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [popupUsers, setPopupUsers] = useState([]);
  const [userData, setUserData] = useState(user);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [showPosts, setShowPosts] = useState(false);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    setUserData(user); 
  }, [user]);

  const fetchUsersData = async (type, token) => {
    try {
      if (!token) {
        console.error("No token found");
        return [];
      }

      const endpoint =
        type === "followers"
          ? `http://localhost:3001/users/${user._id}/followers`
          : `http://localhost:3001/users/${user._id}/following`;

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usersData = response.data[type] || [];
      setPopupUsers(usersData);

      // ✅ User state update करने के लिए
      setUserData((prevData) => ({
        ...prevData,
        followers: type === "followers" ? usersData : prevData.followers,
        following: type === "following" ? usersData : prevData.following,
      }));

      return usersData;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  };

  const handlePopup = async (type) => {
    setPopupType(type);
    setShowPopup(true);

   
    const updatedUsers = await fetchUsersData(type, token);

    setUserData((prevData) => ({
      ...prevData,
      followers: type === "followers" ? updatedUsers : prevData.followers,
      following: type === "following" ? updatedUsers : prevData.following,
    }));
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
          headers: { "Content-Type": "multipart/form-data" },
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

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className={styles.ProfileContainer}>
      <div className={styles.profileHeader}>
        <div className={styles.profileImage}>
          <img
            src={userData.profile_picture || defaultImage}
            alt={userData.username}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2 className={styles.userName}>{userData.username}</h2>
          <p className={styles.userBio}>{userData.bio || "No bio available"}</p>
          <div className={styles.followersFollowing}>
            <span onClick={() => handlePopup("followers")}>
              {userData.followers?.length || 0} Followers
            </span>
            <span onClick={() => handlePopup("following")}>
              {userData.following?.length || 0} Following
            </span>
            <span onClick={() => setShowPosts(!showPosts)}>
              {userData.posts?.length || 0} Posts
            </span>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h3>{popupType === "followers" ? "Followers" : "Following"}</h3>
            <ul>
              {popupUsers.length > 0 ? (
                popupUsers.map((user, index) => (
                  <li key={index}>
                    <div className={styles.userDetails}>
                      <img
                        src={user.profile_picture || defaultImage}
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

      {showPosts && (
        <div className={styles.postsSection}>
          <h3>Posts</h3>
          <ul>
            {userData.posts?.length > 0 ? (
              userData.posts.map((post, index) => (
                <li key={index}>
                  <p>{post.content}</p>
                  <img
                    src={`http://localhost:3001/${post.image || "default_post.jpg"}`}
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


