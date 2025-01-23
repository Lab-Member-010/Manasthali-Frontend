import React, { useState } from "react";
import {
  Home as HomeIcon,
  Group as GroupIcon,
  AutoStories as AutoStoriesIcon,
  Event as EventIcon,
  WorkspacePremium as WorkspacePremiumIcon,
  Chat as ChatIcon,
  Groups as GroupsIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  PowerSettingsNew as PowerSettingsNewIcon,
  AddCircleOutline,
  Settings,
  SupportAgent
} from "@mui/icons-material";
import "./Feed.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { signOut } from "../../redux-config/UserSlice";
import ManasthaliLogo from "../../images/Manasthali.png";
import Chat from "./chat/Chat";
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
const Feed = () => {
  const { token } = useSelector((store) => store.user);
  const userId = useSelector((state) => state.user.user._id);
  const dispatch = useDispatch();

  const [activeComponent, setActiveComponent] = useState("home");
  const [profileData, setProfileData] = useState(null);

  const handleProfileClick = async () => {
    console.log("Fetching profile data for user:", userId);
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfileData(response.data.user);
    } catch (error) {
      console.error("Failed to fetch profile data:", error.response?.data || error.message);
    } finally {
      setActiveComponent("profile");
    }
  };
  

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "home":
        return <FeedHome />;
      case "groups":
        return <Group />;
      case "Dekhte baad me":
        return <FeedHome />;
      case "chat":
        return <Chat />;
      case "group-chat":
        return <GroupChat />;
      case "notifications":
        return <Notification />;
      case "find-friends":
        return <FindFriend />;
      case "profile":
        return <Profile user={profileData} />;
      case "badge":
        return <Badge />;
      case "challenge":
        return <Challenge />;
      case "post":
        return <Post />;
      case "setting":
        return <ProfileSetting/>;
      case "community":
        return <Community/>;
      default:
        return <FeedHome />;
    }
  };

  const renderStories = () => {
    return <Story />;
  };

  return (
    <div className="main-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <img className="rotating-logo" src={ManasthaliLogo} alt="Manasthali Logo" width={70} height={70} />
          <div className="site-logo">Manasthali</div>
        </div>
        <div className="header-right">
          <input type="text" placeholder="Search..." className="searchBar" />
        </div>
      </div>
      <br /> <br /> <br />
      {/* Content Section */}
      <div className="content-container">
        {/* Left Navbar */}
        <div className="left-navbar">
          <div className="nav-item navItem" onClick={() => setActiveComponent("home")}>
            <HomeIcon />
            <span className="icon-text ml-2">Home</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("groups")}>
            <GroupIcon />
            <span className="icon-text ml-2">Group</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("chat")}>
            <ChatIcon />
            <span className="icon-text ml-2">Chat</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("group-chat")}>
            <GroupsIcon />
            <span className="icon-text ml-2">GroupChat</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("notifications")}>
            <NotificationsIcon />
            <span className="icon-text ml-2">Notifications</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("find-friends")}>
            <AutoStoriesIcon />
            <span className="icon-text ml-2">Find-Friends</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("post")}>
            <AddCircleOutline />
            <span className="icon-text ml-2">Post</span>
          </div>
          <div className="nav-item navItem" onClick={() => setActiveComponent("post")}>
            <SupportAgent />
            <span className="icon-text ml-2">Mental Coach</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="mid-part">
          <div className="innerDb">
            <div className="storiesDiv">
              {renderStories()}
            </div>
            {renderActiveComponent()}
          </div>
        </div>

        {/* Right Navbar */}
        <div className="right-navbar">
          <div className="nav-item navItems" onClick={()=>handleProfileClick()}>
            <AccountCircleIcon />
          </div>
          <div className="nav-item navItems" onClick={() => setActiveComponent("challenge")}>
            <EventIcon />
          </div>
          <div className="nav-item navItems" onClick={() => setActiveComponent("badge")}>
            <WorkspacePremiumIcon />
          </div>
          <div className="nav-item navItems" onClick={() => setActiveComponent("setting")}>
            <Settings/>
          </div>
          <div className="nav-item navItems" onClick={() => setActiveComponent("community")}>
            <Settings/>
          </div>
          <div className="nav-item navItems" onClick={() => dispatch(signOut())}>
            <PowerSettingsNewIcon />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feed;
