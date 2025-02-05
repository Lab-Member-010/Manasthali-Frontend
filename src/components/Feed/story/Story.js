import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import styles from "./Story.module.css";

const Story = () => {
  const fileInputRef = useRef(null);
  const user = useSelector((state) => state.user?.user);
  const token = useSelector((state) => state.user?.token);
  const [story, setStory] = useState(null);
  const [showStory, setShowStory] = useState(false);

  
  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/story/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
             
      console.log("Fetched Story:", response.data);
        if (response.data) {
          setStory(response.data);
        }
      } catch (error) {
        console.error("Error fetching story", error);
      }
    };
    fetchStory();
  }, [user._id, token]);

   
  const handleProfileClick = () => {
    if (story) {
      setShowStory(true);
    } else {
      fileInputRef.current.click();
    }
  };

 
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("media", file);
    formData.append("userId", user._id);

    try {
      const response = await axios.post("http://localhost:3001/story/stories", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setStory(response.data);
      }
    } catch (error) {
      console.error("Error uploading story");
    }
  };

  return (
    <div>
     
      <div 
        className={`${styles.circle} ${story ? styles.activeStory : ""}`} 
        onClick={handleProfileClick}
      >
        <img
          src={user?.profile_picture ? user.profile_picture : "./default_profile.jpg"}
          alt="Profile"
          className={styles.profileImage}
        />
      </div>

       
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

     
      {showStory && story && (
        <div className={styles.storyViewer} onClick={() => setShowStory(false)}>
          <img src={`http://localhost:3001/${story.media}`} alt="" />
        </div>
      )}
    </div>
  );
};

export default Story;

 