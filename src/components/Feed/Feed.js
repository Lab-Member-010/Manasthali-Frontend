import React, { useState, useEffect } from "react";
import {
  Home as HomeIcon,
  Event as EventIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  AddCircleOutline,
  Settings,
  PersonAddAlt1,
  Forum,
  Group as GroupIcon,
} from "@mui/icons-material";
import styles from "./Feed.module.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { signOut } from "../../redux-config/UserSlice";
import ManasthaliLogo from "../../images/Manasthali.png";
import Chat from "./chat/ChatList";
import FeedHome from "./home/FeedHome";
import GroupChat from "./group-chat/GroupChat";
import Group from "./group/Group";
import Notification from "./notification/Notification";
import Badge from "./badge/Badge";
import Profile from "./profile/Profile";
import Challenge from "./challenge/Challenege";
import FindFriend from "./Find-friend/FindFriend";
import Story from "./story/Story";
import Post from "./post/Post";
import ProfileSetting from "./profile/ProfileSetting";
import Community from "./community/community";

const Feed = () => {
  const { token } = useSelector((store) => store.user);
  const userId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data.user);
      } catch (error) {
        console.error("Failed to fetch profile data:", error.response?.data || error.message);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchProfileData(); // Fetch profile data when the component mounts
  }, [userId, token]);

  // Function to update profile data when the profile photo changes
  const updateProfilePicture = (newProfileData) => {
    setProfileData(newProfileData); // Update profile data
  };

  const handleProfileClick = () => {
    setActiveComponent("profile");
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <FeedHome />;
      case "groups":
        return <Group />;
      case "chat":
        return <Chat />;
      case "group-chat":
        return <GroupChat />;
      case "notifications":
        return <Notification />;
      case "find-friends":
        return <FindFriend />;
      case "profile":
        return <Profile user={profileData} updateProfilePicture={updateProfilePicture} />;
      case "badge":
        return <Badge />;
      case "challenge":
        return <Challenge />;
      case "post":
        return <Post />;
      case "setting":
        return <ProfileSetting />;
      case "community":
        return <Community />;
      default:
        return <FeedHome />;
    }
  };

  return (
    <div className={styles.mainContainer}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <img className={styles.rotatingLogo} src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div className={styles.siteLogo}>Manasthali</div>
        </div>
      </div>
      <br /> <br /> <br />
      {/* Content Section */}
      <div className={styles.contentContainer}>
        {/* Left Navbar */}
        <div className={styles.leftNavbar}>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("home")}>
            <HomeIcon />
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("groups")}>
            <GroupIcon />
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("chat")}>
            <ChatIcon />
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("group-chat")}>
            <Forum />
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("notifications")}>
            <NotificationsIcon />
            <span className="icon-text ml-2">Notifications</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("find-friends")}>
            <PersonAddAlt1 />
            <span className="icon-text ml-2">Find-Friends</span>
          </div>
          <div className={`nav-item ${styles.navItem}`} onClick={() => setActiveComponent("post")}>
            <AddCircleOutline />
            <span className="icon-text ml-2">Post</span>
          </div>
        </div>

        {/* Main Content */}
        <div className={styles.midPart}>
          <div className={styles.innerDb}>
            {activeComponent === "home" && (
              <div className={styles.storiesDiv}>
                <Story />
              </div>
            )}
            {renderActiveComponent()}
          </div>
        </div>

        {/* Right Navbar */}
        <div className={styles.rightNavbar}>
          <div className={`nav-item ${styles.navItems}`} onClick={() => handleProfileClick()}>
            {/* Conditional Rendering for Profile Image */}
            {loadingProfile ? (
              <img src="loading-spinner.gif" alt="Loading..." className={styles.profileIcon} />
            ) : profileData ? (
              <img src={profileData.profile_picture} alt="user" className={styles.profileIcon} />
            ) : (
              <img src="default-profile.jpg" alt="Default User" className={styles.profileIcon} />
            )}
          </div>
          <div className={`nav-item ${styles.navItems}`} onClick={() => setActiveComponent("challenge")}>
            <EventIcon />
          </div>
          <div className={`nav-item ${styles.navItems}`} onClick={() => setActiveComponent("badge")}>
            <WorkspacePremiumIcon />
          </div>
          <div className={`nav-item ${styles.navItems}`} onClick={() => setActiveComponent("setting")}>
            <Settings />
          </div>
          <div className={`nav-item ${styles.navItems}`} onClick={() => setActiveComponent("community")}>
            <GroupsIcon />
          </div>
          <div className={`nav-item ${styles.navItems}`} onClick={() => dispatch(signOut())}>
            <PowerSettingsNewIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
